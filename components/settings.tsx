"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "react-hot-toast"
import { redirect, useRouter } from "next/navigation"
import { motion } from "framer-motion"

export function Settings() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [id, setId] = useState(session?.user?.userId || 0)
  const [name, setName] = useState(session?.user?.name || "")
  const [email, setEmail] = useState(session?.user?.email || "")
  const [userSession, setSession] = useState(session?.user.session || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState(session?.user?.image || "")
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [updateType, setUpdateType] = useState<"account" | "password" | "avatar" | "delete">("account")
  const [deleteOTP, setDeleteOTP] = useState("")
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setEmail(session.user.email || "")
      setAvatarPreview(session.user.image || "")
    }
  }, [session])

  const handleUpdate = (type: "account" | "password" | "avatar" | "delete") => {
    setUpdateType(type)
    setIsConfirmOpen(true)
  }

  const confirmUpdate = async () => {
    setIsConfirmOpen(false)
    try {
      if (updateType === "account") {
        await updateAccount({ id, name, email, userSession })
      } else if (updateType === "password") {
        await updatePassword({ id, currentPassword, newPassword })
      } else if (updateType === "avatar") {
        await updateAvatar(id)
      } else if (updateType === "delete") {
        await requestDeleteOTP()
      }
      if (updateType !== "delete") {
        toast.success("Update successful")
        await update() // Update the session
      }
    } catch (error) {
      toast.error("Update failed")
      console.error("Update error:", error)
    }
  }

  const updateAccount = async (data: { id: any; name: string; email: string, userSession: any; }) => {
    const response = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update account")
    await signOut({ redirect: false })
    router.push("/")
  }

  const updatePassword = async (data: { id: any; currentPassword: string; newPassword: string }) => {
    const response = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update password")
    await signOut({ redirect: false })
  router.push("/")
  }

  const updateAvatar = async (id: any | Blob) => {
    if (!avatarFile) return

    const formData = new FormData()
    formData.append("avatar", avatarFile)
    formData.append("user", id)

    const response = await fetch("/api/user/update-avatar", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Failed to update avatar")
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const requestDeleteOTP = async () => {
    try {
      const response = await fetch("/api/user/request-delete-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!response.ok) throw new Error("Failed to send OTP")
      toast.success("OTP sent to your email")
      setIsDeleteConfirmOpen(true)
    } catch (error) {
      toast.error("Failed to send OTP")
      console.error("OTP request error:", error)
    }
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, otp: deleteOTP }),
      })
      if (!response.ok) throw new Error("Failed to delete account")
      toast.success("Account deleted successfully")
      await signOut({ redirect: false })
      router.push("/")
    } catch (error) {
      toast.error("Failed to delete account")
      console.error("Account deletion error:", error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl"
    >
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="flex w-full bg-gray-700 p-1 rounded-full mb-6">
          <TabsTrigger value="account" className="flex-1 rounded-full text-sm">
            Account
          </TabsTrigger>
          <TabsTrigger value="password" className="flex-1 rounded-full text-sm">
            Password
          </TabsTrigger>
          <TabsTrigger value="avatar" className="flex-1 rounded-full text-sm">
            Avatar
          </TabsTrigger>
          <TabsTrigger value="delete" className="flex-1 rounded-full text-sm">
            Delete Account
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card className="bg-gray-800 border-gray-700 rounded-xl overflow-hidden mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Account Information</CardTitle>
              <CardDescription className="text-gray-400">
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 md:flex md:space-y-0 md:space-x-4">
              <div className="space-y-2 md:flex-1">
                <Label htmlFor="name" className="text-white">
                  Username
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2 md:flex-1">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 transition-colors"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="secondary"
                onClick={() => handleUpdate("account")}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card className="bg-gray-800 border-gray-700 rounded-xl overflow-hidden mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Change Password</CardTitle>
              <CardDescription className="text-gray-400">
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 md:flex md:space-y-0 md:space-x-4">
              <div className="space-y-2 md:flex-1">
                <Label htmlFor="current" className="text-white">
                  Current password
                </Label>
                <Input
                  id="current"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2 md:flex-1">
                <Label htmlFor="new" className="text-white">
                  New password
                </Label>
                <Input
                  id="new"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 transition-colors"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="secondary"
                onClick={() => handleUpdate("password")}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Update password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="avatar">
          <Card className="bg-gray-800 border-gray-700 rounded-xl overflow-hidden mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Profile Picture</CardTitle>
              <CardDescription className="text-gray-400">Update your profile picture here.</CardDescription>
            </CardHeader>
            <CardContent className="md:flex md:items-center md:space-x-6">
              <div className="flex flex-col items-center space-y-4 md:w-1/3">
                <Avatar className="h-32 w-32 border-4 border-blue-500">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback>{name?.[0]}</AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="avatar"
                  className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Choose file
                  <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </Label>
                {avatarFile && <p className="text-sm text-gray-400">{avatarFile.name}</p>}
              </div>
              <div className="md:w-2/3 mt-4 md:mt-0">
                <p className="text-gray-400">Upload a new avatar to change your profile picture. </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="secondary"
                onClick={() => handleUpdate("avatar")}
                disabled={!avatarFile}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Update Avatar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="delete">
          <Card className="bg-gray-800 border-gray-700 rounded-xl overflow-hidden mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Delete Account</CardTitle>
              <CardDescription className="text-gray-400">
                Permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white">This action cannot be undone. Please be certain.</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="destructive"
                onClick={() => handleUpdate("delete")}
                className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Delete Account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700 rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {updateType === "account"
                ? "This action will update your account information."
                : updateType === "password"
                  ? "This action will change your password and log you out."
                  : updateType === "avatar"
                    ? "This action will update your avatar."
                    : "This action will send a one-time password to your email to confirm account deletion."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUpdate}
              className="bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700 rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Account Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Please enter the one-time password sent to your email to confirm account deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deleteOTP" className="text-white">
                One-Time Password
              </Label>
              <Input
                id="deleteOTP"
                value={deleteOTP}
                onChange={(e) => setDeleteOTP(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-500 transition-colors"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}


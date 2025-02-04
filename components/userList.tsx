"use client"

import { useEffect, useState } from "react"
import { Loader2, ExternalLink, ShieldIcon, StarIcon, AwardIcon, CodeIcon, UserIcon, BadgeSwissFranc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface NewsArticle {
  id: string
  image: string
  badges: string
  email: string
  name: string
}

interface NewsResponse {
  users: NewsArticle[]
}

const getBadgeIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case "owner":
      return { name, priority: 1, icon: ShieldIcon }
    case "admin":
      return { name, priority: 3, icon: StarIcon }
    case "moderator":
      return { name, priority: 4, icon: AwardIcon }
    case "developer":
      return { name, priority: 2, icon: CodeIcon }
    default:
      return { name, priority: 10, icon: UserIcon }
  }
}

export function UserList() {
  const [users, setUsers] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/allusers")
        const data: NewsResponse = await response.json()

        if (!response.ok) throw new Error("Failed to fetch users")

        setUsers(data.users)
      } catch (err) {
        setError("Failed to load users")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  async function banUser(userId: string) {
    const response = await fetch('/api/admin/banUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, sessionKey: process.env.NEXT_PUBLIC_apikey  }),
    })

    if (response.status != 200 ) {
      toast(
                <>
                  {`Failed to ban user`}
                  <a
                    href="https://x.com/wlfyzz"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                  </a>
                </>,
                {
                  duration: 3000,
                },
              )
    }
    toast(
      <>
        {`Banned user.`}
        <a
          href="https://x.com/wlfyzz"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
        </a>
      </>,
      {
        duration: 3000,
      },
    )
    
  }
  async function removeUser(userId: string) {
    const response = await fetch('/api/admin/removeUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, sessionKey: process.env.NEXT_PUBLIC_apikey }),
    })
    if (response.status != 200 ) {
      toast(
                <>
                  {`Failed to remove user`}
                  <a
                    href="https://x.com/wlfyzz"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                  </a>
                </>,
                {
                  duration: 3000,
                },
              )
    }
    toast(
      <>
        {`User removed.`}
        <a
          href="https://x.com/wlfyzz"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
        </a>
      </>,
      {
        duration: 3000,
      },
    )
  }

  return (
    <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700/75 transition-colors">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h4 className="font-medium mb-1">{user.name}</h4>
                <div className="text-sm text-gray-400 mb-2">
                  <span>ID: {user.id}</span>
                  <span className="mx-2">|</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.badges.split(',').map((badge) => {
                    const { name, icon: Icon } = getBadgeIcon(badge.replace(" ", ""))
                    
                    return (
                      <Badge key={name} variant="secondary" className="flex items-center gap-1">
                        <Icon className="h-3 w-3" />
                        {name}
                      </Badge>
                    )
                  })}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300"
                onClick={() => banUser(user.id)}
              >
                Ban
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300"
                onClick={() => removeUser(user.id)}
              >
                Remove
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


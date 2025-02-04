"use client"

import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Header from "@/components/Header"
import { Clock } from "@/components/Clock"
import { Weather } from "@/components/Weather"
import { TaskList } from "@/components/TaskList"
import { QuickLinks } from "@/components/QuickLinks"
import { Button } from "@/components/ui/button"
import { AddTaskModal } from "@/components/AddTaskModal"
import { Radio } from "@/components/radio"
import { TechNews } from "@/components/news"
import { QuickNotes } from "@/components/quickNotes"
import { toast as toasty } from "sonner"
import PreviousMap_ from "postcss/lib/previous-map"
import { UserList } from "@/components/userList"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [greeting, setGreeting] = useState('')
  const [emoji, setEmoji] = useState('')
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [refreshTaskTrigger, setRefreshTaskTrigger] = useState(0)

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours()
      
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting('Good Morning')
        setEmoji("")
      } else if (currentHour >= 12 && currentHour < 17) {
        setGreeting('Good Afternoon')
        setEmoji("☀️")  // Sun emoji for afternoon
      } else if (currentHour >= 17 && currentHour < 21) {
        setGreeting('Good Evening')
        setEmoji("")
      } else {
        setGreeting('Good Night')
        setEmoji("🌙")  // Crescent moon emoji for night
      }
    }
    
    // Fetch badges with the userId from session
    const fetchBadges = async () => {
      if (session?.user?.userId) {
        try {
          const response = await fetch("/api/user/badges", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: session.user.userId }),
          })
          
          if (response.ok) {
            const data = await response.json()
            const perms = data.badges.split(",")
            if (!perms.includes('Admin') && !perms.includes('Owner')) {
                redirect("/dashboard")
            }
            
          } else {
            console.error("Error fetching badges:", response.statusText)
          }
        } catch (error) {
          console.error("Failed to fetch badges:", error)
        }
      }
    }
    fetchBadges()
    if (status === "unauthenticated") {
      router.push("/dashboard")
    } else if (status === "authenticated") {
      const toastId = localStorage.getItem('loginToastId')
      if (toastId) {
        toast.dismiss(toastId)
        localStorage.removeItem('loginToastId')
      }
    }
    
    getGreeting()
  }, [status, router, session?.user?.userId])

  const refreshTasks = useCallback(() => {
    setRefreshTaskTrigger(prev => prev + 1)
  }, [])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
              <h2 className="text-4xl font-bold mb-4">{greeting} {emoji}, {session.user?.name}</h2>
              <div className="text-2xl font-semibold text-gray-300">
                <Clock />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">User list</h3>
              <UserList/>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
              <Weather />
            </div>
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
              <Radio/>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold">Tasks</h3>
                <Button 
                  onClick={() => setIsAddTaskModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="text-white bg-gray-700 hover:bg-gray-600"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
              </div>
              <TaskList refreshTrigger={refreshTaskTrigger} />
            </div>
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
              <QuickNotes/>
            </div>
          </div>
        </div>
      </main>
      <AddTaskModal 
        isOpen={isAddTaskModalOpen} 
        onClose={() => {
          setIsAddTaskModalOpen(false)
          refreshTasks()
        }}
        refreshTasks={refreshTasks}
      />
    </div>
  )
}

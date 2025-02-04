"use client"

import { Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"

export function Users() {
  const [userCount, setUserCount] = useState(null)

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("/api/admin/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUserCount(data.users)
        } else {
          console.error("Error fetching user count:", response.statusText)
        }
      } catch (error) {
        console.error("Failed to fetch user count:", error)
      }
    }

    fetchUserCount()
  }, [])

  return (
    <div>
    <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Users</h3>
        <Button 
          onClick={() => window.location.href = "/admin/users"}
          variant="outline"
          size="sm"
          className="text-white bg-gray-700 hover:bg-gray-600"
        >
          <Plus className="mr-2 h-4 w-4" /> Manage Users
        </Button>
      </div>
        <p className="text-lg">{userCount !== null ? `Total user count: ${userCount}` : "Loading user count..."}</p>
      </div>
    </div>
  )
}


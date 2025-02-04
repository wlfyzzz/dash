"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Trash2 } from 'lucide-react'
import { AddLinkModal } from "./AddLinkModal"
import { toast } from 'react-hot-toast'

interface Link {
  id: string
  title: string
  url: string
  user_id: string
}

export function QuickLinks() {
  const { data: session } = useSession()
  const [links, setLinks] = useState<Link[]>([])
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLinks = async () => {
    if (!session?.user?.userId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/quick-access/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch quick access links')
      }

      const data = await response.json()
      setLinks(data.items)
    } catch (err) {
      console.error('Error fetching quick access links:', err)
      setError('Failed to load quick access links')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [session])

  const addLink = async (newLink: Omit<Link, 'id' | 'user_id'>) => {
    if (!session?.user?.userId) return

    try {
      const response = await fetch('/api/quick-access/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newLink,
          userId: session.user.userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add quick access link')
      }

      await fetchLinks() // Refresh the links after adding a new one
      toast.success('Link added successfully')
    } catch (error) {
      console.error('Error adding link:', error)
    }
  }

  const deleteLink = async (linkId: string, linkTitle: string) => {
    if (!session?.user?.userId) return

    try {
      const response = await fetch('/api/quick-access/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.userId,
          title: linkTitle,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete quick access link')
      }

      await fetchLinks() // Refresh the links after deleting one
      toast.success('Link deleted successfully')
    } catch (error) {
      console.error('Error deleting link:', error)
      toast.error('Failed to delete link. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
        <h3 className="text-2xl font-semibold">Quick Access</h3>
        <h3 className='text-xl font-semibold'> Failed to load links. Please try again later.</h3>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Quick Access</h3>
        <Button 
          onClick={() => setIsAddLinkModalOpen(true)}
          variant="outline"
          size="sm"
          className="text-white bg-gray-700 hover:bg-gray-600"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Link
        </Button>
      </div>
      {links.length === 0 ? (
        <p className="text-gray-300">No quick access links added yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 transition-colors flex justify-between items-center"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-grow"
              >
                {link.title}
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteLink(link.id, link.title)}
                className="ml-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <AddLinkModal
        isOpen={isAddLinkModalOpen}
        onClose={() => setIsAddLinkModalOpen(false)}
        onAddLink={addLink}
      />
    </div>
  )
}


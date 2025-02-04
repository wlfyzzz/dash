import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Link {
  title: string
  url: string
}

interface AddLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onAddLink: (link: Link) => void
}

export function AddLinkModal({ isOpen, onClose, onAddLink }: AddLinkModalProps) {
  const { data: session } = useSession()
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !url.trim() || !session?.user?.userId) {
      toast.error('Please fill in all fields')
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('/api/quick-access/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
          userId: session.user.userId,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to add link')
      }

      const newLink = await response.json()
      
      onAddLink(newLink)
      console.log(newLink)
      if (newLink.error === "Duplicate Request") {
        return
  }
      setTitle('')
      setUrl('')
      onClose()
    } catch (error) {
      console.error('Error adding link:', error)
      toast.error('Failed to add link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-blue-400" />
            Add Quick Access Link
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new quick access link to your dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="link-title" className="text-sm font-medium text-gray-200">
              Title
            </Label>
            <Input
              id="link-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter link title"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-url" className="text-sm font-medium text-gray-200">
              URL
            </Label>
            <Input
              id="link-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter link URL"
              disabled={isLoading}
            />
          </div>
          <DialogFooter className="sm:justify-start">
            <div className="flex w-full justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-gray-700 text-white hover:bg-gray-600"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isLoading ? 'Adding...' : 'Add Link'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


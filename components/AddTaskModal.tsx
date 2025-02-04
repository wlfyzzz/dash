"use client"

import { useState } from 'react'
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
import { toast } from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { PlusCircle } from 'lucide-react'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  refreshTasks: () => void
}

export function AddTaskModal({ isOpen, onClose, refreshTasks }: AddTaskModalProps) {
  const [taskName, setTaskName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const userId = session?.user?.userId

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskName.trim()) {
      toast.error('Task name cannot be empty')
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('/api/tasks/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskName,
          userId: userId,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to add task')
      }
      await response.json()
      toast.success('Task added successfully')
      setTaskName('')
      refreshTasks()
      onClose()
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error('Failed to add task. Please try again.')
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
            Add New Task
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new task to add to your list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="task-name" className="text-sm font-medium text-gray-200">
              Task Name
            </Label>
            <Input
              id="task-name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter task name"
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
                {isLoading ? 'Adding...' : 'Add Task'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


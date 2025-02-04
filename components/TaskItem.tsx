'use client'

import { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Task {
  id: number
  title: string
  completed: boolean
  user_id: number
}

interface TaskItemProps {
  task: Task
  onRemove: (taskId: number) => void
  onUpdate: (updatedTask: Task) => void
}

export function TaskItem({ task, onRemove, onUpdate }: TaskItemProps) {
  const [isLoading, setIsLoading] = useState(false)

  const removeTask = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({bin: true})
      })
      if (!response.ok) {
        throw new Error('Failed to remove task')
      }
      onRemove(task.id)
      toast.success('Task removed successfully')
    } catch (error) {
      console.error('Error removing task:', error)
      toast.error('Failed to remove task')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTask = async () => {
    setIsLoading(true)
    const updatedTask = { ...task, completed: !task.completed }

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: updatedTask.completed }),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      onUpdate(updatedTask)
      toast.success(`Task ${updatedTask.completed ? 'completed' : 'uncompleted'}`)
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-3">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={toggleTask}
          disabled={isLoading}
        />
        <label
          htmlFor={`task-${task.id}`}
          className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}
        >
          {task.title}
        </label>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={removeTask}
        disabled={isLoading}
        className="text-gray-400 hover:text-red-500 hover:bg-red-500/10"
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Remove task</span>
      </Button>
    </div>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { TaskItem } from "./TaskItem"
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'

interface Task {
  id: number
  title: string
  completed: boolean
  user_id: number
}

interface TaskListProps {
  refreshTrigger: number
}

export function TaskList({ refreshTrigger }: TaskListProps) {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    if (!session?.user?.userId) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      const data = await response.json()
      const tasksArray = data.tasks.map((task: any) => ({
        id: task.id,
        title: task.title, 
        completed: task.completed,
        user_id: task.userId,
      }))
      setTasks(tasksArray)
    } catch (err) {
      setError('Error loading tasks')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks, refreshTrigger])

  const handleRemoveTask = (taskId: number) => {
    setTasks(tasks.filter(t => t.id !== taskId))
    fetchTasks() // Refresh the task list after removal
  }

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
  }
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }
  if (error) return <div>{error}</div>

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-gray-300">No tasks to display.</p>
      ) : (
        tasks.map((task) => (
          <TaskItem 
            key={task.id}
            task={task} 
            onRemove={handleRemoveTask}
            onUpdate={handleUpdateTask}
          />
        ))
      )}
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'

export function QuickNotes() {
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const savedNotes = localStorage.getItem('quickNotes')
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('quickNotes', notes)
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Quick Notes</h3>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Jot down your thoughts..."
        className="mb-4 h-32"
      />
<Button 
                  onClick={() => handleSave}
                  variant="outline"
                  size="sm"
                  className="text-white bg-gray-700 hover:bg-gray-600"
                >
                  Save Notes
                </Button>
    </div>
  )
}

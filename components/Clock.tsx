'use client'

import { useState, useEffect } from 'react'

export function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-3xl font-bold">
      {time.toLocaleTimeString()}
    </div>
  )
}

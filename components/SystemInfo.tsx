"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

export function SystemInfo() {
  const [systemInfo, setSystemInfo] = useState<any>(null)

  useEffect(() => {
    const fetchSystemInfo = async () => {
      const response = await fetch("/api/system-info")
      const data = await response.json()
      setSystemInfo(data)
    }

    fetchSystemInfo()
    const interval = setInterval(fetchSystemInfo, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (!systemInfo) return <div>Loading system information...</div>

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <h3 className="text-lg font-medium mb-2">CPU Usage</h3>
        <div className="text-2xl font-bold mb-2">{systemInfo.cpuUsage}%</div>
        <Progress value={Number.parseFloat(systemInfo.cpuUsage)} />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Memory Usage</h3>
        <div className="text-2xl font-bold mb-2">{systemInfo.memUsage}%</div>
        <Progress value={Number.parseFloat(systemInfo.memUsage)} />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Total Memory</h3>
        <div className="text-2xl font-bold">{systemInfo.totalMem} GB</div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Free Memory</h3>
        <div className="text-2xl font-bold">{systemInfo.freeMem} GB</div>
      </div>
    </div>
  )
}


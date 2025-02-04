import { NextResponse } from "next/server"
import os from "os"

export async function GET() {
  const cpuUsage = (os.loadavg()[0] / os.cpus().length) * 100
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem
  const memUsage = (usedMem / totalMem) * 100

  return NextResponse.json({
    cpuUsage: cpuUsage.toFixed(2),
    memUsage: memUsage.toFixed(2),
    totalMem: (totalMem / 1024 / 1024 / 1024).toFixed(2),
    freeMem: (freeMem / 1024 / 1024 / 1024).toFixed(2),
  })
}


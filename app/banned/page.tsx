"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BannedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Card className="w-full max-w-md bg-gray-800 text-white border-red-500 border-2">
        <CardHeader className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <CardTitle className="text-3xl font-bold text-red-500">Account Suspended</CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            Your account has been suspended by an administrator.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">
            If you believe this is a mistake or would like to appeal this decision, please contact our support team.
          </p>
          <div className="bg-gray-700 p-4 rounded-lg flex items-center space-x-3">
            <Mail className="text-blue-400" />
            <span className="text-blue-400">{process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com"}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Link
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com"}`}
              className="flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Support</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/providers"
import { Toaster } from "react-hot-toast"
import { Toaster as Toast } from "@/components/ui/sonner"
import { ClientLayout } from "@/components/Client"

const inter = Inter({ subsets: ["latin"] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} dark bg-gray-900 h-full flex flex-col`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">
              <ClientLayout>{children}</ClientLayout>
            </main>

            {/* Toast notifications */}
            <Toast />
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }}
            />
          </div>
        </Providers>
      </body>
    </html>
  )
}


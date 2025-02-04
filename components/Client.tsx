"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { ConditionalRender } from "@/components/conditional-render"
import { Command } from "@/components/command"

interface RecentItem {
  id: number
  url: string
  title: string
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function updateRecentItems(pathname: string): void {
  if (pathname === "/") {
    return
  }

  const storedItems = localStorage.getItem("recent")
  const recentItems: RecentItem[] = storedItems ? JSON.parse(storedItems) : []

  const newItem: RecentItem = {
    id: Date.now(),
    url: pathname,
    title: capitalizeFirstLetter(pathname.split("/")[1]),
  }

  const existingIndex = recentItems.findIndex((item) => item.url === newItem.url)

  if (existingIndex !== -1) {
    recentItems.splice(existingIndex, 1)
  }

  recentItems.unshift(newItem)

  if (recentItems.length > 2) {
    recentItems.pop()
  }

  localStorage.setItem("recent", JSON.stringify(recentItems))
}

async function logError(error: Error, context: string) {
  try {
    const response = await fetch("/api/log-error", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `${context}: ${error.message}`,
        stack: error.stack,
      }),
    })

    if (!response.ok) {
      console.error("Failed to log error:", await response.text())
    }
  } catch (logError) {
    console.error("Error while logging error:", logError)
  }
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const hasMounted = useRef(false)

  useEffect(() => {
    if (session?.user.name) {
      fetch("/api/user/isBanned/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.userId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user === true ) {
            if (pathname !== "/banned") {
            router.push("/banned")}
          }
        })
        .catch((error) => {
          console.error("Error checking ban status:", error)
          logError(error, "Check Ban Status")
        })
    }
  }, [session, router])

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true

      try {
        toast(
          <>
            {`Site built by `}
            <a
              href="https://x.com/wlfyzz"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              wlfyzz
            </a>
            <FontAwesomeIcon icon={faXTwitter} />
          </>,
          {
            duration: 3000,
          },
        )

        setTimeout(() => {
          toast(
            <>
              {`Code open source on  `}
              <a
                href="https://github.com/wlfyzz/dash"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Github
              </a>
              <FontAwesomeIcon icon={faGithub} />
            </>,
            {
              duration: 3000,
            },
          )
        }, 4000)
      } catch (error) {
        console.error("Error in toast notifications:", error)
        logError(error as Error, "Toast Notifications")
      }
    }
  }, [])

  useEffect(() => {
    try {
      if (pathname) {
        updateRecentItems(pathname)
      }
    } catch (error) {
      console.error("Error updating recent items:", error)
      logError(error as Error, "Update Recent Items")
    }
  }, [pathname])

  return (
    <>
      {children}
      <ConditionalRender excludePaths={["/"]}>
        <Command />
      </ConditionalRender>
    </>
  )
}


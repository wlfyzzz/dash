'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, AtSignIcon, MailIcon, StarIcon, ShieldIcon, AwardIcon, CodeXml, User } from 'lucide-react'
import ColorThief from 'colorthief' // @ts-ignore
import { Badge as BadgeType, sortBadges } from '../types/badge'

function useImageColors(imageUrl: string | null | undefined) {
  const [colors, setColors] = useState<string[]>([])

  useEffect(() => {
    if (!imageUrl) return

    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = imageUrl

    img.onload = () => {
      const colorThief = new ColorThief()
      const palette = colorThief.getPalette(img, 3)
      const hexColors = palette.map((color: number[]) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`)
      setColors(hexColors)
    }
  }, [imageUrl])

  return colors
}

export function UserProfile() {
  const { data: session } = useSession()
  const [badges, setBadges] = useState<BadgeType[]>([])

  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/user/badges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.userId }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.badges) {
            const badgeList: BadgeType[] = data.badges.split(',').map((badge: string) => {
              const name = badge.trim()
              switch (name.toLowerCase()) {
                case 'owner':
                  return { name, priority: 1, icon: ShieldIcon }
                case 'admin':
                  return { name, priority: 3, icon: StarIcon }
                case 'moderator':
                  return { name, priority: 4, icon: AwardIcon }
                case 'developer':
                  return { name, priority: 2, icon: CodeXml}
                default:
                  return { name, priority: 10, icon: User }
              }
            });
            setBadges(sortBadges(badgeList));
          }
        })
        .catch(error => console.error('Error fetching badges:', error));
    }
  }, [session?.user?.id]);

  if (!session?.user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  const { name, email, image } = session.user
  const username = name?.toLowerCase().replace(/\s+/g, '') || 'username'
  const colors = useImageColors(image)

  const gradientStyle = colors.length > 0
    ? { background: `linear-gradient(135deg, ${colors.join(', ')})` }
    : { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' } // Fallback gradient

    const displayBadges = badges.length > 0 && 
    (badges[0].name.toLowerCase() === 'owner' || 
     badges[0].name.toLowerCase() === 'moderator' || 
     badges[0].name.toLowerCase() === 'admin')
    ? [badges[0]] 
    : badges;

  return (
    <Card className="w-auto min-w-[320px] bg-gray-800 text-white border-gray-700 shadow-lg overflow-visible">
      <div className="relative h-32" style={gradientStyle}>
        <Avatar className="absolute -bottom-12 left-6 h-24 w-24">
          <AvatarImage src={image || undefined} alt={name || 'User'} />
          <AvatarFallback>{name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
      </div>
      <CardContent className="pt-16 pb-6 px-6">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold">{name}</h2>
          {displayBadges.map((badge, index) => (
            <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
              {badge.icon && <badge.icon className="h-3 w-3" />}
              {badge.name}
            </Badge>
          ))}
        </div>
        <div className="space-y-4 text-sm">
          <div className="flex items-center">
            <AtSignIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-300">{username}</span>
          </div>
          <div className="flex items-center">
            <MailIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-300">{email}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-300">Joined {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


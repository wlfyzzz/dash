"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Loader2 } from "lucide-react"
import {toast} from 'sonner'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faItunesNote } from "@fortawesome/free-brands-svg-icons"

interface Song {
  id: string
  art: string
  text: string
  artist: string
  title: string
  album: string
}

interface NowPlaying {
  elapsed: number
  duration: number
  song: Song
}

interface RadioData {
  station: {
    name: string
    listen_url: string
  }
  now_playing: NowPlaying
}

export function Radio() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [radioData, setRadioData] = useState<RadioData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [OldTitle, setOldTitle] = useState("")


  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchRadioData()
    const interval = setInterval(fetchRadioData, 500) // Update every 500ms
    return () => clearInterval(interval)
  }, [])

  const fetchRadioData = async () => {
    try {
      const response = await fetch("/api/radio", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch radio data")
      }
      const data = await response.json()
      if (isPlaying) {if (OldTitle != data.data.now_playing.song.title ) {
        toast(
          <>
            {`Now playing `}
            <a
              href="https://pawtasticradio.net"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              ${data.data.now_playing.song.title} By ${data.data.now_playing.song.artist}
            </a>
            <FontAwesomeIcon icon={faItunesNote} />
          </>,
                  {
                    duration: 3000, 
                  }
        )
}}
      setOldTitle(data.data.now_playing.song.title)
      setRadioData(data.data)
      setLoading(false)
    } catch (err) {
      setError("Error fetching radio data")
      setLoading(false)
    }
  }

  const startRadioSession = () => {
    if (radioData) {
      audioRef.current = new Audio(radioData.station.listen_url)
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const stopRadioSession = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsPlaying(false)
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      stopRadioSession()
    } else {
      startRadioSession()
    }
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, []) // 
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }
  if (error) return <div>Error: {error}</div>
  if (!radioData) return null

  const { now_playing } = radioData
  return (
    <div className="space-y-6 p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={now_playing.song.art || "/placeholder.svg"}
            alt={`${now_playing.song.title} cover`}
            className="w-24 h-24 rounded-md object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">{now_playing.song.title}</h2>
            <p className="text-sm text-muted-foreground">{now_playing.song.artist}</p>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Button onClick={togglePlayPause} size="icon" variant="outline">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}


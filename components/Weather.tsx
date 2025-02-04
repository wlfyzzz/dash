'use client'

import { useState, useEffect } from 'react'
import { Loader2, Thermometer, Droplets, Wind } from 'lucide-react'

interface WeatherData {
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  weather: Array<{
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  name: string
}

export function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords

            try {
              const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
              const data = await res.json()
              
              if (data.error) {
                setError(data.error)
              } else {
                setWeather(data)
              }
            } catch (error) {
              console.error('Failed to fetch weather:', error)
              setError('Failed to fetch weather data')
            } finally {
              setLoading(false)
            }
          },
          (error) => {
            console.error('Error getting location:', error)
            setError('Weather permission not found. Cannot load weather')
            setLoading(false)
          }
        )
      } else {
        setError('Geolocation not supported')
        setLoading(false)
      }
    }

    fetchLocationAndWeather()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return <div className="text-sm">{error}</div>
  }

  if (!weather) {
    return <div className="text-sm">Failed to load weather data</div>
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
          alt={weather.weather[0].description}
          className="w-15 h-15"
        />
        <div>
          <div className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</div>
          <div className="text-base capitalize">{weather.weather[0].description}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Thermometer className="h-5 w-5" />
          <span className="text-sm">Feels like: {Math.round(weather.main.feels_like)}°C</span>
        </div>
        <div className="flex items-center space-x-2">
          <Droplets className="h-5 w-5" />
          <span className="text-sm">Humidity: {weather.main.humidity}%</span>
        </div>
      </div>
    </div>
  )
}

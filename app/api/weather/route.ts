import { NextResponse } from 'next/server'

export async function GET(req: any) {
  const apiKey = process.env.weatherKey
  const { searchParams } = new URL(req.url)

  const latitude = searchParams.get("lat")
  const longitude = searchParams.get("lon")

  if (!latitude || !longitude) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching weather:', error)
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  }
}

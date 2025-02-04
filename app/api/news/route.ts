import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(
      'https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=2',
      {
        headers: {
          'Authorization': `Bearer ${process.env.newsKey}`
        },
      }
    )

    const data = await response.json()

    if (data.status !== 'ok') {
      throw new Error('Failed to fetch news')
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

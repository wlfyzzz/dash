"use client"

import { useEffect, useState } from "react"
import { Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewsArticle {
  title: string
  url: string
  publishedAt: string
  source: {
    name: string
  }
}

interface NewsResponse {
  articles: NewsArticle[]
}

export function TechNews() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news")
        const data: NewsResponse = await response.json()

        if (!response.ok) throw new Error("Failed to fetch news")

        setNews(data.articles)
      } catch (err) {
        setError("Failed to load tech news")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
      <div className="space-y-4">
        {news.map((article, index) => (
          <div key={index} className="p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700/75 transition-colors">
            <h4 className="font-medium mb-2">{article.title.split(`- ${article.source.name}`)}</h4>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{article.source.name}</span>
              <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300" asChild>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Learn more
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


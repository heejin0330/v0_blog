"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface SearchResult {
  title: string
  url: string
  snippet: string
}

interface SearchResultsPreviewProps {
  results?: SearchResult[]
  answer?: string
}

export function SearchResultsPreview({ results, answer }: SearchResultsPreviewProps) {
  if (!results || results.length === 0) {
    return null
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
          웹 검색 결과 미리보기
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {answer && (
          <div className="rounded-lg bg-blue-100/50 p-3 text-sm text-blue-900 dark:bg-blue-900/30 dark:text-blue-100">
            <p className="font-medium mb-1">요약:</p>
            <p>{answer}</p>
          </div>
        )}
        <div className="space-y-2">
          {results.map((result, index) => (
            <a
              key={index}
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-blue-200 bg-white p-3 transition-colors hover:bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40 dark:hover:bg-blue-900/40"
            >
              <div className="flex items-start gap-2">
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900 line-clamp-1 dark:text-blue-100">
                    {result.title}
                  </p>
                  <p className="mt-1 text-xs text-blue-700 line-clamp-2 dark:text-blue-300">
                    {result.snippet}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          이 정보는 포스팅 생성 시 활용됩니다.
        </p>
      </CardContent>
    </Card>
  )
}



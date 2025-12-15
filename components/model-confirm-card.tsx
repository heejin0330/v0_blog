"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, RefreshCw, Loader2 } from "lucide-react"
import { SearchResultsPreview } from "@/components/search-results-preview"

export interface WatchModelInfo {
  brand: string
  modelName: string
  referenceNumber: string
  caliber?: string
  caseSize?: string
  caseMaterial?: string
  waterResistance?: string
  releaseYear?: number
  msrpKrw?: number
  thumbnailUrl?: string
  webSearchResults?: Array<{
    title: string
    url: string
    snippet: string
  }>
  webSearchAnswer?: string
}

interface ModelConfirmCardProps {
  modelInfo: WatchModelInfo | null
  isLoading: boolean
  onConfirm: () => void
  onReject: () => void
  onRetry: () => void
}

export function ModelConfirmCard({ modelInfo, isLoading, onConfirm, onReject, onRetry }: ModelConfirmCardProps) {
  if (isLoading) {
    return (
      <Card className="border-border">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="mt-4 text-sm text-muted-foreground">시계 모델 정보를 검색하고 있습니다...</p>
        </CardContent>
      </Card>
    )
  }

  if (!modelInfo) {
    return (
      <Card className="border-border">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">모델명을 입력하고 검색을 시작하세요.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-serif text-xl">모델 정보 확인</CardTitle>
        <CardDescription>아래 정보가 맞는지 확인해주세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Info */}
        <div className="flex gap-6">
          {/* Thumbnail */}
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
            {modelInfo.thumbnailUrl ? (
              <img
                src={modelInfo.thumbnailUrl || "/placeholder.svg"}
                alt={`${modelInfo.brand} ${modelInfo.modelName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <span className="text-xs">이미지 없음</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">브랜드</p>
              <p className="font-semibold text-foreground">{modelInfo.brand}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">모델명</p>
              <p className="font-semibold text-foreground">{modelInfo.modelName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">레퍼런스</p>
              <p className="font-mono text-sm text-foreground">{modelInfo.referenceNumber}</p>
            </div>
          </div>
        </div>

        {/* Specs Table */}
        <div className="rounded-lg border border-border">
          <table className="w-full text-sm">
            <tbody>
              {modelInfo.caliber && (
                <tr className="border-b border-border">
                  <td className="px-4 py-2 font-medium text-muted-foreground">칼리버</td>
                  <td className="px-4 py-2 text-foreground">{modelInfo.caliber}</td>
                </tr>
              )}
              {modelInfo.caseSize && (
                <tr className="border-b border-border">
                  <td className="px-4 py-2 font-medium text-muted-foreground">케이스 크기</td>
                  <td className="px-4 py-2 text-foreground">{modelInfo.caseSize}</td>
                </tr>
              )}
              {modelInfo.caseMaterial && (
                <tr className="border-b border-border">
                  <td className="px-4 py-2 font-medium text-muted-foreground">케이스 소재</td>
                  <td className="px-4 py-2 text-foreground">{modelInfo.caseMaterial}</td>
                </tr>
              )}
              {modelInfo.waterResistance && (
                <tr className="border-b border-border">
                  <td className="px-4 py-2 font-medium text-muted-foreground">방수</td>
                  <td className="px-4 py-2 text-foreground">{modelInfo.waterResistance}</td>
                </tr>
              )}
              {modelInfo.releaseYear && (
                <tr className="border-b border-border">
                  <td className="px-4 py-2 font-medium text-muted-foreground">출시년도</td>
                  <td className="px-4 py-2 text-foreground">{modelInfo.releaseYear}년</td>
                </tr>
              )}
              {modelInfo.msrpKrw && (
                <tr>
                  <td className="px-4 py-2 font-medium text-muted-foreground">정가 (KRW)</td>
                  <td className="px-4 py-2 text-foreground">{modelInfo.msrpKrw.toLocaleString()}원</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Web Search Results Preview */}
        {modelInfo.webSearchResults && modelInfo.webSearchResults.length > 0 && (
          <SearchResultsPreview
            results={modelInfo.webSearchResults}
            answer={modelInfo.webSearchAnswer}
          />
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onRetry} className="bg-transparent">
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 검색
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReject}
            className="bg-transparent text-destructive hover:bg-destructive/10"
          >
            <X className="mr-2 h-4 w-4" />
            취소
          </Button>
          <Button size="sm" onClick={onConfirm} className="bg-primary text-primary-foreground">
            <Check className="mr-2 h-4 w-4" />
            확인 및 진행
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

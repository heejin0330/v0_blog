"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ExternalLink, ImageIcon, LayoutDashboard } from "lucide-react"

interface CompletionCardProps {
  wpPostUrl: string
  wpAdminUrl: string
  imageCount: number
  onViewImages: () => void
  onNewGeneration: () => void
}

export function CompletionCard({
  wpPostUrl,
  wpAdminUrl,
  imageCount,
  onViewImages,
  onNewGeneration,
}: CompletionCardProps) {
  return (
    <Card className="border-green-500/30 bg-green-500/5">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="mt-4 font-serif text-xl text-foreground">저장 완료!</CardTitle>
        <CardDescription>워드프레스에 임시글로 저장되었습니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Links */}
        <div className="space-y-2">
          <a href={wpPostUrl} target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="outline" className="w-full justify-start bg-card">
              <ExternalLink className="mr-2 h-4 w-4" />
              포스트 편집하기
            </Button>
          </a>
          <a href={wpAdminUrl} target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="outline" className="w-full justify-start bg-card">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              관리자 대시보드
            </Button>
          </a>
          <Button variant="outline" className="w-full justify-start bg-card" onClick={onViewImages}>
            <ImageIcon className="mr-2 h-4 w-4" />
            이미지 다운로드 ({imageCount}개)
          </Button>
        </div>

        {/* New Generation */}
        <Button className="w-full bg-primary text-primary-foreground" onClick={onNewGeneration}>
          새 포스팅 생성하기
        </Button>
      </CardContent>
    </Card>
  )
}

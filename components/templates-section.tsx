"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FileText, GitCompare, History, ArrowRight } from "lucide-react"

const templates = [
  {
    id: "detailed_review",
    icon: FileText,
    name: "상세 리뷰형",
    description: "신제품 리뷰, 상세 분석에 적합",
    sections: ["소개", "디자인", "스펙", "무브먼트", "착용감", "가격", "결론"],
    preview: `# 롤렉스 서브마리너 126610LN 완벽 리뷰

## 소개
롤렉스 서브마리너는 1953년 출시 이후 다이버 워치의 아이콘으로...

## 디자인 및 외관
41mm 오이스터 케이스는 이전 모델 대비 1mm 증가하여...

## 상세 스펙
| 항목 | 스펙 |
|------|------|
| 케이스 크기 | 41mm |
| 방수 | 300m |
...`,
  },
  {
    id: "comparison",
    icon: GitCompare,
    name: "비교 분석형",
    description: "구매 가이드, 모델 비교에 적합",
    sections: ["소개", "경쟁 모델 비교", "장단점", "추천 대상", "결론"],
    preview: `# 오메가 스피드마스터 vs 롤렉스 데이토나 비교

## 소개
크로노그래프의 양대 산맥, 어떤 시계가 나에게 맞을까요?

## 경쟁 모델 비교
| 항목 | 스피드마스터 | 데이토나 |
|------|------------|---------|
| 가격 | 7,900$ | 14,800$ |
...`,
  },
  {
    id: "history",
    icon: History,
    name: "히스토리형",
    description: "브랜드 스토리, 컬렉터 대상에 적합",
    sections: ["브랜드 역사", "모델 탄생 배경", "진화 과정", "현재 모델", "가치"],
    preview: `# 오메가 스피드마스터의 역사 - 달에 간 시계

## 브랜드 역사
1848년 스위스 라쇼드퐁에서 시작된 오메가는...

## 문워치의 탄생
1969년 7월 20일, 닐 암스트롱이 달에 첫 발을 내디뎠을 때...

## 진화의 역사
초기 CK2915부터 현재 3861 칼리버까지...`,
  },
]

export function TemplatesSection() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id)
  const activeTemplate = templates.find((t) => t.id === selectedTemplate)

  return (
    <section id="templates" className="border-t border-border bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            목적에 맞는 템플릿 선택
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            3가지 전문 템플릿 중 콘텐츠 성격에 맞는 것을 선택하세요. 각 템플릿은 SEO에 최적화된 구조를 갖추고 있습니다.
          </p>
        </div>

        {/* Template Selector */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Left: Template Cards */}
          <div className="space-y-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={cn(
                  "w-full rounded-xl border p-5 text-left transition-all",
                  selectedTemplate === template.id
                    ? "border-accent bg-card shadow-sm"
                    : "border-border bg-card/50 hover:border-border hover:bg-card",
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      selectedTemplate === template.id ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <template.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{template.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {template.sections.map((section) => (
                        <span
                          key={section}
                          className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Preview */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-semibold text-foreground">미리보기</h4>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                {activeTemplate?.name}
              </span>
            </div>
            <div className="h-80 overflow-auto rounded-lg bg-muted/50 p-4">
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted-foreground">
                {activeTemplate?.preview}
              </pre>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            지금 시작하기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

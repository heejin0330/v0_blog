"use client"

import { cn } from "@/lib/utils"
import { FileText, GitCompare, History } from "lucide-react"

const templates = [
  {
    id: "detailed_review",
    icon: FileText,
    name: "상세 리뷰형",
    description: "신제품 리뷰, 상세 분석",
    sections: ["소개", "디자인", "스펙", "무브먼트", "착용감", "가격", "결론"],
  },
  {
    id: "comparison",
    icon: GitCompare,
    name: "비교 분석형",
    description: "구매 가이드, 모델 비교",
    sections: ["소개", "경쟁 모델 비교", "장단점", "추천 대상", "결론"],
  },
  {
    id: "history",
    icon: History,
    name: "히스토리형",
    description: "브랜드 스토리, 컬렉터 대상",
    sections: ["브랜드 역사", "탄생 배경", "진화 과정", "현재 모델", "가치"],
  },
]

interface TemplateSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onChange(template.id)}
          className={cn(
            "w-full rounded-lg border p-4 text-left transition-all",
            value === template.id ? "border-accent bg-accent/5" : "border-border bg-card hover:border-accent/50",
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                value === template.id ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground",
              )}
            >
              <template.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{template.name}</h4>
              <p className="mt-0.5 text-xs text-muted-foreground">{template.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {template.sections.map((section) => (
                  <span key={section} className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                    {section}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  const [modelName, setModelName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (modelName.trim()) {
      window.location.href = `/workspace?model=${encodeURIComponent(modelName)}`
    }
  }

  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 32V0h32" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">AI 기반 블로그 자동화</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            <span className="text-balance">시계 블로그 포스팅,</span>
            <br />
            <span className="text-balance text-accent">AI가 대신 써드립니다</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            시계 모델명만 입력하세요. 웹에서 정보를 수집하고, SEO에 최적화된 고품질 블로그 글을 자동 생성하여
            워드프레스에 저장합니다.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-lg">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                type="text"
                placeholder="시계 모델명 입력 (예: Rolex Submariner 126610LN)"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="h-12 flex-1 border-border bg-card text-base placeholder:text-muted-foreground focus-visible:ring-accent"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-primary px-6 text-primary-foreground hover:bg-primary/90"
              >
                시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-10">
            <div>
              <p className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">1,000+</p>
              <p className="mt-1 text-sm text-muted-foreground">생성된 포스팅</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">30초</p>
              <p className="mt-1 text-sm text-muted-foreground">평균 생성 시간</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">95%</p>
              <p className="mt-1 text-sm text-muted-foreground">SEO 최적화 점수</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

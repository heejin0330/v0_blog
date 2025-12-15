"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, HelpCircle, Menu, X, Watch } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Watch className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight text-foreground">WatchBlogger</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            기능
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            사용방법
          </Link>
          <Link
            href="#templates"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            템플릿
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">도움말</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="h-5 w-5" />
            <span className="sr-only">설정</span>
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">시작하기</Button>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">메뉴</span>
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-2 p-4">
            <Link
              href="#features"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              기능
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              사용방법
            </Link>
            <Link
              href="#templates"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              템플릿
            </Link>
            <div className="mt-2 flex items-center gap-2 border-t border-border pt-4">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Settings className="mr-2 h-4 w-4" />
                설정
              </Button>
              <Button size="sm" className="flex-1 bg-primary text-primary-foreground">
                시작하기
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

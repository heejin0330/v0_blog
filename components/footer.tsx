import Link from "next/link"
import { Watch } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Watch className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-serif text-lg font-semibold text-foreground">WatchBlogger AI</span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              이용약관
            </Link>
            <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              개인정보처리방침
            </Link>
            <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              문의하기
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">© 2025 WatchBlogger AI</p>
        </div>
      </div>
    </footer>
  )
}

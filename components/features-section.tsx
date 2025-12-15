import { Search, FileText, ImageIcon, Zap, Shield, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "스마트 웹 검색",
    description: "시계 모델명만 입력하면 공식 사이트, 전문 리뷰, 커뮤니티에서 관련 정보를 자동으로 수집합니다.",
  },
  {
    icon: FileText,
    title: "SEO 최적화 콘텐츠",
    description: "메타 태그, 키워드 밀도, H1~H3 구조화까지 검색엔진에 최적화된 1,000자 이상의 글을 생성합니다.",
  },
  {
    icon: ImageIcon,
    title: "이미지 수집",
    description: "고품질 이미지를 자동으로 수집하고 다운로드 링크를 제공합니다. 저작권 걱정 없이 사용하세요.",
  },
  {
    icon: Zap,
    title: "원클릭 저장",
    description: "생성된 콘텐츠를 워드프레스 임시글로 바로 저장. 편집 후 발행만 하면 됩니다.",
  },
  {
    icon: Shield,
    title: "정확한 정보",
    description: "최신 웹 데이터를 기반으로 정확한 스펙, 가격, 리뷰 정보를 제공합니다.",
  },
  {
    icon: BarChart3,
    title: "성과 분석",
    description: "생성된 포스팅의 SEO 점수와 예상 성과를 미리 확인할 수 있습니다.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            블로그 운영의 모든 것을 자동화
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            시간이 많이 드는 정보 수집과 글 작성을 AI가 대신합니다. 당신은 최종 검토와 발행에만 집중하세요.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

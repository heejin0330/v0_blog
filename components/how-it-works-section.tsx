import { Check } from "lucide-react"

const steps = [
  {
    number: "1",
    title: "모델명 입력",
    description: "포스팅할 시계의 모델명과 별명을 입력합니다.",
    details: ["브랜드 자동 인식", "레퍼런스 번호 추출", "모델 정보 미리보기"],
  },
  {
    number: "2",
    title: "정보 확인",
    description: "AI가 수집한 모델 정보를 확인하고 승인합니다.",
    details: ["브랜드 & 스펙 확인", "대표 이미지 미리보기", "수정 또는 재검색"],
  },
  {
    number: "3",
    title: "템플릿 선택",
    description: "3가지 템플릿 중 콘텐츠 성격에 맞는 것을 선택합니다.",
    details: ["상세 리뷰형", "비교 분석형", "히스토리형"],
  },
  {
    number: "4",
    title: "워드프레스 저장",
    description: "생성된 콘텐츠를 워드프레스 임시글로 저장합니다.",
    details: ["임시글 자동 저장", "이미지 다운로드 링크", "관리자 바로가기"],
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            4단계로 완성되는 블로그 포스팅
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            복잡한 설정 없이 모델명만 입력하면 끝. 30초 안에 고품질 콘텐츠가 완성됩니다.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-8 hidden h-0.5 w-full -translate-x-1/2 bg-border lg:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                {/* Step Number */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background font-serif text-2xl font-semibold text-primary">
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>

                {/* Details */}
                <ul className="mt-4 space-y-2">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-accent" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { WordPressSettingsModal } from "@/components/wordpress-settings-modal";
import {
  ModelConfirmCard,
  type WatchModelInfo,
} from "@/components/model-confirm-card";
import { TemplateSelector } from "@/components/template-selector";
import { GenerationProgress } from "@/components/generation-progress";
import { CompletionCard } from "@/components/completion-card";
import { ContentPreview } from "@/components/content-preview";
import { Watch, ArrowLeft, Settings, HelpCircle, Loader2 } from "lucide-react";

type WorkspaceStep = "input" | "confirm" | "generating" | "completed";

interface GenerationResult {
  title: string;
  content: string;
  metaDescription: string;
  tags: string[];
  wordCount: number;
  seoScore: number;
  images: { url: string; alt: string }[];
  wpPostId: number;
  wpPostUrl: string;
}

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialModel = searchParams.get("model") || "";

  const [step, setStep] = useState<WorkspaceStep>("input");
  const [modelName, setModelName] = useState(initialModel);
  const [modelAlias, setModelAlias] = useState("");
  const [includeImages, setIncludeImages] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("detailed_review");
  const [isSearching, setIsSearching] = useState(false);
  const [modelInfo, setModelInfo] = useState<WatchModelInfo | null>(null);
  const [generationSteps, setGenerationSteps] = useState([
    { id: "search", label: "웹 정보 수집 중...", status: "pending" as const },
    { id: "generate", label: "콘텐츠 생성 중...", status: "pending" as const },
    { id: "seo", label: "SEO 최적화 중...", status: "pending" as const },
    { id: "save", label: "워드프레스 저장 중...", status: "pending" as const },
  ]);
  const [generationResult, setGenerationResult] =
    useState<GenerationResult | null>(null);
  const [wpSettings, setWpSettings] = useState<{
    siteUrl: string;
    username?: string;
    appPassword?: string;
  } | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

  // Load WP settings from .env or localStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // 먼저 .env 설정 확인
        const response = await fetch("/api/wordpress/get-settings");
        if (response.ok) {
          const data = await response.json();
          if (data.hasEnvSettings) {
            // .env 설정이 있으면 사용 (서버에서 자동으로 사용되므로 siteUrl만 필요)
            setWpSettings({
              siteUrl: data.siteUrl || "",
            });
            return;
          }
        }
        // .env 설정이 없으면 localStorage에서 로드
        const saved = localStorage.getItem("wp_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          setWpSettings(parsed);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        // 에러 발생 시 localStorage에서 로드 시도
        const saved = localStorage.getItem("wp_settings");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setWpSettings(parsed);
          } catch {
            // JSON 파싱 실패 시 무시
          }
        }
      }
    };

    loadSettings();
  }, []);

  // Auto search if model provided in URL
  useEffect(() => {
    if (initialModel && step === "input") {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!modelName.trim()) return;

    setIsSearching(true);
    setStep("confirm");

    try {
      const response = await fetch("/api/watch/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelName }),
      });

      if (response.ok) {
        const data = await response.json();
        setModelInfo(data);
      } else {
        // Mock data for demo
        setModelInfo({
          brand: "Rolex",
          modelName: "Submariner Date",
          referenceNumber: "126610LN",
          caliber: "3235",
          caseSize: "41mm",
          caseMaterial: "Oystersteel",
          waterResistance: "300m",
          releaseYear: 2020,
          msrpKrw: 13500000,
          thumbnailUrl: "/rolex-submariner-watch.jpg",
        });
      }
    } catch {
      // Mock data for demo
      setModelInfo({
        brand: "Rolex",
        modelName: "Submariner Date",
        referenceNumber: "126610LN",
        caliber: "3235",
        caseSize: "41mm",
        caseMaterial: "Oystersteel",
        waterResistance: "300m",
        releaseYear: 2020,
        msrpKrw: 13500000,
        thumbnailUrl: "/rolex-submariner-watch.jpg",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirm = async () => {
    if (!wpSettings) {
      alert("먼저 워드프레스 설정을 완료해주세요.");
      return;
    }

    if (!modelInfo) {
      alert("시계 정보를 먼저 검색해주세요.");
      return;
    }

    setStep("generating");

    // Simulate generation process
    const updateStep = (stepId: string, status: "active" | "completed") => {
      setGenerationSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, status } : s))
      );
    };

    try {
      // Step 1: Search
      updateStep("search", "active");
      await new Promise((r) => setTimeout(r, 1000));
      updateStep("search", "completed");

      // Step 2: Generate
      updateStep("generate", "active");

      // 실제 콘텐츠 생성 API 호출
      const generateResponse = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelName,
          modelAlias,
          templateType: selectedTemplate,
          includeImages,
          modelInfo,
        }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || "콘텐츠 생성에 실패했습니다.");
      }

      const generateData = await generateResponse.json();
      if (!generateData.success || !generateData.data) {
        throw new Error("콘텐츠 생성 응답이 올바르지 않습니다.");
      }

      updateStep("generate", "completed");

      // Step 3: SEO
      updateStep("seo", "active");
      await new Promise((r) => setTimeout(r, 1000));
      updateStep("seo", "completed");

      // Step 4: Save to WordPress
      updateStep("save", "active");

      // 실제 워드프레스 저장 API 호출
      // .env에 설정이 있으면 siteUrl, username, appPassword는 보내지 않아도 됨
      const requestBody: {
        title: string;
        content: string;
        metaDescription: string;
        tags: string[];
        siteUrl?: string;
        username?: string;
        appPassword?: string;
      } = {
        title: generateData.data.title,
        content: generateData.data.content,
        metaDescription: generateData.data.metaDescription,
        tags: generateData.data.tags || [],
      };

      // .env 설정이 없을 때만 body에 포함
      // wpSettings에 siteUrl만 있다는 것은 .env가 아닐 수 있음
      // 하지만 안전하게 하기 위해 siteUrl이 있으면 포함
      if (wpSettings.siteUrl) {
        requestBody.siteUrl = wpSettings.siteUrl;
      }

      const saveResponse = await fetch("/api/wordpress/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || "워드프레스 저장에 실패했습니다.");
      }

      const saveData = await saveResponse.json();
      if (!saveData.success || !saveData.postId) {
        throw new Error("워드프레스 저장 응답이 올바르지 않습니다.");
      }

      updateStep("save", "completed");

      // Set result with actual WordPress post data
      setGenerationResult({
        title: generateData.data.title,
        content: generateData.data.content,
        metaDescription: generateData.data.metaDescription,
        tags: generateData.data.tags || [],
        wordCount: generateData.data.wordCount || 0,
        seoScore: generateData.data.seoScore || 0,
        images: generateData.data.images || [],
        wpPostId: saveData.postId,
        wpPostUrl:
          saveData.editUrl ||
          `${wpSettings.siteUrl}/wp-admin/post.php?post=${saveData.postId}&action=edit`,
      });

      setStep("completed");
      // 저장 완료 후 자동으로 콘텐츠 및 이미지 미리보기 표시
      setShowImagePreview(true);
    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "콘텐츠 생성 중 오류가 발생했습니다.";
      alert(errorMessage);

      // 모든 단계를 pending으로 리셋
      setGenerationSteps([
        { id: "search", label: "웹 정보 수집 중...", status: "pending" },
        { id: "generate", label: "콘텐츠 생성 중...", status: "pending" },
        { id: "seo", label: "SEO 최적화 중...", status: "pending" },
        { id: "save", label: "워드프레스 저장 중...", status: "pending" },
      ]);

      setStep("confirm");
    }
  };

  const handleReject = () => {
    setStep("input");
    setModelInfo(null);
  };

  const handleRetry = () => {
    setModelInfo(null);
    handleSearch();
  };

  const handleNewGeneration = () => {
    setStep("input");
    setModelName("");
    setModelAlias("");
    setModelInfo(null);
    setGenerationResult(null);
    setGenerationSteps([
      { id: "search", label: "웹 정보 수집 중...", status: "pending" },
      { id: "generate", label: "콘텐츠 생성 중...", status: "pending" },
      { id: "seo", label: "SEO 최적화 중...", status: "pending" },
      { id: "save", label: "워드프레스 저장 중...", status: "pending" },
    ]);
    router.push("/workspace");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Watch className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">
                WatchBlogger
              </span>
            </Link>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              /
            </span>
            <span className="hidden text-sm font-medium text-foreground sm:inline">
              워크스페이스
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
            <WordPressSettingsModal
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              }
              onSave={(settings) => setWpSettings(settings)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로 돌아가기
        </Link>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            {["입력", "확인", "생성", "완료"].map((label, index) => {
              const stepMap: WorkspaceStep[] = [
                "input",
                "confirm",
                "generating",
                "completed",
              ];
              const isActive = stepMap.indexOf(step) >= index;
              const isCurrent = stepMap[index] === step;

              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    } ${
                      isCurrent
                        ? "ring-2 ring-accent ring-offset-2 ring-offset-background"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-sm ${
                      isActive
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                  {index < 3 && <div className="h-px w-8 bg-border sm:w-12" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Panel: Input */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                시계 정보 입력
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                포스팅할 시계의 모델명을 입력하세요.
              </p>

              <div className="mt-6 space-y-4">
                {/* Model Name */}
                <div className="space-y-2">
                  <Label htmlFor="modelName">모델명 *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="modelName"
                      placeholder="예: Rolex Submariner 126610LN"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      disabled={step !== "input"}
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={
                        !modelName.trim() || step !== "input" || isSearching
                      }
                      className="bg-primary text-primary-foreground"
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "검색"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Model Alias */}
                <div className="space-y-2">
                  <Label htmlFor="modelAlias">별명 / 한글명 (선택)</Label>
                  <Input
                    id="modelAlias"
                    placeholder="예: 서브마리너 블랙"
                    value={modelAlias}
                    onChange={(e) => setModelAlias(e.target.value)}
                    disabled={step !== "input" && step !== "confirm"}
                  />
                </div>

                {/* Include Images */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="includeImages"
                    checked={includeImages}
                    onCheckedChange={(checked) =>
                      setIncludeImages(checked as boolean)
                    }
                    disabled={step !== "input" && step !== "confirm"}
                  />
                  <Label
                    htmlFor="includeImages"
                    className="text-sm font-normal"
                  >
                    이미지 수집 포함
                  </Label>
                </div>
              </div>
            </div>

            {/* Template Selector */}
            {(step === "confirm" || step === "input") && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  템플릿 선택
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  콘텐츠 유형에 맞는 템플릿을 선택하세요.
                </p>
                <div className="mt-4">
                  <TemplateSelector
                    value={selectedTemplate}
                    onChange={setSelectedTemplate}
                  />
                </div>
              </div>
            )}

            {/* Generation Progress */}
            {step === "generating" && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  생성 진행 상황
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  콘텐츠를 생성하고 있습니다. 잠시만 기다려주세요.
                </p>
                <div className="mt-6">
                  <GenerationProgress steps={generationSteps} currentStep="" />
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Confirm / Result */}
          <div>
            {step === "input" && (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <Watch className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">
                    모델명을 입력하고 검색을 시작하세요.
                  </p>
                </div>
              </div>
            )}

            {step === "confirm" && (
              <ModelConfirmCard
                modelInfo={modelInfo}
                isLoading={isSearching}
                onConfirm={handleConfirm}
                onReject={handleReject}
                onRetry={handleRetry}
              />
            )}

            {step === "generating" && (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-accent" />
                  <p className="mt-4 font-medium text-foreground">
                    콘텐츠 생성 중...
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    약 30초 정도 소요됩니다.
                  </p>
                </div>
              </div>
            )}

            {step === "completed" && generationResult && wpSettings && (
              <>
                <CompletionCard
                  wpPostUrl={generationResult.wpPostUrl}
                  wpAdminUrl={`${wpSettings.siteUrl}/wp-admin`}
                  imageCount={generationResult.images.length}
                  onViewImages={() => setShowImagePreview(true)}
                  onNewGeneration={handleNewGeneration}
                />
                {showImagePreview && (
                  <div className="mt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        생성된 콘텐츠 및 이미지
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowImagePreview(false)}
                      >
                        닫기
                      </Button>
                    </div>
                    <ContentPreview
                      title={generationResult.title}
                      content={generationResult.content}
                      metaDescription={generationResult.metaDescription}
                      tags={generationResult.tags}
                      wordCount={generationResult.wordCount}
                      seoScore={generationResult.seoScore}
                      images={generationResult.images}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}

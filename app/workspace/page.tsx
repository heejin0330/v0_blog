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
import { Watch, ArrowLeft, Settings, HelpCircle, Loader2, Check, ExternalLink } from "lucide-react"; // 아이콘 추가

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

// [NEW] 검색 결과 타입 정의
interface SearchResultItem {
  title: string;
  url: string;
  content: string;
  selected: boolean;
}

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialModel = searchParams.get("model") || "";

  const [step, setStep] = useState<WorkspaceStep>("input");
  
  // 입력 상태 관리
  const [modelName, setModelName] = useState(initialModel);
  const [modelAlias, setModelAlias] = useState("");
  const [includeImages, setIncludeImages] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("detailed_review");
  
  // 어조(Tone)와 깊이(Depth)
  const [tone, setTone] = useState("informative");
  const [depth, setDepth] = useState("deep");

  const [isSearching, setIsSearching] = useState(false);
  const [modelInfo, setModelInfo] = useState<WatchModelInfo | null>(null);
  
  // [NEW] 검색 결과 상태 관리
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  
  const [generationSteps, setGenerationSteps] = useState([
    { id: "search", label: "웹 정보 수집 중...", status: "pending" as const },
    { id: "generate", label: "콘텐츠 생성 중...", status: "pending" as const },
    { id: "seo", label: "SEO 최적화 중...", status: "pending" as const },
    { id: "save", label: "워드프레스 저장 중...", status: "pending" as const },
  ]);
  
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
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
        const response = await fetch("/api/wordpress/get-settings");
        if (response.ok) {
          const data = await response.json();
          if (data.hasEnvSettings) {
            setWpSettings({
              siteUrl: data.siteUrl || "",
            });
            return;
          }
        }
        const saved = localStorage.getItem("wp_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          setWpSettings(parsed);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        const saved = localStorage.getItem("wp_settings");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setWpSettings(parsed);
          } catch {}
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

  // [UPDATE] 검색 핸들러 수정: 모델 정보 + 웹 검색 결과 동시 호출
  const handleSearch = async () => {
    if (!modelName.trim()) return;

    setIsSearching(true);
    setStep("confirm");
    setSearchResults([]); // 검색 결과 초기화

    try {
      // 1. 모델 기본 정보 검색 (DB 또는 Tavily 간단 검색)
      const infoPromise = fetch("/api/watch/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelName }),
      }).then(res => res.json());

      // 2. [NEW] 웹 검색 결과 가져오기 (검수용)
      // /api/search/raw API가 구현되어 있어야 합니다.
      const searchPromise = fetch("/api/search/raw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `${modelName} watch review specs` }),
      }).then(res => res.json()).catch(() => ({ results: [] })); // 실패해도 진행

      // 병렬 처리
      const [infoData, searchData] = await Promise.all([infoPromise, searchPromise]);

      // 모델 정보 설정
      if (infoData) {
        setModelInfo(infoData);
      } else {
        // Fallback Mock Data
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

      // [NEW] 검색 결과 설정
      if (searchData && searchData.results) {
        setSearchResults(
          searchData.results.map((item: any) => ({
            title: item.title,
            url: item.url,
            content: item.content,
            selected: true, // 기본값: 모두 선택
          }))
        );
      }

    } catch (error) {
      console.error("Search error:", error);
      // Fallback
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

  // [NEW] 검색 결과 토글 함수
  const toggleSearchResult = (index: number) => {
    setSearchResults(prev => 
      prev.map((item, i) => i === index ? { ...item, selected: !item.selected } : item)
    );
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

    const updateStep = (stepId: string, status: "active" | "completed") => {
      setGenerationSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, status } : s))
      );
    };

    // [NEW] 선택된 검색 결과만 필터링하여 텍스트로 변환
    const curatedContext = searchResults
      .filter(item => item.selected)
      .map(item => `[Title: ${item.title}] ${item.content}`)
      .join("\n\n");

    try {
      // Step 1: Search
      updateStep("search", "active");
      await new Promise((r) => setTimeout(r, 1000));
      updateStep("search", "completed");

      // Step 2: Generate
      updateStep("generate", "active");

      // [UPDATE] customSearchContext 포함하여 전송
      const generateResponse = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelName,
          modelAlias,
          templateType: selectedTemplate,
          includeImages,
          modelInfo,
          tone, 
          depth,
          customSearchContext: curatedContext // 👈 정제된 데이터 전송
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
      setShowImagePreview(true);
    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "콘텐츠 생성 중 오류가 발생했습니다.";
      alert(errorMessage);

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
    setSearchResults([]);
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
    setSearchResults([]);
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
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <WordPressSettingsModal
              trigger={
                <Button variant="ghost" size="icon" className="text-muted-foreground">
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
                      disabled={!modelName.trim() || step !== "input" || isSearching}
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
                  <Label htmlFor="includeImages" className="text-sm font-normal">
                    이미지 수집 포함
                  </Label>
                </div>
              </div>
            </div>

            {/* Writing Style Setting Section */}
            {(step === "confirm" || step === "input") && (
              <div className="rounded-xl border border-border bg-card p-6">
                 <h2 className="font-serif text-xl font-semibold text-foreground">
                  글 작성 스타일 설정
                </h2>
                <p className="mt-1 text-sm text-muted-foreground mb-4">
                  AI가 작성할 글의 분위기와 분량을 설정합니다.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 어조 선택 */}
                  <div className="space-y-2">
                    <Label htmlFor="toneSelect">글의 분위기 (Tone)</Label>
                    <select
                      id="toneSelect"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      disabled={step !== "input" && step !== "confirm"}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="informative">📰 전문적인 정보 (기자)</option>
                      <option value="storytelling">☕ 경험담/스토리 (블로거)</option>
                      <option value="critical">⚖️ 장단점 분석 (평론가)</option>
                      <option value="friendly">😊 친근한 설명 (이웃)</option>
                    </select>
                  </div>

                  {/* 깊이 선택 */}
                  <div className="space-y-2">
                    <Label htmlFor="depthSelect">글 분량 (Depth)</Label>
                    <select
                      id="depthSelect"
                      value={depth}
                      onChange={(e) => setDepth(e.target.value)}
                      disabled={step !== "input" && step !== "confirm"}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="deep">📚 심층 분석 (1500자+)</option>
                      <option value="basic">⚡ 기본 작성 (800자)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

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
              <div className="space-y-6">
                {/* 모델 정보 확인 카드 */}
                <ModelConfirmCard
                  modelInfo={modelInfo}
                  isLoading={isSearching}
                  onConfirm={handleConfirm}
                  onReject={handleReject}
                  onRetry={handleRetry}
                  // ModelConfirmCard에 자체적인 버튼이 있다면 아래 검색 결과 UI와 함께 보일 때 레이아웃 고려 필요
                  // 여기서는 ModelConfirmCard가 단순히 정보를 보여주는 용도라고 가정하거나
                  // onConfirm이 눌리면 handleConfirm이 실행되도록 연결됨
                />

                {/* [NEW] 검색 결과 검수 UI */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span>🔎 검색 정보 필터링</span>
                    </h3>
                    <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
                      부정확한 정보는 체크 해제하세요
                    </span>
                  </div>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {searchResults.length > 0 ? (
                      searchResults.map((result, index) => (
                        <div 
                          key={index} 
                          className={`flex gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                            result.selected 
                            ? "border-primary/50 bg-primary/5" 
                            : "border-border bg-muted/30 opacity-60"
                          }`}
                          onClick={() => toggleSearchResult(index)}
                        >
                          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                            result.selected 
                              ? "bg-primary border-primary text-primary-foreground" 
                              : "border-muted-foreground/30 bg-background"
                          }`}>
                            {result.selected && <Check className="h-3 w-3" />}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm truncate">{result.title}</h4>
                              {result.url && (
                                <a 
                                  href={result.url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {result.content}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-sm text-muted-foreground">
                        <p>검색 결과가 없습니다.</p>
                        <p className="mt-1 text-xs">AI가 보유한 일반 지식으로 작성합니다.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
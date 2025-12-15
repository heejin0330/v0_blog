"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Download } from "lucide-react";

interface ContentPreviewProps {
  title: string;
  content: string;
  metaDescription: string;
  tags: string[];
  wordCount: number;
  seoScore: number;
  images: { url: string; alt: string }[];
}

export function ContentPreview({
  title,
  content,
  metaDescription,
  tags,
  wordCount,
  seoScore,
  images,
}: ContentPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [downloading, setDownloading] = useState<number | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (
    imageUrl: string,
    alt: string,
    index: number
  ) => {
    try {
      setDownloading(index);

      // 상대 경로인 경우 직접 다운로드
      if (imageUrl.startsWith("/") || imageUrl.startsWith("./")) {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `${alt || "image"}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // 외부 URL인 경우 프록시를 통해 다운로드
      const proxyUrl = `/api/image/download?url=${encodeURIComponent(
        imageUrl
      )}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error("이미지 다운로드에 실패했습니다.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // 파일명 생성 (alt 텍스트 또는 URL에서 추출)
      const fileName = alt
        ? `${alt.replace(/[^a-z0-9가-힣]/gi, "_")}.${
            blob.type.split("/")[1] || "jpg"
          }`
        : `image_${Date.now()}.${blob.type.split("/")[1] || "jpg"}`;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("다운로드 오류:", error);
      alert("이미지 다운로드에 실패했습니다. 새 창에서 열어서 저장해주세요.");
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadAll = async () => {
    for (let i = 0; i < images.length; i++) {
      await handleDownload(images[i].url, images[i].alt, i);
      // 각 이미지 다운로드 사이에 약간의 지연
      if (i < images.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">글자 수:</span>
          <span className="font-medium text-foreground">
            {wordCount.toLocaleString()}자
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">SEO 점수:</span>
          <span
            className={cn(
              "font-medium",
              seoScore >= 80
                ? "text-green-600"
                : seoScore >= 60
                ? "text-yellow-600"
                : "text-red-600"
            )}
          >
            {seoScore}점
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="preview" className="flex-1">
            미리보기
          </TabsTrigger>
          <TabsTrigger value="html" className="flex-1">
            HTML
          </TabsTrigger>
          <TabsTrigger value="images" className="flex-1">
            이미지 ({images.length})
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex-1">
            SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-4">
          <div className="max-h-96 overflow-auto rounded-lg border border-border bg-card p-6">
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {title}
            </h1>
            <div
              className="prose prose-sm mt-4 max-w-none text-foreground prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </TabsContent>

        <TabsContent value="html" className="mt-4">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 top-2 bg-card"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied ? "복사됨" : "복사"}
            </Button>
            <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs text-muted-foreground">
              {content}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="images" className="mt-4">
          {images.length > 0 && (
            <div className="mb-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                disabled={downloading !== null}
              >
                <Download className="mr-2 h-4 w-4" />
                {downloading !== null
                  ? "다운로드 중..."
                  : `전체 다운로드 (${images.length}개)`}
              </Button>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
              >
                {/* 썸네일 이미지 */}
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      // 이미지 로드 실패 시 placeholder 표시
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
                {/* 이미지 정보 및 액션 */}
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground line-clamp-2">
                    {image.alt}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {image.url}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent text-xs"
                      onClick={() => handleDownload(image.url, image.alt, index)}
                      disabled={downloading === index}
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      {downloading === index ? "다운로드 중..." : "다운로드"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent text-xs"
                      onClick={() => {
                        window.open(image.url, "_blank");
                      }}
                    >
                      새 창
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <div className="space-y-4 rounded-lg border border-border bg-card p-4">
            <div>
              <h4 className="text-sm font-medium text-foreground">메타 제목</h4>
              <p className="mt-1 text-sm text-muted-foreground">{title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                ({title.length}/60자)
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">메타 설명</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {metaDescription}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                ({metaDescription.length}/155자)
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">태그</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Array.from(new Set(tags)).map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

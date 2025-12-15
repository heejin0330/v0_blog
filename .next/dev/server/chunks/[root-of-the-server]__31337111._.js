module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/content/generate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$google$2b$generative$2d$ai$40$0$2e$24$2e$1$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@google+generative-ai@0.24.1/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
;
;
// 1. Google Gemini 클라이언트 설정
// 여러 환경 변수 이름 지원: GEMINI_API_KEY, GOOGLE_GEMINI_API_KEY, GOOGLE_API_KEY
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
if (!apiKey) {
    console.error("Gemini API 키가 설정되지 않았습니다. 다음 환경 변수 중 하나를 설정해주세요:");
    console.error("- GEMINI_API_KEY");
    console.error("- GOOGLE_GEMINI_API_KEY");
    console.error("- GOOGLE_API_KEY");
}
const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$google$2b$generative$2d$ai$40$0$2e$24$2e$1$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](apiKey);
// [핵심 함수] JSON 데이터를 워드프레스 구텐베르크 블록 포맷으로 변환
function convertToWPBlocks(sections) {
    return sections.map((section)=>{
        switch(section.type){
            case "h1":
                return `\n<h1>${String(section.content)}</h1>\n`;
            case "h2":
                return `\n<h2>${String(section.content)}</h2>\n`;
            case "h3":
                return `\n<h3>${String(section.content)}</h3>\n`;
            case "p":
                return `\n<p>${String(section.content)}</p>\n`;
            case "ul":
                // 리스트 아이템 처리
                const listItems = Array.isArray(section.content) ? section.content.map((item)=>`<li>${item}</li>`).join("") : `<li>${String(section.content)}</li>`;
                return `\n<ul>${listItems}</ul>\n`;
            default:
                return `\n<p>${String(section.content)}</p>\n`;
        }
    }).join("\n\n"); // 블록 사이에 줄바꿈 추가
}
// SEO 점수 계산 함수 (Rank Math 기준)
function calculateSEOScore(title, metaDescription, content, images, keywords) {
    let score = 0;
    const maxScore = 100;
    // 주요 키워드 (첫 번째 키워드 사용)
    const primaryKeyword = keywords[0] || "";
    // 1. 제목 최적화 (20점)
    const titleLength = title.length;
    if (titleLength >= 30 && titleLength <= 60) {
        score += 10; // 길이 적절 (30-60자)
    } else if (titleLength > 60 && titleLength <= 70) {
        score += 7; // 약간 김 (60-70자)
    } else if (titleLength > 20 && titleLength < 30) {
        score += 7; // 약간 짧음
    } else {
        score += 3; // 너무 짧거나 김
    }
    // 키워드가 제목에 포함되어 있는지
    if (primaryKeyword && title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
        score += 10; // 키워드 포함
    } else {
        // 키워드의 일부라도 포함되어 있는지 확인
        const keywordWords = primaryKeyword.split(" ").filter((w)=>w.length > 2);
        const hasPartialKeyword = keywordWords.some((word)=>title.toLowerCase().includes(word.toLowerCase()));
        if (hasPartialKeyword) {
            score += 5;
        }
    }
    // 2. 메타 설명 최적화 (15점)
    const metaLength = metaDescription.length;
    if (metaLength >= 120 && metaLength <= 155) {
        score += 10; // 길이 적절 (120-155자)
    } else if (metaLength >= 100 && metaLength < 120) {
        score += 7; // 약간 짧음
    } else if (metaLength > 155 && metaLength <= 160) {
        score += 7; // 약간 김
    } else {
        score += 3; // 너무 짧거나 김
    }
    // 키워드가 메타 설명에 포함되어 있는지
    if (primaryKeyword && metaDescription.toLowerCase().includes(primaryKeyword.toLowerCase())) {
        score += 5; // 키워드 포함
    }
    // 3. 콘텐츠 길이 (15점)
    const contentText = content.replace(/<[^>]*>/g, "");
    const contentLength = contentText.length;
    if (contentLength >= 1000) {
        score += 15; // 충분한 길이 (1000자 이상)
    } else if (contentLength >= 500) {
        score += 10; // 적절한 길이 (500-999자)
    } else if (contentLength >= 300) {
        score += 5; // 최소 길이 (300-499자)
    } else {
        score += 2; // 너무 짧음
    }
    // 4. H1 태그 최적화 (10점)
    const h1Matches = content.match(/<h1[^>]*>(.*?)<\/h1>/gi) || [];
    const h1Count = h1Matches.length;
    if (h1Count === 1) {
        score += 10; // H1이 정확히 1개
    } else if (h1Count === 0) {
        // H1이 없으면 H2의 첫 번째를 확인
        const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
        if (h2Matches.length > 0) {
            score += 5; // H2는 있지만 H1이 없음
        }
    } else {
        score += 3; // H1이 여러 개 (감점)
    }
    // 5. H2 태그 구조 (10점)
    const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
    const h2Count = h2Matches.length;
    if (h2Count >= 3) {
        score += 10; // H2가 3개 이상 (좋은 구조)
    } else if (h2Count >= 1) {
        score += 5; // H2가 1-2개
    }
    // 6. 이미지 Alt 텍스트 최적화 (10점)
    if (images.length > 0) {
        const imagesWithAlt = images.filter((img)=>img.alt && String(img.alt).trim().length > 0).length;
        const altScore = imagesWithAlt / images.length * 10;
        score += Math.round(altScore);
    }
    // 7. 키워드 밀도 (10점)
    const contentTextLower = contentText.toLowerCase();
    const wordCount = contentTextLower.split(/\s+/).filter((w)=>w.length > 0).length;
    if (primaryKeyword && wordCount > 0) {
        const keywordWords = primaryKeyword.toLowerCase().split(" ").filter((w)=>w.length > 2);
        let totalKeywordCount = 0;
        keywordWords.forEach((word)=>{
            const regex = new RegExp(`\\b${word}\\b`, "gi");
            const matches = contentTextLower.match(regex);
            totalKeywordCount += matches ? matches.length : 0;
        });
        const keywordDensity = wordCount > 0 ? totalKeywordCount / wordCount * 100 : 0;
        if (keywordDensity >= 0.5 && keywordDensity <= 2.5) {
            score += 10; // 적절한 밀도 (0.5-2.5%)
        } else if (keywordDensity > 0 && keywordDensity < 0.5) {
            score += 5; // 너무 낮음
        } else if (keywordDensity > 2.5 && keywordDensity <= 4) {
            score += 7; // 약간 높음
        } else {
            score += 3; // 너무 높거나 낮음
        }
    } else {
        score += 5; // 키워드가 없으면 기본 점수
    }
    // 8. 첫 문단에 키워드 포함 (10점)
    const firstParagraph = contentText.substring(0, 200).toLowerCase();
    if (primaryKeyword) {
        const keywordWords = primaryKeyword.toLowerCase().split(" ").filter((w)=>w.length > 2);
        const hasKeywordInFirst = keywordWords.some((word)=>firstParagraph.includes(word));
        if (hasKeywordInFirst) {
            score += 10; // 첫 문단에 키워드 포함
        } else {
            score += 3; // 포함되지 않음
        }
    } else {
        score += 5; // 키워드가 없으면 기본 점수
    }
    return Math.min(Math.round(score), maxScore);
}
async function POST(req) {
    try {
        // API 키 확인
        if (!apiKey) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Gemini API 키가 설정되지 않았습니다. .env.local 파일에 GEMINI_API_KEY, GOOGLE_GEMINI_API_KEY, 또는 GOOGLE_API_KEY 중 하나를 설정해주세요."
            }, {
                status: 500
            });
        }
        // 프론트엔드에서 보내는 모든 파라미터 받기
        const { modelName, modelAlias, templateType, includeImages, modelInfo } = await req.json();
        if (!modelName) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "모델명이 입력되지 않았습니다."
            }, {
                status: 400
            });
        }
        // WordPress 환경 변수 확인은 프론트엔드에서 저장할 때 필요하므로 여기서는 선택적
        // 콘텐츠 생성만 하므로 WordPress 설정이 없어도 진행 가능
        // ---------------------------------------------------------
        // STEP 1: 검색 (Tavily)
        // ---------------------------------------------------------
        console.log(`[1/3] Searching for: ${modelName}...`);
        const tavilyApiKey = process.env.TAVILY_API_KEY;
        if (!tavilyApiKey) {
            console.warn("Tavily API 키가 설정되지 않았습니다. 검색 없이 진행합니다.");
        }
        let searchContext = "";
        if (tavilyApiKey) {
            try {
                const searchResponse = await fetch("https://api.tavily.com/search", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        api_key: tavilyApiKey,
                        query: `${modelName} vintage watch history specs price user review`,
                        search_depth: "basic",
                        include_answer: true,
                        max_results: 5
                    })
                });
                if (!searchResponse.ok) {
                    const errorText = await searchResponse.text();
                    console.error("Tavily API 오류:", errorText);
                    throw new Error(`Tavily 검색 실패: ${errorText}`);
                }
                const searchData = await searchResponse.json();
                if (searchData.results && searchData.results.length > 0) {
                    searchContext = searchData.results.map((result)=>`[제목: ${result.title}] ${result.content}`).join("\n\n");
                } else {
                    console.warn("Tavily 검색 결과가 없습니다.");
                }
            } catch (error) {
                console.error("Tavily 검색 오류:", error);
            // 검색 실패해도 계속 진행
            }
        }
        // ---------------------------------------------------------
        // STEP 2: Gemini 글 작성 (구조화된 JSON 요청)
        // ---------------------------------------------------------
        console.log(`[2/3] Generating structured content with Gemini...`);
        // 모델 정보 활용
        const displayName = modelAlias || modelName;
        const brand = modelInfo?.brand || "";
        const modelNameFull = modelInfo?.modelName || modelName;
        const prompt = `
      모델명: ${displayName}
      ${brand ? `브랜드: ${brand}` : ""}
      ${searchContext ? `[검색된 정보]: ${searchContext}` : ""}
      위 정보를 바탕으로 독자가 읽기 편하게 섹션을 나누어 작성해주세요.
      ${templateType === "detailed_review" ? "상세 리뷰 형식으로 작성해주세요." : ""}
      ${templateType === "comparison" ? "비교 분석 형식으로 작성해주세요." : ""}
      ${templateType === "history" ? "역사 및 배경 형식으로 작성해주세요." : ""}
    `;
        // 시스템 프롬프트
        const systemInstruction = `
      당신은 40대 남성 빈티지 시계 전문 블로거입니다.
      검색된 정보를 바탕으로 블로그 글을 작성합니다.
      
      [필수 지침]
      1. 어조: "~했습니다", "~하죠", "~느껴집니다" (경험담 스타일)
      2. 구조: 제목 -> 서론 -> 스펙(리스트) -> 특징/역사 -> 착용감(중요) -> 결론
      3. SEO: 소제목(h2)을 적절히 배치하여 계층 구조를 잡을 것.
      
      [출력 데이터 구조 (중요)]
      반드시 아래 JSON 스키마를 따르세요. 'sections' 배열에 문단별로 내용을 나누어 담으세요.
      type은 "h1", "h2", "h3", "p", "ul" 중 하나여야 합니다. "ul"일 경우 content는 문자열 배열이어야 합니다.
      첫 번째 섹션은 반드시 "h1" 타입으로 제목을 포함해야 합니다. (SEO 최적화를 위해)

      {
        "title": "블로그 제목",
        "sections": [
          { "type": "h1", "content": "블로그 제목" },
          { "type": "p", "content": "서론 내용..." },
          { "type": "h2", "content": "소제목 (예: 역사와 유래)" },
          { "type": "p", "content": "본문 내용..." },
          { "type": "ul", "content": ["스펙1", "스펙2", "스펙3"] },
          { "type": "h2", "content": "실착 후기" },
          { "type": "p", "content": "착용감 내용..." }
        ]
      }
    `;
        // 모델 선택: 실제 사용 가능한 모델을 동적으로 확인
        let modelOptions = [];
        try {
            // ListModels API를 통해 사용 가능한 모델 확인
            const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            if (modelsResponse.ok) {
                const modelsData = await modelsResponse.json();
                const availableModels = (modelsData.models || []).filter((m)=>m.name && m.supportedGenerationMethods?.includes("generateContent") && m.name.includes("gemini") && !m.name.includes("exp") && // 실험적 모델 제외
                    !m.name.includes("preview") && // 프리뷰 모델 제외
                    !m.name.includes("image") && // 이미지 전용 모델 제외
                    !m.name.includes("tts") && // TTS 전용 모델 제외
                    !m.name.includes("robotics") && // 로봇 전용 모델 제외
                    !m.name.includes("computer-use") // 컴퓨터 사용 전용 모델 제외
                ).map((m)=>m.name.replace("models/", "")) // "models/" 접두사 제거
                .sort((a, b)=>{
                    // 우선순위: 2.5 > 2.0 > latest, flash > pro
                    const getPriority = (name)=>{
                        if (name.includes("2.5")) return 1;
                        if (name.includes("2.0")) return 2;
                        if (name.includes("latest")) return 3;
                        return 4;
                    };
                    return getPriority(a) - getPriority(b);
                });
                if (availableModels.length > 0) {
                    modelOptions = availableModels;
                    console.log("✅ 사용 가능한 모델 발견:", modelOptions);
                } else {
                    throw new Error("사용 가능한 Gemini 모델을 찾을 수 없습니다.");
                }
            } else {
                throw new Error(`모델 목록 조회 실패: ${modelsResponse.status}`);
            }
        } catch (error) {
            console.warn("⚠️ 모델 목록 확인 실패, 기본 모델 사용:", error.message);
            // 폴백: 실제 확인된 모델 목록 사용
            modelOptions = [
                "gemini-2.5-flash",
                "gemini-2.5-pro",
                "gemini-2.0-flash",
                "gemini-2.0-flash-001",
                "gemini-flash-latest",
                "gemini-pro-latest"
            ];
        }
        let aiOutput;
        let lastError = null;
        // 모델을 순차적으로 시도하여 실제로 사용 가능한 모델 찾기
        for (const modelNameOption of modelOptions){
            try {
                console.log(`모델 시도: ${modelNameOption}`);
                const model = genAI.getGenerativeModel({
                    model: modelNameOption,
                    generationConfig: {
                        responseMimeType: "application/json"
                    },
                    systemInstruction: systemInstruction
                });
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();
                // JSON 파싱 시도
                try {
                    aiOutput = JSON.parse(responseText);
                } catch (parseError) {
                    console.error("JSON 파싱 오류:", parseError);
                    console.error("응답 텍스트:", responseText);
                    throw new Error("AI 응답을 JSON으로 파싱할 수 없습니다. 응답 형식을 확인해주세요.");
                }
                // 응답 구조 검증
                if (!aiOutput || typeof aiOutput !== "object") {
                    throw new Error("AI 응답이 올바른 형식이 아닙니다.");
                }
                if (!aiOutput.title || typeof aiOutput.title !== "string") {
                    throw new Error("AI 응답에 제목(title)이 없거나 올바르지 않습니다.");
                }
                if (!aiOutput.sections || !Array.isArray(aiOutput.sections) || aiOutput.sections.length === 0) {
                    throw new Error("AI 응답에 섹션(sections)이 없거나 올바르지 않습니다.");
                }
                console.log(`✅ 모델 ${modelNameOption} 성공!`);
                break; // 성공하면 루프 종료
            } catch (error) {
                console.warn(`❌ 모델 ${modelNameOption} 실패:`, error.message);
                lastError = error;
                // 429 오류 (할당량 초과) - 명확한 메시지와 함께 즉시 중단
                if (error.message?.includes("429") || error.message?.includes("quota") || error.message?.includes("Too Many Requests")) {
                    throw new Error(`API 할당량을 초과했습니다. 무료 티어의 일일/분당 요청 한도에 도달했습니다. 잠시 후 다시 시도해주세요. (모델: ${modelNameOption})`);
                }
                // 401/403 오류 (인증 문제) - 즉시 중단
                if (error.message?.includes("401") || error.message?.includes("403") || error.message?.includes("API key") || error.message?.includes("authentication")) {
                    throw new Error(`API 키 인증에 실패했습니다. .env.local 파일의 GEMINI_API_KEY를 확인해주세요. (모델: ${modelNameOption})`);
                }
                // 404 오류가 아니면 즉시 중단 (다른 종류의 오류)
                if (!error.message?.includes("404") && !error.message?.includes("not found") && !error.message?.includes("is not found for API version")) {
                    throw error;
                }
                continue; // 404 오류만 다음 모델 시도
            }
        }
        // 모든 모델 실패 시
        if (!aiOutput) {
            const errorMessage = lastError?.message || "알 수 없는 오류";
            throw new Error(`사용 가능한 Gemini 모델을 찾을 수 없습니다. 시도한 모델: ${modelOptions.join(", ")}. 마지막 오류: ${errorMessage}\n\n해결 방법:\n1. Google AI Studio (https://aistudio.google.com)에서 API 키가 유효한지 확인하세요.\n2. API 키에 충분한 할당량이 있는지 확인하세요.\n3. .env.local 파일의 GEMINI_API_KEY가 올바르게 설정되어 있는지 확인하세요.`);
        }
        // ---------------------------------------------------------
        // STEP 3: 워드프레스 블록 포맷으로 변환
        // ---------------------------------------------------------
        console.log(`[3/3] Converting to WordPress format...`);
        // 여기서 JSON -> 워드프레스 HTML 주석 포맷으로 변환
        const blockContent = convertToWPBlocks(aiOutput.sections);
        // WordPress에 저장 (프론트엔드가 별도로 저장하므로 여기서는 저장하지 않음)
        // 대신 생성된 콘텐츠 데이터를 반환
        // 공백 제외 글자 수 계산
        const contentText = blockContent.replace(/<[^>]*>/g, "");
        const wordCount = contentText.replace(/\s/g, "").length;
        // 이미지 배열 생성 (includeImages가 true일 때만)
        const imageTypes = [
            "front",
            "side",
            "back"
        ];
        const images = includeImages ? imageTypes.map((type)=>({
                url: `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(`${displayName} watch ${type}`)}`,
                alt: `${displayName} ${type === "front" ? "전면" : type === "side" ? "측면" : "후면"}`
            })) : [];
        // 메타 설명 생성
        const metaDescription = `${displayName}의 완벽 리뷰. 디자인, 스펙, 무브먼트, 착용감까지 상세 분석. 구매 전 꼭 확인하세요.`;
        // 태그 생성
        const tags = [
            brand || "시계",
            modelNameFull,
            "시계 리뷰",
            "럭셔리 워치",
            "명품 시계"
        ].filter(Boolean);
        // SEO 점수 계산 (실제 SEO 요소 기반)
        const keywords = [
            String(displayName),
            `${String(brand)} ${String(modelNameFull)}`,
            String(modelNameFull)
        ];
        const seoScore = calculateSEOScore(aiOutput.title, metaDescription, blockContent, images, keywords);
        // 프론트엔드가 기대하는 형식으로 반환
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                title: aiOutput.title,
                content: blockContent,
                metaDescription,
                tags,
                wordCount,
                seoScore,
                images
            }
        });
    } catch (error) {
        console.error("Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__31337111._.js.map
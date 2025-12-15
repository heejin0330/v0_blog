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
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
if (!apiKey) {
    console.error("Gemini API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.");
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
            case "blockquote":
                return `\n<blockquote class="wp-block-quote"><p>${String(section.content)}</p></blockquote>\n`;
            // ▼▼▼ [수정 1] 리스트 점(Bullet) 오류 해결 로직 ▼▼▼
            case "ul":
                let items = [];
                if (Array.isArray(section.content)) {
                    items = section.content;
                } else {
                    // 문자열로 온 경우 줄바꿈으로 분리
                    items = String(section.content).split("\n");
                }
                const listItems = items.map((item)=>String(item).trim()) // 1. 앞뒤 공백 제거
                .filter((item)=>item.length > 0) // 2. 빈 줄(내용 없는 점) 제거
                .map((item)=>{
                    // 3. AI가 텍스트 앞에 붙인 기호(-, *, •) 제거 (이중 점 방지)
                    const cleanItem = item.replace(/^[-•*]\s*/, "");
                    return `<li>${cleanItem}</li>`;
                }).join("");
                return `\n<ul>${listItems}</ul>\n`;
            // ▲▲▲ [수정 끝] ▲▲▲
            default:
                return `\n<p>${String(section.content)}</p>\n`;
        }
    }).join("\n\n");
}
// SEO 점수 계산 함수
function calculateSEOScore(title, metaDescription, content, images, keywords) {
    let score = 0;
    const maxScore = 100;
    // keywords[0]은 가장 중요한 '공식 모델명'
    const primaryKeyword = keywords[0] || "";
    // 1. 제목 길이 (30-60자)
    if (title.length >= 30 && title.length <= 60) score += 10;
    else if (title.length > 20 && title.length < 70) score += 7;
    else score += 3;
    // 2. 제목 키워드 포함
    if (primaryKeyword && title.toLowerCase().includes(primaryKeyword.toLowerCase())) score += 10;
    // 3. 메타 설명 길이 (120-160자)
    if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 15;
    else if (metaDescription.length > 50) score += 7;
    // 4. 콘텐츠 길이 (애드센스 타겟: 1500자 이상 권장)
    const contentText = content.replace(/<[^>]*>/g, "");
    if (contentText.length >= 1500) score += 20;
    else if (contentText.length >= 1000) score += 15;
    else if (contentText.length >= 500) score += 10;
    else score += 2;
    // 5. 헤딩 태그 구조
    const h2Count = (content.match(/<h2/g) || []).length;
    if (h2Count >= 3) score += 10;
    // 6. 이미지 유무
    if (images.length > 0) score += 10;
    // 7. 키워드 밀도 (본문에 키워드가 있는지)
    if (primaryKeyword && contentText.toLowerCase().includes(primaryKeyword.toLowerCase())) score += 10;
    return Math.min(Math.round(score), maxScore);
}
async function POST(req) {
    try {
        if (!apiKey) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "API Key Missing"
            }, {
                status: 500
            });
        }
        const { modelName, modelAlias, templateType, includeImages, modelInfo, tone = "informative", depth = "deep" } = await req.json();
        if (!modelName) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "모델명이 없습니다."
            }, {
                status: 400
            });
        }
        // ---------------------------------------------------------
        // [수정 2] 이름 변수 분리 (닉네임 오버라이딩 방지)
        // ---------------------------------------------------------
        const officialName = modelName; // 예: Rolex Submariner 126610LV
        const nickname = modelAlias; // 예: 스타벅스
        const brand = modelInfo?.brand || "Brand";
        // ---------------------------------------------------------
        // STEP 1: 검색 (Tavily) - 공식 모델명 기준
        // ---------------------------------------------------------
        console.log(`[1/3] Searching for: ${officialName}...`);
        const tavilyApiKey = process.env.TAVILY_API_KEY;
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
                        // 검색은 정확도를 위해 '공식 명칭'으로 수행
                        query: `${brand} ${officialName} review history specs price pros cons`,
                        search_depth: "basic",
                        include_answer: true,
                        max_results: 5
                    })
                });
                if (searchResponse.ok) {
                    const searchData = await searchResponse.json();
                    if (searchData.results) {
                        searchContext = searchData.results.map((r)=>`[Source: ${r.title}] ${r.content}`).join("\n\n");
                    }
                }
            } catch (e) {
                console.warn("Search failed, proceeding without it.");
            }
        }
        // ---------------------------------------------------------
        // STEP 2: 프롬프트 엔지니어링 (Tone, Depth, SEO Name 반영)
        // ---------------------------------------------------------
        console.log(`[2/3] Generating content (Tone: ${tone}, Depth: ${depth})...`);
        // 어조 설정
        const toneInstructions = {
            informative: "객관적이고 전문적인 저널리스트 톤 ('~합니다/습니다' 체)",
            storytelling: "오래된 시계 수집가의 경험담 톤, 감성적 표현 포함 ('~해요/하죠' 체)",
            critical: "날카롭고 분석적인 평론가 톤, 장단점을 명확히 구분 ('~다' 체)",
            friendly: "친절한 이웃 형/오빠가 설명해주는 톤 ('~야/해' 반말 모드 혹은 친근한 존댓말)"
        };
        // 깊이 설정
        const depthInstruction = depth === "deep" ? `
        [분량 및 깊이 필수]
        - 반드시 전체 글자 수(공백 제외) 1,500자 이상 작성할 것.
        - 단순 스펙 나열을 넘어 '왜 이 스펙이 중요한지' 분석할 것.
        - 마지막에 '자주 묻는 질문(FAQ)' 섹션을 h2로 만들고 3가지 질문/답변을 포함할 것.
      ` : `[분량] 핵심 위주로 간결하게 800자 내외로 작성할 것.`;
        const systemInstruction = `
      당신은 대한민국 최고의 빈티지 시계 전문 에디터입니다.
      
      [작성 목표]
      - 주제: ${officialName} ${nickname ? `(별칭: ${nickname})` : ""}
      - 브랜드: ${brand}
      - 타겟 독자: 시계 구매를 고려하거나 정보를 찾는 3040 남성
      - 톤앤매너: ${toneInstructions[tone] || toneInstructions['informative']}
      
      [강력한 SEO 필수 지침 (중요)]
      1. **제목**: 반드시 '${officialName}'(공식 모델명)과 '${nickname}'(별칭)을 자연스럽게 섞어서 작성할 것. (예: 롤렉스 ${officialName} '${nickname}' 완벽 리뷰)
      2. **본문**: 
         - 글의 시작 부분(Intro)에 정확한 모델명(${officialName})을 명시할 것.
         - 본문 중간중간에 별칭(${nickname})을 자연스럽게 섞어 쓰되, 검색 엔진이 정확한 모델을 인식하도록 공식 명칭을 최소 3회 이상 언급할 것.
      
      ${depthInstruction}

      [필수 구조 (JSON 포맷)]
      반드시 아래 JSON 형식을 지키세요. 마크다운(\`\`\`) 없이 순수 JSON만 반환하세요.
      {
        "title": "SEO 최적화된 제목",
        "excerpt": "구글 검색 결과용 150자 요약",
        "tags": ["키워드1", "키워드2"],
        "sections": [
          { "type": "h1", "content": "제목" },
          { "type": "p", "content": "서론..." },
          { "type": "ul", "content": ["항목1", "항목2"] },
          ...
        ]
      }
    `;
        const userPrompt = `
      공식 모델명: ${officialName}
      별칭(닉네임): ${nickname || "없음"}
      브랜드: ${brand}
      참고 데이터(검색결과): ${searchContext}
      
      위 정보를 바탕으로 구글 애드센스 승인을 받을 수 있는 고품질의 긴 글을 작성해줘.
      '${officialName}'이 메인 키워드로 잡히도록 신경 써서 작성해.
    `;
        // Gemini 모델 호출
        let modelOptions = [
            "gemini-2.0-flash",
            "gemini-1.5-pro",
            "gemini-1.5-flash",
            "gemini-pro"
        ];
        let aiOutput = null;
        for (const modelNameOption of modelOptions){
            try {
                const model = genAI.getGenerativeModel({
                    model: modelNameOption,
                    generationConfig: {
                        responseMimeType: "application/json"
                    },
                    systemInstruction: systemInstruction
                });
                const result = await model.generateContent(userPrompt);
                aiOutput = JSON.parse(result.response.text());
                if (aiOutput?.sections) break;
            } catch (e) {
                console.warn(`Model ${modelNameOption} failed:`, e.message);
                if (e.message.includes("429")) continue;
                if (e.message.includes("404")) continue;
            }
        }
        if (!aiOutput) {
            throw new Error("모든 AI 모델 생성 실패. API 키나 할당량을 확인하세요.");
        }
        // ---------------------------------------------------------
        // STEP 3: 결과 변환 및 반환
        // ---------------------------------------------------------
        console.log(`[3/3] Converting results...`);
        const blockContent = convertToWPBlocks(aiOutput.sections);
        // 이미지 처리 (placeholder)
        const images = includeImages ? [
            "front",
            "side",
            "back"
        ].map((type)=>({
                url: `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(`${officialName} watch ${type}`)}`,
                alt: `${officialName} ${type}`
            })) : [];
        // [수정 3] SEO 키워드 로직 보강
        const seoKeywords = [
            officialName,
            `${brand} ${officialName}`,
            nickname,
            modelInfo?.modelName // 4순위: 기타
        ].filter((k)=>Boolean(k) && k !== "");
        // SEO 점수 계산
        const seoScore = calculateSEOScore(aiOutput.title, aiOutput.excerpt, blockContent, images, seoKeywords // 보강된 키워드 전달
        );
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                title: aiOutput.title,
                content: blockContent,
                metaDescription: aiOutput.excerpt,
                tags: aiOutput.tags,
                wordCount: blockContent.replace(/<[^>]*>/g, "").length,
                seoScore,
                images
            }
        });
    } catch (error) {
        console.error("API Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message || "Internal Server Error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__31337111._.js.map
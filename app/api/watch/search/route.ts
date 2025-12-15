import { type NextRequest, NextResponse } from "next/server";

// Tavily API 검색 결과 타입
interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface TavilySearchResponse {
  query: string;
  follow_up_questions?: string[];
  answer?: string;
  response_time: number;
  results: TavilySearchResult[];
}

// Tavily API로 웹 검색
async function searchWebWithTavily(query: string): Promise<{
  results: TavilySearchResult[];
  answer?: string;
}> {
  const tavilyApiKey = process.env.TAVILY_API_KEY;

  if (!tavilyApiKey) {
    console.warn("Tavily API 키가 설정되지 않았습니다.");
    return { results: [] };
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: tavilyApiKey,
        query: query,
        search_depth: "basic",
        include_answer: true,
        include_raw_content: false,
        max_results: 3,
      }),
    });

    if (!response.ok) {
      throw new Error("Tavily API 호출 실패");
    }

    const data: TavilySearchResponse = await response.json();
    return {
      results: data.results || [],
      answer: data.answer,
    };
  } catch (error) {
    console.error("Tavily 검색 오류:", error);
    return { results: [] };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { modelName } = await request.json();

    if (!modelName) {
      return NextResponse.json(
        { error: "모델명을 입력해주세요." },
        { status: 400 }
      );
    }

    // 기본 시계 정보 (기존 로직)
    const mockData = getWatchInfo(modelName);
    const watchInfo = mockData || {
      brand: extractBrand(modelName),
      modelName: modelName,
      referenceNumber: "Unknown",
      caliber: "자동",
      caseSize: "40mm",
      caseMaterial: "스테인리스 스틸",
      waterResistance: "100m",
      thumbnailUrl: `/placeholder.svg?height=128&width=128&query=${encodeURIComponent(
        modelName
      )} watch`,
    };

    // Tavily API로 웹 검색 결과 가져오기
    // "시계"를 기본 전제로 포함하여 검색 (닉네임 검색 지원)
    const searchQuery = watchInfo.brand && watchInfo.brand !== watchInfo.modelName
      ? `${watchInfo.brand} ${watchInfo.modelName} watch 시계 스펙 사양`
      : `${watchInfo.modelName} watch 시계 스펙 사양`;
    
    const searchData = await searchWebWithTavily(searchQuery);

    // 검색 결과에서 사양 정보 추출
    const extractedSpecs = extractSpecsFromSearchResults(
      searchData.results,
      searchData.answer,
      watchInfo.modelName
    );

    // 추출한 사양 정보로 기본 정보 업데이트 (기본값이거나 Unknown인 경우만)
    const updatedWatchInfo = {
      ...watchInfo,
      ...(extractedSpecs.caliber &&
      (!watchInfo.caliber || watchInfo.caliber === "자동")
        ? { caliber: extractedSpecs.caliber }
        : {}),
      ...(extractedSpecs.caseSize &&
      (!watchInfo.caseSize || watchInfo.caseSize === "40mm")
        ? { caseSize: extractedSpecs.caseSize }
        : {}),
      ...(extractedSpecs.caseMaterial &&
      (!watchInfo.caseMaterial || watchInfo.caseMaterial === "스테인리스 스틸")
        ? { caseMaterial: extractedSpecs.caseMaterial }
        : {}),
      ...(extractedSpecs.waterResistance &&
      (!watchInfo.waterResistance || watchInfo.waterResistance === "100m")
        ? { waterResistance: extractedSpecs.waterResistance }
        : {}),
      ...(extractedSpecs.referenceNumber &&
      watchInfo.referenceNumber === "Unknown"
        ? { referenceNumber: extractedSpecs.referenceNumber }
        : {}),
    };

    // 시계 정보와 검색 결과를 함께 반환
    return NextResponse.json({
      ...updatedWatchInfo,
      webSearchResults: searchData.results.map((r) => ({
        title: r.title,
        url: r.url,
        snippet: r.content.substring(0, 200) + "...",
      })),
      webSearchAnswer: searchData.answer,
    });
  } catch (error) {
    console.error("Watch search error:", error);
    return NextResponse.json(
      { error: "시계 정보 검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

function extractBrand(modelName: string): string {
  const brands = [
    "Rolex",
    "Omega",
    "Patek Philippe",
    "Audemars Piguet",
    "Tudor",
    "IWC",
    "Cartier",
    "Breitling",
    "Tag Heuer",
    "Seiko",
    "Grand Seiko",
    "Citizen",
    "Casio",
    "Tissot",
    "Longines",
    "Hamilton",
  ];
  const lowerModel = modelName.toLowerCase();

  // 모델명에 브랜드명이 포함되어 있는지 확인
  for (const brand of brands) {
    if (lowerModel.includes(brand.toLowerCase())) {
      return brand;
    }
  }

  // 모델명 패턴으로 브랜드 추정
  // Seiko 모델명 패턴 (예: SWR106P1, SNE, SRP 등)
  if (
    /^[A-Z]{2,4}\d{3,}/i.test(modelName) ||
    /^(SNE|SRP|SKX|SBD|SWR)/i.test(modelName)
  ) {
    return "Seiko";
  }

  // Rolex 레퍼런스 패턴 (예: 126610LN)
  if (/^\d{6}[A-Z]{2}$/i.test(modelName)) {
    return "Rolex";
  }

  // Omega 레퍼런스 패턴 (예: 310.30.42.50.01.002)
  if (/^\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{3}$/.test(modelName)) {
    return "Omega";
  }

  // 첫 번째 단어를 브랜드로 추정
  return modelName.split(" ")[0];
}

function getWatchInfo(modelName: string) {
  const lowerModel = modelName.toLowerCase();

  if (lowerModel.includes("submariner")) {
    return {
      brand: "Rolex",
      modelName: "Submariner Date",
      referenceNumber: "126610LN",
      caliber: "3235",
      caseSize: "41mm",
      caseMaterial: "Oystersteel",
      waterResistance: "300m",
      releaseYear: 2020,
      msrpKrw: 13500000,
      thumbnailUrl: "/rolex-submariner-black-dial-watch.jpg",
    };
  }

  if (lowerModel.includes("speedmaster")) {
    return {
      brand: "Omega",
      modelName: "Speedmaster Professional",
      referenceNumber: "310.30.42.50.01.002",
      caliber: "3861",
      caseSize: "42mm",
      caseMaterial: "스테인리스 스틸",
      waterResistance: "50m",
      releaseYear: 2021,
      msrpKrw: 9200000,
      thumbnailUrl: "/omega-speedmaster-moonwatch.jpg",
    };
  }

  if (lowerModel.includes("daytona")) {
    return {
      brand: "Rolex",
      modelName: "Cosmograph Daytona",
      referenceNumber: "126500LN",
      caliber: "4131",
      caseSize: "40mm",
      caseMaterial: "Oystersteel",
      waterResistance: "100m",
      releaseYear: 2023,
      msrpKrw: 22000000,
      thumbnailUrl: "/rolex-daytona-chronograph-watch.jpg",
    };
  }

  if (lowerModel.includes("royal oak")) {
    return {
      brand: "Audemars Piguet",
      modelName: "Royal Oak",
      referenceNumber: "15500ST.OO.1220ST.01",
      caliber: "4302",
      caseSize: "41mm",
      caseMaterial: "스테인리스 스틸",
      waterResistance: "50m",
      releaseYear: 2019,
      msrpKrw: 35000000,
      thumbnailUrl: "/luxury-wristwatch.png",
    };
  }

  return null;
}

// 검색 결과에서 사양 정보 추출
function extractSpecsFromSearchResults(
  results: TavilySearchResult[],
  answer: string | undefined,
  modelName: string
): {
  caliber?: string;
  caseSize?: string;
  caseMaterial?: string;
  waterResistance?: string;
  referenceNumber?: string;
} {
  const specs: {
    caliber?: string;
    caseSize?: string;
    caseMaterial?: string;
    waterResistance?: string;
    referenceNumber?: string;
  } = {};

  // 모든 검색 결과 텍스트 합치기
  const allText = [
    answer || "",
    ...results.map((r) => r.content || r.title || ""),
  ]
    .join(" ")
    .toLowerCase();

  // 칼리버 추출 (예: "3235", "3861", "자동", "automatic")
  const caliberPatterns = [
    /\b(\d{4})\b/g, // 4자리 숫자 (예: 3235, 3861)
    /(자동|automatic|mechanical|quartz)/gi,
    /caliber\s*:?\s*([a-z0-9\-]+)/gi,
    /무브먼트\s*:?\s*([a-z0-9\-]+)/gi,
  ];

  for (const pattern of caliberPatterns) {
    const match = allText.match(pattern);
    if (match) {
      const value = match[0].replace(/caliber|무브먼트|:|\s/gi, "").trim();
      if (value && value.length > 0) {
        specs.caliber = value.length <= 10 ? value : specs.caliber;
        break;
      }
    }
  }

  // 케이스 크기 추출 (예: "41mm", "42mm", "40mm")
  const caseSizeMatch = allText.match(/(\d+(?:\.\d+)?)\s*mm/gi);
  if (caseSizeMatch) {
    // 가장 많이 언급된 크기 선택
    const sizes = caseSizeMatch.map((m) => m.replace(/\s/g, ""));
    const sizeCounts = sizes.reduce((acc, size) => {
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostCommonSize = Object.entries(sizeCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];
    if (mostCommonSize) {
      specs.caseSize = mostCommonSize;
    }
  }

  // 케이스 소재 추출
  const materialPatterns = [
    /(스테인리스\s*스틸|stainless\s*steel|oystersteel|steel)/gi,
    /(티타늄|titanium)/gi,
    /(세라믹|ceramic)/gi,
    /(골드|gold|yellow\s*gold|white\s*gold|rose\s*gold)/gi,
    /(플래티넘|platinum)/gi,
  ];

  for (const pattern of materialPatterns) {
    const match = allText.match(pattern);
    if (match) {
      const material = match[0].trim();
      if (
        material.toLowerCase().includes("stainless") ||
        material.includes("스테인리스")
      ) {
        specs.caseMaterial = "스테인리스 스틸";
      } else if (material.toLowerCase().includes("oystersteel")) {
        specs.caseMaterial = "Oystersteel";
      } else if (
        material.toLowerCase().includes("titanium") ||
        material.includes("티타늄")
      ) {
        specs.caseMaterial = "티타늄";
      } else {
        specs.caseMaterial = material;
      }
      break;
    }
  }

  // 방수 추출 (예: "300m", "50m", "100m")
  const waterResistanceMatch = allText.match(/(\d+)\s*m\b/gi);
  if (waterResistanceMatch) {
    const resistances = waterResistanceMatch.map((m) => m.replace(/\s/g, ""));
    const resistanceCounts = resistances.reduce((acc, res) => {
      acc[res] = (acc[res] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostCommonResistance = Object.entries(resistanceCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];
    if (mostCommonResistance) {
      specs.waterResistance = mostCommonResistance;
    }
  }

  // 레퍼런스 번호 추출 (모델명과 유사한 패턴 찾기)
  const refPatterns = [
    /\b([A-Z]{1,4}\d{3,}[A-Z0-9\.\-]*)\b/g, // 예: SWR106P1, 126610LN
    /reference[:\s]+([A-Z0-9\.\-]+)/gi,
    /레퍼런스[:\s]+([A-Z0-9\.\-]+)/gi,
    /ref[:\s]+([A-Z0-9\.\-]+)/gi,
  ];

  for (const pattern of refPatterns) {
    const matches = allText.match(pattern);
    if (matches) {
      // 모델명과 유사한 패턴 찾기
      const modelPattern = modelName.replace(/\s/g, "").toUpperCase();
      const similarRef = matches.find((m) => {
        const cleanMatch = m
          .replace(/reference|레퍼런스|ref|:|\s/gi, "")
          .toUpperCase();
        return (
          cleanMatch.includes(modelPattern) || modelPattern.includes(cleanMatch)
        );
      });
      if (similarRef) {
        specs.referenceNumber = similarRef
          .replace(/reference|레퍼런스|ref|:|\s/gi, "")
          .trim();
        break;
      }
    }
  }

  return specs;
}

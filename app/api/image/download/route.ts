import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "이미지 URL이 필요합니다." },
        { status: 400 }
      );
    }

    // 이미지 URL 유효성 검사
    try {
      new URL(imageUrl);
    } catch {
      return NextResponse.json(
        { error: "유효하지 않은 URL입니다." },
        { status: 400 }
      );
    }

    // 이미지 가져오기
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "이미지를 가져올 수 없습니다." },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // 이미지 반환
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="image.${
          contentType.split("/")[1] || "jpg"
        }"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("이미지 다운로드 오류:", error);
    return NextResponse.json(
      { error: "이미지 다운로드 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}


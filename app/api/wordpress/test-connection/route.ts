import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // .env 파일에서 우선적으로 가져오기
    let siteUrl = process.env.WORDPRESS_SITE_URL
    let username = process.env.WORDPRESS_USERNAME
    let appPassword = process.env.WORDPRESS_APP_PASSWORD

    // .env에 없으면 요청 본문에서 가져오기
    if (!siteUrl || !username || !appPassword) {
      const body = await request.json()
      siteUrl = siteUrl || body.siteUrl
      username = username || body.username
      appPassword = appPassword || body.appPassword
    }

    if (!siteUrl || !username || !appPassword) {
      return NextResponse.json({ error: "모든 필드를 입력해주세요." }, { status: 400 })
    }

    // Normalize site URL
    const normalizedUrl = siteUrl.replace(/\/$/, "")

    // Test WordPress REST API connection
    const response = await fetch(`${normalizedUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${appPassword}`).toString("base64")}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("WordPress connection error:", errorText)
      return NextResponse.json({ error: "워드프레스 연결에 실패했습니다. 인증 정보를 확인해주세요." }, { status: 401 })
    }

    const userData = await response.json()

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      },
    })
  } catch (error) {
    console.error("Connection test error:", error)
    return NextResponse.json({ error: "연결 테스트 중 오류가 발생했습니다." }, { status: 500 })
  }
}

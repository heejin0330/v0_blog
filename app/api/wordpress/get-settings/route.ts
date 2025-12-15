import { NextResponse } from "next/server"

export async function GET() {
  try {
    // .env 파일에서 워드프레스 설정 확인
    const siteUrl = process.env.WORDPRESS_SITE_URL
    const username = process.env.WORDPRESS_USERNAME
    const appPassword = process.env.WORDPRESS_APP_PASSWORD

    // .env에 설정이 모두 있는지 확인
    const hasEnvSettings = siteUrl && username && appPassword

    return NextResponse.json({
      hasEnvSettings,
      // 보안을 위해 siteUrl과 username만 반환 (appPassword는 반환하지 않음)
      siteUrl: hasEnvSettings ? siteUrl : null,
      username: hasEnvSettings ? username : null,
    })
  } catch (error) {
    console.error("Get settings error:", error)
    return NextResponse.json({ hasEnvSettings: false }, { status: 500 })
  }
}



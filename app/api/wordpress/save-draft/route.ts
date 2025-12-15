import { type NextRequest, NextResponse } from "next/server"

interface WordPressPostData {
  title: string
  content: string
  status: "draft" | "publish" | "pending"
  excerpt?: string
  tags?: number[]
  categories?: number[]
}

export async function POST(request: NextRequest) {
  try {
    // .env 파일에서 우선적으로 가져오기
    let siteUrl = process.env.WORDPRESS_SITE_URL
    let username = process.env.WORDPRESS_USERNAME
    let appPassword = process.env.WORDPRESS_APP_PASSWORD

    // .env에 없으면 요청 본문에서 가져오기
    const body = await request.json()
    
    // .env 값이 없거나 빈 문자열인 경우에만 body에서 가져오기
    if (!siteUrl || siteUrl.trim() === "") {
      siteUrl = body.siteUrl
    }
    if (!username || username.trim() === "") {
      username = body.username
    }
    if (!appPassword || appPassword.trim() === "") {
      appPassword = body.appPassword
    }

    const { title, content, metaDescription, tags } = body

    // 최종적으로 설정이 모두 있는지 확인
    if (!siteUrl || siteUrl.trim() === "" || !username || username.trim() === "" || !appPassword || appPassword.trim() === "") {
      return NextResponse.json({ error: "워드프레스 설정이 필요합니다. .env 파일 또는 요청 본문에 설정을 제공해주세요." }, { status: 400 })
    }

    const normalizedUrl = siteUrl.replace(/\/$/, "")

    // Create post data
    const postData: WordPressPostData = {
      title,
      content,
      status: "draft",
      excerpt: metaDescription,
    }

    // Create the post
    const response = await fetch(`${normalizedUrl}/wp-json/wp/v2/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${username}:${appPassword}`).toString("base64")}`,
      },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("WordPress post creation error:", errorText)
      return NextResponse.json({ error: "포스트 저장에 실패했습니다." }, { status: 500 })
    }

    const post = await response.json()

    return NextResponse.json({
      success: true,
      postId: post.id,
      postUrl: post.link,
      editUrl: `${normalizedUrl}/wp-admin/post.php?post=${post.id}&action=edit`,
    })
  } catch (error) {
    console.error("Save draft error:", error)
    return NextResponse.json({ error: "포스트 저장 중 오류가 발생했습니다." }, { status: 500 })
  }
}

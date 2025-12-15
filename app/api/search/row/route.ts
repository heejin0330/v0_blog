import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const tavilyApiKey = process.env.TAVILY_API_KEY;

    if (!tavilyApiKey) {
      return NextResponse.json({ results: [] });
    }

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: tavilyApiKey,
        query: query,
        search_depth: "basic",
        include_answer: false,
        max_results: 7, // 넉넉하게 가져와서 사용자가 거르게 함
      }),
    });

    const data = await response.json();
    return NextResponse.json({ results: data.results || [] });

  } catch (error) {
    return NextResponse.json({ results: [] });
  }
}
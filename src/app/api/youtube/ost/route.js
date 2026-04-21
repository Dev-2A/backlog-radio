import { NextResponse } from "next/server";
import { searchGameOst } from "@/lib/youtube";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const gameName = searchParams.get("game");

  if (!gameName || !gameName.trim()) {
    return NextResponse.json(
      { error: "game 파라미터가 필요합니다." },
      { status: 400 },
    );
  }

  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: "서버에 YouTube API 키가 설정되어 있지 않습니다." },
      { status: 500 },
    );
  }

  try {
    const videos = await searchGameOst(gameName.trim());

    if (videos.length === 0) {
      return NextResponse.json(
        { error: "OST 후보를 찾지 못했습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      game: gameName.trim(),
      videos,
    });
  } catch (err) {
    console.error("OST search error:", err);
    return NextResponse.json(
      { error: `검색 중 오류: ${err.message}` },
      { status: 500 },
    );
  }
}

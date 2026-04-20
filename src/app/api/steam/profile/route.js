import { NextResponse } from "next/server";
import { resolveSteamId, getPlayerSummary } from "@/lib/steam";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("id");

  if (!input) {
    return NextResponse.json(
      { error: "id 파라미터가 필요합니다." },
      { status: 400 },
    );
  }

  if (!process.env.STEAM_API_KEY) {
    return NextResponse.json(
      { error: "서버에 Steam API 키가 설정되어 있지 않습니다." },
      { status: 500 },
    );
  }

  const steamId = await resolveSteamId(input);
  if (!steamId) {
    return NextResponse.json(
      { error: "Steam ID 또는 커스텀 URL을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  const profile = await getPlayerSummary(steamId);
  if (!profile) {
    return NextResponse.json(
      { error: "프로필을 가져오지 못했습니다." },
      { status: 502 },
    );
  }

  return NextResponse.json({ profile });
}

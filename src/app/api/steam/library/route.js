import { NextResponse } from "next/server";
import { getOwnedGames, groupByBacklog } from "@/lib/steam";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get("steamId");

  if (!steamId || !/^\d{17}$/.test(steamId)) {
    return NextResponse.json(
      { error: "유효한 SteamID64가 필요합니다." },
      { status: 400 },
    );
  }

  if (!process.env.STEAM_API_KEY) {
    return NextResponse.json(
      { error: "서버에 Steam API 키가 설정되어 있지 않습니다." },
      { status: 500 },
    );
  }

  const games = await getOwnedGames(steamId);

  if (games === null) {
    return NextResponse.json(
      {
        error:
          '라이브러리를 가져오지 못했습니다. 프로필의 "게임 상세 정보" 공개 여부를 확인해주세요.',
      },
      { status: 502 },
    );
  }

  if (games.length === 0) {
    return NextResponse.json(
      {
        error:
          '라이브러리가 비어있거나, 프로필의 "게임 상세 정보"가 공개되어 있지 않습니다.',
      },
      { status: 404 },
    );
  }

  const { groups, stats } = groupByBacklog(games);

  return NextResponse.json({ groups, stats });
}

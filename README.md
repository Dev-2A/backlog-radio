<div align="center">

# 📻 Backlog Radio

### 안 한 게임의 OST부터 들어보기

Steam 라이브러리에서 **구매했지만 거의 안 한** 게임들의 사운드트랙을 자동으로 찾아 작업 BGM 플레이리스트로 만들어주는 도구.

"이 음악 좋네, 게임도 한번 해볼까?" — 백로그 정복의 가장 부드러운 시작.

[**🌐 Live Demo**](https://backlog-radio.vercel.app) · [**📖 개발 기록**](https://github.com/Dev-2A/backlog-radio/issues)

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/deployed-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## ✨ 왜 만들었나

Steam 라이브러리에 **사놓고 안 한 게임**이 수십 개. 그렇다고 당장 플레이할 시간은 없고 — 하지만 그 게임의 OST는? 코딩하면서, 책 읽으면서, 산책하면서 들을 수 있잖아.

"게임은 못 해도 음악부터 듣자"는 아이디어에서 출발했어. 음악을 듣다 보면 언젠가 자연스럽게 "이 게임 좀 해볼까?" 싶은 순간이 올 거라는 믿음과 함께.

## 🎯 주요 기능

- 🎮 **자동 백로그 분석** — Steam ID만 입력하면 플레이타임 기준으로 라이브러리를 자동 분류
  - 🌱 완전 백로그 (0분)
  - 🌿 거의 백로그 (1~60분)
  - 🌳 가볍게 해본 (1~3시간)
- 🎵 **OST 자동 발굴** — YouTube Data API + 자체 점수 랭킹으로 최적의 OST 후보 탐색
- 📅 **이번 주의 백로그** — 주차 + 사용자 ID로 결정론적 시드 생성, 월요일마다 자동 갱신
- 🎧 **작업 모드** — 영상은 숨기고 음악만. 하단 고정 플레이어 + 자동 다음 곡 + 셔플/반복
- 📜 **재생 히스토리** — 최근 500곡 기록 + 가장 많이 들은 게임/곡 통계
- ⚡ **스마트 캐시** — OST 검색 결과 30일 캐시로 YouTube API 할당량 절약
- ⌨️ **키보드 단축키** — Space / ←→ / Shift+←→ / M

## 🔧 기술 스택

- **Next.js 15** (App Router) + JavaScript
- **Tailwind CSS v4** — `@theme` 기반 CSS 변수
- **Steam Web API** — 프로필 + 라이브러리 페칭
- **YouTube Data API v3** — OST 검색 + IFrame Player API 재생
- **localStorage** — 히스토리 + OST 캐시 영속화
- **Vercel** — 서버리스 배포

## 🚀 로컬 실행

```bash
git clone https://github.com/Dev-2A/backlog-radio.git
cd backlog-radio
npm install
```

프로젝트 루트에 `.env.local` 파일 생성:

```env
STEAM_API_KEY=여기에_Steam_Web_API_키
YOUTUBE_API_KEY=여기에_YouTube_Data_API_키
```

API 키 발급:
- Steam: https://steamcommunity.com/dev/apikey
- YouTube: https://console.cloud.google.com → YouTube Data API v3 활성화

```bash
npm run dev
```

→ http://localhost:3000

## 🎹 사용법

1. Steam 프로필을 **공개**로 설정하고 **게임 상세 정보**도 공개로 전환
2. SteamID64 또는 커스텀 URL (예: `tangi826`) 입력
3. 라이브러리가 로드되면 🎵 OST 찾기 버튼으로 각 게임 사운드트랙 탐색
4. `▶ 이 3곡 전부 틀기`로 이번 주의 백로그 바로 재생

## 🎨 디자인 메모

- **파스텔 블루 다크 테마** — `oklch()` 컬러 스페이스 사용
- **프레임리스 UI** — 최소한의 구분선, 컨텐츠가 주인공
- **마이크로 인터랙션** — 호버 시 살짝 떠오르는 카드, 진행 바 두꺼워짐 등

## 📚 시리즈

"개발자 도구 시각화" 시리즈의 일환으로, 취미 데이터를 시각적/청각적으로 재구성하는 데 관심이 있어.

- [🎵 Vibe Coding Radio](https://github.com/Dev-2A) — 코딩 세션 + 음악 (사촌 프로젝트)
- 📻 **Backlog Radio** ← *이 프로젝트*
- 🎼 *TBD*

## 📜 License

MIT © Dev-2A

---

<div align="center">
<sub>made with 🥤 & 💙 by <a href="https://github.com/Dev-2A">Dev-2A</a></sub>
</div>

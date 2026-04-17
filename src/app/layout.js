import "./globals.css";

export const metadata = {
  title: "📻 Backlog Radio",
  description:
    "안 한 게임의 OST부터 들어보기 — Steam 백로그 게임 사운드트랙 자동 발굴 + 작업 BGM 플레이리스트",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

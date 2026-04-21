import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Toast from "@/components/ui/Toast";
import { PlayerProvider } from "@/components/player/PlayerProvider";

export const metadata = {
  title: "📻 Backlog Radio — 안 한 게임의 OST부터",
  description:
    "Steam 라이브러리에서 거의 안 한 게임들의 사운드트랙을 자동으로 찾아 작업 BGM 플레이리스트로. 백로그 정복의 가장 부드러운 시작.",
  keywords: [
    "Steam",
    "OST",
    "backlog",
    "백로그",
    "게임 음악",
    "BGM",
    "플레이리스트",
  ],
  openGraph: {
    title: "📻 Backlog Radio",
    description: "안 한 게임의 OST부터 들어보기",
    type: "website",
    locale: "ko_KR",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E📻%3C/text%3E%3C/svg%3E",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <PlayerProvider>
          <Header />
          <main className="flex-1 pb-28 sm:pb-24">{children}</main>
          <Footer />
          <Toast />
        </PlayerProvider>
      </body>
    </html>
  );
}

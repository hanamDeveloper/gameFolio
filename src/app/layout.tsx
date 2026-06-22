import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YS World — 김영섭 포트폴리오",
  description:
    "코드가 아닌 제품을 위해 일하는 Frontend Engineer 김영섭의 3D 탐험형 포트폴리오",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full font-sans antialiased">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}

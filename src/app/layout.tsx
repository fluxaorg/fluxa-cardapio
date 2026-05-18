import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "../index.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Fluxa Food's — Cardápio",
  description: "Cardápio digital Fluxa Food's",
};

// PWA / iOS safe-areas + bloquear pinch-zoom (chave para layout estavel)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FAF9F6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={dmSans.variable}>
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}

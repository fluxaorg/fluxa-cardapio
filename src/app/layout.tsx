import type { Metadata, Viewport } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "Fluxa Cardápio",
  description: "Sistema de cardápio digital Fluxa",
};

// Critical for iOS safe areas (notch + home indicator)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover", // enables env(safe-area-inset-bottom) on iOS
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

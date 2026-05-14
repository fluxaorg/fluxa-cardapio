import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "Fluxa Cardápio",
  description: "Sistema de cardápio digital Fluxa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}

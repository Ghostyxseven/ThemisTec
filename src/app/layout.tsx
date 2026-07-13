import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThemisTec — Gestão Jurídica",
  description:
    "Plataforma de gestão jurídica para advogados autônomos e pequenos escritórios.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1a3c5e",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}

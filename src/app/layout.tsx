import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

import { OfflineSyncProvider } from "@/components/providers/OfflineSyncProvider";

export const metadata: Metadata = {
  title: "ThemisTec — Gestão Jurídica",
  description:
    "Plataforma de gestão jurídica para advogados autônomos e pequenos escritórios.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1e40af",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="pt-BR" className={outfit.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <Toaster position="top-right" richColors />
        <OfflineSyncProvider />
        {children}
      </body>
    </html>
  );
}

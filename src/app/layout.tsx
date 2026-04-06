import React from "react";
import type { Metadata } from "next";
import { BrandProvider } from "@/contexts/BrandContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solar Vision | Diagnóstico por IA",
  description: "Plataforma de termografia solar inteligente com processamento por drones e IA.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <BrandProvider>
          {children}
        </BrandProvider>
      </body>
    </html>
  );
}

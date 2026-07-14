import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#1182BA",
};

export const metadata: Metadata = {
  title: "CVI para Cães e Gatos | Orientação Online pelo WhatsApp | CVI Fácil",
  description: "Vai viajar com seu pet para o exterior? Receba orientação para organizar o CVI de cães e gatos, com análise do destino, prazos e acompanhamento pelo WhatsApp.",
  robots: "index, follow",
  openGraph: {
    title: "CVI para Cães e Gatos | Orientação Online pelo WhatsApp | CVI Fácil",
    description: "Vai viajar com seu pet para o exterior? Receba orientação para organizar o CVI de cães e gatos.",
    url: "https://cvifacil.com.br", // placeholder
    siteName: "CVI Fácil",
    images: [
      {
        url: "/assets/logo-cvi-facil.png", // placeholder
        width: 800,
        height: 600,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${manrope.variable}`}>
      <body className="antialiased min-h-screen bg-surface flex flex-col text-text-main">
        {children}
      </body>
    </html>
  );
}

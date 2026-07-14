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
  metadataBase: new URL("https://cvifacil.com.br"),
  title: {
    default: "CVI Fácil | CVI para cães e gatos em viagens internacionais",
    template: "%s | CVI Fácil",
  },
  description:
    "Assessoria online para organizar o CVI de cães e gatos em viagens internacionais, com análise do destino, checklist de documentos, prazos e suporte humano pelo WhatsApp.",
  applicationName: "CVI Fácil",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "CVI",
    "CVI para cães",
    "CVI para gatos",
    "Certificado Veterinário Internacional",
    "viagem internacional com pet",
    "documentação pet viagem internacional",
    "assessoria CVI",
    "CVI online",
    "passaporte pet",
    "sorologia raiva",
    "MAPA pets",
  ],
  authors: [{ name: "CVI Fácil", url: "https://cvifacil.com.br" }],
  creator: "CVI Fácil",
  publisher: "CVI Fácil",
  category: "pet travel documentation",
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "CVI Fácil | CVI para cães e gatos em viagens internacionais",
    description:
      "Organize o CVI do seu pet com suporte online, checklist de documentos e acompanhamento até a emissão.",
    url: "/",
    siteName: "CVI Fácil",
    images: [
      {
        url: "/assets/hero-pets-viagem.png",
        width: 1200,
        height: 1200,
        alt: "Cão e gato prontos para viagem internacional com CVI Fácil",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVI Fácil | CVI para cães e gatos",
    description:
      "Assessoria online para organizar o CVI do seu pet em viagens internacionais.",
    images: ["/assets/hero-pets-viagem.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/assets/logo-cvi-facil.png",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  other: {
    "geo.region": "BR",
    "geo.placename": "Brasil",
    "business:contact_data:country_name": "Brasil",
    "ai-content-declaration":
      "Página comercial sobre assessoria documental para CVI de cães e gatos em viagens internacionais.",
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

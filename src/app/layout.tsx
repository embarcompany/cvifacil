import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const GTM_ID = "GTM-K8H3VLJZ";

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
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
    "msapplication-TileColor": "#ffffff",
    "msapplication-TileImage": "/mstile-150x150.png",
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
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
      <body className="antialiased min-h-screen bg-surface flex flex-col text-text-main">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}

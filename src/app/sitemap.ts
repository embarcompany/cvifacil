import type { MetadataRoute } from "next";

const siteUrl = "https://cvifacil.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [
        `${siteUrl}/assets/hero-pets-viagem.png`,
        `${siteUrl}/assets/logo-cvi-facil.png`,
      ],
    },
  ];
}

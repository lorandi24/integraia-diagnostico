import type { MetadataRoute } from "next";

/** Manifiesto PWA: permite instalar el diagnóstico como app en celular y escritorio. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Diagnóstico de Madurez en IA – IntegraIA by EMET",
    short_name: "Diagnóstico IA",
    description: "Evalúe qué tan lista está su pyme para la Inteligencia Artificial y reciba un roadmap de 90 días.",
    lang: "es-MX",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#050B18",
    theme_color: "#050B18",
    categories: ["business", "productivity", "education"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

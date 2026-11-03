/**
 * Configuración de contacto para el CTA “Diagnóstico gratuito”.
 * Se define con variables de entorno (ver .env.example).
 */
export const BRAND = {
  name: "IntegraIA by EMET",
  product: "Diagnóstico de Madurez en IA",
};

const CTA_URL = process.env.NEXT_PUBLIC_CTA_URL?.trim();
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");

/** Devuelve el enlace del CTA, con mensaje prellenado si se usa WhatsApp. */
export function ctaHref(message: string): string {
  if (CTA_URL) return CTA_URL;
  const text = encodeURIComponent(message);
  return WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${text}` : `https://wa.me/?text=${text}`;
}

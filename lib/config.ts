/**
 * Configuración de marca y contacto.
 */
export const BRAND = {
  name: "IntegraIA by EMET",
  product: "Diagnóstico de Madurez en IA",
  /** Suba el logo oficial a /public/logo-integraia.png y se mostrará automáticamente. */
  logoSrc: "/logo-integraia.png",
};

/** WhatsApp de IntegraIA (lada internacional, sin espacios). Se puede sobrescribir por entorno. */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "5219992978891";

export function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

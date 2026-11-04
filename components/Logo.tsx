"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { BRAND } from "@/lib/config";

/** Recuerda entre navegaciones si el PNG falló, para no reintentar en cada página. */
let failed = false;

/**
 * Logo oficial: emblema del lobo (/public/logo-integraia.png, 217×256) + nombre en texto real,
 * igual que la Calculadora de ROI. El texto en HTML se ve nítido a cualquier zoom.
 * Si el PNG falta o no carga, se usa el emblema temporal en SVG.
 */
export function BrandLogo({ className = "h-11 sm:h-14" }: { className?: string }) {
  const [error, setError] = useState(failed);
  const ref = useRef<HTMLImageElement>(null);

  const fail = () => {
    failed = true;
    setError(true);
  };

  // La imagen puede fallar antes de que React hidrate el componente.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth === 0) fail();
  }, []);

  return (
    <span className="flex items-center gap-2.5">
      {error ? (
        <LogoMark />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- <img> permite detectar si el archivo falta
        <img
          ref={ref}
          src={BRAND.logoSrc}
          alt=""
          width={217}
          height={256}
          decoding="async"
          fetchPriority="high"
          onError={fail}
          className={`${className} w-auto object-contain`}
        />
      )}
      <Wordmark />
    </span>
  );
}

function Wordmark() {
  return (
    <span className="leading-tight">
      <span className="block font-display text-lg font-bold text-white sm:text-xl">
        Integra<span className="text-gradient">IA</span>
      </span>
      <span className="block text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400">by EMET</span>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className="flex items-center" aria-label={`${BRAND.name} – inicio`}>
      <BrandLogo className={className} />
    </Link>
  );
}

/* ───────── Emblema temporal (solo si falta el PNG) ───────── */

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  // id único: el logo aparece varias veces (header y PDF) y un id repetido rompe el degradado
  const gid = `logo-g-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00E5FF" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#07122A" stroke="rgba(0,229,255,.35)" />
      <path
        d="M20 18v28M32 18l-8 28M32 18l8 28M27 36h10"
        stroke={`url(#${gid})`}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="46" cy="18" r="4" fill="#00E5FF" />
      <path d="M46 22v8h-6" stroke="#14B8A6" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

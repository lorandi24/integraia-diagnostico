import Link from "next/link";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00E5FF" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#07122A" stroke="rgba(0,229,255,.35)" />
      <path
        d="M20 18v28M32 18l-8 28M32 18l8 28M27 36h10"
        stroke="url(#logo-g)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="46" cy="18" r="4" fill="#00E5FF" />
      <path d="M46 22v8h-6" stroke="#14B8A6" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="IntegraIA by EMET – inicio">
      <LogoMark />
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold text-white">
          Integra<span className="text-gradient">IA</span>
        </span>
        <span className="block text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400">by EMET</span>
      </span>
    </Link>
  );
}

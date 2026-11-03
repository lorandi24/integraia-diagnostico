interface Props {
  score: number;
  size?: number;
}

/** Medidor circular SVG (sin dependencias). */
export function ScoreGauge({ score, size = 200 }: Props) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, score)) / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id="gauge-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00E5FF" />
            <stop offset="1" stopColor="#14B8A6" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(148,163,184,.18)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#gauge-g)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-bold text-white">{score}</span>
        <span className="print-muted text-sm text-slate-400">de 100</span>
      </div>
    </div>
  );
}

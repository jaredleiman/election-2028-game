interface ProbabilityGaugeProps {
  demPct: number;
  tossPct: number;
  repPct: number;
  demLabel: string;
  repLabel: string;
}

const ARC = 'M 10 100 A 90 90 0 0 1 190 100';

export default function ProbabilityGauge({ demPct, tossPct, repPct, demLabel, repLabel }: ProbabilityGaugeProps) {
  const segments = [
    { pct: demPct, color: '#3b82f6', key: 'dem' },
    { pct: tossPct, color: '#94a3b8', key: 'toss' },
    { pct: repPct, color: '#ef4444', key: 'rep' },
  ];
  let offset = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[120px] w-[200px]">
        <svg viewBox="0 0 200 110" className="h-full w-full overflow-visible">
          <path d={ARC} pathLength={100} fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth={14} strokeLinecap="round" />
          {segments.map((seg) => {
            const el = (
              <path
                key={seg.key}
                d={ARC}
                pathLength={100}
                fill="none"
                stroke={seg.color}
                strokeWidth={14}
                strokeDasharray={`${seg.pct} 100`}
                strokeDashoffset={-offset}
                className="transition-all duration-700"
                style={{ filter: seg.key === 'dem' ? 'drop-shadow(0 0 6px rgba(59,130,246,0.6))' : undefined }}
              />
            );
            offset += seg.pct;
            return el;
          })}
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="font-display text-4xl font-black leading-none text-gold-300 text-glow-gold">{demPct}%</p>
        </div>
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-400">{demLabel} win probability</p>
      <div className="mt-4 grid w-full grid-cols-3 gap-2 text-center text-[11px]">
        <Legend color="bg-blue-500" label={`${demPct}% ${demLabel}`} />
        <Legend color="bg-slate-400" label={`${tossPct}% toss-up`} />
        <Legend color="bg-red-500" label={`${repPct}% ${repLabel}`} />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center justify-center gap-1.5 text-slate-300">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

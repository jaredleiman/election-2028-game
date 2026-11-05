import { Mic, TrendingDown, TrendingUp } from 'lucide-react';
import CandidatePortrait from '@/components/ui/CandidatePortrait';
import { ACTIONS, HARRISON, WHITMAN } from '@/data/campaign';
import type { GameState, Investment } from '@/types';
import { canAfford } from '@/game/campaign';

interface DebateScreenProps {
  game: GameState;
  onInvest: (investment: Investment) => void;
}

const PERFORMANCE = [
  { label: 'Poise under pressure', harrison: 82, whitman: 74 },
  { label: 'Policy depth', harrison: 78, whitman: 80 },
  { label: 'Rebuttal sharpness', harrison: 85, whitman: 71 },
  { label: 'Likability', harrison: 76, whitman: 69 },
];

const ISSUES = [
  { label: 'Economy', harrison: 58, whitman: 62 },
  { label: 'Healthcare', harrison: 71, whitman: 44 },
  { label: 'Immigration', harrison: 47, whitman: 63 },
  { label: 'Climate', harrison: 69, whitman: 41 },
  { label: 'Foreign policy', harrison: 61, whitman: 57 },
];

const TICKER = [
  { text: 'Pennsylvania', move: 0.4 },
  { text: 'Michigan', move: 0.6 },
  { text: 'Arizona', move: -0.3 },
  { text: 'Georgia', move: -0.2 },
  { text: 'Wisconsin', move: 0.5 },
  { text: 'North Carolina', move: -0.4 },
  { text: 'Nevada', move: 0.2 },
];

const average = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;

export default function DebateScreen({ game, onInvest }: DebateScreenProps) {
  const harrisonScore = average(PERFORMANCE.map((p) => p.harrison));
  const whitmanScore = average(PERFORMANCE.map((p) => p.whitman));
  const swing = Math.round(harrisonScore - whitmanScore) / 10;
  const prep = ACTIONS.find((a) => a.id === 'debate')!.investment;
  const prepAffordable = canAfford(game, { ...prep });
  const tickerItems = [...TICKER, ...TICKER];

  return (
    <div className="relative mx-auto max-w-[1600px] overflow-hidden p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,rgba(232,197,71,0.18),transparent_60%)]" />

      <div className="relative">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-1">Debate night</p>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl">Primetime debate</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-gold-500/30 bg-navy-900/70 px-4 py-2 text-xs uppercase tracking-[0.14em] text-gold-300">
            <Mic className="h-4 w-4" /> Live from the stage
          </div>
        </header>

        <section className="glass-strong mb-6 rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex flex-col items-center text-center">
              <CandidatePortrait candidate={HARRISON} size="xl" />
              <p className="mt-4 font-display text-xl font-extrabold text-slate-50">{HARRISON.name}</p>
              <p className="text-xs uppercase tracking-[0.14em] text-sky-300">{HARRISON.role}</p>
              <p className="mt-3 font-display text-4xl font-black text-gold-300 text-glow-gold">{harrisonScore.toFixed(0)}</p>
            </div>
            <div className="font-display text-2xl font-black text-gold-400/80 text-glow-gold">VS</div>
            <div className="flex flex-col items-center text-center">
              <CandidatePortrait candidate={WHITMAN} size="xl" />
              <p className="mt-4 font-display text-xl font-extrabold text-slate-50">{WHITMAN.name}</p>
              <p className="text-xs uppercase tracking-[0.14em] text-rose-300">{WHITMAN.role}</p>
              <p className="mt-3 font-display text-4xl font-black text-gold-300 text-glow-gold">{whitmanScore.toFixed(0)}</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <section className="glass rounded-2xl p-6">
            <p className="eyebrow mb-5">Performance</p>
            <div className="space-y-5">
              {PERFORMANCE.map((row) => (
                <BarPair key={row.label} label={row.label} harrison={row.harrison} whitman={row.whitman} />
              ))}
            </div>
          </section>

          <section className="glass rounded-2xl p-6">
            <p className="eyebrow mb-5">Key issue scores</p>
            <div className="space-y-5">
              {ISSUES.map((row) => (
                <BarPair key={row.label} label={row.label} harrison={row.harrison} whitman={row.whitman} />
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="glass flex flex-col justify-between gap-6 rounded-2xl p-6">
            <div>
              <p className="eyebrow mb-2">Expected national swing</p>
              <p className="font-display text-5xl font-black text-emerald-400 drop-shadow-[0_0_14px_rgba(16,185,129,0.35)]">
                {swing >= 0 ? '+' : ''}
                {swing.toFixed(1)}%
              </p>
              <p className="mt-2 text-sm text-slate-400">Harrison gains ground if the debate performance holds.</p>
            </div>
            <div className="rounded-xl border border-gold-500/25 bg-navy-950/60 p-4">
              <p className="mb-1 text-sm font-semibold text-slate-100">Debate prep investment</p>
              <p className="mb-4 text-xs text-slate-400">
                ${Math.abs(prep.moneyDelta).toFixed(1)}M and {Math.abs(prep.energyDelta)} energy for +{prep.shift}% nationwide
              </p>
              <button
                type="button"
                disabled={!prepAffordable}
                onClick={() => onInvest({ ...prep })}
                className="rounded-lg border border-gold-400/60 bg-gold-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-gold-300 transition hover:bg-gold-500/20 hover:shadow-gold disabled:cursor-not-allowed disabled:opacity-40"
              >
                Invest in prep
              </button>
            </div>
          </section>

          <section className="glass overflow-hidden rounded-2xl p-6">
            <p className="eyebrow mb-4">Real-time poll movement</p>
            <div className="relative overflow-hidden rounded-xl bg-navy-950/70 py-3 ring-1 ring-gold-500/10">
              <div className="flex w-max animate-ticker gap-8 whitespace-nowrap px-4">
                {tickerItems.map((item, i) => (
                  <span key={`${item.text}-${i}`} className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-slate-200">{item.text}</span>
                    <span className={`flex items-center gap-0.5 font-bold ${item.move >= 0 ? 'text-sky-300' : 'text-rose-300'}`}>
                      {item.move >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      {item.move >= 0 ? '+' : ''}
                      {item.move.toFixed(1)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">Moves since the opening statements, in points of margin.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

function BarPair({ label, harrison, whitman }: { label: string; harrison: number; whitman: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-display text-xs font-bold text-slate-400">
          <span className="text-sky-300">{harrison}</span> / <span className="text-rose-300">{whitman}</span>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div className="flex h-2.5 justify-end overflow-hidden rounded-full bg-navy-950">
          <div className="h-full rounded-full bg-gradient-to-l from-sky-400 to-blue-600" style={{ width: `${harrison}%` }} />
        </div>
        <div className="flex h-2.5 justify-start overflow-hidden rounded-full bg-navy-950">
          <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-red-600" style={{ width: `${whitman}%` }} />
        </div>
      </div>
    </div>
  );
}

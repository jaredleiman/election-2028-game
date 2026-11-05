import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Users, Vote, Trophy } from 'lucide-react';
import CandidatePortrait from '@/components/ui/CandidatePortrait';
import USMap from '@/components/map/USMap';
import { HARRISON, WHITMAN } from '@/data/campaign';
import { TO_WIN, TOTAL_EV } from '@/data/states';
import { getProjection } from '@/game/campaign';
import { leanColor } from '@/lib/mapColors';
import type { GameState } from '@/types';

interface ElectionNightScreenProps {
  game: GameState;
}

const CONFETTI_COLORS = ['#f8fafc', '#60a5fa', '#e8c547', '#3b82f6'];
const CONFETTI = Array.from({ length: 42 }, (_, i) => ({
  id: i,
  left: 4 + ((i * 37) % 44),
  delay: (i * 0.23) % 4,
  duration: 4.5 + ((i * 13) % 35) / 10,
  drift: ((i * 29) % 60) - 30,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 6 + (i % 4) * 2,
}));

function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

export default function ElectionNightScreen({ game }: ElectionNightScreenProps) {
  const projection = getProjection(game.polls);
  const harrisonWon = projection.demEV >= TO_WIN;
  const counter = useCountUp(projection.demEV);

  const fills = useMemo(
    () => Object.fromEntries(Object.entries(game.polls).map(([code, p]) => [code, leanColor(p.dem - p.rep)])),
    [game.polls],
  );

  return (
    <div className="relative mx-auto max-w-[1600px] overflow-hidden p-4 sm:p-6">
      {harrisonWon && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          {CONFETTI.map((c) => (
            <span
              key={c.id}
              className="confetti-piece absolute top-[-5%] block rounded-sm opacity-0"
              style={
                {
                  left: `${c.left}%`,
                  width: c.size,
                  height: c.size * 0.4,
                  background: c.color,
                  animationDelay: `${c.delay}s`,
                  animationDuration: `${c.duration}s`,
                  '--drift': `${c.drift}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      <div className="relative z-10 grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="glass rounded-2xl p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow">Election night results</p>
            <p className="text-xs text-slate-400">Final projected map</p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-navy-950/70 bg-grid">
            <USMap className="absolute inset-0" fills={fills} />
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section className="glass-strong flex flex-col items-center rounded-2xl p-6 text-center">
            <CandidatePortrait candidate={harrisonWon ? HARRISON : WHITMAN} size="lg" />
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-400">
              {harrisonWon ? 'Winner' : 'Leading'}
            </p>
            <p className="font-display text-xl font-extrabold text-slate-50">{harrisonWon ? HARRISON.name : WHITMAN.name}</p>
            <p className="mt-4 font-display text-7xl font-black leading-none text-gold-300 text-glow-gold tabular-nums">{counter}</p>
            <p className="mt-2 text-sm text-slate-400">of {TOTAL_EV} electoral votes needed to win {TO_WIN}</p>
          </section>

          <section className="glass rounded-2xl border-gold-400/40 p-5">
            <p className="eyebrow mb-2">Tipping point state</p>
            <p className="font-display text-2xl font-extrabold text-slate-50">{projection.tipping ?? 'None yet'}</p>
            <p className="mt-1 text-sm text-slate-400">
              The state that carries the winner past {TO_WIN} electoral votes.
            </p>
          </section>
        </div>

        <section className="glass flex flex-col gap-4 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-gold-300">
            <Vote className="h-5 w-5" />
            <p className="eyebrow">Final popular vote</p>
          </div>
          <VoteBar label="Harrison" value={50.6} color="from-sky-400 to-blue-600" text="text-sky-300" />
          <VoteBar label="Whitman" value={47.1} color="from-rose-400 to-red-600" text="text-rose-300" />
        </section>

        <section className="glass flex flex-col gap-4 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-gold-300">
            <Users className="h-5 w-5" />
            <p className="eyebrow">Turnout</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-display text-3xl font-black text-slate-50">158.4M</p>
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Ballots cast</p>
            </div>
            <div>
              <p className="font-display text-3xl font-black text-slate-50">66.2%</p>
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Of eligible voters</p>
            </div>
          </div>
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <Trophy className="h-3.5 w-3.5 text-gold-400" /> Turnout reported across all 50 states and D.C.
          </p>
        </section>
      </div>
    </div>
  );
}

function VoteBar({ label, value, color, text }: { label: string; value: number; color: string; text: string }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm text-slate-300">{label}</span>
        <span className={`font-display text-xl font-extrabold ${text}`}>{value.toFixed(1)}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-navy-950 ring-1 ring-slate-700/50">
        <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

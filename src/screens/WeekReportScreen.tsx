import { useMemo } from 'react';
import { ArrowRight, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import LineChart from '@/components/charts/LineChart';
import USMap from '@/components/map/USMap';
import { INITIAL_POLLS, STATES } from '@/data/states';
import { getProjection } from '@/game/campaign';
import { leanColor } from '@/lib/mapColors';
import type { GameState } from '@/types';
import { TONE_CLASS } from '@/data/campaign';

interface WeekReportScreenProps {
  game: GameState;
}

const NAMES = Object.fromEntries(STATES.map((s) => [s.code, s.name]));

const describeMargin = (margin: number) =>
  margin >= 0 ? `Harrison +${margin.toFixed(1)}` : `Whitman +${(-margin).toFixed(1)}`;

export default function WeekReportScreen({ game }: WeekReportScreenProps) {
  const before = getProjection(INITIAL_POLLS);
  const after = getProjection(game.polls);

  const changes = useMemo(() => {
    return STATES.map((s) => {
      const was = INITIAL_POLLS[s.code].dem - INITIAL_POLLS[s.code].rep;
      const now = game.polls[s.code].dem - game.polls[s.code].rep;
      const flipped = Math.sign(was) !== Math.sign(now);
      const tightened = !flipped && Math.abs(now) < Math.abs(was) - 0.05;
      const shifted = Math.abs(now - was) > 0.05;
      return { code: s.code, was, now, delta: now - was, flipped, tightened, shifted };
    })
      .filter((c) => c.shifted)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  }, [game.polls]);

  const highlighted = useMemo(() => new Set(changes.filter((c) => c.flipped || c.tightened).map((c) => c.code)), [changes]);
  const beforeFills = useMemo(
    () => Object.fromEntries(Object.entries(INITIAL_POLLS).map(([code, p]) => [code, leanColor(p.dem - p.rep)])),
    [],
  );
  const afterFills = useMemo(
    () => Object.fromEntries(Object.entries(game.polls).map(([code, p]) => [code, leanColor(p.dem - p.rep)])),
    [game.polls],
  );
  const drivers = game.log.filter((e) => e.delta !== undefined).slice(0, 5);
  const weekDone = game.week - 1;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6">
      <div className="glass-strong flex flex-col gap-3 rounded-2xl border-gold-400/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-7 w-7 text-gold-300 drop-shadow-[0_0_8px_rgba(232,197,71,0.6)]" />
          <div>
            <p className="eyebrow">Post-turn report</p>
            <h1 className="font-display text-2xl font-extrabold text-slate-50 sm:text-3xl">Week {weekDone} Complete</h1>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Electoral projection moved from <span className="font-bold text-sky-300">{before.demEV}</span> to{' '}
          <span className="font-bold text-sky-300">{after.demEV}</span> EV for Harrison.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MapCard title="Before this turn" fills={beforeFills} />
        <MapCard title="After this turn" fills={afterFills} glowing={highlighted} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="glass rounded-2xl p-6">
          <p className="eyebrow mb-4">States that moved</p>
          {changes.length === 0 ? (
            <p className="text-sm text-slate-400">No state margins changed this turn.</p>
          ) : (
            <ul className="divide-y divide-slate-700/50">
              {changes.slice(0, 8).map((c) => {
                const towardHarrison = c.delta > 0;
                const Arrow = towardHarrison ? ArrowUpRight : ArrowDownRight;
                const label = c.flipped ? 'Flipped' : c.tightened ? 'Tightened' : 'Shifted';
                return (
                  <li key={c.code} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{NAMES[c.code]}</p>
                      <p className="text-xs text-slate-400">
                        {label} &middot; {describeMargin(c.was)} <ArrowRight className="mx-1 inline h-3 w-3" />{' '}
                        {describeMargin(c.now)}
                      </p>
                    </div>
                    <span
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${towardHarrison ? 'bg-sky-500/15 text-sky-300' : 'bg-rose-500/15 text-rose-300'}`}
                    >
                      <Arrow className="h-3.5 w-3.5" />
                      {c.delta >= 0 ? '+' : ''}
                      {c.delta.toFixed(1)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-6">
          <section className="glass rounded-2xl p-6">
            <p className="eyebrow mb-4">Major drivers</p>
            {drivers.length === 0 ? (
              <p className="text-sm text-slate-400">No actions taken yet. Run a campaign action to see drivers here.</p>
            ) : (
              <ul className="space-y-3">
                {drivers.map((d) => (
                  <li key={d.id} className="flex items-start justify-between gap-4 text-sm">
                    <span className={TONE_CLASS[d.tone]}>{d.text}</span>
                    <span className={`shrink-0 font-bold ${(d.delta ?? 0) >= 0 ? 'text-sky-300' : 'text-rose-300'}`}>
                      {(d.delta ?? 0) >= 0 ? '+' : ''}
                      {(d.delta ?? 0).toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="glass rounded-2xl p-6">
            <p className="eyebrow mb-4">National polling</p>
            <LineChart
              series={[
                { label: 'Harrison', color: '#38bdf8', values: game.history.map((p) => p.dem) },
                { label: 'Whitman', color: '#f87171', values: game.history.map((p) => p.rep) },
              ]}
              labels={game.history.map((p) => `W${p.week}`)}
              height={150}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

function MapCard({ title, fills, glowing }: { title: string; fills: Record<string, string>; glowing?: Set<string> }) {
  return (
    <section className="glass rounded-2xl p-5">
      <p className="eyebrow mb-3">{title}</p>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-navy-950/60 bg-grid">
        <USMap className="absolute inset-0" fills={fills} glowing={glowing} />
      </div>
    </section>
  );
}

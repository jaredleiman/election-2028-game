import { useMemo, useState } from 'react';
import ActionPanel from '@/components/actions/ActionPanel';
import ActionModal from '@/components/actions/ActionModal';
import TurnLog from '@/components/actions/TurnLog';
import LineChart from '@/components/charts/LineChart';
import ProbabilityGauge from '@/components/charts/ProbabilityGauge';
import USMap from '@/components/map/USMap';
import StateModal from '@/components/map/StateModal';
import type { ActionDef } from '@/data/campaign';
import { getProjection } from '@/game/campaign';
import { isSwing, leanColor } from '@/lib/mapColors';
import type { GameState, Investment } from '@/types';

interface MapScreenProps {
  game: GameState;
  onInvest: (investment: Investment) => void;
  onEndWeek: () => void;
}

export default function MapScreen({ game, onInvest, onEndWeek }: MapScreenProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<ActionDef | null>(null);

  const fills = useMemo(
    () => Object.fromEntries(Object.entries(game.polls).map(([code, p]) => [code, leanColor(p.dem - p.rep)])),
    [game.polls],
  );
  const glowing = useMemo(
    () => new Set(Object.entries(game.polls).filter(([, p]) => isSwing(p)).map(([code]) => code)),
    [game.polls],
  );
  const projection = getProjection(game.polls);
  const latest = game.history[game.history.length - 1];
  const recent = game.history.slice(-8);

  const handleInvest = (investment: Investment) => {
    onInvest(investment);
    setPendingAction(null);
    setSelectedState(null);
  };

  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 p-4 sm:p-6 lg:grid-cols-[280px_1fr_320px]">
      <ActionPanel onSelect={setPendingAction} />

      <section className="glass relative flex min-h-[460px] flex-col rounded-2xl p-5 sm:min-h-[600px]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Electoral map</p>
            <p className="mt-1 text-xs text-slate-400">Projected margin by state. Click a state to open its analytics.</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
            <span>Whitman</span>
            <span
              className="h-2 w-28 rounded-full"
              style={{ background: 'linear-gradient(to right, #dc2626, #54627a, #2563eb)' }}
            />
            <span>Harrison</span>
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-xl bg-navy-950/60 ring-1 ring-gold-500/10 bg-grid">
          <USMap className="absolute inset-0 p-4" fills={fills} glowing={glowing} selected={selectedState} onSelect={setSelectedState} />
        </div>
        <p className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
          <span className="h-2 w-2 rounded-full bg-gold-400 shadow-gold" />
          Gold glow marks swing states within 2.5 points
        </p>
      </section>

      <div className="flex flex-col gap-4">
        <section className="glass rounded-2xl p-5">
          <p className="eyebrow mb-4">Live national polling</p>
          <LineChart
            series={[
              { label: 'Harrison', color: '#38bdf8', values: recent.map((p) => p.dem) },
              { label: 'Whitman', color: '#f87171', values: recent.map((p) => p.rep) },
            ]}
            labels={recent.map((p) => `W${p.week}`)}
          />
          <div className="mt-4 flex items-center justify-between rounded-xl bg-navy-950/60 px-4 py-3 text-sm">
            <span className="font-semibold text-sky-300">Harrison {latest.dem.toFixed(1)}%</span>
            <span className="font-semibold text-rose-300">Whitman {latest.rep.toFixed(1)}%</span>
          </div>
        </section>

        <section className="glass rounded-2xl p-5">
          <p className="eyebrow mb-5">Electoral college probability</p>
          <ProbabilityGauge
            demPct={projection.demWinPct}
            tossPct={projection.tossPct}
            repPct={projection.repWinPct}
            demLabel="Harrison"
            repLabel="Whitman"
          />
          <p className="mt-5 text-center text-xs text-slate-400">
            Tipping point: <span className="font-semibold text-gold-300">{projection.tipping ?? 'Not yet reached'}</span>
          </p>
        </section>
      </div>

      <div className="lg:col-span-3">
        <TurnLog game={game} onEndWeek={onEndWeek} />
      </div>

      {selectedState && (
        <StateModal
          code={selectedState}
          game={game}
          onInvest={handleInvest}
          onClose={() => setSelectedState(null)}
        />
      )}

      {pendingAction && (
        <ActionModal
          action={pendingAction}
          game={game}
          initialTarget={selectedState}
          onConfirm={handleInvest}
          onClose={() => setPendingAction(null)}
        />
      )}
    </div>
  );
}

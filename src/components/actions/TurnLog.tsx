import { ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MAX_WEEKS } from '@/game/campaign';
import { TONE_CLASS } from '@/data/campaign';
import type { GameState } from '@/types';

interface TurnLogProps {
  game: GameState;
  onEndWeek: () => void;
}

export default function TurnLog({ game, onEndWeek }: TurnLogProps) {
  const canEnd = game.week < MAX_WEEKS;
  return (
    <section className="glass flex min-h-0 flex-col rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="eyebrow">Turn log</p>
        <button
          type="button"
          onClick={onEndWeek}
          disabled={!canEnd}
          className="group inline-flex items-center gap-2 rounded-lg border border-gold-400/60 bg-gold-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-gold-300 transition hover:bg-gold-500/20 hover:shadow-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          End week {game.week}
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </button>
      </div>
      <ul className="max-h-56 space-y-1 overflow-y-auto pr-2">
        {game.log.map((entry) => (
          <li key={entry.id} className="animate-fade-in flex items-center gap-4 rounded-lg px-3 py-2.5 transition hover:bg-white/[0.03]">
            <span className="w-14 shrink-0 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
              Wk {entry.week}
            </span>
            <span className={`min-w-0 flex-1 truncate text-sm ${TONE_CLASS[entry.tone]}`}>{entry.text}</span>
            {entry.delta !== undefined && (
              <span
                className={`flex shrink-0 items-center gap-0.5 text-sm font-bold ${entry.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
              >
                {entry.delta >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {entry.delta >= 0 ? '+' : ''}
                {entry.delta.toFixed(1)}%
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

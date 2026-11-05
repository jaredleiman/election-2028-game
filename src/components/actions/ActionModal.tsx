import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { ActionDef } from '@/data/campaign';
import { STATES } from '@/data/states';
import { canAfford } from '@/game/campaign';
import type { GameState, Investment } from '@/types';

interface ActionModalProps {
  action: ActionDef;
  game: GameState;
  initialTarget: string | null;
  onConfirm: (investment: Investment) => void;
  onClose: () => void;
}

const SORTED_STATES = [...STATES].sort((a, b) => a.name.localeCompare(b.name));

export default function ActionModal({ action, game, initialTarget, onConfirm, onClose }: ActionModalProps) {
  const [target, setTarget] = useState(initialTarget ?? 'PA');
  const targetName = useMemo(() => STATES.find((s) => s.code === target)?.name ?? '', [target]);
  const investment: Investment = { ...action.investment, target: action.targeted ? target : undefined };
  const affordable = canAfford(game, investment);
  const { investment: inv } = action;

  return (
    <Modal title={action.title} eyebrow="Campaign action" onClose={onClose} widthClass="max-w-lg">
      <p className="mb-6 text-sm leading-relaxed text-slate-300">{action.subtitle}.</p>

      {action.targeted && (
        <label className="mb-6 block">
          <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-slate-400">Target state</span>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full rounded-xl border border-gold-500/30 bg-navy-900 px-4 py-3 text-sm text-slate-100 transition focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
          >
            {SORTED_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.ev} EV)
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Cost label="Cash" value={inv.moneyDelta < 0 ? `-$${Math.abs(inv.moneyDelta).toFixed(1)}M` : `+$${inv.moneyDelta.toFixed(1)}M`} tone={inv.moneyDelta < 0 ? 'text-rose-300' : 'text-emerald-300'} />
        <Cost label="Energy" value={`${inv.energyDelta}`} tone="text-slate-200" />
        <Cost label="Staff" value={`${inv.staffDelta}`} tone="text-slate-200" />
      </div>

      {inv.shift > 0 && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-gold-400/40 bg-gold-500/10 px-4 py-3">
          <span className="text-sm text-slate-200">
            Expected effect{action.targeted ? ` in ${targetName}` : ' nationwide'}
          </span>
          <span className="font-display text-xl font-extrabold text-gold-300 text-glow-gold">+{inv.shift.toFixed(1)}%</span>
        </div>
      )}

      {!affordable && (
        <p className="mb-4 text-sm text-rose-300">Not enough cash, energy, or staff for this action this week.</p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-400 hover:text-slate-100"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!affordable}
          onClick={() => onConfirm(investment)}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-gold-300 to-gold-500 px-5 py-2.5 text-sm font-bold text-navy-950 shadow-gold transition hover:shadow-gold-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          Confirm action
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>
      </div>
    </Modal>
  );
}

function Cost({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-navy-900/60 px-3 py-3 text-center">
      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className={`mt-1 font-display text-lg font-bold ${tone}`}>{value}</p>
    </div>
  );
}

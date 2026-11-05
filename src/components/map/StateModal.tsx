import { Building2, GraduationCap, TrendingDown, TrendingUp, Trees, UserRound, Users, Tv } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { GENERIC_EVENTS, STATE_EVENTS, STATES } from '@/data/states';
import { canAfford } from '@/game/campaign';
import { ACTIONS } from '@/data/campaign';
import type { GameState, Investment } from '@/types';

interface StateModalProps {
  code: string;
  game: GameState;
  onInvest: (investment: Investment) => void;
  onClose: () => void;
}

export default function StateModal({ code, game, onInvest, onClose }: StateModalProps) {
  const info = STATES.find((s) => s.code === code);
  if (!info) return null;
  const poll = game.polls[code];
  const demShare = poll.dem;
  const repShare = poll.rep;
  const undecided = Math.max(0, 100 - demShare - repShare);
  const margin = demShare - repShare;
  const leader = margin >= 0 ? 'HARRISON' : 'WHITMAN';
  const events = STATE_EVENTS[code] ?? GENERIC_EVENTS.slice(0, 3);
  const tvAction = ACTIONS.find((a) => a.id === 'ads')!;
  const tvInvestment: Investment = { ...tvAction.investment, target: code };
  const affordable = canAfford(game, tvInvestment);

  const demographics = [
    { icon: Building2, label: 'Urban', value: info.urban },
    { icon: Trees, label: 'Rural', value: 100 - info.urban },
    { icon: GraduationCap, label: 'College', value: info.college },
    { icon: UserRound, label: 'Age 65+', value: info.age65 },
    { icon: Users, label: 'Age 18-34', value: info.age1834 },
  ];

  return (
    <Modal title={info.name.toUpperCase()} eyebrow={`${info.ev} electoral votes`} onClose={onClose} widthClass="max-w-3xl">
      <div className="mb-8">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-1">Latest polling average</p>
            <p className="text-sm text-slate-400">Leader: <span className="font-semibold text-slate-100">{leader}</span></p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="font-display text-2xl font-extrabold text-sky-400">{demShare.toFixed(1)}%</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Harrison (D)</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-rose-400">{repShare.toFixed(1)}%</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Whitman (R)</p>
            </div>
          </div>
        </div>

        <div className="relative flex h-7 overflow-hidden rounded-lg bg-navy-950 ring-1 ring-slate-700/60">
          <div className="h-full bg-gradient-to-r from-blue-700 to-sky-400 transition-all duration-700" style={{ width: `${demShare}%` }} />
          <div className="h-full bg-slate-600/70 transition-all duration-700" style={{ width: `${undecided}%` }} />
          <div className="h-full bg-gradient-to-l from-red-700 to-rose-400 transition-all duration-700" style={{ width: `${repShare}%` }} />
          <div
            className="pointer-events-none absolute inset-y-0 border-x border-gold-300/70 bg-white/10"
            style={{ left: `${Math.max(0, demShare - info.moe)}%`, width: `${Math.min(100, info.moe * 2)}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">
          Margin {margin >= 0 ? '+' : ''}
          {margin.toFixed(1)} pts &middot; Margin of error &plusmn;{info.moe}%
        </p>
      </div>

      <div className="mb-8">
        <p className="eyebrow mb-4">Demographics</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {demographics.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-gold-500/15 bg-navy-900/50 px-3 py-4 text-center">
              <Icon className="mx-auto mb-2 h-6 w-6 text-gold-300" strokeWidth={1.6} />
              <p className="font-display text-lg font-bold text-slate-50">{value.toFixed(1)}%</p>
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="eyebrow mb-3">Recent events</p>
        <ul className="divide-y divide-slate-700/50">
          {events.map((event) => (
            <li key={event.text} className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="text-slate-300">{event.text}</span>
              <span className={`flex shrink-0 items-center gap-1 font-semibold ${event.impact >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {event.impact >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {event.impact >= 0 ? '+' : ''}
                {event.impact.toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-gold-400/40 bg-gradient-to-br from-gold-500/15 to-gold-500/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Tv className="mt-0.5 h-6 w-6 shrink-0 text-gold-300" strokeWidth={1.6} />
          <div>
            <p className="text-sm font-bold text-slate-50">Local TV ad buy</p>
            <p className="text-xs text-slate-400">Cost $3.2M &middot; {tvInvestment.energyDelta} energy</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 sm:justify-end">
          <p className="font-display text-2xl font-extrabold text-gold-300 text-glow-gold">+{tvInvestment.shift.toFixed(1)}%</p>
          <button
            type="button"
            disabled={!affordable}
            onClick={() => onInvest(tvInvestment)}
            className="rounded-xl bg-gradient-to-b from-gold-300 to-gold-500 px-4 py-2.5 text-sm font-bold text-navy-950 shadow-gold transition hover:shadow-gold-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            Buy ads
          </button>
        </div>
      </div>
    </Modal>
  );
}

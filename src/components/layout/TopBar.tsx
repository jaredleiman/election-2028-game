import { Landmark, Vote, Wallet, Zap } from 'lucide-react';
import CandidatePortrait from '@/components/ui/CandidatePortrait';
import { HARRISON, WHITMAN } from '@/data/campaign';
import { MAX_WEEKS, getProjection } from '@/game/campaign';
import type { GameState } from '@/types';
import { TO_WIN } from '@/data/states';

interface TopBarProps {
  game: GameState;
}

export default function TopBar({ game }: TopBarProps) {
  const projection = getProjection(game.polls);
  const low = Math.max(0, projection.demEV - 2);

  return (
    <header className="glass-strong sticky top-0 z-40 border-b border-gold-500/20">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-3 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-600 text-navy-950 shadow-gold">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-sm font-extrabold tracking-[0.18em] text-slate-50">2028 CAMPAIGN SIMULATOR</p>
            <p className="text-[11px] tracking-[0.12em] text-slate-400">NATIONAL STRATEGY & ELECTORAL COMMAND</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3">
            <CandidatePortrait candidate={HARRISON} size="md" />
            <div className="hidden text-left sm:block">
              <p className="font-display text-sm font-bold tracking-wide text-slate-50">{HARRISON.name}</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-sky-300">{HARRISON.role}</p>
            </div>
          </div>

          <div className="relative flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border border-gold-400/70 bg-navy-900/80 shadow-gold-ring">
            <span className="font-display text-3xl font-black leading-none text-gold-300 text-glow-gold">{game.week}</span>
            <span className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-slate-400">of {MAX_WEEKS}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="font-display text-sm font-bold tracking-wide text-slate-50">{WHITMAN.name}</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-rose-300">{WHITMAN.role}</p>
            </div>
            <CandidatePortrait candidate={WHITMAN} size="md" />
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-3 sm:gap-6">
          <Stat icon={Wallet} label="Campaign cash" value={`$${game.money.toFixed(1)}M`} />
          <Stat icon={Zap} label="Candidate energy" value={`${game.energy}/100`} />
          <Stat
            icon={Vote}
            label={`Projected EV (to ${TO_WIN})`}
            value={`${low}–${projection.demEV}`}
          />
        </dl>
      </div>
    </header>
  );
}

interface StatProps {
  icon: typeof Wallet;
  label: string;
  value: string;
}

function Stat({ icon: Icon, label, value }: StatProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-gold-500/15 bg-navy-900/60 px-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-gold-400" strokeWidth={1.75} />
      <div>
        <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-400">{label}</dt>
        <dd className="font-display text-lg font-extrabold leading-tight text-gold-300 text-glow-gold">{value}</dd>
      </div>
    </div>
  );
}

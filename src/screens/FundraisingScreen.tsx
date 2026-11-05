import { CalendarDays, DollarSign, TrendingUp, Users, Wallet } from 'lucide-react';
import LineChart from '@/components/charts/LineChart';
import type { GameState, Investment } from '@/types';
import { canAfford } from '@/game/campaign';

interface FundraisingScreenProps {
  game: GameState;
  onInvest: (investment: Investment) => void;
}

type Risk = 'Low' | 'Medium' | 'High';

interface Fundraiser {
  id: string;
  title: string;
  where: string;
  date: string;
  yieldM: number;
  risk: Risk;
  energy: number;
}

const FUNDRAISERS: Fundraiser[] = [
  { id: 'napa', title: 'Napa Valley dinner', where: 'Napa, CA', date: 'Week 8', yieldM: 4.2, risk: 'Medium', energy: 8 },
  { id: 'austin', title: 'Founders breakfast', where: 'Austin, TX', date: 'Week 9', yieldM: 2.1, risk: 'Low', energy: 4 },
  { id: 'hamptons', title: 'Summer finale gala', where: 'East Hampton, NY', date: 'Week 10', yieldM: 6.8, risk: 'High', energy: 12 },
];

const RISK_STYLE: Record<Risk, string> = {
  Low: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300',
  Medium: 'border-amber-400/40 bg-amber-500/10 text-amber-300',
  High: 'border-rose-400/40 bg-rose-500/10 text-rose-300',
};

const WEEKLY_RAISED = [1.9, 2.2, 2.0, 2.6, 2.4, 3.1, 2.8];
const WEEK_LABELS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];

export default function FundraisingScreen({ game, onInvest }: FundraisingScreenProps) {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6">
      <header>
        <p className="eyebrow mb-1">Fundraising</p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl">Money operation</h1>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={Wallet}
          label="Cash on hand"
          value={`$${game.money.toFixed(1)}M`}
          note="Available for this week's actions"
        />
        <MetricCard
          icon={Users}
          label="Small-dollar momentum"
          value="+$1.8M"
          note="412,000 donors, up 8.4% week over week"
        />
        <MetricCard
          icon={TrendingUp}
          label="High-dollar pipeline"
          value="$14.6M"
          note="23 committed major donors"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="glass rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <p className="eyebrow">Weekly raised</p>
            <span className="text-xs text-slate-400">Millions per week</span>
          </div>
          <LineChart series={[{ label: 'Raised', color: '#34d399', values: WEEKLY_RAISED }]} labels={WEEK_LABELS} height={220} unit="M" />
        </section>

        <section className="glass rounded-2xl p-6">
          <p className="eyebrow mb-5">Upcoming fundraisers</p>
          <ul className="space-y-3">
            {FUNDRAISERS.map((f) => {
              const investment: Investment = {
                label: f.title,
                moneyDelta: f.yieldM,
                energyDelta: -f.energy,
                staffDelta: -1,
                shift: 0,
                tone: 'green',
              };
              return (
                <li
                  key={f.id}
                  className="group flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-navy-900/50 p-4 transition hover:border-emerald-400/40 hover:bg-navy-900/80"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-100">{f.title}</p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" /> {f.where} &middot; {f.date}
                      </p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${RISK_STYLE[f.risk]}`}>
                      {f.risk} risk
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex items-center gap-1.5 font-display text-xl font-extrabold text-emerald-300">
                      <DollarSign className="h-4 w-4" />
                      {f.yieldM.toFixed(1)}M
                      <span className="ml-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">expected</span>
                    </p>
                    <button
                      type="button"
                      disabled={!canAfford(game, investment)}
                      onClick={() => onInvest(investment)}
                      className="rounded-lg border border-emerald-400/50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-emerald-300 transition hover:bg-emerald-500/10 hover:shadow-[0_0_16px_rgba(16,185,129,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Host event
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <section className="glass group rounded-2xl p-6 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/40">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-500/10">
          <Icon className="h-4 w-4 text-emerald-300" strokeWidth={1.75} />
        </span>
      </div>
      <p className="font-display text-4xl font-black text-emerald-300 drop-shadow-[0_0_14px_rgba(16,185,129,0.3)]">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{note}</p>
    </section>
  );
}

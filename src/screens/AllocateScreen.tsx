import { useMemo, useState, type CSSProperties } from 'react';
import { Plane, Megaphone, Users, Wallet, Zap, UserRound } from 'lucide-react';
import USMap from '@/components/map/USMap';
import { getProjection } from '@/game/campaign';
import { leanColor } from '@/lib/mapColors';
import type { GameState, Investment } from '@/types';

interface AllocateScreenProps {
  game: GameState;
  onInvest: (investment: Investment) => void;
}

interface Channel {
  id: 'ads' | 'visit' | 'ground';
  title: string;
  detail: string;
  icon: typeof Megaphone;
  max: number;
  step: number;
  effectPerM: number;
  build: (spend: number) => Investment;
}

const CHANNELS: Channel[] = [
  {
    id: 'ads',
    title: 'National digital ads',
    detail: 'Nationwide programmatic and social buys',
    icon: Megaphone,
    max: 8,
    step: 0.5,
    effectPerM: 0.12,
    build: (spend) => ({
      label: 'National digital ads',
      moneyDelta: -spend,
      energyDelta: -2,
      staffDelta: -1,
      shift: round(spend * 0.12),
      tone: 'blue',
    }),
  },
  {
    id: 'visit',
    title: 'Candidate visit: Arizona',
    detail: 'Three-day swing tour across Phoenix and Tucson',
    icon: Plane,
    max: 3,
    step: 0.1,
    effectPerM: 0.5,
    build: (spend) => ({
      label: 'Arizona tour',
      moneyDelta: -spend,
      energyDelta: -10,
      staffDelta: -1,
      shift: round(spend * 0.5),
      target: 'AZ',
      tone: 'gold',
    }),
  },
  {
    id: 'ground',
    title: 'Ground game: Michigan',
    detail: 'Field offices and door-knocking in Detroit and Grand Rapids',
    icon: Users,
    max: 5,
    step: 0.1,
    effectPerM: 0.35,
    build: (spend) => ({
      label: 'Michigan field program',
      moneyDelta: -spend,
      energyDelta: -6,
      staffDelta: -Math.ceil(spend * 4),
      shift: round(spend * 0.35),
      target: 'MI',
      tone: 'green',
    }),
  },
];

function round(value: number) {
  return Math.round(value * 100) / 100;
}

export default function AllocateScreen({ game, onInvest }: AllocateScreenProps) {
  const [spend, setSpend] = useState<Record<Channel['id'], number>>({ ads: 0, visit: 0, ground: 0 });
  const totalSpend = spend.ads + spend.visit + spend.ground;

  const heat = useMemo(() => {
    const swing = Object.entries(game.polls)
      .map(([code, p]) => ({ code, margin: p.dem - p.rep }))
      .filter((x) => Math.abs(x.margin) < 8)
      .sort((a, b) => Math.abs(a.margin) - Math.abs(b.margin));
    return swing.slice(0, 16);
  }, [game.polls]);

  const fills = useMemo(
    () => Object.fromEntries(Object.entries(game.polls).map(([code, p]) => [code, leanColor(p.dem - p.rep)])),
    [game.polls],
  );
  const projection = getProjection(game.polls);
  const plan = CHANNELS.filter((c) => spend[c.id] > 0).map((c) => c.build(spend[c.id]));
  const planCost = {
    money: plan.reduce((sum, inv) => sum - inv.moneyDelta, 0),
    energy: plan.reduce((sum, inv) => sum - inv.energyDelta, 0),
    staff: plan.reduce((sum, inv) => sum - inv.staffDelta, 0),
  };
  const committable =
    plan.length > 0 && planCost.money <= game.money && planCost.energy <= game.energy && planCost.staff <= game.staff;

  const commit = () => {
    plan.forEach(onInvest);
    setSpend({ ads: 0, visit: 0, ground: 0 });
  };

  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 p-4 sm:p-6 xl:grid-cols-[300px_1fr_320px]">
      <section className="glass rounded-2xl p-5">
        <p className="eyebrow mb-1">Investment heat map</p>
        <p className="mb-5 text-xs text-slate-400">Brighter tiles are the closest races and the highest return.</p>
        <div className="grid grid-cols-4 gap-2">
          {heat.map(({ code, margin }) => (
            <div
              key={code}
              className="rounded-lg border border-gold-400/20 px-2 py-3 text-center transition hover:scale-[1.03] hover:border-gold-400/70"
              style={{ background: `rgba(232, 197, 71, ${Math.max(0.08, 1 - Math.abs(margin) / 8) * 0.45})` }}
            >
              <p className="font-display text-sm font-extrabold text-slate-50">{code}</p>
              <p className="text-[10px] text-slate-200/80">
                {margin >= 0 ? '+' : ''}
                {margin.toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-4">
        {CHANNELS.map((channel) => {
          const value = spend[channel.id];
          const effect = round(value * channel.effectPerM);
          const Icon = channel.icon;
          return (
            <section key={channel.id} className="glass group rounded-2xl p-6 transition duration-300 hover:border-gold-400/50 hover:shadow-gold">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/30 bg-navy-950/60">
                    <Icon className="h-6 w-6 text-gold-300" strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-slate-50">{channel.title}</h3>
                    <p className="text-sm text-slate-400">{channel.detail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Expected effect</p>
                  <p className="font-display text-xl font-extrabold text-gold-300 text-glow-gold">+{effect.toFixed(2)}%</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-300">Budget</span>
                  <span className="font-display font-bold text-slate-50">${value.toFixed(1)}M</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={channel.max}
                  step={channel.step}
                  value={value}
                  style={{ '--fill': `${(value / channel.max) * 100}%` } as CSSProperties}
                  onChange={(e) => setSpend((s) => ({ ...s, [channel.id]: Number(e.target.value) }))}
                  className="gold-range w-full"
                  aria-label={`${channel.title} budget`}
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                  <span>$0M</span>
                  <span>${channel.max}M</span>
                </div>
              </div>
            </section>
          );
        })}

        <div className="glass flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Total this allocation</p>
            <p className="font-display text-2xl font-extrabold text-slate-50">${totalSpend.toFixed(1)}M</p>
          </div>
          <button
            type="button"
            onClick={commit}
            disabled={!committable}
            className="rounded-xl bg-gradient-to-b from-gold-300 to-gold-500 px-6 py-3 text-sm font-bold text-navy-950 shadow-gold transition hover:shadow-gold-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            Commit allocation
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <section className="glass rounded-2xl p-5">
          <p className="eyebrow mb-3">Projected map</p>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-navy-950/60">
            <USMap className="absolute inset-0" fills={fills} />
          </div>
          <p className="mt-3 text-center text-sm text-slate-300">
            Harrison <span className="font-display font-bold text-sky-300">{projection.demEV}</span> &middot; Whitman{' '}
            <span className="font-display font-bold text-rose-300">{projection.repEV}</span> EV
          </p>
        </section>

        <section className="glass rounded-2xl p-5">
          <p className="eyebrow mb-4">Remaining resources</p>
          <div className="space-y-4">
            <Resource icon={Wallet} label="Money" value={`$${game.money.toFixed(1)}M`} percent={(game.money / 60) * 100} />
            <Resource icon={Zap} label="Energy" value={`${game.energy}/100`} percent={game.energy} />
            <Resource icon={UserRound} label="Staff points" value={`${game.staff}`} percent={(game.staff / 60) * 100} />
          </div>
        </section>
      </div>
    </div>
  );
}

function Resource({
  icon: Icon,
  label,
  value,
  percent,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  percent: number;
}) {
  const width = Math.min(100, Math.max(0, percent));
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-slate-300">
          <Icon className="h-4 w-4 text-gold-400" strokeWidth={1.75} />
          {label}
        </span>
        <span className="font-display font-bold text-slate-50">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-navy-950 ring-1 ring-slate-700/50">
        <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-700" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

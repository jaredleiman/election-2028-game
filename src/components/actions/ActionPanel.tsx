import { DollarSign, Megaphone, Mic, Plane, Users, type LucideIcon } from 'lucide-react';
import { ACTIONS, type ActionDef, type ActionId } from '@/data/campaign';

interface ActionPanelProps {
  onSelect: (action: ActionDef) => void;
}

const ICONS: Record<ActionId, LucideIcon> = {
  ads: Megaphone,
  visit: Plane,
  ground: Users,
  debate: Mic,
  fundraise: DollarSign,
};

export default function ActionPanel({ onSelect }: ActionPanelProps) {
  return (
    <section className="glass flex flex-col rounded-2xl p-5">
      <p className="eyebrow mb-4">Campaign actions</p>
      <div className="flex flex-col gap-2.5">
        {ACTIONS.map((action) => {
          const Icon = ICONS[action.id];
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onSelect(action)}
              className="group flex items-center gap-4 rounded-xl border border-gold-500/20 bg-gold-500/[0.04] px-4 py-3.5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-gold-400/70 hover:bg-gold-500/10 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold-500/30 bg-navy-950/60 transition group-hover:border-gold-400 group-hover:shadow-gold">
                <Icon className="h-5 w-5 text-gold-300 drop-shadow-[0_0_6px_rgba(232,197,71,0.6)]" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-sm font-extrabold tracking-wide text-slate-50">
                  {action.title.toUpperCase()}
                </span>
                <span className="block truncate text-xs text-slate-400">{action.subtitle}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

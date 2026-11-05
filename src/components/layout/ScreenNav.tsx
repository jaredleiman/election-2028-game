import { BarChart3, Crown, DollarSign, FileBarChart, Mic, Map } from 'lucide-react';
import type { ScreenId } from '@/types';

interface ScreenNavProps {
  active: ScreenId;
  onChange: (screen: ScreenId) => void;
}

const SCREENS: { id: ScreenId; label: string; icon: typeof Map }[] = [
  { id: 'map', label: 'Map', icon: Map },
  { id: 'allocate', label: 'Allocate', icon: BarChart3 },
  { id: 'debate', label: 'Debate', icon: Mic },
  { id: 'report', label: 'Week report', icon: FileBarChart },
  { id: 'fundraising', label: 'Fundraising', icon: DollarSign },
  { id: 'night', label: 'Election night', icon: Crown },
];

export default function ScreenNav({ active, onChange }: ScreenNavProps) {
  return (
    <nav
      aria-label="Screens"
      className="fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 gap-1 overflow-x-auto rounded-2xl border border-gold-500/25 bg-navy-950/85 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl"
    >
      {SCREENS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition duration-200 sm:text-sm ${
              isActive
                ? 'bg-gradient-to-b from-gold-300 to-gold-500 text-navy-950 shadow-gold'
                : 'text-slate-300 hover:bg-gold-500/10 hover:text-gold-300'
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.8} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

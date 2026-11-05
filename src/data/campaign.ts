import type { Investment, LogTone } from '@/types';

export interface Candidate {
  name: string;
  role: string;
  party: 'dem' | 'rep';
  initial: string;
  accent: string;
}

export const HARRISON: Candidate = {
  name: 'HARRISON',
  role: 'Democratic Nominee',
  party: 'dem',
  initial: 'H',
  accent: 'from-sky-400 to-blue-700',
};

export const WHITMAN: Candidate = {
  name: 'WHITMAN',
  role: 'Republican Nominee',
  party: 'rep',
  initial: 'W',
  accent: 'from-rose-400 to-red-700',
};

export type ActionId = 'ads' | 'visit' | 'ground' | 'debate' | 'fundraise';

export interface ActionDef {
  id: ActionId;
  title: string;
  subtitle: string;
  targeted: boolean;
  investment: Omit<Investment, 'target'>;
}

export const ACTIONS: ActionDef[] = [
  {
    id: 'ads',
    title: 'Ads',
    subtitle: 'Create and deploy an ad campaign',
    targeted: true,
    investment: { label: 'Local TV ad buy', moneyDelta: -3.2, energyDelta: -4, staffDelta: -2, shift: 0.8, tone: 'blue' },
  },
  {
    id: 'visit',
    title: 'Visit',
    subtitle: 'Candidate visit and rally',
    targeted: true,
    investment: { label: 'Candidate rally', moneyDelta: -0.9, energyDelta: -10, staffDelta: -1, shift: 0.6, tone: 'gold' },
  },
  {
    id: 'ground',
    title: 'Ground Game',
    subtitle: 'Field offices and organizing',
    targeted: true,
    investment: { label: 'Field organizing', moneyDelta: -1.8, energyDelta: -6, staffDelta: -6, shift: 0.7, tone: 'green' },
  },
  {
    id: 'debate',
    title: 'Debate Prep',
    subtitle: 'Policy briefings and rehearsal',
    targeted: false,
    investment: { label: 'Debate preparation', moneyDelta: -0.5, energyDelta: -12, staffDelta: -2, shift: 0.3, tone: 'gold' },
  },
  {
    id: 'fundraise',
    title: 'Fundraise',
    subtitle: 'Donor events and calls',
    targeted: false,
    investment: { label: 'Donor fundraising swing', moneyDelta: 6.5, energyDelta: -8, staffDelta: 0, shift: 0, tone: 'green' },
  },
];

export const TONE_CLASS: Record<LogTone, string> = {
  gold: 'text-gold-300',
  blue: 'text-sky-400',
  red: 'text-rose-400',
  green: 'text-emerald-400',
  muted: 'text-slate-400',
};

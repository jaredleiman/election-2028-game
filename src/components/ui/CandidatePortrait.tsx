import type { Candidate } from '@/data/campaign';

interface CandidatePortraitProps {
  candidate: Candidate;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE = {
  sm: 'h-10 w-10 text-base',
  md: 'h-16 w-16 text-2xl',
  lg: 'h-24 w-24 text-4xl',
  xl: 'h-40 w-40 text-6xl',
};

export default function CandidatePortrait({ candidate, size = 'md' }: CandidatePortraitProps) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${candidate.accent} ${SIZE[size]} font-display font-extrabold text-white ring-2 ring-gold-400/80 shadow-[0_0_24px_rgba(232,197,71,0.25)]`}
      aria-label={`${candidate.name} portrait placeholder`}
    >
      <span className="drop-shadow-md">{candidate.initial}</span>
      <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 to-transparent" />
    </div>
  );
}

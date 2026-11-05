import { STATE_PATHS } from '@/data/statePaths';
import { STATES } from '@/data/states';

interface USMapProps {
  fills: Record<string, string>;
  glowing?: Set<string>;
  selected?: string | null;
  onSelect?: (code: string) => void;
  className?: string;
  label?: string;
}

const NAMES = Object.fromEntries(STATES.map((s) => [s.code, s.name]));

export default function USMap({ fills, glowing, selected, onSelect, className = '', label }: USMapProps) {
  const interactive = Boolean(onSelect);
  return (
    <svg
      viewBox="-60 5 1010 595"
      role="img"
      aria-label={label ?? 'Map of the United States'}
      className={`h-full w-full ${className}`}
    >
      <defs>
        <filter id="gold-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g>
        {Object.entries(STATE_PATHS).map(([code, d]) => {
          const isSelected = selected === code;
          const isGlowing = glowing?.has(code);
          return (
            <path
              key={code}
              d={d}
              fill={fills[code] ?? '#334155'}
              stroke={isSelected ? '#93c5fd' : isGlowing ? '#e8c547' : '#0b1322'}
              strokeWidth={isSelected ? 3 : isGlowing ? 2 : 1}
              strokeLinejoin="round"
              filter={isGlowing ? 'url(#gold-glow)' : undefined}
              className={`state-path ${interactive ? 'cursor-pointer' : ''} ${isSelected ? 'state-selected' : ''}`}
              onClick={interactive ? () => onSelect?.(code) : undefined}
              onKeyDown={
                interactive
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') onSelect?.(code);
                    }
                  : undefined
              }
              tabIndex={interactive ? 0 : -1}
              role={interactive ? 'button' : undefined}
              aria-label={interactive ? NAMES[code] : undefined}
            >
              <title>{NAMES[code]}</title>
            </path>
          );
        })}
      </g>
    </svg>
  );
}

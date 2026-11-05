export interface ChartSeries {
  label: string;
  color: string;
  values: number[];
}

interface LineChartProps {
  series: ChartSeries[];
  labels: string[];
  height?: number;
  unit?: string;
}

const W = 400;

export default function LineChart({ series, labels, height = 180, unit = '%' }: LineChartProps) {
  const all = series.flatMap((s) => s.values);
  const min = Math.floor(Math.min(...all) - 1);
  const max = Math.ceil(Math.max(...all) + 1);
  const span = max - min || 1;
  const count = labels.length;
  const xOf = (i: number) => (count <= 1 ? W / 2 : (i / (count - 1)) * W);
  const yOf = (v: number) => height - ((v - min) / span) * height;
  const ticks = [max, Math.round((max + min) / 2), min];

  return (
    <div className="relative w-full select-none">
      <div className="flex">
        <div className="flex w-10 flex-col justify-between pr-2 text-right text-[10px] text-slate-500" style={{ height }}>
          {ticks.map((t) => (
            <span key={t}>
              {t}
              {unit}
            </span>
          ))}
        </div>
        <div className="relative flex-1" style={{ height }}>
          <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            {ticks.map((t) => (
              <line key={t} x1={0} x2={W} y1={yOf(t)} y2={yOf(t)} stroke="rgba(148,163,184,0.12)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            ))}
            {series.map((s) => {
              const points = s.values.map((v, i) => `${xOf(i)},${yOf(v)}`).join(' ');
              return (
                <polyline
                  key={s.label}
                  points={points}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ filter: `drop-shadow(0 0 4px ${s.color})` }}
                />
              );
            })}
          </svg>
          {series.map((s) => {
            const last = s.values[s.values.length - 1];
            return (
              <div
                key={`${s.label}-dot`}
                className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-navy-950"
                style={{ left: '100%', top: yOf(last), background: s.color }}
              />
            );
          })}
        </div>
      </div>
      <div className="ml-10 mt-2 flex justify-between text-[10px] text-slate-500">
        {labels.map((l, i) => (
          <span key={`${l}-${i}`}>{l}</span>
        ))}
      </div>
    </div>
  );
}

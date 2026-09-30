import { useId } from 'react';

/**
 * Hand-rolled SVG charts.
 *
 * A charting library would add ~100 kB gzipped for three simple plots on an app whose
 * users are frequently on metered mobile data in Pakistan. These are small enough to own.
 *
 * Accessibility: each chart is `role="img"` with a full text `aria-label` describing the
 * data, and every chart is accompanied by the same numbers in text elsewhere on the page —
 * a screen-reader user never depends on the graphic. Colours meet 1.4.11 (3:1).
 * Plots stay LTR via `.chart-plot` because mirroring an axis in RTL misreads the data.
 */

export interface DistributionBucket {
  label: string;
  count: number;
  color: string;
}

export function DistributionChart({ buckets, ariaLabel }: { buckets: DistributionBucket[]; ariaLabel: string }) {
  const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0);
  const max = Math.max(1, ...buckets.map((bucket) => bucket.count));
  const barWidth = 100 / buckets.length;

  return (
    <div className="stack" style={{ gap: 'var(--sp-3)' }}>
      <svg
        className="chart-plot"
        viewBox="0 0 100 48"
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel}
        style={{ inlineSize: '100%', blockSize: 150 }}
      >
        {buckets.map((bucket, index) => {
          const height = (bucket.count / max) * 40;
          return (
            <rect
              key={bucket.label}
              x={index * barWidth + barWidth * 0.18}
              y={44 - height}
              width={barWidth * 0.64}
              height={Math.max(height, bucket.count > 0 ? 1 : 0)}
              fill={bucket.color}
              rx="0.8"
            />
          );
        })}
        <line x1="0" y1="44" x2="100" y2="44" stroke="var(--line-300)" strokeWidth="0.4" />
      </svg>
      <ul style={{ display: 'grid', gap: 'var(--sp-1)', margin: 0, padding: 0, listStyle: 'none' }}>
        {buckets.map((bucket) => (
          <li key={bucket.label} className="row small" style={{ gap: 'var(--sp-2)' }}>
            <span
              aria-hidden="true"
              style={{
                inlineSize: 10,
                blockSize: 10,
                borderRadius: 3,
                background: bucket.color,
                flex: 'none',
              }}
            />
            <span style={{ flex: 1 }}>{bucket.label}</span>
            <b className="mono">{bucket.count}</b>
            <span className="muted" style={{ minInlineSize: '3.5ch', textAlign: 'end' }}>
              {total ? Math.round((bucket.count / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface TrendPoint {
  label: string;
  value: number; // 0..1
}

export function TrendChart({ points, ariaLabel }: { points: TrendPoint[]; ariaLabel: string }) {
  const gradientId = useId();
  if (points.length < 2) return null;

  const stepX = 100 / (points.length - 1);
  const toY = (value: number) => 44 - Math.max(0, Math.min(1, value)) * 40;
  const line = points.map((point, index) => `${index * stepX},${toY(point.value)}`).join(' ');
  const area = `0,44 ${line} 100,44`;

  return (
    <div className="stack" style={{ gap: 'var(--sp-2)' }}>
      <svg
        className="chart-plot"
        viewBox="0 0 100 48"
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel}
        style={{ inlineSize: '100%', blockSize: 150 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-500)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((fraction) => (
          <line
            key={fraction}
            x1="0"
            y1={toY(fraction)}
            x2="100"
            y2={toY(fraction)}
            stroke="var(--line-200)"
            strokeWidth="0.3"
          />
        ))}
        <polygon points={area} fill={`url(#${gradientId})`} />
        <polyline
          points={line}
          fill="none"
          stroke="var(--brand-500)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
        <line x1="0" y1="44" x2="100" y2="44" stroke="var(--line-300)" strokeWidth="0.4" />
      </svg>
      <div className="row small muted" style={{ justifyContent: 'space-between' }}>
        <span>{points[0].label}</span>
        <span>{points[points.length - 1].label}</span>
      </div>
    </div>
  );
}

export function DonutChart({
  value,
  total,
  label,
  ariaLabel,
}: {
  value: number;
  total: number;
  label: string;
  ariaLabel: string;
}) {
  const safeTotal = Math.max(total, 1);
  const fraction = Math.max(0, Math.min(1, value / safeTotal));
  const radius = 16;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="row" style={{ gap: 'var(--sp-4)' }}>
      <svg viewBox="0 0 40 40" role="img" aria-label={ariaLabel} style={{ inlineSize: 88, blockSize: 88, flex: 'none' }}>
        <circle cx="20" cy="20" r={radius} fill="none" stroke="var(--line-200)" strokeWidth="6" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="var(--brand-500)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${circumference * fraction} ${circumference}`}
          transform="rotate(-90 20 20)"
        />
      </svg>
      <div className="stat">
        <b>
          {value}
          <span className="muted" style={{ fontSize: '1rem', fontWeight: 500 }}>
            /{total}
          </span>
        </b>
        <span className="small muted">{label}</span>
      </div>
    </div>
  );
}

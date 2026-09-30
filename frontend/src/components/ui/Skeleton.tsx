/**
 * Loading placeholders shaped like the content they replace, so the layout does not jump
 * when real data lands (which is also what keeps CLS down on slow connections).
 * Always paired with `aria-busy` on the container by `AsyncState`.
 */
export function Skeleton({ lines = 3, height = 16 }: { lines?: number; height?: number }) {
  return (
    <div className="stack" aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className="skeleton"
          style={{ height, width: index === lines - 1 ? '62%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-3" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="card">
          <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 30, width: '65%' }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonRows({ count = 4 }: { count?: number }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="item-row">
          <div className="skeleton" style={{ height: 38, width: 38, flex: 'none' }} />
          <div className="item-main">
            <div className="skeleton" style={{ height: 14, width: '55%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 10, width: '30%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

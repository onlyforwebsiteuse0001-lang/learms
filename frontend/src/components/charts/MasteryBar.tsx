import { useI18n } from '../../i18n';
import type { MessageKey } from '../../i18n';

/** Five bands. The numeric label is always rendered, so colour is never the only signal. */
export function masteryLevel(pKnow: number): 0 | 1 | 2 | 3 | 4 {
  if (pKnow < 0.2) return 0;
  if (pKnow < 0.4) return 1;
  if (pKnow < 0.6) return 2;
  if (pKnow < 0.8) return 3;
  return 4;
}

export const MASTERY_LABEL: Record<number, MessageKey> = {
  0: 'mastery.level0',
  1: 'mastery.level1',
  2: 'mastery.level2',
  3: 'mastery.level3',
  4: 'mastery.level4',
};

export function masteryColor(pKnow: number): string {
  return `var(--mastery-${masteryLevel(pKnow)})`;
}

interface MasteryBarProps {
  value: number; // 0..1
  label: string;
  sublabel?: string;
  onSelect?: () => void;
  selected?: boolean;
}

export function MasteryBar({ value, label, sublabel, onSelect, selected }: MasteryBarProps) {
  const { t } = useI18n();
  const percent = Math.round(Math.max(0, Math.min(1, value)) * 100);
  const level = masteryLevel(value);
  const levelText = t(MASTERY_LABEL[level]);

  const body = (
    <>
      <div className="row" style={{ gap: 'var(--sp-2)', alignItems: 'baseline' }}>
        <b style={{ flex: 1, minInlineSize: 0, overflowWrap: 'anywhere' }}>{label}</b>
        <span className="mono" style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
          {percent}%
        </span>
      </div>
      <div
        className="progress-track"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}% — ${levelText}`}
        aria-label={label}
      >
        <div
          className="progress-fill"
          style={{ inlineSize: `${percent}%`, background: masteryColor(value) }}
        />
      </div>
      <p className="small muted">
        {levelText}
        {sublabel ? ` · ${sublabel}` : ''}
      </p>
    </>
  );

  if (!onSelect) {
    return <div className="stack" style={{ gap: 'var(--sp-1)' }}>{body}</div>;
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="stack"
      style={{
        gap: 'var(--sp-1)',
        textAlign: 'start',
        background: selected ? 'var(--brand-050)' : 'transparent',
        border: `1px solid ${selected ? 'var(--brand-500)' : 'var(--line-200)'}`,
        borderRadius: 'var(--radius)',
        padding: 'var(--sp-3)',
        font: 'inherit',
        cursor: 'pointer',
        inlineSize: '100%',
      }}
    >
      {body}
    </button>
  );
}

import { useI18n } from '../../i18n';

interface ProgressBarProps {
  /** 0–100, or null when the real value is genuinely unknown. */
  value: number | null;
  label: string;
  showValue?: boolean;
}

/**
 * `value === null` renders an INDETERMINATE bar.
 *
 * That distinction is the whole point: when `XMLHttpRequest` reports
 * `lengthComputable === false` we do not know the percentage, and animating a made-up
 * number towards 88% (as the original scaffold did) is a fabricated output. An
 * indeterminate bar tells the truth — "working, amount unknown".
 */
export function ProgressBar({ value, label, showValue = true }: ProgressBarProps) {
  const { t } = useI18n();
  const clamped = value === null ? null : Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className="stack" style={{ gap: 'var(--sp-2)' }}>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        {...(clamped === null
          ? {}
          : { 'aria-valuenow': clamped, 'aria-valuetext': t('common.percent', { value: clamped }) })}
      >
        <div
          className={`progress-fill${clamped === null ? ' progress-indeterminate' : ''}`}
          style={clamped === null ? undefined : { inlineSize: `${clamped}%` }}
        />
      </div>
      {showValue && (
        <p className="small muted">
          {label}
          {clamped !== null ? ` · ${t('common.percent', { value: clamped })}` : ''}
        </p>
      )}
    </div>
  );
}

import { useI18n } from '../../i18n';
import type { MessageKey } from '../../i18n';
import type { DocumentStatus } from '../../api/types';

const TONE: Record<DocumentStatus, string> = {
  queued: 'badge-neutral',
  processing: 'badge-info',
  success: 'badge-ok',
  failed: 'badge-err',
};

const LABEL: Record<DocumentStatus, MessageKey> = {
  queued: 'docs.status.queued',
  processing: 'docs.status.processing',
  success: 'docs.status.success',
  failed: 'docs.status.failed',
};

/**
 * Status is carried by TEXT plus colour, never colour alone (WCAG 1.4.1 Use of Colour).
 * Unknown statuses fall through to a neutral pill showing the raw value rather than being
 * silently dropped — if the backend adds a state, we want to see it, not hide it.
 */
export function StatusBadge({ status }: { status: DocumentStatus | string }) {
  const { t } = useI18n();
  const known = status in TONE ? (status as DocumentStatus) : null;

  if (!known) return <span className="badge badge-neutral">{status}</span>;
  return <span className={`badge ${TONE[known]}`}>{t(LABEL[known])}</span>;
}

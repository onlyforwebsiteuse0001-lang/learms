import type { ReactNode } from 'react';

/**
 * Every route renders exactly one of these, giving a consistent h1-per-page structure
 * (WCAG 2.4.6 Headings and Labels / 2.4.2 Page Titled at the view level).
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-head">
      <div className="row row-wrap" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minInlineSize: '16rem' }}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="row row-wrap">{actions}</div>}
      </div>
    </div>
  );
}

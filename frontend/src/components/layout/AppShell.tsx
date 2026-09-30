import { useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n';
import type { MessageKey } from '../../i18n';
import { useAuthStore } from '../../store/auth';
import { useUiStore } from '../../store/ui';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavItem {
  to: string;
  labelKey: MessageKey;
  icon: string;
  /** Shown in the mobile tab bar (space for five). */
  primary?: boolean;
}

const NAV_GROUPS: Array<{ titleKey: MessageKey; items: NavItem[] }> = [
  {
    titleKey: 'nav.learn',
    items: [
      { to: '/', labelKey: 'nav.dashboard', icon: '◉', primary: true },
      { to: '/path', labelKey: 'nav.path', icon: '→', primary: true },
      { to: '/mastery', labelKey: 'nav.mastery', icon: '▤' },
      { to: '/analytics', labelKey: 'nav.analytics', icon: '◫' },
    ],
  },
  {
    titleKey: 'nav.material',
    items: [
      { to: '/upload', labelKey: 'nav.upload', icon: '↑', primary: true },
      { to: '/documents', labelKey: 'nav.documents', icon: '▤' },
      { to: '/concepts', labelKey: 'nav.concepts', icon: '◈' },
      { to: '/library', labelKey: 'nav.library', icon: '▦', primary: true },
    ],
  },
  {
    titleKey: 'nav.practice',
    items: [
      { to: '/diagnostic', labelKey: 'nav.diagnostic', icon: '◎', primary: true },
      { to: '/quiz', labelKey: 'nav.quiz', icon: '?' },
      { to: '/tutor', labelKey: 'nav.tutor', icon: '☺' },
      { to: '/explain', labelKey: 'nav.explain', icon: '✎' },
      { to: '/planner', labelKey: 'nav.planner', icon: '▥' },
      { to: '/catchup', labelKey: 'nav.catchup', icon: '⟳' },
      { to: '/exam', labelKey: 'nav.exam', icon: '⧗' },
    ],
  },
];

const TAB_ITEMS = NAV_GROUPS.flatMap((group) => group.items).filter((item) => item.primary);

export function AppShell() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const name = useAuthStore((state) => state.name);
  const online = useUiStore((state) => state.online);
  const pushToast = useUiStore((state) => state.pushToast);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const demoMode = String(import.meta.env.VITE_DEMO_MODE ?? 'false') === 'true';

  // A client-side route change does not move focus or re-announce the page, so a screen
  // reader user would stay silently parked in the nav. Moving focus to the route heading
  // restores the behaviour a full page load would have given (WCAG 2.4.3 Focus Order).
  useEffect(() => {
    headingRef.current?.focus();
  }, [location.pathname]);

  const signOut = () => {
    logout('user');
    pushToast('info', t('auth.signedOut'));
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      <a className="skip-link" href="#main-content">
        {t('app.skipToContent')}
      </a>

      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            ح
          </span>
          <span className="brand-text">
            <span>{t('app.name')}</span>
            <small>{t('app.tagline')}</small>
          </span>
        </NavLink>
        <div className="spacer" />
        <LanguageSwitcher />
        {name && (
          <span className="small muted" style={{ display: 'none' }} data-testid="student-name">
            {name}
          </span>
        )}
        <button type="button" className="btn btn-ghost btn-sm" onClick={signOut}>
          {t('nav.signOut')}
        </button>
      </header>

      <nav className="sidebar" aria-label={t('app.primaryNav')}>
        {NAV_GROUPS.map((group) => (
          <div className="sidebar-group" key={group.titleKey}>
            <h2>{t(group.titleKey)}</h2>
            {group.items.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className="nav-link">
                <span aria-hidden="true">{item.icon}</span>
                <span>{t(item.labelKey)}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <main id="main-content" className="main" aria-label={t('app.mainLandmark')}>
        {demoMode && (
          <p className="demo-banner" role="note">
            {t('state.demoBanner')}
          </p>
        )}
        {/* 4.1.3 Status Messages — connectivity change is announced, not just coloured. */}
        {!online && (
          <p className="offline-banner" role="status" aria-live="polite">
            {t('state.offline')}
          </p>
        )}
        {/* Focus target for route changes; -1 keeps it out of the tab sequence. */}
        <h1 ref={headingRef} tabIndex={-1} className="visually-hidden">
          {t('app.name')}
        </h1>
        <Outlet />
      </main>

      <nav className="tabbar" aria-label={t('app.primaryNav')}>
        {TAB_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}>
            <span aria-hidden="true">{item.icon}</span>
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

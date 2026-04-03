import { Link } from 'react-router-dom';

interface TopBarProps {
  activeSection: 'briefing' | 'claude';
  defaultContentPath: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function TopBar({ activeSection, defaultContentPath, onToggleTheme, theme }: TopBarProps) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

  return (
    <nav className="topbar">
      <span className="topbar-logo">AGENTS_BRIEFING</span>
      <span className="topbar-sep topbar-hide-m">//</span>
      <span className="topbar-hide-m">v1.0</span>
      <span className="topbar-sep topbar-hide-m">|</span>
      <span className="topbar-hide-m">SYS.DATE: {dateStr}</span>

      <div className="topbar-switch">
        <Link
          className={`topbar-link${activeSection === 'briefing' ? ' active' : ''}`}
          to={defaultContentPath}
        >
          BRIEFING
        </Link>
        <Link
          className={`topbar-link${activeSection === 'claude' ? ' active' : ''}`}
          to="/claude"
        >
          CLAUDE
        </Link>
      </div>

      <div className="topbar-right">
        <button className="theme-toggle" onClick={onToggleTheme}>
          {theme === 'dark' ? 'LIGHT_MODE' : 'DARK_MODE'}
        </button>
        <div className="topbar-status">
          <span className="status-dot" />
          <span>ONLINE</span>
        </div>
      </div>
    </nav>
  );
}

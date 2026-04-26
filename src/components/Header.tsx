import { Link } from 'react-router-dom';
import type { BreadcrumbItem } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  breadcrumbs?: BreadcrumbItem[];
}

export function Header({ theme, onToggleTheme, breadcrumbs = [] }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          Lingua
          {/* <span>-VivekG</span> */}
          <span>LANG LEARN</span>
        </Link>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀' : '◑'}
        </button>
      </div>
      {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
    </header>
  );
}

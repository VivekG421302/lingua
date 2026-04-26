import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Language, BreadcrumbItem } from '../types';
import { getLanguages } from '../api';
import { Header } from '../components/Header';

interface HomePageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function HomePage({ theme, onToggleTheme }: HomePageProps) {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

  useEffect(() => {
    getLanguages()
      .then(setLanguages)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-layout">
      <Header theme={theme} onToggleTheme={onToggleTheme} breadcrumbs={breadcrumbs} />
      <main className="page-content">
        <div className="page-header">
          <p className="page-header-meta">Your Library</p>
          <h1>Languages</h1>
          <p className="page-header-desc">
            Select a language to explore its chapters and lessons, or add a new one to your library.
          </p>
        </div>

        <div className="section-heading">
          <h3>{languages.length} language{languages.length !== 1 ? 's' : ''}</h3>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/add-language')}>
            + Add Language
          </button>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : languages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🌐</div>
            <p>No languages yet. Add your first one!</p>
          </div>
        ) : (
          <div className="card-grid">
            {languages.map(lang => (
              <div
                key={lang.id}
                className="card"
                onClick={() => navigate(`/languages/${lang.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(`/languages/${lang.id}`)}
              >
                <div className="card-label">{lang.type}</div>
                <div className="card-title">{lang.name}</div>
                <div className="card-subtitle">{lang.country}{lang.state ? `, ${lang.state}` : ''}</div>
                <span className="card-arrow">→</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

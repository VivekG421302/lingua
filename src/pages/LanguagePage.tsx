import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Language, Chapter, BreadcrumbItem } from '../types';
import { getLanguage, getChaptersByLanguage } from '../api';
import { Header } from '../components/Header';

interface LanguagePageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function LanguagePage({ theme, onToggleTheme }: LanguagePageProps) {
  const { languageId } = useParams<{ languageId: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: language?.name ?? '…', path: `/languages/${languageId}` },
  ];

  useEffect(() => {
    if (!languageId) return;
    Promise.all([getLanguage(languageId), getChaptersByLanguage(languageId)])
      .then(([lang, chs]) => { setLanguage(lang); setChapters(chs); })
      .finally(() => setLoading(false));
  }, [languageId]);

  return (
    <div className="app-layout">
      <Header theme={theme} onToggleTheme={onToggleTheme} breadcrumbs={breadcrumbs} />
      <main className="page-content">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <>
            <div className="page-header">
              <p className="page-header-meta">{language?.type} · {language?.country}</p>
              <h2>{language?.name}</h2>
              <p className="page-header-desc">Browse chapters or add new ones.</p>
            </div>

            <div className="section-heading">
              <h3>{chapters.length} chapter{chapters.length !== 1 ? 's' : ''}</h3>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(`/languages/${languageId}/add-chapter`)}
              >
                + Add Chapter
              </button>
            </div>

            {chapters.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📖</div>
                <p>No chapters yet. Create the first one!</p>
              </div>
            ) : (
              <div className="card-grid">
                {chapters.map((ch, i) => (
                  <div
                    key={ch.id}
                    className="card"
                    onClick={() => navigate(`/languages/${languageId}/chapters/${ch.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && navigate(`/languages/${languageId}/chapters/${ch.id}`)}
                  >
                    <div className="card-label">Chapter {i + 1}</div>
                    <div className="card-title">{ch.title}</div>
                    <div className="card-subtitle">{ch.description}</div>
                    <span className="card-arrow">→</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

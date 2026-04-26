import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Language, Chapter, Lesson, BreadcrumbItem } from '../types';
import { getLanguage, getChapter, getLessonsByChapter } from '../api';
import { Header } from '../components/Header';

interface ChapterPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function ChapterPage({ theme, onToggleTheme }: ChapterPageProps) {
  const { languageId, chapterId } = useParams<{ languageId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: language?.name ?? '…', path: `/languages/${languageId}` },
    { label: chapter?.title ?? '…', path: `/languages/${languageId}/chapters/${chapterId}` },
  ];

  useEffect(() => {
    if (!languageId || !chapterId) return;
    Promise.all([getLanguage(languageId), getChapter(chapterId), getLessonsByChapter(chapterId)])
      .then(([lang, ch, ls]) => { setLanguage(lang); setChapter(ch); setLessons(ls); })
      .finally(() => setLoading(false));
  }, [languageId, chapterId]);

  return (
    <div className="app-layout">
      <Header theme={theme} onToggleTheme={onToggleTheme} breadcrumbs={breadcrumbs} />
      <main className="page-content">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <>
            <div className="page-header">
              <p className="page-header-meta">{language?.name} · Chapter</p>
              <h2>{chapter?.title}</h2>
              {chapter?.description && <p className="page-header-desc">{chapter.description}</p>}
            </div>

            <div className="section-heading">
              <h3>{lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</h3>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(`/languages/${languageId}/chapters/${chapterId}/add-lesson`)}
              >
                + Add Lesson
              </button>
            </div>

            {lessons.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <p>No lessons yet. Create the first one!</p>
              </div>
            ) : (
              <div className="card-grid">
                {lessons.map((ls, i) => (
                  <div
                    key={ls.id}
                    className="card"
                    onClick={() => navigate(`/languages/${languageId}/chapters/${chapterId}/lessons/${ls.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && navigate(`/languages/${languageId}/chapters/${chapterId}/lessons/${ls.id}`)}
                  >
                    <div className="card-label">Lesson {i + 1}</div>
                    <div className="card-title">{ls.title}</div>
                    <div className="card-subtitle">{ls.description}</div>
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

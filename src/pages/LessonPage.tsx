import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Language, Chapter, Lesson, Sentence, BreadcrumbItem } from '../types';
import { getLanguage, getChapter, getLesson, getSentencesByLesson } from '../api';
import { Header } from '../components/Header';

interface LessonPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function LessonPage({ theme, onToggleTheme }: LessonPageProps) {
  const { languageId, chapterId, lessonId } = useParams<{
    languageId: string; chapterId: string; lessonId: string;
  }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: language?.name ?? '…', path: `/languages/${languageId}` },
    { label: chapter?.title ?? '…', path: `/languages/${languageId}/chapters/${chapterId}` },
    { label: lesson?.title ?? '…', path: `/languages/${languageId}/chapters/${chapterId}/lessons/${lessonId}` },
  ];

  useEffect(() => {
    if (!languageId || !chapterId || !lessonId) return;
    Promise.all([
      getLanguage(languageId),
      getChapter(chapterId),
      getLesson(lessonId),
      getSentencesByLesson(lessonId),
    ])
      .then(([lang, ch, ls, sents]) => {
        setLanguage(lang); setChapter(ch); setLesson(ls); setSentences(sents);
      })
      .finally(() => setLoading(false));
  }, [languageId, chapterId, lessonId]);

  const addSentencePath = `/languages/${languageId}/chapters/${chapterId}/lessons/${lessonId}/add-sentence`;

  return (
    <div className="app-layout">
      <Header theme={theme} onToggleTheme={onToggleTheme} breadcrumbs={breadcrumbs} />
      <main className="page-content">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <>
            <div className="page-header">
              <p className="page-header-meta">{language?.name} · {chapter?.title}</p>
              <h2>{lesson?.title}</h2>
              {lesson?.description && <p className="page-header-desc">{lesson.description}</p>}
            </div>

            <div className="section-heading">
              <h3>{sentences.length} sentence{sentences.length !== 1 ? 's' : ''}</h3>
              <button className="btn btn-primary btn-sm" onClick={() => navigate(addSentencePath)}>
                + Add Sentence
              </button>
            </div>

            {sentences.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">💬</div>
                <p>No sentences yet. Start adding some!</p>
              </div>
            ) : (
              <div style={{ marginTop: '0.5rem' }}>
                {sentences.map((s, i) => (
                  <div
                    key={s.id}
                    className="sentence-card"
                    onClick={() =>
                      navigate(`/languages/${languageId}/chapters/${chapterId}/lessons/${lessonId}/sentences/${s.id}`)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={e =>
                      e.key === 'Enter' &&
                      navigate(`/languages/${languageId}/chapters/${chapterId}/lessons/${lessonId}/sentences/${s.id}`)
                    }
                  >
                    <span className="sentence-card-text">{s.englishSentence}</span>
                    <span className="sentence-card-index">
                      {s.audioData ? '🎤' : ''} {i + 1}
                    </span>
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

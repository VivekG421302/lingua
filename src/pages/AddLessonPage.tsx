import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Language, Chapter, BreadcrumbItem } from '../types';
import { getLanguage, getChapter, createLesson } from '../api';
import { Header } from '../components/Header';

interface AddLessonPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function AddLessonPage({ theme, onToggleTheme }: AddLessonPageProps) {
  const { languageId, chapterId } = useParams<{ languageId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '' });

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: language?.name ?? '…', path: `/languages/${languageId}` },
    { label: chapter?.title ?? '…', path: `/languages/${languageId}/chapters/${chapterId}` },
    { label: 'Add Lesson', path: '#' },
  ];

  useEffect(() => {
    if (!languageId || !chapterId) return;
    Promise.all([getLanguage(languageId), getChapter(chapterId)]).then(([lang, ch]) => {
      setLanguage(lang);
      setChapter(ch);
    });
  }, [languageId, chapterId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !chapterId) return;
    setSubmitting(true);
    try {
      const ls = await createLesson({ ...form, chapterId });
      setCreatedId(ls.id);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Header theme={theme} onToggleTheme={onToggleTheme} breadcrumbs={breadcrumbs} />
      <main className="page-content">
        <div className="page-header">
          <p className="page-header-meta">Creator Flow · Step 3{chapter ? ` · ${chapter.title}` : ''}</p>
          <h2>Add a Lesson</h2>
        </div>

        {!createdId ? (
          <form className="form-card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Lesson Title *</label>
              <input
                id="title"
                name="title"
                className="form-input"
                placeholder="e.g. Hello & Goodbye"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                placeholder="What will learners practice in this lesson?"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div className="btn-group">
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save Lesson'}
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => navigate(`/languages/${languageId}/chapters/${chapterId}`)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="form-card">
            <div className="success-banner">✓ Lesson saved successfully!</div>
            <div className="btn-group">
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/languages/${languageId}/chapters/${chapterId}/lessons/${createdId}/add-sentence`)}
              >
                Continue → Add Sentences
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => navigate(`/languages/${languageId}/chapters/${chapterId}`)}
              >
                Back to Chapter
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

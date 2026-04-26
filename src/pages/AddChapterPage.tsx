import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Language, BreadcrumbItem } from '../types';
import { getLanguage, createChapter } from '../api';
import { Header } from '../components/Header';

interface AddChapterPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function AddChapterPage({ theme, onToggleTheme }: AddChapterPageProps) {
  const { languageId } = useParams<{ languageId: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '' });

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: language?.name ?? '…', path: `/languages/${languageId}` },
    { label: 'Add Chapter', path: '#' },
  ];

  useEffect(() => {
    if (languageId) getLanguage(languageId).then(setLanguage);
  }, [languageId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !languageId) return;
    setSubmitting(true);
    try {
      const ch = await createChapter({ ...form, languageId });
      setCreatedId(ch.id);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Header theme={theme} onToggleTheme={onToggleTheme} breadcrumbs={breadcrumbs} />
      <main className="page-content">
        <div className="page-header">
          <p className="page-header-meta">Creator Flow · Step 2{language ? ` · ${language.name}` : ''}</p>
          <h2>Add a Chapter</h2>
        </div>

        {!createdId ? (
          <form className="form-card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Chapter Title *</label>
              <input
                id="title"
                name="title"
                className="form-input"
                placeholder="e.g. Greetings & Introductions"
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
                placeholder="What will learners cover in this chapter?"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div className="btn-group">
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save Chapter'}
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => navigate(`/languages/${languageId}`)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="form-card">
            <div className="success-banner">✓ Chapter saved successfully!</div>
            <div className="btn-group">
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/languages/${languageId}/chapters/${createdId}/add-lesson`)}
              >
                Continue → Add Lesson
              </button>
              <button className="btn btn-ghost" onClick={() => navigate(`/languages/${languageId}`)}>
                Back to Language
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

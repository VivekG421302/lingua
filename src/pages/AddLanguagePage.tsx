import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BreadcrumbItem } from '../types';
import { createLanguage } from '../api';
import { Header } from '../components/Header';

interface AddLanguagePageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function AddLanguagePage({ theme, onToggleTheme }: AddLanguagePageProps) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', type: '', country: '', state: '' });

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Add Language', path: '/add-language' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const lang = await createLanguage(form);
      setCreatedId(lang.id);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Header theme={theme} onToggleTheme={onToggleTheme} breadcrumbs={breadcrumbs} />
      <main className="page-content">
        <div className="page-header">
          <p className="page-header-meta">Creator Flow · Step 1</p>
          <h2>Add a Language</h2>
        </div>

        {!createdId ? (
          <form className="form-card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Language Name *</label>
              <input
                id="name"
                name="name"
                className="form-input"
                placeholder="e.g. Japanese"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="type">Language Family / Type</label>
              <input
                id="type"
                name="type"
                className="form-input"
                placeholder="e.g. East Asian, Romance, Germanic"
                value={form.type}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="country">Country</label>
              <input
                id="country"
                name="country"
                className="form-input"
                placeholder="e.g. Japan"
                value={form.country}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="state">State / Region (optional)</label>
              <input
                id="state"
                name="state"
                className="form-input"
                placeholder="e.g. Kansai dialect"
                value={form.state}
                onChange={handleChange}
              />
            </div>
            <div className="btn-group" style={{ marginTop: '1rem' }}>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save Language'}
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => navigate('/')}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="form-card">
            <div className="success-banner">✓ Language saved successfully!</div>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>What would you like to do next?</p>
            <div className="btn-group">
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/languages/${createdId}/add-chapter`)}
              >
                Continue → Add Chapter
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/')}>
                Go to Home
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

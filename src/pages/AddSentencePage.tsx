import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Language, Chapter, Lesson, BreadcrumbItem } from '../types';
import { getLanguage, getChapter, getLesson, createSentence } from '../api';
import { Header } from '../components/Header';
import { AudioRecorder } from '../components/AudioRecorder';

interface AddSentencePageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function AddSentencePage({ theme, onToggleTheme }: AddSentencePageProps) {
  const { languageId, chapterId, lessonId } = useParams<{
    languageId: string; chapterId: string; lessonId: string;
  }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [audioBase64, setAudioBase64] = useState('');
  // const [recorderKey, setRecorderKey] = useState(0);
  const [form, setForm] = useState({ englishSentence: '', translatedSentence: '' });
  const englishRef = useRef<HTMLInputElement>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: language?.name ?? '…', path: `/languages/${languageId}` },
    { label: chapter?.title ?? '…', path: `/languages/${languageId}/chapters/${chapterId}` },
    { label: lesson?.title ?? '…', path: `/languages/${languageId}/chapters/${chapterId}/lessons/${lessonId}` },
    { label: 'Add Sentence', path: '#' },
  ];

  useEffect(() => {
    if (!languageId || !chapterId || !lessonId) return;
    Promise.all([getLanguage(languageId), getChapter(chapterId), getLesson(lessonId)]).then(
      ([lang, ch, ls]) => { setLanguage(lang); setChapter(ch); setLesson(ls); }
    );
  }, [languageId, chapterId, lessonId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({ englishSentence: '', translatedSentence: '' });
    setAudioBase64('');
    // setRecorderKey(k => k + 1); // Force AudioRecorder remount to reset
    setTimeout(() => englishRef.current?.focus(), 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.englishSentence.trim() || !lessonId) return;
    setSubmitting(true);
    try {
      await createSentence({
        lessonId,
        englishSentence: form.englishSentence,
        translatedSentence: form.translatedSentence,
        audioData: audioBase64,
      });

      setSuccessCount(c => c + 1);

      setSuccessCount(c => c + 1);

      setResetSignal(s => s + 1);
      resetForm(); 
    } finally {
      setSubmitting(false);
    }
  };

  const backPath = `/languages/${languageId}/chapters/${chapterId}/lessons/${lessonId}`;

  return (
    <div className="app-layout">
      <Header theme={theme} onToggleTheme={onToggleTheme} breadcrumbs={breadcrumbs} />
      <main className="page-content">
        <div className="page-header">
          <p className="page-header-meta">Creator Flow · Step 4{lesson ? ` · ${lesson.title}` : ''}</p>
          <h2>Add Sentences</h2>
          <p className="page-header-desc">
            After submitting, the form clears so you can rapidly add more sentences.
          </p>
        </div>

        {successCount > 0 && (
          <div className="success-banner">
            ✓ {successCount} sentence{successCount !== 1 ? 's' : ''} saved! Keep going.
          </div>
        )}

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="englishSentence">English Sentence *</label>
            <input
              ref={englishRef}
              id="englishSentence"
              name="englishSentence"
              className="form-input"
              placeholder="e.g. Good morning!"
              value={form.englishSentence}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="translatedSentence">Translation</label>
            <input
              id="translatedSentence"
              name="translatedSentence"
              className="form-input"
              placeholder="e.g. おはようございます！"
              value={form.translatedSentence}
              onChange={handleChange}
            />
          </div>

          <AudioRecorder
            // audio={audioBase64}
            resetSignal={resetSignal} 
            onAudioCaptured={setAudioBase64}
            onReset={() => setAudioBase64('')}
          />

          {audioBase64 && (
            <p className="form-hint" style={{ color: 'var(--success)', marginBottom: '1rem' }}>
              ✓ Audio will be saved with this sentence
            </p>
          )}

          <div className="btn-group">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : '+ Save Sentence'}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => navigate(backPath)}>
              ← Back to Lesson
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

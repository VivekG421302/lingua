import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Language, Chapter, Lesson, Sentence, BreadcrumbItem } from '../types';
import { getLanguage, getChapter, getLesson, getSentencesByLesson, getSentence } from '../api';
import { Header } from '../components/Header';

interface SentencePageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

function base64ToObjectUrl(base64: string, mimeType = 'audio/webm'): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
}

export function SentencePage({ theme, onToggleTheme }: SentencePageProps) {
  const { languageId, chapterId, lessonId, sentenceId } = useParams<{
    languageId: string; chapterId: string; lessonId: string; sentenceId: string;
  }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [allSentences, setAllSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);
  const audioUrlRef = useRef<string | null>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: language?.name ?? '…', path: `/languages/${languageId}` },
    { label: chapter?.title ?? '…', path: `/languages/${languageId}/chapters/${chapterId}` },
    { label: lesson?.title ?? '…', path: `/languages/${languageId}/chapters/${chapterId}/lessons/${lessonId}` },
    { label: sentence ? sentence.englishSentence.slice(0, 20) + (sentence.englishSentence.length > 20 ? '…' : '') : '…', path: '#'},
  ];

  useEffect(() => {
    if (!languageId || !chapterId || !lessonId || !sentenceId) return;
    setLoading(true);

    // Clean up previous object URL
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    Promise.all([
      getLanguage(languageId),
      getChapter(chapterId),
      getLesson(lessonId),
      getSentence(sentenceId),
      getSentencesByLesson(lessonId),
    ])
      .then(([lang, ch, ls, sent, allSents]) => {
        setLanguage(lang); setChapter(ch); setLesson(ls);
        setSentence(sent); setAllSentences(allSents);
      })
      .finally(() => setLoading(false));

    return () => {
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, [languageId, chapterId, lessonId, sentenceId]);

  const currentIndex = allSentences.findIndex(s => s.id === sentenceId);
  const prevSentence = currentIndex > 0 ? allSentences[currentIndex - 1] : null;
  const nextSentence = currentIndex >= 0 && currentIndex < allSentences.length - 1
    ? allSentences[currentIndex + 1] : null;

  const lessonPath = `/languages/${languageId}/chapters/${chapterId}/lessons/${lessonId}`;
  const sentencePath = (id: string) =>
    `/languages/${languageId}/chapters/${chapterId}/lessons/${lessonId}/sentences/${id}`;

  let audioSrc: string | null = null;
  if (sentence?.audioData) {
    if (!audioUrlRef.current) {
      audioUrlRef.current = base64ToObjectUrl(sentence.audioData);
    }
    audioSrc = audioUrlRef.current;
  }

  return (
    <div className="app-layout">
      <Header theme={theme} onToggleTheme={onToggleTheme} breadcrumbs={breadcrumbs} />
      <main className="page-content">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : sentence ? (
          <div className="sentence-page">
            <div className="page-header">
              <p className="page-header-meta">
                {currentIndex + 1} of {allSentences.length} · {lesson?.title}
              </p>
            </div>

            <p className="sentence-english">{sentence.englishSentence}</p>
            <div className="sentence-translated">{sentence.translatedSentence || '—'}</div>

            <div className="sentence-audio-section">
              <div className="sentence-audio-label">Pronunciation</div>
              {audioSrc ? (
                <audio
                  key={audioSrc}
                  src={audioSrc}
                  controls
                  className="sentence-audio-player"
                  autoPlay={false}
                />
              ) : (
                <p className="sentence-no-audio">No recording for this sentence yet.</p>
              )}
            </div>

            <div className="sentence-nav">
              <button
                className="btn btn-ghost"
                onClick={() => prevSentence ? navigate(sentencePath(prevSentence.id)) : navigate(lessonPath)}
              >
                ← {prevSentence ? 'Previous' : 'Back to Lesson'}
              </button>
              {nextSentence && (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(sentencePath(nextSentence.id))}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Sentence not found.</p>
            <button className="btn btn-ghost" style={{ marginTop: '1rem' }} onClick={() => navigate(lessonPath)}>
              Back to Lesson
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

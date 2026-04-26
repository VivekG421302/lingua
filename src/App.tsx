import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { HomePage } from './pages/HomePage';
import { AddLanguagePage } from './pages/AddLanguagePage';
import { LanguagePage } from './pages/LanguagePage';
import { AddChapterPage } from './pages/AddChapterPage';
import { ChapterPage } from './pages/ChapterPage';
import { AddLessonPage } from './pages/AddLessonPage';
import { LessonPage } from './pages/LessonPage';
import { AddSentencePage } from './pages/AddSentencePage';
import { SentencePage } from './pages/SentencePage';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const themeProps = { theme, onToggleTheme: toggleTheme };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage {...themeProps} />} />
        <Route path="/add-language" element={<AddLanguagePage {...themeProps} />} />
        <Route path="/languages/:languageId" element={<LanguagePage {...themeProps} />} />
        <Route path="/languages/:languageId/add-chapter" element={<AddChapterPage {...themeProps} />} />
        <Route path="/languages/:languageId/chapters/:chapterId" element={<ChapterPage {...themeProps} />} />
        <Route path="/languages/:languageId/chapters/:chapterId/add-lesson" element={<AddLessonPage {...themeProps} />} />
        <Route path="/languages/:languageId/chapters/:chapterId/lessons/:lessonId" element={<LessonPage {...themeProps} />} />
        <Route path="/languages/:languageId/chapters/:chapterId/lessons/:lessonId/add-sentence" element={<AddSentencePage {...themeProps} />} />
        <Route path="/languages/:languageId/chapters/:chapterId/lessons/:lessonId/sentences/:sentenceId" element={<SentencePage {...themeProps} />} />
      </Routes>
    </BrowserRouter>
  );
}

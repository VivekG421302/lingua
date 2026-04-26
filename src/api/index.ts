import axios from 'axios';
import type { Language, Chapter, Lesson, Sentence } from '../types';

const BASE_URL = 'http://localhost:3001';

const api = axios.create({ baseURL: BASE_URL });

// Languages
export const getLanguages = () => api.get<Language[]>('/languages').then(r => r.data);
export const getLanguage = (id: string) => api.get<Language>(`/languages/${id}`).then(r => r.data);
export const createLanguage = (data: Omit<Language, 'id'>) =>
  api.post<Language>('/languages', data).then(r => r.data);

// Chapters
export const getChaptersByLanguage = (languageId: string) =>
  api.get<Chapter[]>(`/chapters?languageId=${languageId}`).then(r => r.data);
export const getChapter = (id: string) => api.get<Chapter>(`/chapters/${id}`).then(r => r.data);
export const createChapter = (data: Omit<Chapter, 'id'>) =>
  api.post<Chapter>('/chapters', data).then(r => r.data);

// Lessons
export const getLessonsByChapter = (chapterId: string) =>
  api.get<Lesson[]>(`/lessons?chapterId=${chapterId}`).then(r => r.data);
export const getLesson = (id: string) => api.get<Lesson>(`/lessons/${id}`).then(r => r.data);
export const createLesson = (data: Omit<Lesson, 'id'>) =>
  api.post<Lesson>('/lessons', data).then(r => r.data);

// Sentences
export const getSentencesByLesson = (lessonId: string) =>
  api.get<Sentence[]>(`/sentences?lessonId=${lessonId}`).then(r => r.data);
export const getSentence = (id: string) => api.get<Sentence>(`/sentences/${id}`).then(r => r.data);
export const createSentence = (data: Omit<Sentence, 'id'>) =>
  api.post<Sentence>('/sentences', data).then(r => r.data);

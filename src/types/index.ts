export interface Language {
  id: string;
  name: string;
  type: string;
  country: string;
  state: string;
}

export interface Chapter {
  id: string;
  languageId: string;
  title: string;
  description: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  description: string;
}

export interface Sentence {
  id: string;
  lessonId: string;
  englishSentence: string;
  translatedSentence: string;
  audioData: string;
}

export interface BreadcrumbItem {
  label: string;
  path: string;
}

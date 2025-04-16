export const languages = ['en', 'ar', 'fr'] as const;
export type Language = typeof languages[number];

export const defaultLanguage = 'en';

export const languageNames: Record<Language, string> = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
};

export const regions = {
  ksa: {
    name: 'Saudi Arabia',
    languages: ['ar', 'en'],
    defaultLanguage: 'ar',
  },
  uae: {
    name: 'United Arab Emirates',
    languages: ['ar', 'en'],
    defaultLanguage: 'en',
  },
  tunisia: {
    name: 'Tunisia',
    languages: ['ar', 'fr'],
    defaultLanguage: 'ar',
  },
  morocco: {
    name: 'Morocco',
    languages: ['ar', 'fr'],
    defaultLanguage: 'ar',
  },
  france: {
    name: 'France',
    languages: ['fr'],
    defaultLanguage: 'fr',
  },
  canada: {
    name: 'Canada',
    languages: ['en', 'fr'],
    defaultLanguage: 'en',
  },
} as const;

export type Region = keyof typeof regions; 
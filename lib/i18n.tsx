export type Locale = 'en' | 'es' | 'fr' | 'hi';

// Supported locales for the application
const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'es', 'fr', 'hi'] as const;
export const DEFAULT_LOCALE: Locale = 'en';

// Function to check if a given locale is valid
export function isValidLocale(locale: string): locale is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}
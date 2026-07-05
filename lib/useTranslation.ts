import { translations, type Locale, type Translation } from "./translations";

/** Retourne le dictionnaire de la locale demandée. */
export function useTranslation(locale: Locale): Translation {
  return translations[locale];
}

"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/translations";

// La balise <html> vit dans le layout racine, qui ne connaît pas la locale
// (contrainte Next.js). Ce micro-composant met à jour son attribut lang
// dès l'affichage de la page — lecteurs d'écran et moteurs de recherche
// voient la bonne langue.
export default function SetHtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}

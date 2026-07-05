import { redirect } from "next/navigation";

// Filet de sécurité : la détection de langue se fait normalement dans
// middleware.ts (cookie + Accept-Language). Si une requête atteint quand
// même cette page, on renvoie vers le français (marché de base).
export default function RootRedirect() {
  redirect("/fr");
}

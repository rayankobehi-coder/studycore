# STUDYCORE

Plateforme académique : notes, moyennes, simulateur, crédits ECTS, parcours, planning, échéances, révisions, objectifs, analytics et ressources.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
```

## Logo

Place ton fichier **`public/logo.png`**. Il est utilisé dans la barre latérale, l’en-tête mobile et l’icône du site. Tant qu’il est absent, le logo STUDYCORE intégré (`public/brand-mark.svg`) est affiché automatiquement.

## Mode démonstration

Sans configuration Supabase, l’application fonctionne en mode démonstration avec des données fictives (élève « Alex Martin », BTS Informatique). Toutes les modifications restent dans le navigateur (`localStorage`). Le bouton « Explorer la démo » est disponible sur les pages de connexion et d’accueil.

## Supabase (optionnel, comptes réels)

1. Copie `.env.example` en `.env.local` et renseigne `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Exécute `src/database/migrations/20261009_student_workspaces.sql` dans l’éditeur SQL de Supabase. Cette table stocke l’espace de chaque étudiant, protégé par RLS (chacun ne voit que ses données).
3. Redémarre le serveur.

## Architecture

- `src/app` : pages (App Router). `proxy.ts` gère la protection des routes.
- `src/components` : coque d’application, composants académiques, graphiques, formulaires et UI.
- `src/lib/engine` : moteur de calcul et règles académiques (inchangé).
- `src/lib/workspace` : données, sélecteurs (qui appellent le moteur), validation (Zod), export.
- `src/app/globals.css` : système visuel complet (couleurs, mode clair/sombre, composants, responsive).

Les résultats affichés sont indicatifs et non officiels.

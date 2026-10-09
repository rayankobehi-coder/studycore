# STUDYCORE

StudyCore est une interface responsive de suivi de parcours étudiant. Le projet utilise Next.js App Router, React, TypeScript et CSS (Tailwind CSS 4 pour les utilitaires et `src/app/globals.css` pour le design system).

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Pour vérifier une version de production :

```bash
npm run lint
npm run build
```

## Pages

| URL | Page |
| --- | --- |
| `/dashboard` | Accueil et résumé académique |
| `/subjects` | Notes, matières et ajout d’évaluation |
| `/subjects/algorithmique` | Détail d’une matière |
| `/simulator` | Simulateur par matière et par semestre |
| `/schedule` | Emploi du temps |
| `/assignments` | Échéances, devoirs et examens |
| `/credits` | Suivi des crédits ECTS |
| `/study-planner` | Plan de révisions |
| `/analytics` | Performances académiques |
| `/pathway` | Parcours et progression vers le diplôme |
| `/resources` | Bibliothèque de ressources |
| `/profile` | Profil étudiant |

La navigation mobile est en bas de l’écran; sur grand écran, le menu latéral donne aussi accès aux pages complémentaires.

## Images et organisation

```text
public/
└── images/
    ├── logo.png
    └── references/
        └── studycore_*.png
```

`public/images/logo.png` est le logo partagé par l’interface. Les visuels d’inspiration fournis sont conservés dans `public/images/references/`; l’interface est constituée de composants React et CSS, et non de captures d’écran utilisées comme arrière-plan.

## Supabase

Pour activer l’authentification et les données Supabase, copier `.env.example` vers `.env.local` et renseigner l’URL du projet et la clé publique `anon`. Sans ces paramètres, le site reste navigable en mode démonstration; les opérations d’authentification nécessitent une instance Supabase configurée.

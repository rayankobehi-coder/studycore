import type { Workspace, LibraryResource } from './types';
import type { Subject, Assessment, Grade, Credit, Assignment, ScheduleEvent } from '@/lib/types';
import { AcademicRuleSet } from '@/lib/engine/AcademicRuleSet';
import { dateKey, addDays, mondayOf } from './dates';

const created = '2026-09-01T08:00:00.000Z';
const subjectSeeds = [
  ['algo', 'Algorithmique', 'ALGO', 4, 6, 14.2, '#7771eb', 'informatique'],
  ['reseaux', 'Réseaux', 'RES', 3, 6, 13.8, '#5b95cc', 'informatique'],
  ['bdd', 'Base de données', 'BDD', 1, 9, 8.7, '#ca9860', 'informatique'],
  ['web', 'Développement web', 'WEB', 4, 6, 15.1, '#639c88', 'informatique'],
  ['anglais', 'Anglais', 'ANG', 3, 3, 16.4, '#aa7fba', 'langues'],
  ['maths', 'Mathématiques', 'MATH', 1, 9, 7.9, '#c27f82', 'sciences'],
  ['systemes', 'Systèmes', 'SYS', 4, 6, 14.8, '#698da1', 'informatique'],
  ['projet', 'Projet professionnel', 'PRO', 4, 6, 14.3, '#939263', 'professionnel'],
  ['communication', 'Communication', 'COM', 2, 3, 14.2, '#9a8fbb', 'langues'],
  ['economie', 'Économie & gestion', 'ECO', 2, 6, 15.18, '#749da6', 'professionnel'],
] as const;

const resourceSeeds = [
  {
    id: 'structures', subjectId: 'algo', title: 'Les structures de données, simplement',
    type: 'FICHE', description: 'Tableaux, listes, piles et files : les fondamentaux à garder sous la main.',
    content: '# Les structures de données\n\nUne structure de données organise les informations pour faciliter leur lecture et leur modification.\n\n## Les tableaux\nUn tableau stocke des éléments contigus. Accès par indice : O(1). Recherche sans tri : O(n).\n\n## Les listes chaînées\nChaque nœud contient une valeur et une référence vers le suivant. Une insertion en tête est en O(1).\n\n## Pile et file\nPile : dernier entré, premier sorti (LIFO). File : premier entré, premier sorti (FIFO).\n\n## Pour t’entraîner\n1. Implémente une pile avec un tableau.\n2. Écris une fonction qui inverse une liste.\n3. Compare la complexité des deux approches.\n\nÀ retenir : le bon choix dépend des opérations les plus fréquentes, pas seulement de la taille des données.',
  },
  {
    id: 'sql', subjectId: 'bdd', title: 'SQL : les jointures sans prise de tête',
    type: 'FICHE', description: 'Comprendre INNER JOIN, LEFT JOIN et les relations entre tables.',
    content: '# SQL : les jointures\n\n## INNER JOIN\nRetourne les lignes qui ont une correspondance dans les deux tables.\n\nSELECT etudiants.nom, formations.nom\nFROM etudiants\nINNER JOIN formations ON etudiants.formation_id = formations.id;\n\n## LEFT JOIN\nConserve toutes les lignes de la table de gauche. Une correspondance absente à droite produit NULL.\n\n## Exercice\nCrée deux tables : auteurs et livres. Affiche tous les auteurs, y compris ceux qui n’ont publié aucun livre.\n\n## Corrigé\nUtilise auteurs LEFT JOIN livres ON auteurs.id = livres.auteur_id.\n\nAttention : un filtre WHERE sur une colonne de droite peut retirer les lignes sans correspondance.',
  },
  {
    id: 'reseaux-ip', subjectId: 'reseaux', title: 'Adressage IP & sous-réseaux',
    type: 'EXERCICE', description: 'Quatre exercices progressifs pour maîtriser les masques IPv4.',
    content: '# Adressage IPv4\n\n## Rappel\nUne adresse IPv4 comprend 32 bits. Le préfixe CIDR indique le nombre de bits consacrés au réseau.\n\n## Exercice 1\nPour 192.168.1.0/24, indique le masque et le nombre d’adresses.\n\n## Exercice 2\nDécoupe ce réseau en quatre sous-réseaux égaux.\n\n## Corrigé\n1. Masque : 255.255.255.0. 256 adresses, généralement 254 hôtes utilisables.\n2. Préfixe /26. Réseaux : .0, .64, .128 et .192.\n\n## Exercice 3\nExplique la différence entre une adresse réseau et une adresse de diffusion.',
  },
  {
    id: 'web-accessible', subjectId: 'web', title: 'Un web accessible, dès le premier composant',
    type: 'FICHE', description: 'Sémantique HTML, navigation clavier et contrastes : ta checklist.',
    content: '# Construire une interface accessible\n\n## Sémantique\nUtilise un bouton pour une action et un lien pour une navigation. Associe chaque champ à un label.\n\n## Clavier\nTous les contrôles doivent être accessibles avec Tab. Le focus doit toujours rester visible.\n\n## Contraste\nVérifie les textes et les éléments interactifs. N’utilise jamais la couleur seule pour porter une information.\n\n## Checklist\n1. Teste sans souris.\n2. Agrandis le texte à 200 %.\n3. Vérifie les messages d’erreur.\n4. Teste les petits écrans.\n5. Donne un nom accessible aux boutons à icône.',
  },
  {
    id: 'anglais-tech', subjectId: 'anglais', title: 'Technical English : the essentials',
    type: 'FICHE', description: 'Le vocabulaire informatique utile à l’écrit comme à l’oral.',
    content: '# Technical English\n\n## Everyday vocabulary\nAn array : un tableau. A loop : une boucle. A query : une requête. A network : un réseau.\n\n## Explain your project\nStart with the problem. Describe your solution. Explain one technical choice. End with what you learned.\n\n## Practice\nWrite a short paragraph about your latest project. Use at least five technical words. Read it aloud and check your pronunciation.\n\n## Useful phrases\nThe purpose of this application is…\nWe chose this approach because…\nThe main challenge was…',
  },
  {
    id: 'maths-annale', subjectId: 'maths', title: 'Probabilités : sujet d’entraînement',
    type: 'ANNALE', description: 'Un sujet fictif de 45 minutes, avec pistes de résolution.',
    content: '# Probabilités — entraînement\n\nSujet pédagogique fictif, non officiel. Durée conseillée : 45 minutes.\n\n## Partie 1 : événements\nUne urne contient 3 boules rouges et 7 boules bleues. Calcule la probabilité de tirer une boule rouge.\n\n## Partie 2 : deux tirages\nSans remise, calcule la probabilité de tirer deux boules rouges.\n\n## Pistes de résolution\nPartie 1 : 3/10.\nPartie 2 : (3/10) × (2/9) = 1/15.\n\n## Aller plus loin\nCompare le résultat avec deux tirages avec remise. Explique pourquoi les événements ne sont pas indépendants sans remise.',
  },
] as const;

export function createDemoWorkspace(today: Date = new Date()): Workspace {
  const year = today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
  const academicYear = `${year}-${year + 1}`;
  const subjects: Subject[] = subjectSeeds.map(([id, name, code, coefficient, credits, , color, unitId]) => ({
    id, name, code, coefficient, credits, color, unitId, semesterId: 's1', passingGrade: 10,
    teacherName: 'Équipe pédagogique', createdAt: created, updatedAt: created,
  }));
  const assessments: Assessment[] = [];
  const grades: Grade[] = [];
  const labels = ['Contrôle continu', 'Travaux pratiques', 'Devoir surveillé'];
  subjectSeeds.forEach(([id, , , , , average]) => {
    [-0.9, -0.3, 0.5].forEach((offset, i) => {
      const assessmentId = `${id}-a${i + 1}`;
      assessments.push({ id: assessmentId, subjectId: id, name: labels[i], type: i === 1 ? 'TP' : i === 2 ? 'DEVOIR_SURVEILLE' : 'CONTROLE_CONTINU', coefficient: i + 1, date: dateKey(addDays(today, [-28, -14, -2][i])), createdAt: created, updatedAt: created });
      grades.push({ id: `${id}-g${i + 1}`, subjectId: id, assessmentId, studentId: 'demo', value: Number((average + offset).toFixed(2)), scale: 20, createdAt: created, updatedAt: created });
    });
  });
  const credits: Credit[] = subjects.map(subject => ({
    id: `credit-${subject.id}`, studentId: 'demo', subjectId: subject.id, unitId: subject.unitId,
    creditsEarned: ['bdd', 'maths'].includes(subject.id) ? 0 : subject.credits,
    creditsTotal: subject.credits,
    status: subject.id === 'bdd' ? 'PENDING' : subject.id === 'maths' ? 'IN_PROGRESS' : 'ACQUIRED',
  }));
  const assignmentSeeds = [
    ['exam-algo', 'algo', 'Examen d’algorithmique', 'EXAMEN', 3, 4, 4, 90],
    ['projet-bdd', 'bdd', 'Modélisation d’une base de données', 'PROJET', 5, 2, 3, 120],
    ['exam-reseaux', 'reseaux', 'Évaluation : adressage & routage', 'EXAMEN', 7, 3, 3, 60],
    ['oral-anglais', 'anglais', 'Présentation de mon projet', 'ORAL', 10, 2, 2, 30],
    ['tp-web', 'web', 'Intégration d’une page responsive', 'TP', 0, 2, 2, 60],
  ] as const;
  const assignments: Assignment[] = assignmentSeeds.map(([id, subjectId, title, type, offset, coefficient, priority, estimatedTime]) => ({
    id, subjectId, title, type, dueDate: `${dateKey(addDays(today, offset))}T09:00:00`, coefficient,
    priority, estimatedTime, difficulty: 3, status: 'PENDING', studentId: 'demo', createdAt: created,
  }));
  const week = mondayOf(today);
  const eventSeeds = [
    ['algo', 0, '08:00', '10:00', 'B12'], ['web', 0, '10:30', '12:00', 'L03'], ['anglais', 0, '14:00', '15:30', 'A02'],
    ['reseaux', 1, '09:00', '11:00', 'C04'], ['bdd', 1, '14:00', '16:00', 'L02'],
    ['maths', 2, '08:30', '10:00', 'B08'], ['algo', 2, '10:30', '12:00', 'B12'], ['projet', 2, '14:00', '16:00', 'L03'],
    ['web', 3, '09:00', '11:00', 'L03'], ['systemes', 3, '14:00', '16:00', 'C01'],
    ['algo', 4, '08:00', '10:00', 'B12'], ['reseaux', 4, '10:30', '12:00', 'C04'], ['communication', 4, '14:00', '15:30', 'A02'],
  ] as const;
  const events: ScheduleEvent[] = eventSeeds.map(([subjectId, offset, startTime, endTime, room], i) => ({
    id: `course-${i}`, studentId: 'demo', subjectId, title: subjects.find(s => s.id === subjectId)!.name,
    type: 'COURSE', date: dateKey(addDays(week, offset)), startTime, endTime, room,
  }));
  const resources: LibraryResource[] = resourceSeeds.map((resource, i) => ({
    ...resource, authorId: 'demo', author: 'Équipe STUDYCORE', readingMinutes: [4, 6, 8, 5, 3, 12][i],
    level: 'BTS', year: academicYear, votes: [24, 18, 12, 9, 16, 21][i], downloads: 0, createdAt: created,
  }));
  return {
    version: 1, isDemo: true,
    profile: { firstName: 'Alex', lastName: 'Martin', formation: 'BTS Informatique', formationType: 'BTS', institution: 'Institut Horizon · établissement fictif', className: '2e année', academicYear, onboardingCompleted: false },
    semesters: [
      { id: 's1', academicYearId: academicYear, name: 'Semestre 1', order: 1, startDate: `${year}-09-01`, endDate: `${year + 1}-01-31` },
      { id: 's2', academicYearId: academicYear, name: 'Semestre 2', order: 2, startDate: `${year + 1}-02-01`, endDate: `${year + 1}-06-30` },
    ], activeSemesterId: 's1', subjects, assessments, grades, credits, assignments, events, resources,
    sessions: [
      { id: 'session-1', studentId: 'demo', subjectId: 'algo', date: dateKey(today), startTime: '18:00', endTime: '19:30', duration: 90, completed: false, notes: 'Graphes & complexité' },
      { id: 'session-2', studentId: 'demo', subjectId: 'bdd', date: dateKey(today), startTime: '20:00', endTime: '21:00', duration: 60, completed: false, notes: 'Jointures SQL' },
    ],
    goals: [
      { id: 'goal-average', studentId: 'demo', title: 'Atteindre 14 de moyenne', type: 'OVERALL', targetValue: 14, deadline: `${year}-12-15`, status: 'ACTIVE', createdAt: created, updatedAt: created },
      { id: 'goal-credits', studentId: 'demo', title: 'Obtenir mes 60 crédits', type: 'CREDITS', targetValue: 60, deadline: `${year + 1}-06-30`, status: 'ACTIVE', createdAt: created, updatedAt: created },
      { id: 'goal-maths', studentId: 'demo', title: 'Reprendre confiance en maths', type: 'SUBJECT_GRADE', subjectId: 'maths', targetValue: 11, deadline: `${year}-12-15`, status: 'ACTIVE', createdAt: created, updatedAt: created },
    ], notifications: [], bookmarks: [], upvotes: [], simulations: [],
    rules: AcademicRuleSet.fromFormationType('BTS').getConfig(),
    preferences: { examReminders: true, goalUpdates: true, revisionReminders: true },
    previousAverage: 13.47,
  };
}

export function createEmptyWorkspace(today = new Date()): Workspace {
  const base = createDemoWorkspace(today);
  return { ...base, isDemo: false, profile: { ...base.profile, firstName: '', lastName: '', institution: '', onboardingCompleted: false }, subjects: [], assessments: [], grades: [], credits: [], events: [], assignments: [], sessions: [], goals: [], resources: [], notifications: [], bookmarks: [], upvotes: [], simulations: [], previousAverage: null };
}

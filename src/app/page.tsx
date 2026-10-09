'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  GraduationCap,
  Calculator,
  Target,
  Brain,
  BarChart3,
  Calendar,
  BookOpen,
  CreditCard,
  ChevronRight,
  Check,
  Star,
  ArrowUpRight,
} from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: 'Notes & Moyennes',
    desc: 'Enregistre tes évaluations et calcule automatiquement tes moyennes avec un moteur de calcul intelligent.',
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    icon: Calculator,
    title: 'Simulateur What If',
    desc: 'Teste différents scénarios sans modifier tes vraies notes et découvre leur impact sur ta moyenne.',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: Target,
    title: 'Objectif de note',
    desc: 'Définis un objectif et l\'application calcule exactement la note qu\'il te faut obtenir.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: CreditCard,
    title: 'Crédits ECTS',
    desc: 'Suis tes crédits en temps réel avec un système de validation intelligent et configurable.',
    color: 'text-rose-600 bg-rose-50',
  },
  {
    icon: Brain,
    title: 'Planificateur révisions',
    desc: 'Priorise tes révisions selon l\'urgence, le coefficient et ton niveau dans chaque matière.',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    icon: BarChart3,
    title: 'Analytics avancés',
    desc: 'Visualise ton évolution, identifie tes forces et faiblesses avec des graphiques clairs.',
    color: 'text-cyan-600 bg-cyan-50',
  },
  {
    icon: Calendar,
    title: 'Emploi du temps',
    desc: 'Organise tes cours, examens et révisions dans un calendrier hebdomadaire interactif.',
    color: 'text-orange-600 bg-orange-50',
  },
  {
    icon: BookOpen,
    title: 'Ressources partagées',
    desc: 'Accède à une bibliothèque de cours, exercices, annales et fiches de révision.',
    color: 'text-blue-600 bg-blue-50',
  },
];

const levels = [
  { emoji: '🏫', name: 'Collège' },
  { emoji: '🎓', name: 'Lycée' },
  { emoji: '📚', name: 'BTS' },
  { emoji: '🎓', name: 'Licence' },
  { emoji: '🎓', name: 'Master' },
  { emoji: '💼', name: 'Formation pro' },
];

const stats = [
  { value: '10+', label: 'Modules académiques' },
  { value: '5', label: 'Niveaux supportés' },
  { value: '30+', label: 'Types d\'évaluations' },
  { value: '100%', label: 'Personnalisable' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ---- Navbar ---- */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="" width={38} height={38} className="h-9 w-9 rounded-lg object-contain" priority />
            <span className="text-lg font-bold text-gray-900">STUDYCORE</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Fonctionnalités
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Comment ça marche
            </a>
            <a href="#levels" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Niveaux
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="absolute top-0 right-0 -mr-20 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 h-96 w-96 rounded-full bg-purple-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
              <Sparkles className="h-4 w-4" />
              Plateforme académique multi-niveaux
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Gérez ton parcours{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                académique
              </span>{' '}
              simplement
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              STUDYCORE t&apos;aide à suivre tes notes, calculer tes moyennes, simuler tes résultats,
              organiser tes révisions et atteindre tes objectifs — le tout dans une interface adaptée
              à ton niveau.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                Commencer gratuitement
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Voir les fonctionnalités
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Niveaux supportés ---- */}
      <section id="levels" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Pour tous les niveaux</h2>
            <p className="mt-4 text-lg text-gray-600">
              L&apos;interface s&apos;adapte automatiquement à ton système académique
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {levels.map((level) => (
              <div
                key={level.name}
                className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-6 py-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-2xl">{level.emoji}</span>
                <span className="font-medium text-gray-900">{level.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section id="features" className="border-t border-gray-100 bg-gray-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Tout ce dont tu as besoin
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Un module pour chaque aspect de ta vie académique
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className={`inline-flex rounded-lg p-3 ${feature.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Comment ça marche</h2>
            <p className="mt-4 text-lg text-gray-600">
              Commence en quelques minutes
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Crée ton profil',
                desc: 'Inscris-toi et choisis ton niveau d\'études. L\'interface s\'adapte automatiquement.',
              },
              {
                step: '2',
                title: 'Ajoute tes matières',
                desc: 'Configure tes matières, coefficients et évaluations. Ou utilise nos modèles.',
              },
              {
                step: '3',
                title: 'Laisse le moteur travailler',
                desc: 'Notes, moyennes, crédits, simulations — tout est calculé automatiquement.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="border-t border-gray-100 bg-gradient-to-br from-indigo-600 to-purple-700 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Prêt à reprendre le contrôle de tes études ?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Rejoins STUDYCORE gratuitement et découvre une nouvelle façon de gérer ton parcours académique.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-lg hover:bg-indigo-50 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              C&apos;est parti !
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-400 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              J&apos;ai déjà un compte
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="" width={34} height={34} className="h-8 w-8 rounded-lg object-contain" />
              <span className="font-bold text-gray-900">STUDYCORE</span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; 2026 STUDYCORE. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

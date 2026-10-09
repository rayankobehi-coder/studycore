'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight,
  BellRing,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  CreditCard,
  GraduationCap,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const subjects = [
  { name: 'Algorithmique', detail: 'Coefficient 4 · 6 crédits', average: '14.2', state: 'VALIDÉE ✓', color: 'green' },
  { name: 'Réseaux', detail: 'Coefficient 3 · 4 crédits', average: '13.8', state: 'VALIDÉE ✓', color: 'green' },
  { name: 'Développement Web', detail: 'Coefficient 3 · 5 crédits', average: '15.1', state: 'VALIDÉE ✓', color: 'green' },
  { name: 'Base de données', detail: 'Coefficient 3 · 4 crédits', average: '8.7', state: 'À SURVEILLER', color: 'blue' },
  { name: 'Mathématiques', detail: 'Coefficient 2 · 3 crédits', average: '7.9', state: 'À RISQUE', color: 'red' },
];

const quickLinks = [
  { href: '/assignments', icon: CalendarDays, title: 'Échéances', detail: 'Examens et devoirs à venir' },
  { href: '/credits', icon: CreditCard, title: 'Crédits ECTS', detail: '42 crédits validés sur 60' },
  { href: '/study-planner', icon: BookOpen, title: 'Plan de révisions', detail: 'Organiser mes sessions' },
  { href: '/analytics', icon: TrendingUp, title: 'Performances', detail: 'Voir mon évolution' },
  { href: '/pathway', icon: GraduationCap, title: 'Mon parcours', detail: 'Suivre mes semestres' },
  { href: '/resources', icon: CircleHelp, title: 'Ressources', detail: 'Cours et fiches utiles' },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="home-heading">
        <div>
          <Badge variant="info">BTS Informatique · 2026-2027</Badge>
          <h1 className="mt-3 text-2xl font-bold">Bonjour, Alex 👋</h1>
          <p className="mt-1 text-sm text-gray-500">Voici l&apos;état de ton parcours académique en temps réel.</p>
        </div>
        <span className="semester-label">Semestre 2</span>
      </div>

      <section className="home-stats" aria-label="Résumé académique">
        <Card className="home-average">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">MOYENNE GÉNÉRALE</p>
                <p className="mt-1 text-2xl font-bold">14.27 <span className="text-sm font-normal text-gray-500">/ 20</span></p>
                <span className="trend-pill"><TrendingUp size={13} /> +0.8 pts</span>
              </div>
              <div className="metric-icon"><GraduationCap size={22} /></div>
            </div>
            <p className="mt-3 text-xs text-gray-500"><CheckCircle2 size={13} className="mr-1 inline text-emerald-600" /> Progression constante depuis le Semestre 1</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="eyebrow">CRÉDITS ECTS</p>
            <p className="mt-1 text-xl font-bold">42<span className="text-sm font-medium text-gray-500">/60</span></p>
            <Progress value={70} className="mt-3" />
            <p className="mt-2 text-xs text-gray-500">70% acquis</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="eyebrow">UNITÉS VALIDÉES</p>
            <p className="mt-1 text-xl font-bold">8<span className="text-sm font-medium text-gray-500">/10</span></p>
            <Progress value={80} className="mt-3 [&>div]:bg-emerald-400" />
            <p className="mt-2 text-xs text-gray-500">80% acquis</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="eyebrow">OBJECTIF</p>
            <p className="mt-1 text-xl font-bold">14.00</p>
            <Progress value={82} className="mt-3 [&>div]:bg-violet-400" />
            <p className="mt-2 text-xs font-medium text-indigo-600">+0.27 dépassé</p>
          </CardContent>
        </Card>
      </section>

      <div className="notice-strip">
        <span className="notice-icon"><BellRing size={16} /></span>
        <div><strong>Priorité académique de la semaine</strong><span>Tes deux matières cibles sont Algorithmique et Base de données pour valider l&apos;UE.</span></div>
        <Link href="/study-planner" aria-label="Voir le plan de révisions"><ArrowRight size={18} /></Link>
      </div>

      <section className="dashboard-chart-panel">
        <div className="section-heading">
          <div><h2>Évolution des notes</h2><p>Trajectoire continue du cycle</p></div>
          <Link href="/analytics" className="text-sm font-medium text-indigo-600">Voir l&apos;analyse <ArrowRight size={14} className="ml-1 inline" /></Link>
        </div>
        <div className="grade-chart" role="img" aria-label="Évolution de la moyenne de 13.40 à 14.27">
          <div className="chart-guides"><span>15</span><span>10</span></div>
          <svg viewBox="0 0 720 155" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="grade-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5141ef" stopOpacity=".2" /><stop offset="1" stopColor="#5141ef" stopOpacity="0" /></linearGradient></defs>
            <path d="M 24 112 C 120 105, 160 89, 238 91 S 365 68, 434 73 S 568 53, 696 32 L 696 145 L 24 145 Z" fill="url(#grade-fill)" />
            <path d="M 24 112 C 120 105, 160 89, 238 91 S 365 68, 434 73 S 568 53, 696 32" fill="none" stroke="#4938ed" strokeWidth="3" />
            {[['24','112'], ['238','91'], ['434','73'], ['696','32']].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="5" fill="#fff" stroke="#4938ed" strokeWidth="3" />)}
          </svg>
          <div className="chart-values"><span>13.40</span><span>13.66</span><span>13.80</span><strong>14.27</strong></div>
          <div className="chart-dates"><span>Oct 2026</span><span>Déc 2026</span><span>Fév 2027</span><span>Aujourd&apos;hui</span></div>
        </div>
      </section>

      <section className="dashboard-next">
        <div className="section-heading">
          <div><h2>Prochaines échéances</h2><p>Prépare tes prochains rendez-vous</p></div>
          <Link href="/assignments" className="text-sm font-medium text-indigo-600">Voir le planning</Link>
        </div>
        <div className="next-list">
          <Link href="/assignments" className="next-item">
            <span className="next-symbol urgent"><CalendarDays size={17} /></span>
            <span className="next-copy"><strong>Examen Algorithmique</strong><small>Coeff 4 · Épreuve écrite finale</small></span>
            <Badge variant="danger">Dans 3 jours</Badge>
          </Link>
          <Link href="/assignments" className="next-item">
            <span className="next-symbol info"><BookOpen size={17} /></span>
            <span className="next-copy"><strong>Projet Base de données</strong><small>Coeff 3 · Rendu modèle SQL</small></span>
            <Badge variant="info">Dans 5 jours</Badge>
          </Link>
        </div>
      </section>

      <section className="dashboard-subjects">
        <div className="section-heading">
          <div><h2>Matières & Performances</h2><p>Synthèse semestrielle par unité</p></div>
          <Link href="/subjects" className="text-sm font-medium text-indigo-600">Tout voir <ArrowRight size={14} className="ml-1 inline" /></Link>
        </div>
        <div className="dashboard-subject-list">
          {subjects.map((subject) => (
            <Link href="/subjects" className="dashboard-subject-row" key={subject.name}>
              <span className="subject-meta"><strong>{subject.name}</strong><small>{subject.detail}</small></span>
              <span className="subject-score"><strong className={`score-${subject.color}`}>{subject.average}</strong><small>/20</small></span>
              <Badge variant={subject.color === 'green' ? 'success' : subject.color === 'blue' ? 'info' : 'danger'}>{subject.state}</Badge>
            </Link>
          ))}
        </div>
      </section>

      <div className="dashboard-boost">
        <span><Sparkles size={19} /></span>
        <div><strong>Besoin d&apos;un coup de boost ?</strong><p>Simule l&apos;impact d&apos;une note cible sur ta moyenne générale.</p></div>
        <Link href="/simulator" aria-label="Ouvrir le simulateur"><ArrowRight size={19} /></Link>
      </div>

      <section className="quick-links">
        <div className="section-heading"><div><h2>Ton espace StudyCore</h2><p>Tous les outils pour avancer à ton rythme</p></div></div>
        <div className="quick-link-grid">
          {quickLinks.map(({ href, icon: Icon, title, detail }) => (
            <Link href={href} key={href} className="quick-link-card">
              <span><Icon size={18} /></span><strong>{title}</strong><small>{detail}</small><ArrowRight size={15} className="quick-arrow" />
            </Link>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}

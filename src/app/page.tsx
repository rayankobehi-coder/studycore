'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Calculator, CalendarDays, CreditCard, LineChart, Brain, GraduationCap, ShieldCheck, Play, CheckCircle2 } from 'lucide-react';
import { Brand } from '@/components/brand/brand';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';

const features = [
  { icon: GraduationCap, title: 'Notes & moyennes', text: 'Saisis tes évaluations, coefficients et barèmes. La moyenne se recalcule instantanément.' },
  { icon: Calculator, title: 'Simulateur', text: 'Teste une note d’examen, vois son effet sur ta moyenne et découvre ce qu’il te faut obtenir.' },
  { icon: CreditCard, title: 'Crédits ECTS', text: 'Suis les UE validées, en attente et restantes, avec la progression vers ton objectif.' },
  { icon: CalendarDays, title: 'Planning', text: 'Cours, examens et révisions dans une vue semaine claire, avec les examens bien identifiés.' },
  { icon: Brain, title: 'Révisions', text: 'Un plan de la journée qui met en premier ce qui compte le plus cette semaine.' },
  { icon: LineChart, title: 'Analytics', text: 'L’évolution de ta moyenne, tes matières fortes et celles qui demandent de l’attention.' },
];
const levels = ['Collège', 'Lycée', 'BTS', 'Licence', 'Master', 'Formation pro'];

export default function LandingPage() {
  const { startDemo } = useWorkspace();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="public-page">
      <header className={`public-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <Brand href="/" />
        <nav aria-label="Sections">
          <a href="#fonctionnalites">Fonctionnalités</a>
          <a href="#comment">Comment ça marche</a>
          <a href="#niveaux">Niveaux</a>
        </nav>
        <div className="row" style={{ gap: 8 }}>
          <Link href="/login" className="button button-ghost button-sm">Connexion</Link>
          <Link href="/register" className="button button-primary button-sm">Commencer</Link>
        </div>
      </header>

      <section className="landing-hero">
        <div className="rise">
          <span className="badge badge-brand">Nouveau · Parcours, planning et objectifs réunis</span>
          <h1 style={{ marginTop: 22 }}>Comprends tes notes.<br /><span>Maîtrise ton parcours.</span><br />Atteins tes objectifs.</h1>
          <p className="lead">STUDYCORE centralise tes moyennes, crédits, examens, révisions et objectifs dans un seul espace.</p>
          <div className="cta-row">
            <Link href="/register" className="button button-primary button-lg">Commencer gratuitement <ArrowRight size={18} /></Link>
            <a href="#comment" className="button button-outline button-lg">Découvrir comment ça marche</a>
          </div>
          <div className="trust-row">
            <span><ShieldCheck size={16} />Données privées</span>
            <span><CheckCircle2 size={16} />Sans carte bancaire</span>
            <button type="button" onClick={startDemo} className="button button-link" style={{ fontSize: '0.86rem' }}><Play size={14} />Explorer la démo</button>
          </div>
        </div>
        <DashboardPreview />
      </section>

      <section className="landing-section" id="fonctionnalites">
        <p className="eyebrow">Fonctionnalités</p>
        <h2 style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.8rem)', letterSpacing: '-0.045em' }}>Tout ton parcours. Un seul endroit.</h2>
        <div className="feature-grid">
          {features.map(item => {
            const Icon = item.icon;
            return (
              <article className="feature" key={item.title}>
                <div className="feature-icon"><Icon size={21} /></div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-section" id="comment" style={{ paddingTop: 0 }}>
        <div className="split" style={{ alignItems: 'center' }}>
          <div>
            <p className="eyebrow">Comment ça marche</p>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.8rem)', letterSpacing: '-0.045em' }}>Entrée, compréhension, décision, action.</h2>
            <div className="stack" style={{ marginTop: 26, gap: 18 }}>
              {[
                ['Saisis', 'Notes, coefficients, crédits, dates et objectifs.'],
                ['Comprends', 'STUDYCORE applique les règles de ton niveau et calcule ta situation.'],
                ['Décide', 'Simule un examen, vois ce qu’il te faut obtenir, ajuste ton temps.'],
                ['Agis', 'Ton plan de révisions et ton planning te disent quoi faire maintenant.'],
              ].map(([title, text], i) => (
                <div key={title} className="row" style={{ alignItems: 'flex-start' }}>
                  <span className="stat-icon" style={{ width: 36, height: 36, borderRadius: 12, fontWeight: 700 }}>{i + 1}</span>
                  <div><h3>{title}</h3><p className="muted small" style={{ marginTop: 3 }}>{text}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel" style={{ padding: 28 }}>
            <p className="eyebrow">Ta question du jour</p>
            <h3 style={{ fontSize: '1.3rem', letterSpacing: '-0.03em' }}>« Que dois-je obtenir à l’examen d’algorithmique pour atteindre 10 ? »</h3>
            <div className="result-band" style={{ marginTop: 22 }}>
              <span className="muted small">Réponse STUDYCORE</span>
              <strong className="num" style={{ fontSize: '2.2rem', letterSpacing: '-0.05em' }}>8,34 / 20</strong>
              <span className="small">Un résultat pleinement faisable, avec une moyenne de matière déjà solide.</span>
            </div>
            <Link href="/simulator" className="button button-outline" style={{ marginTop: 20 }}>Ouvrir le simulateur <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="landing-section" id="niveaux" style={{ paddingTop: 0 }}>
        <div className="panel" style={{ display: 'grid', gap: 18, padding: 32 }}>
          <div className="row-between">
            <div><p className="eyebrow">Tous niveaux</p><h2 style={{ fontSize: '1.5rem' }}>Du collège à la formation professionnelle</h2></div>
            <div className="pill-grid">{levels.map(level => <span key={level} className="chip">{level}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="landing-section" style={{ paddingTop: 0 }}>
        <div className="hero-band">
          <div>
            <p className="eyebrow">Prêt à savoir où tu en es ?</p>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', letterSpacing: '-0.045em' }}>Enfin, je sais exactement où j’en suis.</h2>
            <p>Crée ton espace en quelques minutes, ou explore la démo avec des données fictives.</p>
          </div>
          <div className="cta-row" style={{ marginTop: 0 }}>
            <Link href="/register" className="button button-lg" style={{ background: '#fff', color: '#312e81' }}>Commencer gratuitement</Link>
            <Button type="button" variant="outline" size="lg" onClick={startDemo} style={{ background: 'transparent', color: '#fff', borderColor: 'rgb(255 255 255 / 0.4)' }}>Démo</Button>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--line)', padding: '28px clamp(18px, 5vw, 64px)', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <Brand compact href="/" />
        <p className="small faint">Résultats indicatifs, non officiels. Vérifie toujours tes résultats auprès de ton établissement. · <Link href="/resources" className="text-link">Ressources</Link> · <Link href="/mentions-legales" className="text-link">Mentions légales</Link> · <Link href="/confidentialite" className="text-link">Confidentialité</Link></p>
      </footer>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="device rise" aria-hidden="true" style={{ animationDelay: '0.1s' }}>
      <div className="device-screen">
        <div className="device-bar"><i /><i /><i /><span className="small faint" style={{ marginLeft: 8 }}>studycore · tableau de bord</span></div>
        <div className="mini-stats">
          <div className="mini-stat"><span className="tiny muted">Moyenne générale</span><strong className="num">14,27</strong><span className="tiny delta">+0,80</span></div>
          <div className="mini-stat"><span className="tiny muted">Crédits</span><strong className="num">42<small className="faint"> / 60</small></strong><span className="tiny muted">ECTS</span></div>
          <div className="mini-stat"><span className="tiny muted">Validées</span><strong className="num">8<small className="faint"> / 10</small></strong><span className="tiny muted">matières</span></div>
        </div>
        <div style={{ padding: '0 14px 16px' }}>
          <div className="surface-soft" style={{ padding: 16, display: 'grid', gap: 12 }}>
            <div className="row-between"><strong className="small">Situation académique</strong><span className="tiny faint">Semestre 1</span></div>
            {[['Algorithmique', 14.2, 'var(--ok)', 71], ['Réseaux', 13.8, 'var(--ok)', 69], ['Base de données', 8.7, 'var(--warn)', 44], ['Mathématiques', 7.9, 'var(--danger)', 39]].map(([name, value, color, width]) => (
              <div key={name as string} className="row" style={{ gap: 10 }}>
                <span className="small" style={{ width: 120 }}>{name}</span>
                <div className="progress" style={{ flex: 1 }}><span style={{ width: `${width}%`, background: color as string }} /></div>
                <strong className="num small" style={{ color: color as string }}>{(value as number).toFixed(1)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, CheckCircle2, Download, FileBadge, GraduationCap, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';

const semesters = [
  { name: 'Semestre 1', period: 'Septembre 2025 – Janvier 2026', average: '13.72', credits: '30 ECTS acquis', mention: 'Validé (Mention)', rank: '6e / 34', units: '5 / 5 validées' },
  { name: 'Semestre 2', period: 'Février 2026 – Juin 2026', average: '14.15', credits: '30 ECTS acquis', mention: 'Validé', rank: '4e / 34', units: 'Stage Immersion · 5 sem. validées' },
  { name: 'Semestre 3', period: 'Septembre 2026 – Janvier 2027', average: '14.27', credits: '26/30 ECTS proj.', mention: 'Semestre Actuel', rank: 'En cours · 12/60 ECTS', units: 'Reste épreuve finale de Base de Données Avancées et Projet Algo orienté objet.' },
  { name: 'Semestre 4', period: 'Février 2027 – Juin 2027', average: '—', credits: '30 ECTS à acquérir', mention: 'Prochainement', rank: '', units: "Projet de Fin d'Études (PFE) + Soutenance de stage." },
];

export default function PathwayPage() {
  return (
    <AppLayout>
      <div className="screen-heading"><div><Badge variant="info">◉ BTS Informatique (2025-2027) · 120 ECTS</Badge><h1>Mon Parcours</h1><p>Visualise ton cursus complet, tes validations d&apos;années et l&apos;obtention de ton diplôme.</p></div></div>
      <section className="path-overview"><div><span>PROGRESSION CURSUS</span><strong>72 <small>/ 120 ECTS</small></strong></div><div><span>MOYENNE CUMULATIVE</span><strong className="score-brand">13.98 <small>/20</small></strong></div><div className="path-progress"><span>Crédits validés certifiés</span><strong>60% acquis</strong><div className="subject-progress"><span style={{ width: '60%', background: '#4c3dea' }} /></div><small>Année 1 : 60 ECTS ✓ <span>Année 2 : 12 / 60 ECTS</span></small></div><div className="path-forecast"><Sparkles size={15} /> À ce rythme, validation estimée avec <strong>Mention Bien</strong> en juin 2027.</div></section>
      <div className="section-heading pathway-section-heading"><h2>Feuille de Route Cursus</h2><span>4 semestres</span></div>
      <div className="roadmap">
        <div className="roadmap-year"><span><CheckCircle2 size={16} /></span><div><strong>ANNÉE 1 : FONDAMENTAUX</strong><Badge variant="success">Validée · 60/60 ECTS</Badge></div></div>
        {semesters.map((semester, index) => <article className={`semester-card ${index > 1 ? 'future' : ''} ${index === 2 ? 'current' : ''}`} key={semester.name}><div className="semester-card-top"><div><span>{semester.name}</span><small>{semester.period}</small></div><div><Badge variant={index < 2 ? 'success' : index === 2 ? 'info' : 'outline'}>{semester.mention}</Badge><strong>{semester.average}<small> /20</small></strong></div></div>{index < 2 ? <div className="semester-metrics"><span><Award size={13} /> Rang Promo<strong>{semester.rank}</strong></span><span><FileBadge size={13} /> Unités (UE)<strong>{semester.units}</strong></span></div> : <div className="semester-status"><strong>{semester.credits}</strong><p>{semester.units}</p>{index === 2 && <div className="subject-progress"><span style={{ width: '82%', background: '#4d3deb' }} /></div>}</div>}</article>)}
        <div className="roadmap-year second"><span><GraduationCap size={15} /></span><div><strong>ANNÉE 2 : SPÉCIALISATION</strong><Badge variant="info">En cours · 12/60 ECTS</Badge></div></div>
      </div>
      <section className="diploma-card"><div className="section-heading"><div><h2><GraduationCap size={16} /> DIPLÔME : BTS INFORMATIQUE</h2><p>Objectif de sortie <Badge variant="info">Grade BAC+2</Badge></p></div></div><strong className="diploma-goal">Cible Mention Bien <span>Seuil ≥ 14.00</span></strong><ul><li><CheckCircle2 size={15} />120 ECTS cumulés requis (72 acquis à ce jour)</li><li><CheckCircle2 size={15} />Moyenne cycle ≥ 10.00 (Moyenne actuelle : 13.98)</li><li><LockKeyhole size={15} />Stage certifié et soutenance finale validée</li></ul></section>
      <section className="certificates-panel"><div className="section-heading"><span><ShieldCheck size={18} /></span><div><h2>Attestations Officielles</h2><p>Conformes aux normes ECTS académiques</p></div></div><p>Tous les relevés générés disposent d&apos;un cachet d&apos;intégrité numérique et d&apos;un QR code de vérification pour les universités et employeurs.</p><Button className="w-full"><Download size={15} className="mr-2" />Exporter le Relevé Certifié (PDF)</Button><Button className="mt-2 w-full" variant="secondary"><FileBadge size={15} className="mr-2" />Attestation de Crédits ECTS</Button><small>• Signé par Secrétariat Pédagogique <span>MAJ : 14/02/2027</span></small></section>
      <Link href="/credits" className="path-credits-link">Voir le détail des crédits <ArrowRight size={15} /></Link>
    </AppLayout>
  );
}

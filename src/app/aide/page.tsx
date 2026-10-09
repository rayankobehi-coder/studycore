import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead } from '@/components/academic';

const faqs = [
  {
    q: 'Mes résultats sont-ils officiels ?',
    a: 'Non. Les moyennes, crédits et simulations sont indicatifs. Ils reposent sur les notes que tu saisis et sur des règles de calcul paramétrables. Seuls les relevés de ton établissement font foi.',
  },
  {
    q: 'Où sont enregistrées mes données ?',
    a: 'Dans ton navigateur, en local. Si la synchronisation de compte est activée, elles sont aussi sauvegardées sur ton compte, accessible uniquement par toi.',
  },
  {
    q: 'Comment fonctionne le mode démo ?',
    a: 'Le bouton « Démo » ouvre un espace rempli de données fictives. Tu peux tout tester sans risque, puis effacer ces données depuis les paramètres.',
  },
  {
    q: 'Comment sauvegarder mes notes ?',
    a: 'Depuis Paramètres, tu peux exporter une sauvegarde complète en JSON, tes notes en CSV, ou un bilan en Markdown. La sauvegarde JSON peut être réimportée.',
  },
  {
    q: 'Comment utiliser le simulateur ?',
    a: 'Choisis une matière, indique la note visée et le coefficient de l’examen. Le simulateur calcule la moyenne obtenue et la note minimale nécessaire.',
  },
  {
    q: 'Comment changer le thème ?',
    a: 'Le bouton du haut de l’écran alterne entre clair, sombre et système. Ton choix est retenu sur cet appareil.',
  },
];

export default function HelpPage() {
  return (
    <AppLayout title="Aide">
      <PageHead eyebrow="Aide" title="Centre d’aide" description="Réponses courtes aux questions les plus fréquentes. Pour la confidentialité, consulte la page dédiée." />
      <div className="card faq" style={{ padding: '8px 22px' }}>
        {faqs.map(item => (
          <details key={item.q} style={{ borderBottom: '1px solid var(--line)', padding: '16px 0' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{item.q}</summary>
            <p className="muted" style={{ marginTop: 10, lineHeight: 1.6 }}>{item.a}</p>
          </details>
        ))}
      </div>
      <p className="small muted" style={{ marginTop: 20 }}>
        Liens utiles : <Link href="/mentions-legales" className="text-link">Mentions légales</Link> · <Link href="/confidentialite" className="text-link">Confidentialité</Link>
      </p>
    </AppLayout>
  );
}

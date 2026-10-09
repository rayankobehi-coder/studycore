import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="legal">
      <p className="small"><Link href="/" className="text-link">← Retour à l’accueil</Link></p>
      <h1 style={{ marginTop: 16 }}>Confidentialité</h1>
      <p className="lead">Quelles données STUDYCORE conserve, où, et comment les effacer.</p>

      <section>
        <h2>Où sont tes données</h2>
        <p>Tes matières, notes et échéances sont enregistrées dans ton navigateur. Si la synchronisation de compte est activée, elles sont aussi enregistrées sur ton compte, dans une table protégée par des règles d’accès qui limitent la lecture et l’écriture à ton seul compte.</p>
      </section>

      <section>
        <h2>Export et suppression</h2>
        <p>Tu peux exporter tes données en JSON, CSV ou Markdown depuis les paramètres. Tu peux aussi effacer toutes les données locales depuis les paramètres.</p>
      </section>

      <section>
        <h2>Mode démonstration</h2>
        <p>Le mode démonstration n’utilise que des données fictives et n’envoie aucune donnée personnelle.</p>
      </section>

      <section>
        <h2>Tes droits</h2>
        <p>Tu peux demander l’accès, la correction ou la suppression de tes données via le <Link href="/aide" className="text-link">centre d’aide</Link>.</p>
      </section>
    </main>
  );
}

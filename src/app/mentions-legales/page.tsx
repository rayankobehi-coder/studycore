import Link from 'next/link';

export default function LegalNoticePage() {
  return (
    <main className="legal">
      <p className="small"><Link href="/" className="text-link">← Retour à l’accueil</Link></p>
      <h1 style={{ marginTop: 16 }}>Mentions légales</h1>
      <p className="lead">Informations sur l’éditeur de STUDYCORE et sur la nature des résultats affichés.</p>

      <section>
        <h2>Éditeur</h2>
        <p>STUDYCORE est un projet d’accompagnement académique. Les informations d’identification de l’éditeur seront publiées ici avant la mise en service publique.</p>
      </section>

      <section>
        <h2>Nature des résultats</h2>
        <p>Les moyennes, crédits, simulations et indicateurs affichés par STUDYCORE sont <strong>indicatifs et non officiels</strong>. Ils reposent sur les données saisies par l’utilisateur et sur des règles de calcul paramétrables.</p>
        <p>Seuls les relevés et décisions de ton établissement font foi. Vérifie toujours tes résultats auprès de lui.</p>
      </section>

      <section>
        <h2>Données de démonstration</h2>
        <p>Le mode démonstration utilise des données entièrement fictives. Aucune donnée personnelle réelle n’est présente dans ce mode.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Pour toute question sur le site, utilise le <Link href="/aide" className="text-link">centre d’aide</Link>.</p>
      </section>
    </main>
  );
}

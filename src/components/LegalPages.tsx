import React, { useState } from "react";
import { FileText, Shield, Lock, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

type Lang = "fr" | "en";

// ─── Shared section accordion ────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-slate-800/60 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-900/60 hover:bg-slate-900 transition text-left">
        <span className="text-sm font-black text-white">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {open && <div className="px-5 py-4 bg-slate-950/40 space-y-3">{children}</div>}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] text-slate-400 leading-relaxed">{children}</p>;
}

function H({ children }: { children: React.ReactNode }) {
  return <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mt-4 mb-1">{children}</h4>;
}

// ═══════════════════════════════════════════════════════════
// CGU — Conditions Générales d'Utilisation
// ═══════════════════════════════════════════════════════════
export function CGUPage({ lang }: { lang: Lang }) {
  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-16">
      <PageHeader
        icon={<FileText className="w-6 h-6 text-amber-400" />}
        badge={lang === "fr" ? "Légal" : "Legal"}
        title={lang === "fr" ? "Conditions Générales d'Utilisation" : "Terms of Use"}
        subtitle={lang === "fr" ? "Dernière mise à jour : juin 2026 — Version 1.0" : "Last updated: June 2026 — Version 1.0"}
        color="amber"
      />

      {lang === "fr" ? (
        <>
          <Section title="1. Présentation de KIDIWORLD">
            <P>KIDIWORLD est une plateforme créative numérique éditée par <strong className="text-white">LINKYOURART SAS</strong>, société par actions simplifiée au capital variable, dont le siège social est situé en France. KIDIWORLD est un incubateur de talents artistiques dédié aux jeunes de 4 à 18 ans.</P>
            <P>La plateforme permet aux utilisateurs de participer à des challenges créatifs, de soumettre leurs œuvres à des jurys professionnels, d'accéder à des outils de création (éditeur de scénario, studio musical, atelier graphique) et d'interagir avec un coach IA bienveillant.</P>
          </Section>
          <Section title="2. Acceptation des CGU">
            <P>L'accès et l'utilisation de KIDIWORLD impliquent l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation. Pour les utilisateurs mineurs (moins de 18 ans), l'acceptation doit être réalisée par le titulaire de l'autorité parentale ou le représentant légal.</P>
            <P>LINKYOURART se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par notification sur la plateforme. La poursuite de l'utilisation vaut acceptation des nouvelles conditions.</P>
          </Section>
          <Section title="3. Création de compte & Profil">
            <P>L'inscription est gratuite. Chaque compte est associé à un profil utilisateur comprenant : prénom, tranche d'âge, langue, et préférences créatives. Aucune donnée personnelle sensible n'est requise.</P>
            <P>Les parents ou tuteurs légaux peuvent configurer un code de contrôle parental pour superviser l'activité de leur enfant sur la plateforme. Ce contrôle parental est accessible depuis la section "Profil & Contrôle" de la plateforme.</P>
            <H>Tranches d'âge & Adaptation des contenus</H>
            <P>KIDIWORLD adapte automatiquement ses contenus, challenges et outils en fonction de la tranche d'âge déclarée : <strong className="text-white">4-7 ans (Bout d'Chou)</strong>, <strong className="text-white">8-11 ans (Explo)</strong>, <strong className="text-white">12-15 ans (Junior)</strong>, <strong className="text-white">16-18 ans (Senior)</strong>. Cette adaptation garantit que chaque utilisateur accède à des défis et outils adaptés à son développement cognitif et créatif.</P>
          </Section>
          <Section title="4. Propriété intellectuelle des créations">
            <P>Tout contenu créatif soumis par les utilisateurs (scénarios, musiques, dessins, photographies, podcasts, etc.) reste la <strong className="text-white">propriété intellectuelle exclusive de leur auteur</strong>.</P>
            <P>En soumettant une création sur KIDIWORLD, l'utilisateur accorde à LINKYOURART une licence non exclusive, gratuite, mondiale et révocable pour afficher, reproduire et promouvoir ladite création dans le cadre des activités de la plateforme (galerie, classements, communications marketing).</P>
            <P>LINKYOURART s'engage à ne jamais céder, vendre ou exploiter commercialement les créations des utilisateurs sans accord écrit préalable de l'auteur ou de son représentant légal.</P>
          </Section>
          <Section title="5. Règles de conduite & Modération">
            <P>KIDIWORLD est une plateforme sécurisée dédiée aux mineurs. Tout contenu à caractère violent, sexuel, discriminatoire, harcelant ou illégal est strictement interdit et entraînera la suppression immédiate du compte.</P>
            <P>Une équipe de modération humaine et des filtres automatisés veillent en permanence à la sécurité des contenus. Les utilisateurs peuvent signaler tout contenu inapproprié via le bouton de signalement disponible sur chaque création.</P>
          </Section>
          <Section title="6. Responsabilité & Garanties">
            <P>KIDIWORLD est fournie "en l'état". LINKYOURART ne saurait être tenu responsable des interruptions de service, des pertes de données accidentelles ou des dommages indirects liés à l'utilisation de la plateforme.</P>
            <P>LINKYOURART s'engage à maintenir un niveau de disponibilité de 99% hors opérations de maintenance planifiées, et à notifier les utilisateurs 24h à l'avance de toute interruption programmée.</P>
          </Section>
          <Section title="7. Droit applicable & Juridiction">
            <P>Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation ou exécution sera soumis aux tribunaux compétents du ressort du siège social de LINKYOURART SAS, sauf dispositions légales impératives contraires.</P>
          </Section>
        </>
      ) : (
        <>
          <Section title="1. About KIDIWORLD">
            <P>KIDIWORLD is a digital creative platform published by <strong className="text-white">LINKYOURART SAS</strong>, a French simplified joint-stock company. KIDIWORLD is an artistic talent incubator dedicated to young people aged 4 to 18.</P>
            <P>The platform allows users to participate in creative challenges, submit their works to professional juries, access creation tools (screenplay editor, music studio, graphic workshop) and interact with a supportive AI coach.</P>
          </Section>
          <Section title="2. Acceptance of Terms">
            <P>Access to and use of KIDIWORLD implies full acceptance of these Terms of Use. For minor users (under 18), acceptance must be given by the holder of parental authority or legal representative.</P>
            <P>LINKYOURART reserves the right to modify these Terms at any time. Users will be notified via a platform notification. Continued use constitutes acceptance of the new terms.</P>
          </Section>
          <Section title="3. Account Creation & Profile">
            <P>Registration is free. Each account is linked to a user profile including: first name, age group, language, and creative preferences. No sensitive personal data is required.</P>
            <P>Parents or legal guardians can set a parental control code to supervise their child's activity on the platform, accessible from the "Profile & Control" section.</P>
            <H>Age Groups & Content Adaptation</H>
            <P>KIDIWORLD automatically adapts its content, challenges and tools based on the declared age group: <strong className="text-white">4-7 years (Little One)</strong>, <strong className="text-white">8-11 years (Explorer)</strong>, <strong className="text-white">12-15 years (Junior)</strong>, <strong className="text-white">16-18 years (Senior)</strong>. This ensures each user accesses challenges and tools suited to their cognitive and creative development.</P>
          </Section>
          <Section title="4. Intellectual Property of Creations">
            <P>All creative content submitted by users (screenplays, music, drawings, photography, podcasts, etc.) remains the <strong className="text-white">exclusive intellectual property of their author</strong>.</P>
            <P>By submitting a creation on KIDIWORLD, the user grants LINKYOURART a non-exclusive, free, worldwide and revocable license to display, reproduce and promote said creation within the platform's activities.</P>
            <P>LINKYOURART commits to never transfer, sell or commercially exploit users' creations without prior written agreement from the author or their legal representative.</P>
          </Section>
          <Section title="5. Code of Conduct & Moderation">
            <P>KIDIWORLD is a secure platform dedicated to minors. Any violent, sexual, discriminatory, harassing or illegal content is strictly prohibited and will result in immediate account deletion.</P>
            <P>A human moderation team and automated filters continuously ensure content safety. Users can report any inappropriate content via the report button on each creation.</P>
          </Section>
          <Section title="6. Liability & Warranties">
            <P>KIDIWORLD is provided "as is". LINKYOURART cannot be held responsible for service interruptions, accidental data loss or indirect damages related to use of the platform.</P>
          </Section>
          <Section title="7. Applicable Law & Jurisdiction">
            <P>These Terms are governed by French law. Any dispute will be submitted to the competent courts of LINKYOURART SAS's registered office jurisdiction.</P>
          </Section>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Privacy Policy
// ═══════════════════════════════════════════════════════════
export function PrivacyPage({ lang }: { lang: Lang }) {
  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-16">
      <PageHeader
        icon={<Lock className="w-6 h-6 text-indigo-400" />}
        badge={lang === "fr" ? "Protection des données" : "Data Protection"}
        title={lang === "fr" ? "Politique de Confidentialité" : "Privacy Policy"}
        subtitle={lang === "fr" ? "Conforme au RGPD — Dernière mise à jour : juin 2026" : "GDPR Compliant — Last updated: June 2026"}
        color="indigo"
      />

      {lang === "fr" ? (
        <>
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <P>KIDIWORLD applique une politique <strong className="text-emerald-400">Zéro Collecte Excessive</strong> : nous ne collectons que les données strictement nécessaires au fonctionnement de la plateforme. Zéro publicité, zéro revente de données, zéro tracking tiers.</P>
          </div>
          <Section title="1. Responsable du traitement">
            <P><strong className="text-white">LINKYOURART SAS</strong> — Responsable du traitement des données à caractère personnel collectées sur KIDIWORLD. Contact DPO : <a href="mailto:privacy@kidi.world" className="text-indigo-400 hover:underline">privacy@kidi.world</a></P>
          </Section>
          <Section title="2. Données collectées">
            <H>Données de profil (obligatoires)</H>
            <P>• Prénom (pas de nom de famille requis)<br/>• Tranche d'âge (pas de date de naissance exacte)<br/>• Langue préférée<br/>• Identifiant anonymisé de session</P>
            <H>Données de création (générées par l'utilisateur)</H>
            <P>• Scénarios, compositions, dessins, podcasts soumis par l'utilisateur<br/>• Ces données restent la propriété de l'utilisateur et sont chiffrées au repos</P>
            <H>Données techniques (collecte minimale)</H>
            <P>• Logs de connexion anonymisés (adresse IP tronquée)<br/>• Données de performance technique (pas d'identification utilisateur)<br/>• Aucun cookie de tracking tiers</P>
          </Section>
          <Section title="3. Finalités du traitement">
            <P>Les données sont utilisées exclusivement pour : fournir les fonctionnalités de la plateforme, adapter les contenus à la tranche d'âge, assurer la sécurité et la modération, et améliorer l'expérience utilisateur. Aucune donnée n'est utilisée à des fins publicitaires ou revendue à des tiers.</P>
          </Section>
          <Section title="4. Protection des mineurs (RGPD Art. 8)">
            <P>Conformément au RGPD et à la directive ePrivacy, KIDIWORLD applique des mesures renforcées pour les utilisateurs mineurs :</P>
            <P>• Le consentement parental est requis pour les utilisateurs de moins de 15 ans<br/>• Les données des mineurs ne sont jamais partagées avec des tiers<br/>• Le contrôle parental permet aux représentants légaux de consulter, modifier ou supprimer les données de leur enfant<br/>• Conservation limitée : données supprimées 30 jours après la désactivation du compte</P>
          </Section>
          <Section title="5. Vos droits (RGPD)">
            <P>Conformément au RGPD, vous disposez des droits suivants : <strong className="text-white">accès, rectification, effacement ("droit à l'oubli"), portabilité, limitation, opposition</strong>. Pour exercer ces droits, contactez : <a href="mailto:privacy@kidi.world" className="text-indigo-400 hover:underline">privacy@kidi.world</a></P>
            <P>Délai de réponse : 30 jours maximum. Vous pouvez également introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés).</P>
          </Section>
          <Section title="6. Sécurité des données">
            <P>KIDIWORLD utilise le chiffrement TLS 1.3 pour toutes les communications. Les données au repos sont chiffrées AES-256. Nos serveurs sont hébergés en Europe (conformité RGPD). Des audits de sécurité réguliers sont réalisés par des prestataires indépendants.</P>
          </Section>
        </>
      ) : (
        <>
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <P>KIDIWORLD applies a <strong className="text-emerald-400">Zero Excessive Collection</strong> policy: we only collect data strictly necessary for the platform to function. No ads, no data reselling, no third-party tracking.</P>
          </div>
          <Section title="1. Data Controller">
            <P><strong className="text-white">LINKYOURART SAS</strong> — Data controller for personal data collected on KIDIWORLD. DPO contact: <a href="mailto:privacy@kidi.world" className="text-indigo-400 hover:underline">privacy@kidi.world</a></P>
          </Section>
          <Section title="2. Data Collected">
            <H>Profile data (required)</H>
            <P>• First name (no last name required)<br/>• Age group (no exact date of birth)<br/>• Preferred language<br/>• Anonymised session identifier</P>
            <H>Creation data (user-generated)</H>
            <P>• Screenplays, compositions, drawings, podcasts submitted by the user<br/>• This data remains the user's property and is encrypted at rest</P>
            <H>Technical data (minimal collection)</H>
            <P>• Anonymised connection logs (truncated IP)<br/>• Technical performance data (no user identification)<br/>• No third-party tracking cookies</P>
          </Section>
          <Section title="3. Processing Purposes">
            <P>Data is used exclusively to: provide platform features, adapt content to age group, ensure safety and moderation, and improve user experience. No data is used for advertising or sold to third parties.</P>
          </Section>
          <Section title="4. Protection of Minors (GDPR Art. 8)">
            <P>In compliance with GDPR and the ePrivacy directive, KIDIWORLD applies enhanced measures for minor users:</P>
            <P>• Parental consent required for users under 15<br/>• Minors' data is never shared with third parties<br/>• Parental controls allow legal representatives to view, edit or delete their child's data<br/>• Limited retention: data deleted 30 days after account deactivation</P>
          </Section>
          <Section title="5. Your Rights (GDPR)">
            <P>Under GDPR, you have the following rights: <strong className="text-white">access, rectification, erasure ("right to be forgotten"), portability, restriction, objection</strong>. To exercise these rights: <a href="mailto:privacy@kidi.world" className="text-indigo-400 hover:underline">privacy@kidi.world</a></P>
          </Section>
          <Section title="6. Data Security">
            <P>KIDIWORLD uses TLS 1.3 encryption for all communications. Data at rest is AES-256 encrypted. Servers are hosted in Europe (GDPR compliant). Regular security audits are conducted by independent providers.</P>
          </Section>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Legal Notice / Mentions Légales
// ═══════════════════════════════════════════════════════════
export function LegalNoticePage({ lang }: { lang: Lang }) {
  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-16">
      <PageHeader
        icon={<Shield className="w-6 h-6 text-teal-400" />}
        badge={lang === "fr" ? "Transparence" : "Transparency"}
        title={lang === "fr" ? "Mentions Légales" : "Legal Notice"}
        subtitle={lang === "fr" ? "Conformément à la loi française n°2004-575 du 21 juin 2004" : "In accordance with French law n°2004-575 of June 21, 2004"}
        color="teal"
      />

      {lang === "fr" ? (
        <>
          <Section title="Éditeur de la plateforme">
            <P><strong className="text-white">Raison sociale :</strong> LINKYOURART SAS</P>
            <P><strong className="text-white">Forme juridique :</strong> Société par Actions Simplifiée (SAS)</P>
            <P><strong className="text-white">Pays :</strong> France 🇫🇷</P>
            <P><strong className="text-white">Email :</strong> <a href="mailto:contact@kidi.world" className="text-teal-400 hover:underline">contact@kidi.world</a></P>
            <P><strong className="text-white">Directeur de la publication :</strong> Équipe dirigeante LINKYOURART</P>
          </Section>
          <Section title="Hébergement">
            <P><strong className="text-white">Hébergeur :</strong> Vercel Inc.</P>
            <P><strong className="text-white">Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</P>
            <P><strong className="text-white">Site :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">vercel.com</a></P>
            <P>Les données des utilisateurs européens sont traitées conformément au RGPD via les mécanismes de transfert approuvés par la Commission Européenne.</P>
          </Section>
          <Section title="Propriété intellectuelle">
            <P>La marque <strong className="text-white">KIDIWORLD</strong>, le logo KW, l'identité visuelle et tous les éléments constitutifs de la plateforme sont la propriété exclusive de <strong className="text-white">LINKYOURART SAS</strong>.</P>
            <P>Toute reproduction, représentation, modification ou exploitation non autorisée de ces éléments engage la responsabilité civile et/ou pénale de son auteur.</P>
            <P>Les créations soumises par les utilisateurs restent la propriété intellectuelle de leurs auteurs. KIDIWORLD n'en revendique aucun droit de propriété.</P>
          </Section>
          <Section title="Limitation de responsabilité">
            <P>LINKYOURART met tout en œuvre pour assurer l'exactitude et la mise à jour des informations diffusées sur KIDIWORLD. Cependant, LINKYOURART ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à la disposition des utilisateurs.</P>
          </Section>
          <Section title="Contact & Signalement">
            <P>Pour tout signalement de contenu inapproprié, demande de droit à l'oubli, ou question légale : <a href="mailto:legal@kidi.world" className="text-teal-400 hover:underline">legal@kidi.world</a></P>
            <P>Pour le contrôle parental et la protection des mineurs : <a href="mailto:parents@kidi.world" className="text-teal-400 hover:underline">parents@kidi.world</a></P>
          </Section>
        </>
      ) : (
        <>
          <Section title="Platform Publisher">
            <P><strong className="text-white">Company name:</strong> LINKYOURART SAS</P>
            <P><strong className="text-white">Legal form:</strong> Simplified Joint-Stock Company (SAS)</P>
            <P><strong className="text-white">Country:</strong> France 🇫🇷</P>
            <P><strong className="text-white">Email:</strong> <a href="mailto:contact@kidi.world" className="text-teal-400 hover:underline">contact@kidi.world</a></P>
          </Section>
          <Section title="Hosting">
            <P><strong className="text-white">Host:</strong> Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, USA</P>
            <P>European users' data is processed in compliance with GDPR via transfer mechanisms approved by the European Commission.</P>
          </Section>
          <Section title="Intellectual Property">
            <P>The <strong className="text-white">KIDIWORLD</strong> brand, KW logo, visual identity and all platform elements are the exclusive property of <strong className="text-white">LINKYOURART SAS</strong>.</P>
            <P>Creations submitted by users remain their authors' intellectual property. KIDIWORLD claims no ownership rights over them.</P>
          </Section>
          <Section title="Contact & Reporting">
            <P>To report inappropriate content, right to erasure requests, or legal questions: <a href="mailto:legal@kidi.world" className="text-teal-400 hover:underline">legal@kidi.world</a></P>
            <P>For parental control and child protection: <a href="mailto:parents@kidi.world" className="text-teal-400 hover:underline">parents@kidi.world</a></P>
          </Section>
        </>
      )}
    </div>
  );
}

// ─── Shared page header ──────────────────────────────────────
function PageHeader({ icon, badge, title, subtitle, color }: {
  icon: React.ReactNode; badge: string; title: string; subtitle: string;
  color: "amber" | "indigo" | "teal";
}) {
  const colors = {
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    teal: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  };
  return (
    <div className="space-y-3 pb-4 border-b border-slate-800/60">
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${colors[color]}`}>
        {icon} {badge}
      </span>
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <p className="text-xs text-slate-500 font-mono">{subtitle}</p>
    </div>
  );
}

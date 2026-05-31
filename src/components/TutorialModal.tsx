import React from "react";
import { Bot, Award, Coins, Shield, Clock, Globe, Film, PenTool, Volume2, Users, Sparkles } from "lucide-react";
import { UserProfile, AccountSession } from "./AccountAuth";

interface TutorialModalProps {
  tutorialStep: number;
  setTutorialStep: (s: number) => void;
  tutorialLang: "fr" | "en";
  setTutorialLang: (l: "fr" | "en") => void;
  onClose: () => void;
  profile: UserProfile;
  role: string;
  statsStars: number;
  accountSession: AccountSession;
}

export default function TutorialModal({
  tutorialStep, setTutorialStep,
  tutorialLang, setTutorialLang,
  onClose, profile, role, statsStars, accountSession
}: TutorialModalProps) {

  const TOTAL_STEPS = 5;
  const tl = tutorialLang;

  const T = {
    fr: {
      badge: "Guide Interactif", by: "Propulsé par", profile: "Ton Profil",
      labelName: "Nom", labelRole: "Rôle", labelStars: "Étoiles", labelCoins: "KidiCoins",
      roleArtist: "Jeune Artiste", roleJury: "Comité Jury",
      stepLabel: "Étape", of: "sur", close: "Fermer", prev: "Précédent", next: "Suivant",
      start: "C'est parti ! 🚀", tip: "💡 Fais une pause de 5 min toutes les 30 min !",
      steps: [
        {
          emoji: "🌍", color: "amber",
          title: "Qu'est-ce que KIDIWORLD ?",
          intro: "KIDIWORLD est un vrai incubateur artistique pour les jeunes de 4 à 18 ans, soutenu par LinkYourArt.",
          items: [
            { icon: "🎯", color: "amber", title: "Des Défis Artistiques Réels", desc: "Chaque mois, de nouveaux Challenges créatifs dans 8 catégories : Cinéma, Musique, Design, 3D & Jeux, Photo, Architecture, TV Séries et Podcast. Des professionnels du secteur parrainent chaque défi." },
            { icon: "🏆", color: "pink", title: "Un Jury Professionnel", desc: "Tes créations sont évaluées par de vrais experts : réalisateurs, compositeurs, designers, photographes. Tu reçois des retours constructifs et bienveillants." },
            { icon: "🔒", color: "indigo", title: "Sécurisé & Sans Pub", desc: "Zéro publicité, zéro tracking, zéro achat forcé. KIDIWORLD est un espace de création pure, conforme RGPD, avec contrôle parental intégré." },
          ]
        },
        {
          emoji: "🗺️", color: "indigo",
          title: "Comment naviguer sur KIDIWORLD ?",
          intro: "La plateforme est organisée en onglets. Voici comment t'y retrouver :",
          items: [
            { icon: "🔍", color: "indigo", title: "Onglet Explorer — Le cœur des Défis", desc: "Tu découvres tous les challenges actifs, tu filtres par catégorie (multi-sélection), et tu cliques sur un défi pour voir ses indices et y participer." },
            { icon: "🎮", color: "violet", title: "Onglet KidiGaming — Ton Espace de Création", desc: "Ton atelier personnel. Tu y écris ton scénario, composes ta musique, dessines ton costume. Tout est sauvegardé automatiquement." },
            { icon: "📺", color: "teal", title: "Onglet KidiStream — La Galerie", desc: "Découvre les œuvres des autres jeunes talents. Like, commente, et inspire-toi. Les meilleures créations sont mises en avant chaque semaine." },
          ]
        },
        {
          emoji: "🎨", color: "pink",
          title: "Participer à un Défi — Étape par Étape",
          intro: "Voici comment fonctionne un challenge KIDIWORLD de A à Z :",
          items: [
            { icon: "1️⃣", color: "amber", title: "Choisis ton Défi dans l'Explorer", desc: "Filtre par catégorie, lis le brief du défi, découvre qui le parraine et les récompenses à gagner. Clique sur ▶ Participer." },
            { icon: "2️⃣", color: "pink", title: "Débloque les Indices Jour par Jour", desc: "Chaque défi révèle des indices progressifs. Un nouvel indice se débloque chaque jour — cela t'aide à construire ton projet étape par étape." },
            { icon: "3️⃣", color: "indigo", title: "Crée dans ton Workspace & Soumets", desc: "Utilise l'éditeur de scénario, le studio musical ou le tableau de dessin. Quand tu es prêt, clique sur 🚀 Soumettre. Ton œuvre part au jury !" },
          ]
        },
        {
          emoji: "🤖", color: "violet",
          title: "Linky — Ton Coach IA Personnel",
          intro: "Le bouton violet en bas à droite ouvre le chat avec Linky, ton mentor IA disponible 24h/24.",
          items: [
            { icon: "🪐", color: "violet", title: "Linky — Coach Créatif", desc: "Pose-lui n'importe quelle question sur ton projet : comment commencer, structurer ton histoire, améliorer ta mélodie. Il répond avec bienveillance." },
            { icon: "🎬", color: "amber", title: "Jérôme Salle — Parrain Cinéma", desc: "Conseils de réalisateur pro : cadrage, rythme narratif, dialogues percutants, construction de l'acte 1." },
            { icon: "🎹", color: "pink", title: "Hans Zimmer — Parrain Musique", desc: "Conseils de compositeur légendaire : atmosphères sonores, émotions musicales, leitmotivs, orchestration simple." },
          ]
        },
        {
          emoji: "⭐", color: "teal",
          title: "Récompenses, Étoiles & KidiCoins",
          intro: "KIDIWORLD récompense chaque effort. Plus tu crées, plus tu progresses !",
          items: [
            { icon: "⭐", color: "amber", title: "Étoiles — Ton Score de Progression", desc: "Chaque projet soumis, chaque feedback reçu te rapporte des étoiles. Les étoiles définissent ton rang dans le classement global." },
            { icon: "💰", color: "teal", title: "KidiCoins — Ta Monnaie Créative", desc: "Les KidiCoins récompensent tes actions : soumettre un projet, aider un pair, décrocher un top jury..." },
            { icon: "🎓", color: "indigo", title: "Badges & Titres Honorifiques", desc: "Deviens \"Novice Cinéaste\", \"Grand Virtuose\" ou \"Master Scénario\". Chaque badge est une vraie reconnaissance de ton talent." },
          ]
        },
      ]
    },
    en: {
      badge: "Interactive Guide", by: "Powered by", profile: "Your Profile",
      labelName: "Name", labelRole: "Role", labelStars: "Stars", labelCoins: "KidiCoins",
      roleArtist: "Young Artist", roleJury: "Jury Committee",
      stepLabel: "Step", of: "of", close: "Close", prev: "Previous", next: "Next",
      start: "Let's go! 🚀", tip: "💡 Take a 5-min break every 30 minutes!",
      steps: [
        {
          emoji: "🌍", color: "amber",
          title: "What is KIDIWORLD?",
          intro: "KIDIWORLD is a real artistic incubator for young people aged 4 to 18, supported by LinkYourArt.",
          items: [
            { icon: "🎯", color: "amber", title: "Real Artistic Challenges", desc: "Every month, new creative challenges across 8 categories: Cinema, Music, Design, 3D & Games, Photography, Architecture, TV Series and Podcast." },
            { icon: "🏆", color: "pink", title: "A Professional Jury", desc: "Your creations are evaluated by real experts: directors, composers, designers, photographers. You receive constructive and encouraging feedback." },
            { icon: "🔒", color: "indigo", title: "Safe & Ad-Free", desc: "Zero ads, zero tracking, zero forced purchases. KIDIWORLD is a pure creative space, GDPR compliant, with built-in parental controls." },
          ]
        },
        {
          emoji: "🗺️", color: "indigo",
          title: "How to navigate KIDIWORLD?",
          intro: "The platform is organized into tabs. Here's how to find your way:",
          items: [
            { icon: "🔍", color: "indigo", title: "Explorer Tab — The Challenge Hub", desc: "Discover all active challenges, filter by category, and click a challenge to see its clues and how to participate." },
            { icon: "🎮", color: "violet", title: "KidiGaming Tab — Your Creative Space", desc: "Your personal workshop. Write your screenplay, compose music, draw costumes. Everything auto-saves." },
            { icon: "📺", color: "teal", title: "KidiStream Tab — The Gallery", desc: "Discover works from other young talents worldwide. Like, comment, get inspired." },
          ]
        },
        {
          emoji: "🎨", color: "pink",
          title: "How to Join a Challenge",
          intro: "Here's how a KIDIWORLD challenge works from start to finish:",
          items: [
            { icon: "1️⃣", color: "amber", title: "Pick your Challenge in the Explorer", desc: "Filter by category, read the challenge brief, discover the sponsor and rewards. Click ▶ Join." },
            { icon: "2️⃣", color: "pink", title: "Unlock Clues Day by Day", desc: "Each challenge reveals progressive clues. A new clue unlocks each day — helping you build your project step by step." },
            { icon: "3️⃣", color: "indigo", title: "Create in your Workspace & Submit", desc: "Use the screenplay editor, music studio or drawing board. When ready, click 🚀 Submit. Your work goes to the jury!" },
          ]
        },
        {
          emoji: "🤖", color: "violet",
          title: "Linky — Your Personal AI Coach",
          intro: "The purple button at the bottom right opens chat with Linky, your 24/7 AI mentor.",
          items: [
            { icon: "🪐", color: "violet", title: "Linky — Creative Coach", desc: "Ask anything about your project: how to start, structure your story, improve your melody. Linky replies with kindness." },
            { icon: "🎬", color: "amber", title: "Jérôme Salle — Cinema Mentor", desc: "Pro director advice: framing, narrative pacing, punchy dialogue, building act 1." },
            { icon: "🎹", color: "pink", title: "Hans Zimmer — Music Mentor", desc: "Legendary composer advice: soundscapes, musical emotions, leitmotifs, simple orchestration." },
          ]
        },
        {
          emoji: "⭐", color: "teal",
          title: "Rewards, Stars & KidiCoins",
          intro: "KIDIWORLD rewards every effort. The more you create, the more you grow!",
          items: [
            { icon: "⭐", color: "amber", title: "Stars — Your Progress Score", desc: "Every submitted project and received feedback earns stars. Stars define your rank in the global leaderboard." },
            { icon: "💰", color: "teal", title: "KidiCoins — Your Creative Currency", desc: "KidiCoins reward your actions: submitting a project, helping a peer, hitting the top jury..." },
            { icon: "🎓", color: "indigo", title: "Badges & Honorary Titles", desc: "Become a 'Novice Filmmaker', 'Grand Virtuoso' or 'Screenplay Master'. Each badge is genuine recognition of your talent." },
          ]
        },
      ]
    }
  };

  const t = T[tl];
  const step = t.steps[tutorialStep - 1];

  const colorMap: Record<string, string> = {
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    pink: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    teal: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  };
  const barColors = ["bg-amber-500", "bg-indigo-500", "bg-pink-500", "bg-violet-500", "bg-teal-500"];

  return (
    <div
      id="tutorial-modal-overlay"
      className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl flex justify-center items-center z-[9999] p-3 md:p-6"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === "tutorial-modal-overlay") onClose();
      }}
    >
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: "10s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />

      <div
        className="relative w-full max-w-4xl max-h-[94vh] bg-slate-950 border border-slate-800/60 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.15)] flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500 z-10" />

        {/* LEFT PANEL */}
        <div className="w-full md:w-72 bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-800/60 p-6 flex flex-col justify-between shrink-0 relative overflow-hidden">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-500/8 rounded-full blur-3xl" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/8 rounded-full blur-3xl" />

          <div className="space-y-5 relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600 flex items-center justify-center shadow-lg shrink-0">
                <span className="text-slate-950 font-black text-[13px]" style={{ letterSpacing: '-0.05em' }}>KW</span>
              </div>
              <div>
                <div className="text-lg font-black">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">KIDI</span>
                  <span className="text-white">WORLD</span>
                </div>
                <div className="text-[9px] text-slate-500 font-mono uppercase">{t.by} LinkYourArt</div>
              </div>
            </div>

            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              {t.badge}
            </span>

            {/* Lang switcher */}
            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold font-mono block">🌍 Langue / Language</span>
              <div className="flex gap-2">
                {(["fr", "en"] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setTutorialLang(lang)}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition border ${
                      tutorialLang === lang
                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md"
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                    }`}
                  >
                    {lang === "fr" ? "🇫🇷 Français" : "🇬🇧 English"}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile */}
            <div className="space-y-2 pt-3 border-t border-slate-800/60">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold font-mono">{t.profile}</span>
              {[
                { label: t.labelName, value: profile.childName, icon: "👤" },
                { label: t.labelRole, value: role === "jury" ? t.roleJury : t.roleArtist, icon: "🎭" },
                { label: t.labelStars, value: `${statsStars} ⭐`, icon: "⭐" },
                { label: t.labelCoins, value: `${accountSession.kidiCoins} 💰`, icon: "💰" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between bg-slate-950/60 border border-slate-800/40 rounded-xl px-3 py-2">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1.5">{item.icon} {item.label}</span>
                  <span className="text-[10px] font-black text-white">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Step dots */}
            <div className="flex items-center gap-1.5 pt-2">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTutorialStep(i + 1)}
                  className={`transition-all duration-300 rounded-full ${
                    i + 1 === tutorialStep ? `w-6 h-2 ${barColors[i]}`
                    : i + 1 < tutorialStep ? `w-2 h-2 ${barColors[i]} opacity-60`
                    : "w-2 h-2 bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-[9.5px] text-slate-600 leading-snug relative z-10 pt-4 border-t border-slate-800/40 mt-4">
            {t.by} <strong className="text-slate-500">LinkYourArt</strong>
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-800/60 flex items-center justify-between shrink-0">
            <div className="space-y-1">
              <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${colorMap[step.color].split(' ')[0]}`}>
                {t.stepLabel} {tutorialStep} {t.of} {TOTAL_STEPS}
              </span>
              <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColors[tutorialStep - 1]}`}
                  style={{ width: `${(tutorialStep / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-500/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition font-bold"
            >✕</button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="space-y-1">
              <h4 className="text-xl font-black text-white flex items-center gap-2 leading-tight">
                <span className="text-2xl">{step.emoji}</span>
                {step.title}
              </h4>
              <p className="text-[11.5px] text-slate-400 leading-relaxed">{step.intro}</p>
            </div>
            <div className="space-y-3">
              {step.items.map((item, i) => (
                <div key={i} className={`p-4 rounded-2xl border bg-slate-900/40 hover:bg-slate-900/70 transition duration-200 flex gap-3 ${colorMap[item.color].split(' ').slice(1).join(' ')}`}>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg shrink-0 ${colorMap[item.color]}`}>
                    {item.icon}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className={`text-xs font-black block ${colorMap[item.color].split(' ')[0]}`}>{item.title}</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer nav */}
          <div className="px-6 py-4 border-t border-slate-800/60 flex items-center justify-between gap-3 shrink-0 bg-slate-950/60">
            <span className="text-[10px] text-slate-600 italic hidden sm:block">{t.tip}</span>
            <div className="flex gap-2 ml-auto">
              {tutorialStep > 1 && (
                <button
                  onClick={() => setTutorialStep(tutorialStep - 1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition"
                >
                  ← {t.prev}
                </button>
              )}
              {tutorialStep < TOTAL_STEPS ? (
                <button
                  onClick={() => setTutorialStep(tutorialStep + 1)}
                  className={`flex items-center gap-1.5 px-5 py-2.5 font-black text-xs rounded-xl transition shadow-lg border ${colorMap[step.color]}`}
                >
                  {t.next} →
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition active:scale-95"
                >
                  {t.start}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

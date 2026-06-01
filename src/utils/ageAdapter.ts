// ═══════════════════════════════════════════════════════════════════════
// KIDIWORLD — Age Adaptation Engine
// Adapts UI, vocabulary, tools, challenges & complexity by age group
// ═══════════════════════════════════════════════════════════════════════

export type AgeGroup = "4-7" | "8-11" | "12-15" | "16-18";
export type Lang = "fr" | "en";

export function getAgeGroup(age: number): AgeGroup {
  if (age <= 7) return "4-7";
  if (age <= 11) return "8-11";
  if (age <= 15) return "12-15";
  return "16-18";
}

// ─── Age group metadata ─────────────────────────────────────────────────
export const AGE_META: Record<AgeGroup, {
  label: Record<Lang, string>;
  emoji: string;
  color: string;
  colorHex: string;
  tagline: Record<Lang, string>;
  mentorName: string;
  mentorEmoji: string;
  complexity: "beginner" | "intermediate" | "advanced" | "pro";
}> = {
  "4-7": {
    label: { fr: "Bout d'Chou ⭐", en: "Little Star ⭐" },
    emoji: "🌟",
    color: "from-pink-500 to-rose-400",
    colorHex: "#ec4899",
    tagline: { fr: "Explore & Joue !", en: "Explore & Play!" },
    mentorName: "Léo",
    mentorEmoji: "🦁",
    complexity: "beginner",
  },
  "8-11": {
    label: { fr: "Explorateur 🚀", en: "Explorer 🚀" },
    emoji: "🚀",
    color: "from-amber-500 to-orange-400",
    colorHex: "#f59e0b",
    tagline: { fr: "Découvre & Crée !", en: "Discover & Create!" },
    mentorName: "Max",
    mentorEmoji: "🤖",
    complexity: "intermediate",
  },
  "12-15": {
    label: { fr: "Junior 🎨", en: "Junior 🎨" },
    emoji: "🎨",
    color: "from-indigo-500 to-violet-500",
    colorHex: "#6366f1",
    tagline: { fr: "Exprime & Perfectionne !", en: "Express & Perfect!" },
    mentorName: "Linky",
    mentorEmoji: "💡",
    complexity: "advanced",
  },
  "16-18": {
    label: { fr: "Senior Pro 🏆", en: "Senior Pro 🏆" },
    emoji: "🏆",
    color: "from-emerald-500 to-teal-500",
    colorHex: "#10b981",
    tagline: { fr: "Réalise & Performe !", en: "Create & Perform!" },
    mentorName: "Linky Pro",
    mentorEmoji: "🎯",
    complexity: "pro",
  },
};

// ─── Vocabulary adaptation ───────────────────────────────────────────────
export const VOCAB: Record<string, Record<AgeGroup, Record<Lang, string>>> = {
  "workspace.screenplay.title": {
    "4-7":   { fr: "✏️ Mon Histoire", en: "✏️ My Story" },
    "8-11":  { fr: "📖 Mon Récit", en: "📖 My Story" },
    "12-15": { fr: "🎬 Mon Scénario", en: "🎬 My Screenplay" },
    "16-18": { fr: "📝 Scénario Pro", en: "📝 Pro Screenplay" },
  },
  "workspace.music.title": {
    "4-7":   { fr: "🎵 Ma Chanson", en: "🎵 My Song" },
    "8-11":  { fr: "🎶 Ma Mélodie", en: "🎶 My Melody" },
    "12-15": { fr: "🎹 Ma Composition", en: "🎹 My Composition" },
    "16-18": { fr: "🎼 Production Musicale", en: "🎼 Music Production" },
  },
  "workspace.design.title": {
    "4-7":   { fr: "🖍️ Mon Dessin", en: "🖍️ My Drawing" },
    "8-11":  { fr: "🎨 Ma Création", en: "🎨 My Creation" },
    "12-15": { fr: "✂️ Mon Design", en: "✂️ My Design" },
    "16-18": { fr: "🖌️ Direction Artistique", en: "🖌️ Art Direction" },
  },
  "workspace.guide.title": {
    "4-7":   { fr: "🗺️ Mon Guide", en: "🗺️ My Guide" },
    "8-11":  { fr: "🔍 Indices du Défi", en: "🔍 Challenge Clues" },
    "12-15": { fr: "📋 Brief & Indices", en: "📋 Brief & Clues" },
    "16-18": { fr: "📊 Brief Professionnel", en: "📊 Professional Brief" },
  },
  "submit.label": {
    "4-7":   { fr: "🚀 Envoyer ma création !", en: "🚀 Send my creation!" },
    "8-11":  { fr: "🎯 Soumettre mon œuvre", en: "🎯 Submit my work" },
    "12-15": { fr: "📤 Soumettre au Jury", en: "📤 Submit to Jury" },
    "16-18": { fr: "🏆 Déposer mon dossier", en: "🏆 Submit my portfolio" },
  },
  "coach.greeting": {
    "4-7":   { fr: "Salut ! Je suis Léo 🦁 Qu'est-ce qu'on crée aujourd'hui ?", en: "Hi! I'm Leo 🦁 What are we creating today?" },
    "8-11":  { fr: "Hey ! Moi c'est Max 🤖 Prêt(e) pour l'aventure créative ?", en: "Hey! I'm Max 🤖 Ready for the creative adventure?" },
    "12-15": { fr: "Bonjour ! Je suis Linky 💡 Parlons de ton projet créatif.", en: "Hello! I'm Linky 💡 Let's talk about your creative project." },
    "16-18": { fr: "Bienvenue. Je suis Linky Pro 🎯 Ensemble, construisons quelque chose d'exceptionnel.", en: "Welcome. I'm Linky Pro 🎯 Let's build something exceptional together." },
  },
  "challenge.difficulty": {
    "4-7":   { fr: "Niveau : Débutant 🌟", en: "Level: Beginner 🌟" },
    "8-11":  { fr: "Niveau : Intermédiaire 🚀", en: "Level: Intermediate 🚀" },
    "12-15": { fr: "Niveau : Avancé 🎨", en: "Level: Advanced 🎨" },
    "16-18": { fr: "Niveau : Professionnel 🏆", en: "Level: Professional 🏆" },
  },
};

export function v(key: string, ageGroup: AgeGroup, lang: Lang): string {
  return VOCAB[key]?.[ageGroup]?.[lang] ?? key;
}

// ─── Tool visibility by age ──────────────────────────────────────────────
export interface AgeTools {
  showScreenplay: boolean;
  showMusic: boolean;
  showDesign: boolean;
  showDrawingBoard: boolean;
  showPodcast: boolean;
  showTvSeries: boolean;
  showGaming: boolean;
  showAdvancedFilters: boolean;
  showProBadges: boolean;
  maxScenarioLength: number; // chars
  screenplayComplexity: "simple" | "standard" | "professional";
  musicComplexity: "simple" | "standard" | "advanced";
  aiCoachTone: "playful" | "friendly" | "mentor" | "professional";
}

export function getAgeTools(ageGroup: AgeGroup): AgeTools {
  switch (ageGroup) {
    case "4-7":
      return {
        showScreenplay: true,
        showMusic: true,
        showDesign: true,
        showDrawingBoard: true,
        showPodcast: false,
        showTvSeries: false,
        showGaming: true,
        showAdvancedFilters: false,
        showProBadges: false,
        maxScenarioLength: 500,
        screenplayComplexity: "simple",
        musicComplexity: "simple",
        aiCoachTone: "playful",
      };
    case "8-11":
      return {
        showScreenplay: true,
        showMusic: true,
        showDesign: true,
        showDrawingBoard: true,
        showPodcast: true,
        showTvSeries: false,
        showGaming: true,
        showAdvancedFilters: true,
        showProBadges: false,
        maxScenarioLength: 1500,
        screenplayComplexity: "standard",
        musicComplexity: "standard",
        aiCoachTone: "friendly",
      };
    case "12-15":
      return {
        showScreenplay: true,
        showMusic: true,
        showDesign: true,
        showDrawingBoard: true,
        showPodcast: true,
        showTvSeries: true,
        showGaming: true,
        showAdvancedFilters: true,
        showProBadges: true,
        maxScenarioLength: 4000,
        screenplayComplexity: "professional",
        musicComplexity: "advanced",
        aiCoachTone: "mentor",
      };
    case "16-18":
      return {
        showScreenplay: true,
        showMusic: true,
        showDesign: true,
        showDrawingBoard: true,
        showPodcast: true,
        showTvSeries: true,
        showGaming: true,
        showAdvancedFilters: true,
        showProBadges: true,
        maxScenarioLength: 10000,
        screenplayComplexity: "professional",
        musicComplexity: "advanced",
        aiCoachTone: "professional",
      };
  }
}

// ─── Challenge descriptions adapted by age ───────────────────────────────
export function adaptChallengeDescription(description: string, ageGroup: AgeGroup, lang: Lang): string {
  // Returns a prefix/framing adapted to age group
  const prefixes: Record<AgeGroup, Record<Lang, string>> = {
    "4-7": {
      fr: "🌈 Amuse-toi bien ! ",
      en: "🌈 Have fun! ",
    },
    "8-11": {
      fr: "🚀 C'est ton défi ! ",
      en: "🚀 This is your challenge! ",
    },
    "12-15": {
      fr: "",
      en: "",
    },
    "16-18": {
      fr: "",
      en: "",
    },
  };
  return prefixes[ageGroup][lang] + description;
}

// ─── UI theme tokens by age ──────────────────────────────────────────────
export function getAgeTheme(ageGroup: AgeGroup) {
  const themes = {
    "4-7": {
      fontSize: "text-sm",
      buttonSize: "px-5 py-3 text-sm",
      cardRadius: "rounded-3xl",
      iconSize: "w-6 h-6",
      textareaRows: 4,
      showEmoji: true,
      fontWeight: "font-extrabold",
    },
    "8-11": {
      fontSize: "text-sm",
      buttonSize: "px-4 py-2.5 text-xs",
      cardRadius: "rounded-2xl",
      iconSize: "w-5 h-5",
      textareaRows: 6,
      showEmoji: true,
      fontWeight: "font-bold",
    },
    "12-15": {
      fontSize: "text-xs",
      buttonSize: "px-4 py-2.5 text-xs",
      cardRadius: "rounded-2xl",
      iconSize: "w-4 h-4",
      textareaRows: 10,
      showEmoji: true,
      fontWeight: "font-bold",
    },
    "16-18": {
      fontSize: "text-xs",
      buttonSize: "px-4 py-2.5 text-xs",
      cardRadius: "rounded-xl",
      iconSize: "w-4 h-4",
      textareaRows: 14,
      showEmoji: false,
      fontWeight: "font-semibold",
    },
  };
  return themes[ageGroup];
}

// ─── Age-adapted placeholder texts ──────────────────────────────────────
export const PLACEHOLDERS: Record<string, Record<AgeGroup, Record<Lang, string>>> = {
  screenplay: {
    "4-7": {
      fr: "Il était une fois dans l'espace... 🌟 Un petit animal rigolo rencontre une méduse lumineuse...",
      en: "Once upon a time in space... 🌟 A funny little animal meets a glowing jellyfish...",
    },
    "8-11": {
      fr: "Dans la station spatiale POLARIS, l'équipage de jeunes explorateurs découvre un signal mystérieux venant d'une planète inconnue...",
      en: "Aboard the POLARIS space station, a crew of young explorers picks up a mysterious signal from an unknown planet...",
    },
    "12-15": {
      fr: "ACTE I — SCÈNE 1\nINT. POSTE DE COMMANDE DU POLARIS — NUIT\n\nLe tableau de bord clignote. MAYA (13 ans), aux commandes, fronce les sourcils...",
      en: "ACT I — SCENE 1\nINT. POLARIS COMMAND DECK — NIGHT\n\nThe dashboard flickers. MAYA (13), at the controls, furrows her brow...",
    },
    "16-18": {
      fr: "FADE IN:\n\nEXT. ORBITE BASSE TERRESTRE — NUIT\n\nLe POLARIS-7, vaisseau de classe Alpha, dérive silencieusement. À son bord, une équipe de six chercheurs face à une anomalie que la physique quantique ne peut pas expliquer.\n\nINT. LABORATOIRE DE RECHERCHE — CONTINU\n\nDR. ELENA VASQUEZ (28) examine des données sur trois écrans simultanément...",
      en: "FADE IN:\n\nEXT. LOW EARTH ORBIT — NIGHT\n\nPOLARIS-7, an Alpha-class vessel, drifts silently. On board, a team of six researchers confronts an anomaly that quantum physics cannot explain.\n\nINT. RESEARCH LAB — CONTINUOUS\n\nDR. ELENA VASQUEZ (28) reviews data across three simultaneous screens...",
    },
  },
  music: {
    "4-7": {
      fr: "🎵 Do ré mi... Je joue des notes joyeuses ! Ma chanson parle d'étoiles et d'animaux rigolos...",
      en: "🎵 Do re mi... I play happy notes! My song is about stars and funny animals...",
    },
    "8-11": {
      fr: "🎶 Tempo : 120 BPM — Ma mélodie commence doucement puis monte en puissance quand le héros entre en scène...",
      en: "🎶 Tempo: 120 BPM — My melody starts softly then builds up as the hero enters the scene...",
    },
    "12-15": {
      fr: "Instruments : Piano (mélodie principale), Cordes (ambiance), Percussions (rythme)\nTempo : 95 BPM — Tonalité : Ré mineur\n\nSection A (0:00-0:30) : Introduction mystérieuse avec piano solo...",
      en: "Instruments: Piano (main melody), Strings (atmosphere), Percussion (rhythm)\nTempo: 95 BPM — Key: D minor\n\nSection A (0:00-0:30): Mysterious introduction with solo piano...",
    },
    "16-18": {
      fr: "NOTES DE COMPOSITION — THÈME PRINCIPAL\n\nStructure : Intro (4 mesures) / Thème A (16 mesures) / Développement (32 mesures) / Réexposition (16 mesures) / Coda (8 mesures)\n\nOrchestration : Quatuor à cordes + Piano + Synthétiseurs analogiques\nRéférence harmonique : Debussy / Nils Frahm / Hans Zimmer\n\nThème principal (Fa# mineur, 4/4):\n[Mesure 1] Mi-Ré#-Mi-Ré#-Do#-Si / [Mesure 2] La-Sol#-La-Si-Do#-Ré#...",
      en: "COMPOSITION NOTES — MAIN THEME\n\nStructure: Intro (4 bars) / Theme A (16 bars) / Development (32 bars) / Recapitulation (16 bars) / Coda (8 bars)\n\nOrchestration: String quartet + Piano + Analog synthesizers\nHarmonic reference: Debussy / Nils Frahm / Hans Zimmer\n\nMain theme (F# minor, 4/4):\n[Bar 1] E-D#-E-D#-C#-B / [Bar 2] A-G#-A-B-C#-D#...",
    },
  },
};

// ─── Age-appropriate challenge filter ───────────────────────────────────
export function challengeMatchesAge(challengeAgeGroup: string, userAge: number): boolean {
  if (challengeAgeGroup === "4-18" || challengeAgeGroup === "12-18") return true;
  const [min, max] = challengeAgeGroup.split("-").map(Number);
  return userAge >= min && userAge <= max;
}

// ─── Age-adapted reward labels ───────────────────────────────────────────
export function getRewardLabel(ageGroup: AgeGroup, lang: Lang): Record<string, string> {
  const labels: Record<AgeGroup, Record<Lang, Record<string, string>>> = {
    "4-7": {
      fr: { stars: "Étoiles Magiques ✨", coins: "Pièces d'Or 🪙", badge: "Mon Badge 🎖️" },
      en: { stars: "Magic Stars ✨", coins: "Gold Coins 🪙", badge: "My Badge 🎖️" },
    },
    "8-11": {
      fr: { stars: "Étoiles 🌟", coins: "KidiCoins 💰", badge: "Badge Explorer 🏅" },
      en: { stars: "Stars 🌟", coins: "KidiCoins 💰", badge: "Explorer Badge 🏅" },
    },
    "12-15": {
      fr: { stars: "Points Créatifs ⭐", coins: "KidiCoins 💰", badge: "Titre Artistique 🎨" },
      en: { stars: "Creative Points ⭐", coins: "KidiCoins 💰", badge: "Artistic Title 🎨" },
    },
    "16-18": {
      fr: { stars: "Score Pro 🏆", coins: "KidiCoins 💰", badge: "Certification LinkYourArt 🎓" },
      en: { stars: "Pro Score 🏆", coins: "KidiCoins 💰", badge: "LinkYourArt Certification 🎓" },
    },
  };
  return labels[ageGroup][lang];
}

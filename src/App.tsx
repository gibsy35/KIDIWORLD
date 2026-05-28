import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import DrawingBoard from "./components/DrawingBoard";
import SoundtrackStudio from "./components/SoundtrackStudio";
import ScreenplayEditor from "./components/ScreenplayEditor";
import AICreativeCoach from "./components/AICreativeCoach";
import JuryDashboard from "./components/JuryDashboard";
import ProfileSetup from "./components/ProfileSetup";
import TranslatedText from "./components/TranslatedText";
import ChallengeCard from "./components/ChallengeCard";
import AccountAuth, { AccountSession } from "./components/AccountAuth";
import KidiMusic from "./components/KidiMusic";
import KidiGaming from "./components/KidiGaming";
import PrestigeAwards from "./components/PrestigeAwards";
import PartnersSection from "./components/PartnersSection";
import AboutUsSection from "./components/AboutUsSection";
import Footer from "./components/Footer";
import KidiStreamPlayer from "./components/KidiStreamPlayer";
import confetti from "canvas-confetti";
import { Challenge, Submission, Clue, UserProfile } from "./types";
import { t } from "./utils/i18n";
import { 
  Sparkles, 
  Calendar, 
  BookOpen, 
  Music, 
  Palette, 
  Check, 
  Play, 
  Send, 
  Bot, 
  Shield, 
  HelpCircle, 
  Heart, 
  Star, 
  Award, 
  ChevronRight,
  ChevronLeft,
  Filter,
  Globe,
  Lock,
  Compass,
  Zap,
  Clock,
  Gamepad2,
  Coins,
  Search,
  ArrowLeft,
  ArrowRight,
  Film,
  PenTool,
  Volume2,
  Users
} from "lucide-react";

// List of creative promotional visual artworks with custom prompts and gradients for dynamic refresh
const BANNER_VISUALS = [
  {
    slogan: "Stimule activement ton talent créatif !",
    description: "Découvre des dizaines de challenges d'écriture, de dessin de mode et d'harmonie sonore, disponibles en Version Démo d'essai pour apprendre, puis en Vrai Concours évalué par de véritables experts professionnels du cinéma d'animation !",
    imagePath: "/src/assets/images/kidiworld_hero_banner_1779248938176.png",
    badge: "🌍 LinkYourArt Incubator & KidiWorld",
    gradient: "from-slate-950 via-slate-950/80 to-indigo-950/20"
  },
  {
    slogan: "Deviens le prodige de ton propre cinéma d'animation !",
    description: "Structure ton scénario d'aventure en trois actes, sélectionne des dialogues magiques guidés par l'androïde buggé, et attire l'attention des comités de vote de LinkYourArt !",
    imagePath: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200", 
    badge: "🎨 Académie d'Animation Sidérale",
    gradient: "from-slate-950 via-slate-950/80 to-purple-950/30"
  },
  {
    slogan: "Harmonise tes rêves avec la librairie Kidi Music !",
    description: "Décode des vibrations chiptune comiques, compose de douces sérénades spatiales ou écoute des morceaux premium fantastiques avec ta réserve de KidiCoins récompensés !",
    imagePath: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200",
    badge: "🎵 Studio d'Harmonie & Clavier d'Or",
    gradient: "from-slate-950 via-slate-950/80 to-pink-950/30"
  },
  {
    slogan: "Conçois des Jeux Mobiles interactifs par IA !",
    description: "Fais l'expérience de la science créative : module la constante gravitationnelle sidérale et prends immédiatement les manettes de tes propres codes de jeux mobiles compilés !",
    imagePath: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200",
    badge: "🎮 Laboratoire de Jeux Mobiles Kidi Games",
    gradient: "from-slate-950 via-slate-950/80 to-teal-950/30"
  }
];

// Initializing beautiful mock database seeds with diverse age groups, demos, and categories
const initialClues: Clue[] = [
  { day: 1, title: "Harpon cosmique", description: "L'outil énergétique d'amarrage pour harponner la poussière d'étoiles dorées.", type: "keyword", content: "harpon cosmique", isUnlocked: true },
  { day: 2, title: "Chants des abysses", description: "La fréquence sonore mystérieuse qui guide les équipages à travers le vide.", type: "sound", content: "chants des abysses", isUnlocked: true },
  { day: 3, title: "Voiles à gravité", description: "Les grandes voiles solaires conçues pour surfer l'onde d'attraction stellaire.", type: "keyword", content: "voiles à gravité", isUnlocked: true },
  { day: 4, title: "Poussière de singularité", description: "Le carburant ultra-rare sécrété par le grand cachalot sidéral.", type: "keyword", content: "poussière de singularité", isUnlocked: true },
  { day: 5, title: "Androïde buggé", description: "Un robot de bord qui bégaye et se souvient des poèmes oubliés du passé.", type: "keyword", content: "androïde buggé", isUnlocked: true },
  { day: 6, title: "Chronosphère", description: "Une mystérieuse boussole temporelle trouvée sous un astéroïde.", type: "keyword", content: "chronosphère", isUnlocked: false },
  { day: 7, title: "Sillage de Bioluminescence", description: "La traînée lumineuse que la créature laisse derrière elle.", type: "image", content: "sillage de bioluminescence", isUnlocked: false },
  { day: 8, title: "Sérénade sidérale", description: "La complainte harmonique pour apaiser la colère de la tempête.", type: "sound", content: "sérénade sidérale", isUnlocked: false },
  { day: 9, title: "Casque en Quartz stellaire", description: "Le scaphandre étincelant des stylistes de l'espace.", type: "keyword", content: "casque en quartz stellaire", isUnlocked: false },
  { day: 10, title: "L'Alliance du Cachalot", description: "Le message final envoyé par le jury : composez de toutes vos forces !", type: "text", content: "l'alliance du cachalot", isUnlocked: false },
];

const seedSubmissions: Submission[] = [
  {
    id: "sub-1",
    challengeId: "movie-whale-1",
    authorName: "Bastien",
    authorAge: 14,
    title: "Le Dernier sillage d'Or",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: "screenplay",
    content: {
      screenplay: {
        title: "Le Dernier sillage d'Or",
        act1: "SCÈNE 1 - L'ANCRAGE DU GRAND HARPON\nDescription : Le navire pirate 'L'Horizon' tangue. Un jeune garçon, Bastien, ajuste sa combinaison.\nBastien jette alors le HARPON COSMIQUE dans la nébuleuse d'Or.\n\nDIALOGUE :\nBASTIEN\nRegardez ! L'ancre lumineuse a mordu !",
        act2: "SCÈNE 2 - LA COMPLAINTE DE L'ANDROÏDE\nDescription : L'esprit du bateau tremble. Un ANDROÏDE BUGGÉ fait des étincelles bleues.\n\nDIALOGUE :\nL'ANDROÏDE\nLes CHANTS DES ABYSSES m'appellent de l'intérieur... La baleine est là.",
        act3: "SCÈNE 3 - LE VOL SUR LA GRAVITÉ\nDescription : Les VOILES À GRAVITÉ s'ouvrent, captant la POUSSIÈRE DE SINGULARITÉ. Le cachalot s'éloigne tranquillement, sauf qu'il est maintenant libre et guidé par la musique.",
      },
    },
    votes: 42,
    feedback: [
      {
        author: "Lucas Besson - LinkYourArt Movies",
        text: "Magnifique Bastien ! La transition à l'acte III est très aérienne. Ton utilisation de l'androïde apporte beaucoup de poésie à ce décor de science-fiction.",
        rating: 5,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "sub-2",
    challengeId: "movie-whale-1",
    authorName: "Léa",
    authorAge: 12,
    title: "Symphonie Lactée v2",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: "music",
    content: {
      music: {
        melody: [
          1, 0, 0, 1, 0, 0, 1, 0,
          0, 1, 0, 0, 1, 0, 0, 1,
          0, 0, 1, 0, 0, 1, 0, 0,
          0, 0, 0, 1, 0, 0, 1, 0,
          1, 0, 0, 0, 0, 1, 0, 1,
        ],
        instrument: "space-piano",
        lyrics: "Dans la nébuleuse d'Or chantent les cachalots\nLeurs ondes percent le grand vide sidéral\nOuvrez les voiles de gravité pour aller tout là-haut...",
        tempo: 125,
      },
    },
    votes: 35,
    feedback: [
      {
        author: "Compositeur en Chef @ LinkYourArt Records",
        text: "Des harmonies très raccord avec le cahier des charges ! Les paroles sont touchantes et la mélodie monte bien en arpeggio.",
        rating: 4,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

// Seed collection of rich challenges covering multiple age bands & creative trials (Cinéma, Musique, Dessin/Mode, 3D Jeu Vidéo, Photo, etc.)
const initialChallengesList: Challenge[] = [
  {
    id: "movie-whale-1",
    title: "GRAND PRIX DU MEILLEUR SCÉNARIO : Le Secret du Cachalot Stellaire",
    subtitle: "Défi scénaristique d'élite parrainé par Jérôme Salle & Canal+",
    sponsor: "Jérôme Salle - Réalisateur de renom & Canal+ Création @ LinkYourArt Movies",
    description: "Plongez au cœur d'un univers où les cachalots de lumière guident les explorateurs cosmiques. Composez un court-métrage captivant d'animation d'une poésie rare. Le projet lauréat recevra le prestigieux PRIX DU MEILLEUR SCÉNARIO chez LinkYourArt, comprenant une rencontre en tête-à-tête privilégiée avec un grand réalisateur de renom, ainsi qu'un stage immersif d'observation de 5 jours dans un des meilleurs studios d'animation partenaires (comme Mikros Image ou les Gobelins) et la visite VIP guidée de leurs studios d'écriture à Paris !",
    category: "cinema",
    ageGroup: "12-15",
    isDemo: false,
    startDate: "2026-05-15",
    endDate: "2026-08-15",
    cluesDurationDays: 10,
    currentSimulatedDay: 5,
    maxDays: 10,
    clues: initialClues,
    nestedChallenges: [
      { id: "nest-1", title: "Thème Audio du Cachalot", category: "music", description: "Le scénario a besoin de vibrations ! Compose un hymne bioluminescent exclusif.", reward: "Visite Pro de Grand Studio d'Enregistrement", status: "active" },
      { id: "nest-2", title: "Garde-Robe Cosmique (Costumes)", category: "costume", description: "Dessine la combinaison de vol spatiale portée par Bastien pour flotter dans le sillage de lumière.", reward: "Stage d'initiation Haute Couture", status: "active" },
    ],
    submissions: seedSubmissions,
  },
  {
    id: "real-photo-gallery-2",
    title: "KIDI PHOTOGRAPHY : Les Gardiens de l'Ombre et de la Lumière",
    subtitle: "Concours National de Photographie parrainé par Yann Arthus-Bertrand",
    sponsor: "Yann Arthus-Bertrand - Grand Photographe, Réalisateur & Président Fondateur @ LinkYourArt Photo",
    description: "Capter l'invisible, raconter une histoire forte par le jeu de l'exposition, de la perspective astrale et du cadrage ! Le grand vainqueur de ce challenge KIDI PHOTOGRAPHY remportera une session de mentorat personnalisé d'une demi-journée en direct avec un photographe globe-trotteur de National Geographic, ainsi que l'exposition physique grand format de son tirage final lors de la prochaine Biennale Internationale d'Art Contemporain de LinkYourArt !",
    category: "photography",
    ageGroup: "16-18",
    isDemo: false,
    startDate: "2026-05-18",
    endDate: "2026-09-01",
    cluesDurationDays: 10,
    currentSimulatedDay: 5,
    maxDays: 10,
    clues: initialClues,
    nestedChallenges: [
      { id: "nest-7-1", title: "Prisme Stellor", category: "poster", description: "Cadre la lueur bleutée d'un fragment de comète.", reward: "Mentorat d'Art National Geographic", status: "active" }
    ],
    submissions: [
      {
        id: "sub-7-1",
        challengeId: "real-photo-gallery-2",
        authorName: "Éloi",
        authorAge: 13,
        title: "Larme de Perséide",
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        category: "poster",
        content: {
          poster: {
            tagline: "Un éclat infini sous le regard du ciel fraternel.",
            themeColor: "#0284c7",
            imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200"
          }
        },
        votes: 42,
        feedback: [
          { author: "Nathalie - Reporter", text: "Magnifique gestion de la lumière froide et de la perspective astrale !", rating: 5, date: new Date().toISOString() }
        ]
      }
    ]
  },
  {
    id: "real-fashion-design-3",
    title: "GRAND PRIX KIDI DESIGN & MODE : Les Scaphandres de la Haute Coque",
    subtitle: "Défi de stylisme et de design d'uniformes d'équipage avec Chanel",
    sponsor: "Virginie Viard - Directrice Artistique Senior pro @ LinkYourArt Creative House",
    description: "Designers de demain, redéfinissez les codes vestimentaires galactiques ! Imaginez et dessinez la combinaison spatiale d'exploration pour l'équipage du Polaris. Alliez coupes fluides, textiles bioluminescents et fibres de quartz. À la clé : le prestigieux PRIX DU DESIGN JUNIOR impliquant une immersion exceptionnelle de 3 jours au sein des ateliers de couture de nos créateurs partenaires Chanel, et la modélisation 3D professionnelle de votre modèle par un infographiste de mode sur grand écran !",
    category: "design",
    ageGroup: "12-15",
    isDemo: false,
    startDate: "2026-05-12",
    endDate: "2026-08-20",
    cluesDurationDays: 10,
    currentSimulatedDay: 7,
    maxDays: 10,
    clues: initialClues,
    nestedChallenges: [
      { id: "nest-5-1", title: "Finition Quartz", category: "costume", description: "Mets en valeur la visière en quartz stellaire magique.", reward: "Aiguille d'Or de l'Académie Mode", status: "active" }
    ],
    submissions: []
  },
  {
    id: "real-3d-gaming-4",
    title: "KIDI 3D & JEUX : L'Arène des Astéroïdes en Gravité Zéro",
    subtitle: "Concours d'Innovation Interactive & Game Design d'animation avec Ubisoft & Pixar",
    sponsor: "Yohann - Producteur de Jeux & Lead Designer @ Ubisoft & LinkYourArt Play",
    description: "Préparez la physique du cosmos, sculptez un parcours d'esquive millimétré et pilotez vos rêves de créateur de mondes ! Pour ce défi KIDI 3D & JEUX, concevez le prototype d'un mini-jeu mobile idéal en modifiant les forces de gravité et la vitesse des projectiles. Le gagnant du Trophée d'Excellence 'Junior Game Changer' remportera une invitation VIP de rêve pour une visite privée exclusive des ateliers de développement d'Ubisoft, accompagnée d'un après-midi complet de co-design avec un Lead Producer !",
    category: "animation",
    ageGroup: "8-11",
    isDemo: false,
    startDate: "2026-05-20",
    endDate: "2026-09-10",
    cluesDurationDays: 10,
    currentSimulatedDay: 3,
    maxDays: 10,
    clues: initialClues,
    nestedChallenges: [
      { id: "nest-8-1", title: "Gravité Zéro", category: "poster", description: "Expérimente les trajectoires paraboliques de ton module mobile.", reward: "Insigne de l'Ingénieur Céleste Ubisoft", status: "active" }
    ],
    submissions: []
  },
  {
    id: "real-music-composer-5",
    title: "PRIX LINKYOURART SOUNDSCAPES : L'Hymne Cosmique du Cachalot",
    subtitle: "Un chef-d'œuvre symphonique d'initiation avec l'Orchestre de Radio France",
    sponsor: "Hans Zimmer & l'Orchestre Symphonique de Radio France",
    description: "Mariez des harmonies célestes et des rythmes chiptunes entraînants pour écrire et composer le thème sonore officiel d'entrée du grand Cachalot Stellaire dans le port galactique ! Le vainqueur de ce concours de haute volée remportera le GRAND PRIX SOUNDSCAPES DE LA CRÉATION MUSICALE : son morceau sera mis en musique, arrangé et enregistré en direct par de réels musiciens professionnels de l'Orchestre de Radio France, suivie d'une initiation magique d'un jour au sein de leurs studios mythiques !",
    category: "music",
    ageGroup: "16-18",
    isDemo: false,
    startDate: "2026-05-18",
    endDate: "2026-08-18",
    cluesDurationDays: 10,
    currentSimulatedDay: 5,
    maxDays: 10,
    clues: initialClues,
    nestedChallenges: [
      { id: "nest-4-1", title: "Harmonie d'Orfèvre", category: "music", description: "Utilise un tempo rapide à 140 BPM et des accords en arpeggio.", reward: "Grand Prix Composition", status: "active" }
    ],
    submissions: []
  },
  {
    id: "real-architecture-6",
    title: "KIDI ARCHITECTURE : La Cité d'Or Suspendue dans la Nébuleuse",
    subtitle: "Concours d'Éco-Architecture & Design Néo-Futuriste avec Jean Nouvel",
    sponsor: "Jean Nouvel & les Architectes Associés de la Nébuleuse d'Or",
    description: "Futurs visionnaires de la construction, bâtissez le futur ! Dessinez ou décrivez les plans de la première cité d'habitation écologique auto-suffisante flottant en apesanteur. Mariez mégastructures d'acier recyclé, dômes de biosphère végétale et captation solaire active. Le grand gagnant verra ses croquis modélisés et imprimés en 3D à grande échelle pour être exposés, doublés d'une session de critique constructive de 2 heures par le grand architecte Jean Nouvel et ses associés !",
    category: "architecture",
    ageGroup: "12-15",
    isDemo: false,
    startDate: "2026-05-22",
    endDate: "2026-09-30",
    cluesDurationDays: 10,
    currentSimulatedDay: 2,
    maxDays: 10,
    clues: initialClues,
    nestedChallenges: [
      { id: "nest-10-1", title: "Verrière Solaire", category: "costume", description: "Dessine le plan de captation des poussières de gaz d'hélium.", reward: "Trophée d'Architecture d'Avenir", status: "active" }
    ],
    submissions: []
  },
  {
    id: "demo-junior-7",
    title: "Le Voyage Cosmique des Petits Pas - PRIX JUNIOR",
    subtitle: "Challenge Démo de dessin et d'initiation colorée pour les plus jeunes",
    sponsor: "Karla - Concept Artist Senior pro @ LinkYourArt Junior Team",
    description: "Bienvenue aux plus jeunes explorateurs de l'univers ! Pour ce challenge créatif amusant, imagine un petit animal tout doux ou une méduse souriante qui vole à bord du Polaris. Utilise notre tableau de dessin avec des couleurs pastel et des étoiles lumineuses pour exprimer ton génie. Relève le défi et obtiens ton Diplôme Officiel de Jeune Explorateur de l'Art !",
    category: "design",
    ageGroup: "4-7",
    isDemo: true,
    startDate: "2026-05-01",
    endDate: "2026-12-31",
    cluesDurationDays: 5,
    currentSimulatedDay: 3,
    maxDays: 5,
    clues: [
      { day: 1, title: "Étoiles Sages", description: "Ajoute de petites poussières d'étoiles de couleur rose bonbon.", type: "keyword", content: "etoile rose", isUnlocked: true },
      { day: 2, title: "Bulle magique", description: "Une bulle transparente qui protège tes animaux.", type: "keyword", content: "bulle magique", isUnlocked: true },
      { day: 3, title: "Sourire radieux", description: "Le visage de ta créature doit être très souriant.", type: "text", content: "sourire", isUnlocked: true },
      { day: 4, title: "Nageoire Bleue", description: "Une belle nageoire pour avancer sur les courants d'or.", type: "keyword", content: "nageoire bleue", isUnlocked: false },
      { day: 5, title: "Ami Robot", description: "Dessine la main d'un petit robot qui fait coucou.", type: "image", content: "robot coucou", isUnlocked: false },
    ],
    nestedChallenges: [
      { id: "nest-2-1", title: "Couleur Spatiale", category: "costume", description: "Fais des touches de bleu néon pour éclairer tes arrières-plans !", reward: "Insigne Petit Initié", status: "active" }
    ],
    submissions: [
      {
        id: "sub-2-1",
        challengeId: "demo-junior-7",
        authorName: "Maya",
        authorAge: 6,
        title: "Mon Petit Poulpe Spatial Rigolo",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        category: "costume",
        content: {
          costume: {
            imageUrl: "",
            materials: "Eau pétillante d'étoile et peinture rose",
            name: "Poulpy"
          }
        },
        votes: 18,
        feedback: [
          { author: "Karla - Concept Artist", text: "Trop mignon Maya ! Les grands yeux bleus de Poulpy sont fantastiques !", rating: 5, date: new Date().toISOString() }
        ]
      }
    ]
  },
  {
    id: "tvseries-1",
    title: "KIDI SÉRIES : Le Polaris — Pilote de Série",
    subtitle: "Écris le pilote de la série d'animation SF parrainée par Netflix & Canal+",
    sponsor: "Aurélie Saada — Scénariste & Showrunner @ Canal+ & LinkYourArt",
    description: "Crée le premier épisode d'une série d'animation originale ! Développe tes personnages, écris les dialogues du pilote et imagine l'arc narratif de la saison. Le gagnant verra son pilote storyboardé par une équipe de pros et présenté aux équipes de développement de Canal+ Kids.",
    category: "tvseries",
    ageGroup: "12-15",
    isDemo: false,
    startDate: "2026-06-01",
    endDate: "2026-10-31",
    cluesDurationDays: 10,
    currentSimulatedDay: 1,
    maxDays: 10,
    clues: [
      { day: 1, title: "Le Showrunner", description: "Définis le concept de ta série en une phrase : genre, univers, cible.", type: "keyword", content: "concept série", isUnlocked: true },
      { day: 2, title: "Le Pitch", description: "Présente tes 3 personnages principaux avec leur rôle dans l'équipage.", type: "text", content: "personnages", isUnlocked: false },
      { day: 3, title: "Le Cold Open", description: "Écris l'accroche des 2 premières minutes de ton épisode.", type: "text", content: "cold open", isUnlocked: false },
      { day: 4, title: "Le Conflit", description: "Quel est l'enjeu central de ton pilote ? Qu'est-ce qui est en danger ?", type: "keyword", content: "enjeu", isUnlocked: false },
      { day: 5, title: "Le Cliffhanger", description: "Comment se termine ton épisode pour donner envie de voir la suite ?", type: "text", content: "cliffhanger", isUnlocked: false },
    ],
    nestedChallenges: [
      { id: "nest-tv-1", title: "Générique d'Intro", category: "music", description: "Compose le thème musical d'ouverture de ta série (8 mesures).", reward: "Collaboration avec compositeur Canal+", status: "active" },
      { id: "nest-tv-2", title: "Character Design", category: "design", description: "Dessine le design de ton personnage principal.", reward: "Critique par animateur Pixar France", status: "active" },
    ],
    submissions: []
  },
  {
    id: "podcast-1",
    title: "KIDI PODCAST : Voix du Cosmos",
    subtitle: "Crée et enregistre un épisode de podcast sur l'exploration spatiale & la science",
    sponsor: "Thomas Pesquet & l'équipe éditoriale de France Inter Jeunesse",
    description: "Lance ton propre podcast scientifique ! Choisis un sujet fascinant lié à l'espace, la nature ou la technologie, écris ton script, et enregistre un épisode de 5 minutes. Les meilleurs épisodes seront diffusés sur la plateforme France Inter Jeunesse et bénéficieront d'un coaching vocal avec un journaliste radio pro.",
    category: "podcast",
    ageGroup: "12-18",
    isDemo: false,
    startDate: "2026-06-15",
    endDate: "2026-11-30",
    cluesDurationDays: 8,
    currentSimulatedDay: 0,
    maxDays: 8,
    clues: [
      { day: 1, title: "Le Sujet", description: "Choisis ton thème scientifique et formule ta question centrale.", type: "keyword", content: "thème podcast", isUnlocked: false },
      { day: 2, title: "La Recherche", description: "Liste 5 faits surprenants sur ton sujet que peu de gens connaissent.", type: "text", content: "faits insolites", isUnlocked: false },
      { day: 3, title: "Le Script", description: "Écris l'intro accrocheuse de ton épisode (30 secondes à l'oral).", type: "text", content: "intro podcast", isUnlocked: false },
      { day: 4, title: "L'Invité Imaginaire", description: "Invente une interview avec un scientifique ou explorateur fictif.", type: "text", content: "interview", isUnlocked: false },
    ],
    nestedChallenges: [
      { id: "nest-pod-1", title: "Jingle d'Ouverture", category: "music", description: "Compose un jingle de 10 secondes pour ton podcast.", reward: "Diffusion sur France Inter Jeunesse", status: "active" },
    ],
    submissions: []
  }
];

// static curated distribution channels (NETFLIX for kids art streaming, distributed by KIDIWORLD)
export interface StreamItem {
  id: string;
  title: string;
  category: string;
  author: string;
  authorAge: number;
  description: string;
  banner: string;
  rating: string;
  feedback: string;
  themeColor: string;
  badge: string;
  mediaType: "cinema" | "music" | "costume" | "photography";
  contentSnippet: {
    act1: string;
    lyrics: string;
  };
}

const KIDISTREAM_GALLERY: StreamItem[] = [
  {
    id: "ks-1",
    title: "Le Cachalot et Bastien",
    category: "🎬 Séries d'Animation",
    author: "Bastien",
    authorAge: 14,
    description: "Un scénario d'animation hollywoodien mettant en scène un majestueux cachalot cosmique qui traverse des océans d'étoiles et de matière noire.",
    banner: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600",
    rating: "⭐⭐⭐⭐⭐",
    feedback: "L'écriture d'une poésie absolue, une odyssée céleste digne d'un grand studio !",
    themeColor: "from-amber-600/30 to-slate-950",
    badge: "SÉLECTION DU JURY",
    mediaType: "cinema",
    contentSnippet: {
      act1: "BASTIEN: Le grand harpon cosmique est ancré !\nL'ANDROÏDE: Bip-bop... Alerte de chants abyssaux !",
      lyrics: ""
    }
  },
  {
    id: "ks-2",
    title: "Symphonie Lactée Temporelle",
    category: "🎵 Bandes-sons Galactiques",
    author: "Léa",
    authorAge: 12,
    description: "Une production sonore originale combinant synthétiseur rétro, violons éthérés et des battements à 125BPM inspirés par la rotation terrestre.",
    banner: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600",
    rating: "⭐⭐⭐⭐⭐",
    feedback: "Une ambiance hypnotique, digne des plus prestigieux compositeurs de films spatiaux !",
    themeColor: "from-pink-600/30 to-slate-950",
    badge: "N°1 TRENDING",
    mediaType: "music",
    contentSnippet: {
      act1: "",
      lyrics: "Dans la nébuleuse d'Or chantent les cachalots...\nPoussières d'étoiles et rêves de cristal..."
    }
  },
  {
    id: "ks-3",
    title: "Poulpy le Poulpe Cosmique",
    category: "🎨 Stylisme & Costumes",
    author: "Maya",
    authorAge: 6,
    description: "Une création de style combinant les codes de la haute couture parisienne et les besoins d'ergonomie d'un astronaute en apesanteur.",
    banner: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600",
    rating: "⭐⭐⭐⭐⭐",
    feedback: "Un choix de couleurs audacieux, un coup de cœur unanime pour ce chef-d'œuvre de créativité !",
    themeColor: "from-emerald-600/40 to-slate-950",
    badge: "COUP DE COEUR",
    mediaType: "costume",
    contentSnippet: {
      act1: "Design: Poulpy - Peinture rose d'étoile avec visière en quartz stellaire.",
      lyrics: ""
    }
  },
  {
    id: "ks-4",
    title: "L'Odyssée Sonore de Linky",
    category: "🎵 Bandes-sons Galactiques",
    author: "Kenzo",
    authorAge: 10,
    description: "Bande-son électronique rétro-synthé ultra-dynamique, reproduisant des effets de signaux d'étoiles à neutrons d'une incroyable fraîcheur.",
    banner: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600",
    rating: "⭐⭐⭐⭐",
    feedback: "Une rythmique impeccable, une vraie maîtrise créative de la lutherie électronique.",
    themeColor: "from-indigo-600/30 to-slate-950",
    badge: "COOPÉRATIVE PRO",
    mediaType: "music",
    contentSnippet: {
      act1: "Électronique rythmée",
      lyrics: "Bip bop machine, bois une poussière d'étoile !"
    }
  },
  {
    id: "ks-5",
    title: "Larme de Perséide",
    category: "📸 Séquences Photo Reporter",
    author: "Éloi",
    authorAge: 13,
    description: "Cliché d'astrophotographie d'une netteté époustouflante, saisissant le passage d'une comète glaciale dans l'orbite lunaire.",
    banner: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=600",
    rating: "⭐⭐⭐⭐⭐",
    feedback: "Une maîtrise de l'exposition digne d'un grand reporter du National Geographic !",
    themeColor: "from-cyan-600/30 to-slate-950",
    badge: "OEIL D'OR",
    mediaType: "photography",
    contentSnippet: {
      act1: "Une supernova illuminant les anneaux célestes.",
      lyrics: ""
    }
  },
  {
    id: "ks-6",
    title: "La Cité Suspendue Néoplanétaire",
    category: "🏛️ Maquettes & Architecture",
    author: "Timothée",
    authorAge: 16,
    description: "Maquette écologique d'une métropole aérostatique autonome, conçue pour filtrer et capter la rosée cométaire.",
    banner: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
    rating: "⭐⭐⭐⭐⭐",
    feedback: "Jean Nouvel a été soufflé par l'ingéniosité de ce dôme vivant à verrière thermo-active !",
    themeColor: "from-teal-600/30 to-slate-950",
    badge: "GRAND PRIX ARCHI",
    mediaType: "photography", // This corresponds to how it works structurally, and we build photography preview
    contentSnippet: {
      act1: "Dôme de biosphère végétale à verrière active.",
      lyrics: ""
    }
  }
];

const INITIAL_LEADERBOARD = [
  { name: "Bastien", age: 14, category: "cinema", stars: 165, coins: 450, badge: "Master Scénario ✍️", avatar: "🚀 Astro-Mousse" },
  { name: "Léa", age: 12, category: "music", stars: 142, coins: 380, badge: "Grand Virtuose 🎹", avatar: "👽 Petit Génie" },
  { name: "Éloi", age: 13, category: "photography", stars: 128, coins: 310, badge: "Oeil de Lynx 📸", avatar: "🌟 Star Hunter" },
  { name: "Maya", age: 6, category: "design", stars: 98, coins: 250, badge: "Petit Coco Mode 🎨", avatar: "🧸 Bout-d-chou" },
  { name: "Timothée", age: 16, category: "architecture", stars: 110, coins: 290, badge: "Bâtisseur Sidéral 🏛️", avatar: "🪐 Globe Trotter" },
  { name: "Kenzo", age: 10, category: "animation", stars: 85, coins: 180, badge: "Gamer Bidouilleur 👾", avatar: "👾 Robot Rétro" },
  { name: "Sacha", age: 15, category: "tvseries", stars: 77, coins: 150, badge: "Showrunner Junior 📺", avatar: "🚀 Astro-Mousse" },
  { name: "Chloé", age: 8, category: "music", stars: 64, coins: 120, badge: "Joueuse Flûte 🎵", avatar: "👽 Petit Génie" },
  { name: "Arthur", age: 17, category: "photography", stars: 55, coins: 90, badge: "Reporter Comète 🌟", avatar: "🌟 Star Hunter" },
  { name: "Inès", age: 14, category: "podcast", stars: 48, coins: 80, badge: "Voix des Étoiles 🎙️", avatar: "🎙️ Micro Pro" }
];

export default function App() {
  const [role, setRole] = useState<"child" | "jury">("child");
  const [activeTab, setActiveTab] = useState<"explorer" | "workspace" | "profile" | "kidi-games" | "kidi-music" | "kidi-stream" | "accounts" | "partners">("explorer");
  const [activeWorkspaceSubTab, setActiveWorkspaceSubTab] = useState<"guide" | "screenplay" | "music" | "costume">("guide");

  // Onboarding On-load Tutorial Modal State at Root level to bypass header rendering constraints
  const [isTutorialOpen, setIsTutorialOpen] = useState(() => {
    const dismissed = localStorage.getItem("kidiworld_welcome_tutorial_dismissed");
    return dismissed !== "true";
  });
  const [tutorialStep, setTutorialStep] = useState(1);

  // Account Session for KidiClub & KidiCoins Wallet with LocalStorage persistence
  const [accountSession, setAccountSession] = useState<AccountSession>(() => {
    const saved = localStorage.getItem("kidiworld_account_session_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      isLoggedIn: false,
      username: "Copilote",
      role: "child",
      kidiCoins: 120,
      isPremiumMember: false,
      avatar: "🚀 Astro-Mousse"
    };
  });

  // Pick a random visual index at load to stimulate dynamic talent
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem("kidiworld_account_session_v1", JSON.stringify(accountSession));
  }, [accountSession]);

  useEffect(() => {
    if (accountSession.isLoggedIn) {
      setProfile((prev) => ({
        ...prev,
        childName: accountSession.username
      }));
    }
  }, [accountSession.isLoggedIn, accountSession.username]);

  useEffect(() => {
    const rand = Math.floor(Math.random() * BANNER_VISUALS.length);
    setActiveBannerIndex(rand);
  }, []);

  // User Profile with Parental Control states
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("kidiworld_user_profile_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      childName: "Bastien",
      childAge: 14,
      language: "fr",
      parentEmail: "parents@kidiworld.org",
      parentApproved: true,
      screenTimeLimitMinutes: 45,
      preferredCategories: ["cinema", "music", "design", "animation", "photography"]
    };
  });

  // Load challenges database from LocalStorage or initialize with seed
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem("kidiworld_all_challenges_v4");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return initialChallengesList;
  });

  const [activeChallengeId, setActiveChallengeId] = useState<string>("movie-whale-1");

  // Get active challenge
  const challenge = challenges.find((c) => c.id === activeChallengeId) || challenges[0];

  // Youth drafts
  const [draftTitle, setDraftTitle] = useState("Le Berceau de la Constellation");
  const [draftScreenplay, setDraftScreenplay] = useState({
    title: "Le Berceau de la Constellation",
    act1: "SCÈNE 1 - LE QUART DE NUIT\nDescription : Le navire spatial avance lentement. Un jeune mécano observe la nébuleuse scintillante.\nTout à coup, il prépare son HARPON COSMIQUE pour s'amarrer au grand vaisseau fantôme...\n\n",
    act2: "SCÈNE 2 - LA VOIX VIBRANTE\nDescription : Des CHANTS DES ABYSSES résonnent à travers les cloisons d'acier. Un ANDROÏDE BUGGÉ commence à peindre des poissons d'eau dorée sur les écrans radar.\n\n",
    act3: "SCÈNE 3 - SURF GRAVITATIONNEL\nDescription : Les VOILES À GRAVITÉ captent la POUSSIÈRE DE SINGULARITÉ pour lancer un saut hyper-vitesse. La bête stellaire les accompagne en chantant une merveilleuse mélodie finale.",
  });

  const [draftMusic, setDraftMusic] = useState({
    melody: [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    instrument: "space-piano",
    lyrics: "Un chant de cristal / Un lointain récital...",
    tempo: 120,
  });

  const [draftCostume, setDraftCostume] = useState({
    imageUrl: "",
    name: "Combinaison Solaire Bastien",
    materials: "Tissu d'or liquide à fils luminescents",
  });

  // Submit states
  const [childSubmitName, setChildSubmitName] = useState(profile.childName);
  const [childSubmitAge, setChildSubmitAge] = useState(profile.childAge);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  // Filters for the Challenge Explorer
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [filterAge, setFilterAge] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<string>("all"); // "all", "real", "demo"
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Netflix-style player simulation states
  const [selectedStreamItem, setSelectedStreamItem] = useState<StreamItem | null>(null);
  const [isStreamPlayerPlaying, setIsStreamPlayerPlaying] = useState<boolean>(false);
  const [streamVolume, setStreamVolume] = useState<number>(75);
  const [streamLikes, setStreamLikes] = useState<Record<string, number>>({
    "ks-1": 138,
    "ks-2": 242,
    "ks-3": 95,
    "ks-4": 84,
    "ks-5": 110,
  });

  // Sidebar collapsible view states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("kidiworld_sidebar_collapsed") === "true";
  });

  // Sound Synth Generator for Celebratory Moments
  const playFestiveSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      // Beautiful harmonic ascending bright celebratory arpeggio for kids
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        
        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.35);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } catch (e) {
      console.warn("Web Audio API not supported/interrupted:", e);
    }
  };

  // Leaderboard filters
  const [leaderboardCategory, setLeaderboardCategory] = useState<string>("all");
  const [leaderboardAge, setLeaderboardAge] = useState<string>("all");

  // Sync states with LocalStorage
  useEffect(() => {
    localStorage.setItem("kidiworld_all_challenges_v4", JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem("kidiworld_user_profile_v2", JSON.stringify(profile));
    setChildSubmitName(profile.childName);
    setChildSubmitAge(profile.childAge);
  }, [profile]);

  // Derived calculations for keys unlocking based on simulated date
  const unlockedClues = challenge.clues
    .filter((clue) => clue.day <= challenge.currentSimulatedDay)
    .map((clue) => clue.title);

  const statsStars = challenges.reduce((acc, currentCh) => {
    return acc + currentCh.submissions.reduce((sAcc, curr) => sAcc + curr.votes, 0);
  }, 125);

  // Kids events dispatcher
  const handleSaveScreenplay = (act1: string, act2: string, act3: string, title: string) => {
    setDraftScreenplay({ act1, act2, act3, title });
  };

  const handleSaveMusic = (melody: number[], instrument: string, lyrics: string, tempo: number) => {
    setDraftMusic({ melody, instrument, lyrics, tempo });
  };

  const handleSaveSketch = (imageUrl: string, characterName: string, materials: string) => {
    setDraftCostume({ imageUrl, name: characterName, materials });
  };

  // Helper drop-in setter to stay backwards compatible with previous single state calls
  const setChallenge = (updater: Challenge | ((prev: Challenge) => Challenge)) => {
    setChallenges((prevList) => {
      return prevList.map((c) => {
        if (c.id === challenge.id) {
          return typeof updater === "function" ? updater(c) : updater;
        }
        return c;
      });
    });
  };

  // Submission handler for active challenge
  const handleSubmittingProject = (category: "screenplay" | "music" | "costume") => {
    if (!childSubmitName.trim()) {
      alert("S'il te plaît, entre ton nom de jeune créatif ou enregistre ton profil !");
      return;
    }

    if (!profile.parentApproved && childSubmitAge < 15) {
      alert("⚠️ Attention : Une signature d'approbation parentale est nécessaire dans l'onglet 'Contrôle Parental' pour valider de vrais concours !");
      return;
    }

    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      challengeId: challenge.id,
      authorName: childSubmitName.trim(),
      authorAge: childSubmitAge,
      title: category === "screenplay" ? draftScreenplay.title : category === "music" ? "Thème Symphonique de " + childSubmitName : "Uniforme de " + childSubmitName,
      submittedAt: new Date().toISOString(),
      category: category,
      content: {
        screenplay: category === "screenplay" ? draftScreenplay : undefined,
        music: category === "music" ? draftMusic : undefined,
        costume: category === "costume" ? draftCostume : undefined,
      },
      votes: 1, 
      feedback: [],
    };

    setChallenge((prev) => ({
      ...prev,
      submissions: [newSub, ...prev.submissions],
    }));

    setIsSubmittedSuccessfully(true);
    // Celebrating with confetti and sound
    confetti({
      particleCount: 140,
      spread: 85,
      origin: { y: 0.65 }
    });
    playFestiveSound();
    setTimeout(() => setIsSubmittedSuccessfully(false), 4500);
  };

  // Jury Events Dispatchers (Updates specific submission in correct challenge)
  const handlePostFeedback = (submissionId: string, text: string, rating: number, author: string) => {
    setChallenge((prev) => {
      const nextSubmissions = prev.submissions.map((sub) => {
        if (sub.id === submissionId) {
          return {
            ...sub,
            votes: sub.votes + Math.floor(Math.random() * 8) + 3,
            feedback: [
              ...sub.feedback,
              {
                author,
                text,
                rating,
                date: new Date().toISOString(),
              },
            ],
          };
        }
        return sub;
      });
      return { ...prev, submissions: nextSubmissions };
    });
  };

  const handleAddClue = (clue: Clue) => {
    setChallenge((prev) => {
      return {
        ...prev,
        clues: [...prev.clues, clue],
      };
    });
  };

  const handleAdvanceTimeline = () => {
    setChallenge((prev) => {
      const nextDay = Math.min(prev.currentSimulatedDay + 1, prev.maxDays);
      const nextClues = prev.clues.map((clue) => {
        if (clue.day <= nextDay) {
          return { ...clue, isUnlocked: true };
        }
        return clue;
      });
      return { ...prev, currentSimulatedDay: nextDay, clues: nextClues };
    });
    // Celebratory effects
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 }
    });
    playFestiveSound();
  };

  const handleUnlockClueWithCoins = (clueDay: number) => {
    // Check if child is logged in
    if (!accountSession.isLoggedIn) {
      alert("🔑 Connecte-toi au KidiClub pour accumuler ou dépenser tes KidiCoins !");
      return;
    }
    // Check if enough coins
    if (accountSession.kidiCoins < 10) {
      alert("❌ Oups ! Tu as besoin de 10 KidiCoins pour débloquer cet indice. Joue aux KidiGames pour en gagner !");
      return;
    }
    
    // Deduct coins & unlock clue
    setAccountSession((prev) => ({
      ...prev,
      kidiCoins: prev.kidiCoins - 10
    }));

    setChallenge((prev) => {
      const nextClues = prev.clues.map((clue) => {
        if (clue.day === clueDay) {
          return { ...clue, isUnlocked: true };
        }
        return clue;
      });
      return { ...prev, clues: nextClues };
    });

    // Celebrate!
    confetti({
      particleCount: 150,
      spread: 85,
      origin: { y: 0.65 }
    });
    playFestiveSound();
  };

  const handleLikeStreamItem = (itemId: string) => {
    setStreamLikes((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleResetTimeline = () => {
    setChallenge((prev) => {
      const resetClues = prev.clues.map((clue) => {
        return { ...clue, isUnlocked: clue.day <= 2 };
      });
      return { ...prev, currentSimulatedDay: 2, clues: resetClues };
    });
  };

  const handleAddNewChallenge = (title: string, subtitle: string, desc: string, sponsor: string, maxDays: number) => {
    const newChallengeSetup: Challenge = {
      id: `challenge-${Date.now()}`,
      title,
      subtitle,
      sponsor,
      description: desc,
      category: "cinema",
      ageGroup: "12-15",
      isDemo: false,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      cluesDurationDays: maxDays,
      currentSimulatedDay: 1,
      maxDays: maxDays,
      clues: Array(maxDays).fill(null).map((_, i) => ({
        day: i + 1,
        title: `Indice magique ${i + 1}`,
        description: `Trouve comment enrichir ton histoire avec l'indice du jour ${i + 1}.`,
        type: "keyword",
        content: `indice ${i + 1}`,
        isUnlocked: i === 0,
      })),
      nestedChallenges: [
        { id: `nest-mus-${Date.now()}`, title: "La Musique de " + title, category: "music", description: "Compose un hymne sonore original.", reward: "Insigne Pro", status: "active" },
        { id: `nest-cos-${Date.now()}`, title: "La Tenue de " + title, category: "costume", description: "Imagine le croquis.", reward: "Dessinateur Certifié", status: "active" },
      ],
      submissions: [],
    };

    setChallenges((prev) => [newChallengeSetup, ...prev]);
    setActiveChallengeId(newChallengeSetup.id);
    setActiveTab("workspace");
    setActiveWorkspaceSubTab("guide");
  };

  // Filters calculation
  const filteredChallengesList = challenges.filter((ch) => {
    const matchesCategory = filterCategory.length === 0 || filterCategory.includes(ch.category);
    const matchesAge = filterAge === "all" || ch.ageGroup === filterAge;
    const matchesMode = filterMode === "all" || 
      (filterMode === "demo" && ch.isDemo) || 
      (filterMode === "real" && !ch.isDemo);

    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return matchesCategory && matchesAge && matchesMode;
    }

    // Match title, subtitle, or description
    const matchTitle = ch.title.toLowerCase().includes(q);
    const matchSubtitle = ch.subtitle.toLowerCase().includes(q);
    const matchDescription = ch.description.toLowerCase().includes(q);
    
    // Match category
    const matchCategoryText = ch.category.toLowerCase().includes(q);
    
    // Match category readable labels in French/English
    const categoryLabel = ch.category === "cinema" ? "cinéma cinoche film movie scénario scenario" 
      : ch.category === "music" ? "musique chanson sound original song track compositeur son" 
      : ch.category === "design" ? "mode dessin stylisme beaux-arts croquis costume tenue"
      : ch.category === "animation" ? "jeu vidéo anim 3d cinoche d'animation"
      : ch.category === "photography" ? "photographie photo lumière prisme zoom supernova"
      : "";
    const matchCategoryLabel = categoryLabel.includes(q);

    // Match keywords or clue metadata
    const matchClues = ch.clues.some(clue => 
      clue.title.toLowerCase().includes(q) ||
      clue.description.toLowerCase().includes(q) ||
      clue.content.toLowerCase().includes(q)
    );

    // Match nested challenges
    const matchNested = ch.nestedChallenges.some(nest =>
      nest.title.toLowerCase().includes(q) ||
      nest.description.toLowerCase().includes(q)
    );

    const matchesSearch = matchTitle || matchSubtitle || matchDescription || matchCategoryText || matchCategoryLabel || matchClues || matchNested;

    return matchesCategory && matchesAge && matchesMode && matchesSearch;
  });

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-amber-500 selection:text-slate-900 pb-12 flex flex-col font-sans">
      
      {/* Dynamic Smart Header */}
      <Header 
        starsCount={statsStars}
        profileName={profile.childName}
        profileAge={profile.childAge}
        profileLang={profile.language}
        onChangeLang={(lang) => {
          setProfile(prev => ({ ...prev, language: lang }));
        }}
        onOpenProfile={() => {
          setActiveTab("profile");
        }}
        isProfileActive={activeTab === "profile"}
        kidiCoins={accountSession.kidiCoins}
        onOpenTutorial={() => {
          setTutorialStep(1);
          setIsTutorialOpen(true);
        }}
      />

      {true ? (
        // Children view workspace
        <main className="max-w-7xl mx-auto px-6 mt-6 flex-1 w-full flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT SIDEBAR NAVIGATION PANEL */}
          <div className={`w-full ${isSidebarCollapsed ? "lg:w-[76px]" : "lg:w-[280px]"} shrink-0 lg:sticky lg:top-6 flex flex-col gap-4 transition-all duration-300`}>
            
            {/* Quick avatar summary for children */}
            <div className={`bg-gradient-to-br from-indigo-950/45 via-slate-900 to-indigo-950/25 border border-slate-900 ${isSidebarCollapsed ? "p-3.5 justify-center" : "p-5"} rounded-2xl relative overflow-hidden flex items-center gap-3`}>
              <div 
                className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-amber-600 border border-amber-400 text-slate-950 text-md font-black flex items-center justify-center rounded-full shrink-0 shadow-lg select-none"
                title={`${profile.childName || "Visiteur"} - ${statsStars} Stars`}
              >
                🚀
              </div>
              {!isSidebarCollapsed && (
                <div className="text-left leading-tight min-w-0 transition-all duration-305">
                  <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase tracking-wider">
                    Artiste Junior
                  </span>
                  <span className="text-sm font-black text-white block truncate">
                    {profile.childName || "Visiteur"}
                  </span>
                  <span className="text-[10px] text-amber-550 font-bold block font-mono leading-none mt-0.5 animate-pulse">
                    ★ {statsStars} Stars
                  </span>
                </div>
              )}
            </div>

            {/* Main Navigation Stack */}
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-900 flex flex-col gap-2 shadow-xl">
              <div className="flex items-center justify-between px-1 select-none">
                {!isSidebarCollapsed && (
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold block text-left px-1 py-1">
                    Menu Principal
                  </span>
                )}
                <button
                  onClick={() => {
                    const nextState = !isSidebarCollapsed;
                    setIsSidebarCollapsed(nextState);
                    localStorage.setItem("kidiworld_sidebar_collapsed", String(nextState));
                  }}
                  className={`p-1.5 hover:bg-slate-950 text-slate-400 hover:text-white rounded-lg transition duration-150 cursor-pointer ${isSidebarCollapsed ? "mx-auto w-full flex justify-center" : ""}`}
                  title={isSidebarCollapsed ? "Déplier le menu" : "Replier le menu"}
                >
                  {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>

              {/* Grid or vertical stack depending on the screen dimensions */}
              <div className="flex flex-wrap lg:flex-col gap-1.5 w-full">
                
                {/* EXPLORATEUR */}
                <button
                  onClick={() => setActiveTab("explorer")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition flex-grow sm:flex-initial lg:w-full text-left cursor-pointer ${
                    activeTab === "explorer"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-950/60"
                  } ${isSidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                  title={t("nav.explorer", profile.language)}
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span className={isSidebarCollapsed ? "lg:hidden" : ""}>{t("nav.explorer", profile.language)}</span>
                </button>

                {/* WORKSPACE - MON STUDIO */}
                <button
                  onClick={() => setActiveTab("workspace")}
                  className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition flex-grow sm:flex-initial lg:w-full text-left cursor-pointer ${
                    activeTab === "workspace"
                      ? "bg-gradient-to-r from-indigo-505 to-purple-500 text-white shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-950/60"
                  } ${isSidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                  title={t("nav.workspace", profile.language)}
                >
                  <div className={`flex items-center gap-2.5 min-w-0 ${isSidebarCollapsed ? "lg:justify-center w-full" : ""}`}>
                    <Zap className="w-4 h-4 text-amber-505 shrink-0" />
                    <span className={isSidebarCollapsed ? "lg:hidden truncate" : "truncate"}>{t("nav.workspace", profile.language)}</span>
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-[9px] bg-slate-950/60 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded font-mono shrink-0 truncate max-w-[80px] hidden lg:inline-block">
                      {challenge.title.slice(0, 8)}...
                    </span>
                  )}
                </button>

                {/* KIDI GAMES */}
                <button
                  onClick={() => setActiveTab("kidi-games")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition flex-grow sm:flex-initial lg:w-full text-left cursor-pointer ${
                    activeTab === "kidi-games"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-950/60"
                  } ${isSidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                  title={t("nav.kidigames", profile.language)}
                >
                  <Gamepad2 className="w-4 h-4 shrink-0" />
                  <span className={isSidebarCollapsed ? "lg:hidden" : ""}>{t("nav.kidigames", profile.language)}</span>
                </button>

                {/* KIDI MUSIC */}
                <button
                  onClick={() => setActiveTab("kidi-music")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition flex-grow sm:flex-initial lg:w-full text-left cursor-pointer ${
                    activeTab === "kidi-music"
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-950/60"
                  } ${isSidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                  title={t("nav.kidimusic", profile.language)}
                >
                  <Music className="w-4 h-4 shrink-0" />
                  <span className={isSidebarCollapsed ? "lg:hidden" : ""}>{t("nav.kidimusic", profile.language)}</span>
                </button>

                {/* KIDI STREAM */}
                <button
                  onClick={() => setActiveTab("kidi-stream")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition flex-grow sm:flex-initial lg:w-full text-left cursor-pointer ${
                    activeTab === "kidi-stream"
                      ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-950/60"
                  } ${isSidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                  title={t("nav.kidistream", profile.language)}
                >
                  <Film className="w-4 h-4 shrink-0" />
                  <span className={isSidebarCollapsed ? "lg:hidden" : ""}>{t("nav.kidistream", profile.language)}</span>
                </button>

                {/* ABOUT US (QUI SOMMES-NOUS ?) */}
                <button
                  onClick={() => setActiveTab("about")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition flex-grow sm:flex-initial lg:w-full text-left cursor-pointer ${
                    activeTab === "about"
                      ? "bg-gradient-to-r from-amber-500/25 to-amber-500/10 text-white border border-amber-500/30 shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-950/60"
                  } ${isSidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                  title={t("nav.about", profile.language)}
                >
                  <BookOpen className="w-4 h-4 text-amber-505 shrink-0" />
                  <span className={isSidebarCollapsed ? "lg:hidden" : ""}>{t("nav.about", profile.language)}</span>
                </button>

                {/* PARTNERS */}
                <button
                  onClick={() => setActiveTab("partners")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition flex-grow sm:flex-initial lg:w-full text-left cursor-pointer ${
                    activeTab === "partners"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-505 text-slate-950 shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-950/60"
                  } ${isSidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                  title={t("nav.partners", profile.language)}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span className={isSidebarCollapsed ? "lg:hidden" : ""}>{t("nav.partners", profile.language)}</span>
                </button>

                {/* KIDICLUB (ACCOUNTS) */}
                <button
                  onClick={() => setActiveTab("accounts")}
                  className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition flex-grow sm:flex-initial lg:w-full text-left cursor-pointer relative ${
                    activeTab === "accounts"
                      ? "bg-gradient-to-r from-indigo-650 to-violet-650 text-white shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-950/60"
                  } ${isSidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                  title={t("nav.kidiclub", profile.language)}
                >
                  <div className={`flex items-center gap-2.5 min-w-0 ${isSidebarCollapsed ? "lg:justify-center" : ""}`}>
                    <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className={isSidebarCollapsed ? "lg:hidden" : ""}>{t("nav.kidiclub", profile.language)}</span>
                  </div>
                  {accountSession.isLoggedIn && !isSidebarCollapsed ? (
                    <span className="text-[10px] bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                      {accountSession.kidiCoins} Coins
                    </span>
                  ) : null}
                </button>

              </div>

            </div>

            {/* Quick alert bar to show leftover screen-time limits dynamically */}
            {profile.screenTimeLimitMinutes !== 9999 && (
              <div className={`flex items-center gap-2 text-[10px] text-amber-500 bg-amber-500/5 ${isSidebarCollapsed ? "p-3 justify-center" : "px-4 py-3"} rounded-2xl border border-amber-500/10 font-mono text-left select-none`}>
                <Clock className="w-5 h-5 text-amber-500 animate-spin shrink-0 animate-pulse" style={{ animationDuration: "12s" }} />
                {!isSidebarCollapsed && <span className="transition-all duration-300">Supervision active : session protégée sous contrôle parental.</span>}
              </div>
            )}

          </div>

          {/* RIGHT ACTIONABLE CONTENT AREA */}
          <div className="flex-1 w-full space-y-6 min-w-0">

          {activeTab === "explorer" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Whimsical Kids Hero Banner with randomized dynamic artwork */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-900 shadow-2xl bg-slate-950 p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 min-h-[260px]">
                {/* Background decorative image matching target index */}
                <div className="absolute inset-0 z-0 opacity-40 hover:opacity-55 transition-opacity duration-500 overflow-hidden">
                  <img
                    src={BANNER_VISUALS[activeBannerIndex].imagePath}
                    alt="Atmosphère Créative"
                    className="w-full h-full object-cover scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${BANNER_VISUALS[activeBannerIndex].gradient}`} />
                </div>

                <div className="relative z-10 space-y-3 text-left max-w-xl">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full inline-block font-mono">
                    {BANNER_VISUALS[activeBannerIndex].badge}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                    {BANNER_VISUALS[activeBannerIndex].slogan}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed font-sans">
                    {BANNER_VISUALS[activeBannerIndex].description}
                  </p>

                  <button
                    id="shuffle-visual-indicator"
                    onClick={() => {
                      const nextIndex = (activeBannerIndex + 1) % BANNER_VISUALS.length;
                      setActiveBannerIndex(nextIndex);
                    }}
                    className="mt-2 text-[11px] font-extrabold text-amber-400 bg-amber-500/15 border border-amber-400/25 hover:bg-amber-500/35 transition cursor-pointer px-3.5 py-1.5 rounded-full flex items-center gap-1.5 select-none"
                  >
                    ✨ Stimuler mon talent (Changer de visuel d'IA)
                  </button>
                </div>

                <div className="relative z-10 shrink-0 bg-slate-900/95 backdrop-blur-sm p-5 py-4 rounded-2xl border border-slate-800 text-left max-w-xs space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Évaluation Mondiale :</span>
                  <strong className="text-xs text-amber-400 font-sans block">De vraies récompenses</strong>
                  <p className="text-[10px] text-slate-300 leading-normal">
                    Reçois des retours constructifs et gagne ta place d'études en atelier d'animation, n'importe où dans le monde !
                  </p>
                </div>
              </div>

              {/* 🏆 SPECTACULAR PRESTIGE PRIX & GRAND PRIX SHOWCASE */}
              <PrestigeAwards language={profile.language} />



              {/* Advanced Interactive Filtering system for Categories, Age limits, and Demo flag */}
              <div className="bg-slate-900 border border-slate-950 shadow-lg p-5 rounded-3xl text-left space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                      Filtres de Pointe de la Plateforme (4 - 18 ans)
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {filteredChallengesList.length} défis trouvés pour ton profil
                  </span>
                </div>

                {/* Challenge Search Bar Input integration */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    id="challenge-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Chercher un défi par titre, mot-clé, catégorie (ex: cinéma, photo, musique, herbes, lune)..."
                    className="w-full pl-10 pr-24 py-3 bg-slate-950/80 border border-slate-800/80 focus:border-amber-500/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-sans"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[10px] hover:text-white transition font-mono font-bold text-rose-400 cursor-pointer"
                    >
                      Effacer [×]
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Filter selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      Catégories Artistiques <span className="text-amber-500/70">(multi-sélection)</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "cinema", label: "🎬 CINÉMA" },
                        { id: "music", label: "🎵 MUSIC" },
                        { id: "design", label: "🎨 DESIGN" },
                        { id: "animation", label: "👾 3D & JEUX" },
                        { id: "photography", label: "📸 PHOTO" },
                        { id: "architecture", label: "🏛️ ARCHI" },
                        { id: "tvseries", label: "📺 TV SÉRIES" },
                        { id: "podcast", label: "🎙️ PODCAST" },
                      ].map((cat) => {
                        const isSelected = filterCategory.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setFilterCategory(prev =>
                              prev.includes(cat.id) ? prev.filter(c => c !== cat.id) : [...prev, cat.id]
                            )}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap select-none ${
                              isSelected
                                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 scale-105"
                                : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-600"
                            }`}
                          >
                            {cat.label}{isSelected && <span className="ml-1 text-slate-950">✓</span>}
                          </button>
                        );
                      })}
                      {filterCategory.length > 0 && (
                        <button
                          onClick={() => setFilterCategory([])}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                        >
                          ✕ Tout effacer
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Developmental Age filter selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      Tranche d'Âge Créatif
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {["all", "4-7", "8-11", "12-15", "16-18"].map((age) => (
                        <button
                          key={age}
                          onClick={() => setFilterAge(age)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                            filterAge === age
                              ? "bg-indigo-500 text-white font-black"
                              : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                          }`}
                        >
                          {age === "all" ? "Tout Âge" : `${age} ans`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode demo vs real concours filter */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      Type de participation
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { code: "all", label: "Tous les modes" },
                        { code: "demo", label: "Essais & Démos" },
                        { code: "real", label: "Vrais Concours Pro" }
                      ].map((mode) => (
                        <button
                          key={mode.code}
                          onClick={() => setFilterMode(mode.code)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            filterMode === mode.code
                              ? "bg-pink-500 text-white font-black"
                              : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* TWO COLUMN GRID FOR CHALLENGES & LEADERBOARDS SIDE-BY-SIDE */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start text-left">
                
                {/* Left Area (3 COLUMNS) - Challenge cards */}
                <div className="xl:col-span-3 space-y-6">
                  {filteredChallengesList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredChallengesList.map((ch) => (
                        <ChallengeCard
                          key={ch.id}
                          challenge={ch}
                          isActive={ch.id === activeChallengeId}
                          language={profile.language}
                          onSelect={(challengeId) => {
                            setActiveChallengeId(challengeId);
                            setActiveWorkspaceSubTab("guide");
                            setActiveTab("workspace");
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-900/45 border border-slate-900 rounded-3xl p-10 text-center space-y-4 max-w-sm mx-auto shadow-xl animate-fadeIn mt-4">
                      <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto text-2xl border border-amber-500/25">
                        🔍
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-white font-bold text-sm">Aucun défi trouvé</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Zut ! Aucun défi ne correspond précisément à votre recherche ou vos filtres. Essayez d'ajuster vos mots-clés ou réinitialisez tout pour explorer de nouvelles idées !
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setFilterCategory([]);
                          setFilterAge("all");
                          setFilterMode("all");
                        }}
                        className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-black rounded-xl transition cursor-pointer shadow-md"
                      >
                        Réinitialiser tous les filtres
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Area (1 COLUMN) - Talent Leaderboard Board */}
                <div className="xl:col-span-1 bg-slate-900 border border-slate-900/60 rounded-[2rem] p-5 space-y-4 shadow-xl text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="pb-3 border-b border-indigo-950 flex flex-col gap-1">
                    <span className="text-[9px] bg-amber-500/15 border border-amber-500/20 text-amber-400 font-extrabold px-2.5 py-0.5 rounded-full inline-block tracking-wide uppercase font-mono w-max">
                      🏆 Hall of Fame
                    </span>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans mt-1">
                      Classement des Prodiges
                    </h3>
                    <p className="text-[9px] text-slate-400 leading-relaxed">
                      Recherche de talents immédiate pour les recruteurs certifiés.
                    </p>
                  </div>

                  {/* Leaderboard Area Selectors */}
                  <div className="space-y-2 pt-1 font-sans">
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-400 uppercase tracking-widest font-mono font-bold block">
                        Spécialité Artistique
                      </label>
                      <select
                        value={leaderboardCategory}
                        onChange={(e) => setLeaderboardCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="all">🔥 Tous les milieux créatifs</option>
                        <option value="cinema">🎬 KIDI CINÉMA / SCÉNARIO</option>
                        <option value="music">🎵 KIDI MUSIC</option>
                        <option value="design">🎨 KIDI DESIGN & MODE</option>
                        <option value="animation">👾 KIDI 3D & JEUX</option>
                        <option value="photography">📸 KIDI PHOTOGRAPHY</option>
                        <option value="architecture">🏛️ KIDI ARCHITECTURE</option>
                        <option value="tvseries">📺 TV SÉRIES</option>
                        <option value="podcast">🎙️ PODCAST</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-400 uppercase tracking-widest font-mono font-bold block">
                        Tranche d'Âge
                      </label>
                      <select
                        value={leaderboardAge}
                        onChange={(e) => setLeaderboardAge(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="all">Tout âge confondu</option>
                        <option value="4-7">4 - 7 ans (Junior)</option>
                        <option value="8-11">8 - 11 ans (Moyen)</option>
                        <option value="12-15">12 - 15 ans (Teenager)</option>
                        <option value="16-18">16 - 18 ans (Senior)</option>
                      </select>
                    </div>
                  </div>

                  {/* Dynamic mapped list of children with scout options */}
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {INITIAL_LEADERBOARD
                      .filter(user => {
                        const matchCat = leaderboardCategory === "all" || user.category === leaderboardCategory;
                        const matchAgeSegment = leaderboardAge === "all" || 
                          (leaderboardAge === "4-7" && user.age >= 4 && user.age <= 7) ||
                          (leaderboardAge === "8-11" && user.age >= 8 && user.age <= 11) ||
                          (leaderboardAge === "12-15" && user.age >= 12 && user.age <= 15) ||
                          (leaderboardAge === "16-18" && user.age >= 16 && user.age <= 18);
                        return matchCat && matchAgeSegment;
                      })
                      .map((user, idx) => (
                        <div
                          key={user.name}
                          className="bg-slate-955/80 border border-slate-900/60 pb-2.5 pt-2 px-2.5 rounded-xl flex items-center justify-between gap-2.5 transition group hover:border-slate-800"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[10px] font-mono font-black text-amber-500 w-4 text-center shrink-0">
                              #{idx + 1}
                            </span>
                            <div className="text-left leading-tight min-w-0">
                              <span className="text-xs font-black text-white hover:text-amber-400 block truncate">
                                {user.name} <span className="text-slate-400 text-[10px]">({user.age} ans)</span>
                              </span>
                              <span className="text-[8px] text-slate-400 block uppercase tracking-wide font-mono font-bold truncate">
                                {user.badge}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end shrink-0">
                            <span className="text-xs font-black text-amber-400 font-mono">
                              ⭐ {user.stars}
                            </span>
                            <button
                              onClick={() => {
                                alert(`📡 Contact Parental Sécurisé LinkYourArt Network :\n\nVous demandez à recruter ou proposer un stage thématique à ${user.name} (${user.age} ans) sous la supervision des parents.\n\nUn courriel d'accord d'écriture a été expédié à l'administrateur de KidiWorld.`);
                              }}
                              className="text-[8px] mt-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded cursor-pointer transition select-none uppercase"
                            >
                              Scouter 💼
                            </button>
                          </div>
                        </div>
                      ))}

                    {INITIAL_LEADERBOARD.filter(user => {
                      const matchCat = leaderboardCategory === "all" || user.category === leaderboardCategory;
                      const matchAgeSegment = leaderboardAge === "all" || 
                        (leaderboardAge === "4-7" && user.age >= 4 && user.age <= 7) ||
                        (leaderboardAge === "8-11" && user.age >= 8 && user.age <= 11) ||
                        (leaderboardAge === "12-15" && user.age >= 12 && user.age <= 15) ||
                        (leaderboardAge === "16-18" && user.age >= 16 && user.age <= 18);
                      return matchCat && matchAgeSegment;
                    }).length === 0 && (
                      <span className="text-[10px] text-slate-500 italic block text-center py-4">
                        Aucun candidat dans cette sélection.
                      </span>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === "profile" && (
            <div className="animate-fadeIn">
              <ProfileSetup 
                profile={profile} 
                onChangeProfile={(updated) => setProfile(updated)} 
                starsCount={statsStars}
              />
            </div>
          )}

          {activeTab === "accounts" && (
            <div className="animate-fadeIn">
              <AccountAuth
                session={accountSession}
                onUpdateSession={(newSession) => setAccountSession(newSession)}
                language={profile.language}
              />
            </div>
          )}

          {activeTab === "kidi-games" && (
            <div className="animate-fadeIn">
              <KidiGaming
                session={accountSession}
                onUpdateSession={(newSession) => setAccountSession(newSession)}
                language={profile.language}
              />
            </div>
          )}

          {activeTab === "kidi-music" && (
            <div className="animate-fadeIn">
              <KidiMusic
                session={accountSession}
                onUpdateSession={(newSession) => setAccountSession(newSession)}
                language={profile.language}
              />
            </div>
          )}

          {activeTab === "kidi-stream" && (
            <div className="space-y-6 animate-fadeIn text-left">
              {/* BRAND NEW HEADLAND DISTRIBUTION ZONE BAR */}
              <div className="bg-gradient-to-br from-indigo-950/45 via-slate-900/95 to-indigo-950/25 p-8 rounded-[2.5rem] border border-slate-900 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-10 w-80 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute -left-10 -bottom-10 w-80 h-32 bg-pink-500/5 blur-3xl rounded-full pointer-events-none" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                  <div className="space-y-2">
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest font-mono border border-indigo-500/20 animate-pulse">
                      📡 Galerie KidiStream — Auto-Distribution Mondiale
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight font-sans">
                      Les Chefs-d'œuvre de la Communauté KidiWorld 🏆
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold max-w-2xl leading-relaxed">
                      Quand un jeune artiste (4 à 18 ans) soumet une création, notre jury et la lutherie IA l'analysent, puis le publient directement en distribution. Clique sur n'importe quel chef-d'œuvre pour ouvrir le Lecteur Interactif Sandbox et bidouiller ses paramètres !
                    </p>
                  </div>

                  {/* High quality stats cards explaining platform value instantly */}
                  <div className="grid grid-cols-2 gap-3 shrink-0 w-full md:w-auto font-mono">
                    <div className="p-3 bg-slate-950/85 border border-slate-900/85 rounded-xl text-center space-y-0.5">
                      <span className="text-[10px] text-slate-500 font-bold block">AUDIENCE GLOBAL</span>
                      <span className="text-sm font-black text-amber-400 block">45,280+ Écoutes</span>
                    </div>
                    <div className="p-3 bg-slate-950/85 border border-slate-900/85 rounded-xl text-center space-y-0.5">
                      <span className="text-[10px] text-slate-500 font-bold block">PRIX ATTRIBUÉS</span>
                      <span className="text-sm font-black text-pink-400 block">1,240 ★ Stars</span>
                    </div>
                  </div>
                </div>

                {/* Grid layout of all beautiful artworks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 relative z-10">
                  {KIDISTREAM_GALLERY.map((item) => {
                    const likes = streamLikes[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedStreamItem(item);
                          setIsStreamPlayerPlaying(true);
                        }}
                        className="bg-slate-950/90 border border-slate-900 hover:border-indigo-500 rounded-3xl overflow-hidden cursor-pointer group transition-all duration-300 relative hover:-translate-y-1.5 shadow-xl hover:shadow-[0_15px_40px_rgba(99,102,241,0.18)] select-none"
                      >
                        {/* Upper Badge */}
                        <div className="absolute top-3.5 left-3.5 z-10 flex gap-2">
                          <span className="text-[9px] font-black bg-indigo-600 text-white px-2.5 py-1 rounded-md tracking-wider uppercase shadow-md font-sans">
                            {item.badge}
                          </span>
                        </div>

                        {/* Banner Image with circular play overlay on hover */}
                        <div className="h-44 w-full relative overflow-hidden bg-slate-900">
                          <img
                            src={item.banner}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                          
                          {/* Play circle overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/45 backdrop-blur-[1px]">
                            <div className="w-12 h-12 bg-white hover:bg-amber-400 text-slate-950 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition duration-300">
                              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Metadata details */}
                        <div className="p-5 space-y-1.5 text-left relative">
                          <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest font-mono">
                            {item.category}
                          </span>
                          <h4 className="text-sm font-black text-white group-hover:text-amber-400 transition truncate leading-snug">
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 block font-semibold truncate leading-none">
                            Par <strong className="text-slate-200 font-bold">{item.author} ({item.authorAge} ans)</strong>
                          </span>
                          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 pt-1 font-medium italic">
                            "{item.description}"
                          </p>

                          <div className="pt-3 border-t border-slate-900 mt-3 flex justify-between items-center text-[10px] font-mono text-slate-400 leading-none">
                            <span className="text-amber-400 font-black block">{item.rating}</span>
                            <span className="text-indigo-400 font-black flex items-center gap-1.5 hover:text-indigo-300">
                              ❤️ {likes} likes
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STATS DECK THAT EXPLAINS THE DISTRIBUTION SYSTEM SO IT'S NOT AN EMPTY CONCEPT */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
                <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-900 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white hover:text-amber-400 block tracking-tight uppercase">Émetteurs & Radios 📡</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                        Les morceaux originaux de Kidi Music et les bandes-sons du studio sont automatiquement indexés par notre lutherie IA.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-900 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-pink-500/10 text-pink-400 rounded-lg border border-pink-500/20">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white hover:text-pink-400 block tracking-tight uppercase">Studios d'Animation 🎬</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                        Les scénaristes d'élite de LinkYourArt reçoivent directement les scripts primés en 3 actes rédigés par les jeunes génies.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-900 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white hover:text-cyan-400 block tracking-tight uppercase">Grands Prix Physiques 🏅</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                        Gagne des bourses réelles, des stages chez Ubisoft ou Radio France, et des visites guidées de prestigieux studios à Paris !
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Entertainment Player Modal */}
              {isStreamPlayerPlaying && selectedStreamItem && (
                <KidiStreamPlayer
                  item={selectedStreamItem}
                  onClose={() => {
                    setIsStreamPlayerPlaying(false);
                    setSelectedStreamItem(null);
                  }}
                  language={profile.language}
                  likesCount={streamLikes[selectedStreamItem.id] || 0}
                  onLike={handleLikeStreamItem}
                  playCelebration={() => {
                    confetti({
                      particleCount: 130,
                      spread: 75,
                      origin: { y: 0.6 }
                    });
                    playFestiveSound();
                  }}
                />
              )}

            </div>
          )}

          {activeTab === "partners" && (
            <div className="animate-fadeIn">
              <PartnersSection language={profile.language} />
            </div>
          )}

          {activeTab === "about" && (
            <div className="animate-fadeIn">
              <AboutUsSection language={profile.language} />
            </div>
          )}

          {activeTab === "workspace" && (
            <div className="space-y-6">
              
              {/* Workspace Mini Banner showing Active Challenge & Category details with Real-time translate */}
              <div className="bg-slate-900/95 border border-slate-800/70 p-5 rounded-3xl text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      challenge.isDemo ? "bg-sky-500/10 text-sky-400" : "bg-rose-500/10 text-rose-400"
                    }`}>
                      {challenge.isDemo ? "MODE DÉMO" : "CONCOURS RÉEL LINKYOURART"}
                    </span>
                    <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                      Âge visé : {challenge.ageGroup} ans
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-black text-white leading-tight">
                    <TranslatedText text={challenge.title} targetLang={profile.language} />
                  </h2>
                  <p className="text-xs text-slate-400">
                    <TranslatedText text={challenge.subtitle} targetLang={profile.language} />
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400 font-mono">Langue Traduite :</span>
                  <span className="text-xs font-bold bg-slate-950 px-2.5 py-1.5 border border-slate-800 rounded-lg text-amber-400">
                    {profile.language.toUpperCase()} (IA Temps Réel)
                  </span>
                </div>
              </div>

              {/* Core Kids Workspace Layout Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                
                {/* Main Tabs and Workspace Work - 3 Columns */}
                <div className="xl:col-span-3 space-y-6">
                  {/* Kids Interface tab navigation and categories */}
                  <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 flex flex-wrap gap-1.5 shadow-md">
                    <button
                      onClick={() => setActiveWorkspaceSubTab("guide")}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        activeWorkspaceSubTab === "guide" ? "bg-slate-950 text-white border border-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      1. Guide du Challenge & Indices
                    </button>
                    
                    <button
                      onClick={() => setActiveWorkspaceSubTab("screenplay")}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        activeWorkspaceSubTab === "screenplay" ? "bg-slate-950 text-amber-400 border border-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      2. Scénariste (Textes)
                    </button>
                    
                    <button
                      onClick={() => setActiveWorkspaceSubTab("music")}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        activeWorkspaceSubTab === "music" ? "bg-slate-950 text-violet-400 border border-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Music className="w-4 h-4 text-violet-400" />
                      3. Studio Sonore (Chanson)
                    </button>
                    
                    <button
                      onClick={() => setActiveWorkspaceSubTab("costume")}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        activeWorkspaceSubTab === "costume" ? "bg-slate-950 text-pink-400 border border-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Palette className="w-4 h-4 text-pink-400" />
                      4. Dessin (Costumes d'Équipage)
                    </button>
                  </div>

                  {/* Display respective active component workspace */}
                  {activeWorkspaceSubTab === "guide" && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 text-left">
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          Règles de Participation & Distributeur d'Indices de Pro
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Chaque jour, le jury professionnel LinkYourArt déverrouille de nouveaux indices d'orientation. Combine tous les indices débloqués pour bâtir le dossier créatif le plus original dans l'âge cible.
                        </p>
                      </div>

                      {/* Summary of mission description */}
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 flex gap-4 leading-relaxed text-xs text-slate-300">
                        <div className="w-1.5 bg-gradient-to-b from-amber-500 to-pink-500 rounded-full shrink-0" />
                        <div>
                          <strong className="text-white block mb-1">Le Pitch Artistique :</strong>
                          <TranslatedText text={challenge.description} targetLang={profile.language} isParagraph={true} />
                        </div>
                      </div>

                      {/* 10 days timeline cards */}
                      <div className="space-y-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono block">
                          📆 L'Évolution des Indices de l'Académie
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                          {challenge.clues.map((clue) => (
                            <div
                              key={clue.day}
                              className={`p-3.5 rounded-2xl border transition relative flex flex-col justify-between h-40 ${
                                clue.isUnlocked
                                  ? "bg-slate-950 border-amber-500/30 text-slate-100"
                                  : "bg-slate-900/40 border-slate-950/20 text-slate-600 select-none"
                              }`}
                            >
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] bg-slate-900 font-mono text-slate-500 px-1.5 py-0.5 rounded">
                                    Jour {clue.day}
                                  </span>
                                  {clue.isUnlocked ? (
                                    <span className="text-[10px] text-amber-400 font-mono">DEVOILÉ</span>
                                  ) : (
                                    <span className="text-[10px] text-slate-700 font-mono">VERROUILLÉ</span>
                                  )}
                                </div>
                                <h4 className={`text-xs font-bold truncate ${clue.isUnlocked ? "text-amber-400" : "text-slate-600"}`}>
                                  {clue.isUnlocked ? <TranslatedText text={clue.title} targetLang={profile.language} /> : "???"}
                                </h4>
                                <div className="text-[10px] text-slate-400 leading-normal mt-1 line-clamp-3">
                                  {clue.isUnlocked ? <TranslatedText text={clue.description} targetLang={profile.language} isParagraph={true} /> : "Cet indice sera dévoilé prochainement par le jury de LinkYourArt."}
                                </div>
                              </div>

                              {clue.isUnlocked ? (
                                <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-900 pt-1.5">
                                  <span>VALEUR : PRO</span>
                                  <span className="text-amber-500">{clue.type.toUpperCase()}</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleUnlockClueWithCoins(clue.day)}
                                  className="mt-2 w-full bg-indigo-650 hover:bg-indigo-600 hover:scale-[1.03] text-indigo-100 border border-indigo-505/35 font-bold text-[9.5px] py-1 px-1 rounded-xl font-mono transition-all duration-150 cursor-pointer text-center select-none block"
                                  title="Dépense 10 KidiCoins pour révéler ce secret à l'avance !"
                                >
                                  Débloquer : 10 Coins 🔑
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Production nested challs team builder info */}
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3 block">
                          🤝 Challenges de Spécialités (La constitution de l'Équipe)
                        </h4>
                        <p className="text-xs text-slate-400 mb-4 leading-normal">
                          Pas de bon film d'animation sans musique et sans style ! Travailles ton scénario principal en même temps que tes camarades composent et dessinent. Le projet gagnant constituera la Dream Team créative de demain !
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {challenge.nestedChallenges.map((nest) => (
                            <div key={nest.id} className="bg-slate-900 p-4 border border-slate-800 rounded-xl flex items-start gap-3">
                              <div className={`p-2.5 rounded-lg shrink-0 ${
                                nest.category === "music" ? "bg-violet-500/15 text-violet-400 border border-violet-500/20" : "bg-pink-500/15 text-pink-400 border border-pink-500/20"
                              }`}>
                                {nest.category === "music" ? <Music className="w-5 h-5" /> : <Palette className="w-5 h-5" />}
                              </div>
                              <div className="text-left text-xs">
                                <strong className="text-white block">
                                  <TranslatedText text={nest.title} targetLang={profile.language} />
                                </strong>
                                <div className="text-slate-400 mt-1 leading-normal">
                                  <TranslatedText text={nest.description} targetLang={profile.language} isParagraph={true} />
                                </div>
                                <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded mt-2 inline-block">
                                  🎁 Récompense : <strong className="text-amber-400">{nest.reward}</strong>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeWorkspaceSubTab === "screenplay" && (
                    <ScreenplayEditor
                      unlockedClues={unlockedClues}
                      onSaveScreenplay={handleSaveScreenplay}
                      savedScreenplay={draftScreenplay}
                    />
                  )}

                  {activeWorkspaceSubTab === "music" && (
                    <SoundtrackStudio
                      onSaveSoundtrack={handleSaveMusic}
                      savedSoundtrack={draftMusic}
                    />
                  )}

                  {activeWorkspaceSubTab === "costume" && (
                    <DrawingBoard
                      onSaveSketch={handleSaveSketch}
                      savedSketch={draftCostume}
                      suggestedClues={unlockedClues.slice(0, 3)}
                    />
                  )}

                  {/* Final Submitting Form Frame to send to LinkYourArt Jury */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-left space-y-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-6 h-6 text-amber-400" />
                      <h3 className="text-lg font-bold text-white">Prêt à soumettre mon projet artistique à l'évaluation ?</h3>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      Lorsque tu es fier de tes textes d'animation, de ta musique ou de ton dessin de styliste cosmique, remplis tes coordonnées pour transmettre ton travail au Comité d'Évaluation de LinkYourArt.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800/60 max-w-3xl items-end">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-medium block">
                          Mon Prénom Créatif
                        </label>
                        <input
                          type="text"
                          placeholder="Saisis ton prénom..."
                          value={childSubmitName}
                          onChange={(e) => setChildSubmitName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-xs text-white px-3 py-2 rounded-xl focus:outline-none transition font-sans"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-medium block">
                          Mon Âge de participation (4 à 18 ans)
                        </label>
                        <input
                          type="number"
                          min="4"
                          max="18"
                          value={childSubmitAge}
                          onChange={(e) => setChildSubmitAge(parseInt(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-xs text-white px-3 py-2 rounded-xl focus:outline-none transition font-mono"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmittingProject(activeWorkspaceSubTab === "guide" ? "screenplay" : activeWorkspaceSubTab)}
                          className="flex-1 py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition transform active:scale-95 text-center cursor-pointer"
                        >
                          Soumettre mon Chef-d'Œuvre
                        </button>
                      </div>
                    </div>

                    {isSubmittedSuccessfully && (
                      <div className="p-4 bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 rounded-2xl animate-pulse">
                        🚀 Magnifique ! Ton projet a été envoyé avec succès au Jury de LinkYourArt.
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Coach Assistant Sidebar - 1 Column */}
                <div className="xl:col-span-1">
                  <AICreativeCoach
                    challengeTitle={challenge.title}
                    unlockedClues={unlockedClues}
                    draftScreenplay={draftScreenplay}
                    draftMusic={draftMusic}
                    draftCostume={draftCostume}
                  />
                </div>
              </div>
            </div>
          )}
          </div>
        </main>
      ) : null}

      {/* Footer */}
      <Footer language={profile.language} />

      {/* GLOBAL HIGH-INDEX ONBOARDING WELCOME MODAL OVERLAY */}
      {isTutorialOpen && (
        <div 
          id="tutorial-modal-overlay" 
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl flex justify-center items-center z-[9999] p-4 md:p-8 animate-fadeIn"
          style={{ cursor: "zoom-out" }}
          onClick={(e) => {
            if ((e.target as HTMLElement).id === "tutorial-modal-overlay") {
              localStorage.setItem("kidiworld_welcome_tutorial_dismissed", "true");
              setIsTutorialOpen(false);
            }
          }}
        >
          {/* Animated Ambient background halos to look insanely grandiose */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-505/10 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: "10s" }} />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />

          <div 
            className="relative w-full max-w-4xl max-h-[92vh] bg-slate-950/90 backdrop-blur-md border border-amber-550/30 rounded-[2.5rem] overflow-y-auto shadow-[0_0_100px_rgba(245,158,11,0.22)] flex flex-col md:flex-row transition-all duration-500 scrollbar-thin scrollbar-thumb-slate-800"
            style={{ cursor: "default" }}
          >
            
            {/* Top glowing kinetic neon bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500 z-10" />

            {/* LEFT PROFILE EMBLEM BLOCK (COSMIC RADAR STATUS) */}
            <div className="w-full md:w-[290px] bg-slate-900/30 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-900 shrink-0 relative overflow-hidden">
              {/* Internal glow accents */}
              <div className="absolute -left-12 -top-12 w-44 h-44 rounded-full bg-indigo-500/10 blur-3xl" />
              <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl" />

              <div className="space-y-6 relative z-10 text-left">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Creative Hub
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight leading-none">
                    KIDI<span className="text-amber-400">WORLD</span>
                  </h3>
                  <p className="text-[10.5px] text-slate-400 font-bold leading-relaxed">
                    L'incubateur de talents artistiques pour les créateurs de 4 à 18 ans !
                  </p>
                </div>

                {/* Integration Details card */}
                <div className="space-y-3 pt-4 border-t border-slate-900">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono block">Ton Profil Actif :</span>
                  
                  {/* Participant Card */}
                  <div className="p-3 bg-slate-950/60 border border-slate-900/60 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-amber-500" /> Nom :
                    </span>
                    <span className="text-[10px] font-black text-white">
                      {profile.childName}
                    </span>
                  </div>

                  {/* Role Card */}
                  <div className="p-3 bg-slate-950/60 border border-slate-900/60 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-450" /> Rôle :
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                      role === "jury"
                        ? "bg-pink-500/10 border-pink-500/25 text-pink-400"
                        : "bg-amber-500/10 border-amber-500/25 text-amber-400"
                    }`}>
                      {role === "jury" ? "Comité Jury" : "Jeune Artiste"}
                    </span>
                  </div>

                  {/* Stars Card */}
                  <div className="p-3 bg-slate-950/60 border border-slate-900/60 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> Palmarès :
                    </span>
                    <span className="text-[10px] font-black text-white font-mono flex items-center gap-1">
                      {statsStars} Étoiles ⭐
                    </span>
                  </div>

                  {/* Coins Card */}
                  <div className="p-3 bg-slate-950/60 border border-slate-900/60 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-500" /> KidiCoins :
                    </span>
                    <span className="text-[10px] font-black text-amber-400 font-mono">
                      {accountSession.kidiCoins} Coins 💰
                    </span>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer brand-note */}
              <div className="pt-6 border-t border-slate-900/60 mt-6 md:mt-0 relative z-10 text-left">
                <p className="text-[9.5px] text-slate-500 leading-normal font-semibold">
                  Soutenu par <strong className="text-slate-400 font-bold">LinkYourArt</strong>, incubateur mondial de l'excellence artistique.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: INTERACTIVE SLIDES SECTION */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-6 bg-slate-950 text-left">
              
              {/* Stepper progress & header indicators */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-455 uppercase tracking-widest font-mono">
                      GUIDE D'INITIATION DÉFI ARTISTIQUE
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    <span className="text-[10px] font-semibold text-slate-400 font-mono">
                      Étape {tutorialStep} sur 3
                    </span>
                  </div>

                  {/* Progress sliding trace */}
                  <div className="flex items-center gap-1 w-24 h-1 bg-slate-900 rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        tutorialStep === 1 ? "w-1/3 bg-amber-500" : tutorialStep === 2 ? "w-2/3 bg-pink-500" : "w-full bg-indigo-500"
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("kidiworld_welcome_tutorial_dismissed", "true");
                    setIsTutorialOpen(false);
                  }}
                  className="px-2.5 py-1 text-[10px] font-extrabold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
                >
                  Fermer [×]
                </button>
              </div>

              {/* Active tutorial content cards */}
              <div className="flex-1 py-1">
                {tutorialStep === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-white flex items-center gap-2">
                        <span>Étape 1 : Libère ton Génie Créatif !</span>
                        <span className="text-amber-400">🎨</span>
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold">
                        Trois ateliers amusants pour écrire, dessiner et composer ton univers original :
                      </p>
                    </div>

                    <div className="grid gap-3.5">
                      {/* Sub-item Film Dialogue */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-amber-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg flex-shrink-0 border border-amber-500/20 h-9 w-9 flex items-center justify-center">
                          <Film className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Scénariste de Cinéma d'Animation 📜</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Écris ton histoire ou utilise nos modèles d'aventure. Clique sur l'onglet <strong className="text-amber-400 font-bold">"🎬 Aperçu Cinéma"</strong> pour formater tes répliques automatiquement à la hollywoodienne, puis télécharge le PDF !
                          </p>
                        </div>
                      </div>

                      {/* Sub-item Canvas sketch */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-pink-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg flex-shrink-0 border border-pink-500/20 h-9 w-9 flex items-center justify-center">
                          <PenTool className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Dessinateur Galactique & Autocollants 🎨</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Peins avec le pinceau laser ou efface d'un trait. Amuse-toi avec les <strong className="text-pink-400 font-bold">Tampons Stellaires</strong> : sélectionne un emoji rigolo pour dessiner des tampons géants en couleur !
                          </p>
                        </div>
                      </div>

                      {/* Sub-item Music track */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-indigo-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg flex-shrink-0 border border-indigo-500/20 h-9 w-9 flex items-center justify-center">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Compositeur Symphonique & Rythmes 🎵</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Imagine une bande-son rétro-gaming, rythme tes percussions stellaires et joue sur le synthétiseur spatial pour donner du relief sonore à tes histoires d'animation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tutorialStep === 2 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-white flex items-center gap-2">
                        <span>Étape 2 : Le Comité d'Évaluation de Jury Pro !</span>
                        <span className="text-pink-400">🎬</span>
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold">
                        Fais analyser tes chefs-d'œuvre par des experts bienveillants de LinkYourArt pour progresser :
                      </p>
                    </div>

                    <div className="grid gap-3.5">
                      {/* Sub-item submitted works */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-pink-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg flex-shrink-0 border border-pink-500/20 h-9 w-9 flex items-center justify-center">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Présente tes œuvres comme un Professionnel 🎭</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Bascule vers l'espace <strong className="text-pink-400 font-bold">Comité Jury Pro</strong> pour évaluer tes créations et celles de tes paires avec les boutons de notation bienveillants.
                          </p>
                        </div>
                      </div>

                      {/* Sub-item recommendations feedback */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-emerald-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg flex-shrink-0 border border-emerald-500/20 h-9 w-9 flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Retours Chaleureux & Conseils Stimulants ❤️</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Nos experts de l'animation te partagent de vrais secrets d'écriture, de la bienveillance constructive et des encouragements chaleureux pour t'améliorer sans pression.
                          </p>
                        </div>
                      </div>

                      {/* Sub-item stargift */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-amber-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg flex-shrink-0 border border-amber-500/20 h-9 w-9 flex items-center justify-center">
                          <Coins className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Gagne d'Inestimables KidiCoins 💰</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Chaque correction constructive et chaque projet validé augmente ton score en étoiles et crédite ton portefeuille de KidiCoins récompensés.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tutorialStep === 3 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-white flex items-center gap-2">
                        <span>Étape 3 : Une Session Sécurisée & Équilibrée !</span>
                        <span className="text-indigo-400">🛡️</span>
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold">
                        Le tableau de bord adulte KidiSafe assure la sérénité de toute la famille :
                      </p>
                    </div>

                    <div className="grid gap-3.5">
                      {/* Sub-item safe parental configuration controls info */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-pink-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg flex-shrink-0 border border-pink-500/20 h-9 w-9 flex items-center justify-center">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Contrôle Adulte Protégé KidiSafe 🔒</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Entrez votre email de tuteur dans l'onglet de contrôle pour ajuster les limites intelligentes de temps d'écran hebdomadaire et superviser les projets en toute sérénité.
                          </p>
                        </div>
                      </div>

                      {/* Sub-item dynamic gauges screen life */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-emerald-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg flex-shrink-0 border border-emerald-500/20 h-9 w-9 flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Compteur de Temps Visuel Adaptatif ⏳</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Une jauge chromatique glisse doucement du vert vif vers le rouge alarmant dans l'inspecteur pour aider les enfants à doser calmement l'exposition aux écrans.
                          </p>
                        </div>
                      </div>

                      {/* Sub-item custom options space language */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-indigo-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg flex-shrink-0 border border-indigo-500/20 h-9 w-9 flex items-center justify-center">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Choisis ta Langue de Travail 🌍</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Apprends en t'amusant ! Bascule ton profil d'artiste à tout moment pour pratiquer l'anglais, l'espagnol, le japonais ou le français d'un simple geste.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer controls for steps */}
              <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[10px] text-slate-500 font-semibold italic flex items-center gap-1">
                  🍵 Pensez à faire une petite pause active toutes les 15 minutes !
                </span>

                <div className="flex gap-2.5 w-full sm:w-auto">
                  {tutorialStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setTutorialStep(prev => prev - 1)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Précédent
                    </button>
                  )}

                  {tutorialStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setTutorialStep(prev => prev + 1)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                    >
                      Suivant <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem("kidiworld_welcome_tutorial_dismissed", "true");
                        setIsTutorialOpen(false);
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition transform active:scale-95 cursor-pointer"
                    >
                      C'est parti ! 🚀
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

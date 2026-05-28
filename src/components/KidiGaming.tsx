import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Play, Award, Zap, ChevronRight, Lock, CheckCircle, Smartphone, Flame, RefreshCcw, Command, Cpu, ArrowRight, Code, FileCode, Check, Star, ShieldAlert, CreditCard, Wallet, Coins, RefreshCw, Layers, Folder, Plus, Trash2, Calendar, Save, Hourglass, Edit3, Search } from "lucide-react";
import { AccountSession } from "./AccountAuth";
import ConfirmModal from "./ConfirmModal";

interface GameModel {
  id: string;
  name: string;
  type: "free" | "premium";
  priceCoins: number;
  unlocked: boolean;
  category: "chess" | "memory" | "ai-builder" | "kidi-educatif";
  description: string;
  rating: number;
  ageBand: string;
  artGradient: string;
}

export interface SavedProject {
  id: string;
  name: string;
  prompt: string;
  gravity: number;
  speed: number;
  generationCount: number;
  lastUpdated: string;
}

interface KidiGamingProps {
  session: AccountSession;
  onUpdateSession: (updated: AccountSession) => void;
  language: "fr" | "en";
}

export default function KidiGaming({ session, onUpdateSession, language }: KidiGamingProps) {
  const [activeGameCategory, setActiveGameCategory] = useState<"chess" | "memory" | "ai-builder" | "kidi-educatif">("ai-builder");
  const [coinsReward, setCoinsReward] = useState<string>("");
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; projectId: string | null }>({ isOpen: false, projectId: null });
  const [challengeSearchQuery, setChallengeSearchQuery] = useState<string>("");

  // Game 1: Cosmic Chess puzzle states
  const [chessMoveStep, setChessMoveStep] = useState<"not-started" | "piece-selected" | "solved" | "failed">("not-started");
  const [chessScore, setChessScore] = useState(0);

  // Game 2: Memory card game states
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryVictory, setMemoryVictory] = useState(false);

  // Game 4: Kidi Éducatif state variables
  const [activeEduGameId, setActiveEduGameId] = useState<"tictactoe" | "simon" | "quiz" | "math">("tictactoe");
  
  // 4a. Tic Tac Toe States
  const [tttBoard, setTttBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [tttTurn, setTttTurn] = useState<"X" | "O">("X"); // X is Player, O is Robot
  const [tttWinner, setTttWinner] = useState<string | null>(null); // "X", "O", "draw", or null
  const [tttScore, setTttScore] = useState({ player: 0, ai: 0 });

  // 4b. Simon Spatial States
  const [simonSequence, setSimonSequence] = useState<number[]>([]);
  const [simonPlayerSeq, setSimonPlayerSeq] = useState<number[]>([]);
  const [simonRound, setSimonRound] = useState(0);
  const [simonIsPlaying, setSimonIsPlaying] = useState(false);
  const [simonIsShowing, setSimonIsShowing] = useState(false);
  const [simonLitButton, setSimonLitButton] = useState<number | null>(null);

  // 4c. Physics Planet Quiz States
  const [quizPlanet, setQuizPlanet] = useState<number>(0); // Index of planet questions
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizStatus, setQuizStatus] = useState<"unsolved" | "success" | "wrong">("unsolved");

  // 4d. Comet Math States
  const [mathNum1, setMathNum1] = useState(5);
  const [mathNum2, setMathNum2] = useState(3);
  const [mathOp, setMathOp] = useState<"+" | "-" | "*">("+");
  const [mathChoices, setMathChoices] = useState<number[]>([4, 8, 12]);
  const [mathScore, setMathScore] = useState(0);
  const [mathTimer, setMathTimer] = useState(15);
  const [mathIsActive, setMathIsActive] = useState(false);

  // Suspended Project Manager Workspace
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    try {
      const saved = localStorage.getItem("kidi_saved_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: "proj-space",
        name: "👾 Odyssée Des Méduse IA",
        prompt: "Une méduse de l'espace qui esquive des astéroïdes roses géants avec lasers fuchsia",
        gravity: 1.2,
        speed: 13,
        generationCount: 1,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "proj-candy",
        name: "🍭 Fête Gourmande Panda",
        prompt: "Un ourson panda roux glouton mangeant des bonbons fuchsia tombant du ciel",
        gravity: 1.6,
        speed: 10,
        generationCount: 2,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "proj-flight",
        name: "🌟 Envolée Du Phénix",
        prompt: "Un phénix doré survolant les rings célestes en planant contre le mistral cosmique",
        gravity: 0.8,
        speed: 15,
        generationCount: 0,
        lastUpdated: new Date().toISOString()
      }
    ];
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("kidi_saved_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].id;
      }
    } catch {}
    return "proj-space";
  });

  const activeProject = savedProjects.find(p => p.id === activeProjectId) || savedProjects[0];

  // Game 3: AI Game Prototyper engine states (coupled to the active project)
  const [aiPrompt, setAiPrompt] = useState(activeProject.prompt);
  const [aiGravity, setAiGravity] = useState(activeProject.gravity);
  const [aiSpeed, setAiSpeed] = useState(activeProject.speed);
  
  const [aiCompiling, setAiCompiling] = useState(false);
  const [compilingLogs, setCompilingLogs] = useState<string[]>([]);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [arcadeScore, setArcadeScore] = useState(0);
  const [arcadeLives, setArcadeLives] = useState(3);
  const [arcadeStatus, setArcadeStatus] = useState<"playing" | "game-over" | "won">("playing");

  const [generationCount, setGenerationCount] = useState<number>(activeProject.generationCount);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"game" | "code">("game");
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [parentApprovalCode, setParentApprovalCode] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"options" | "card-form" | "success">("options");

  const [premiumPurchasedIds, setPremiumPurchasedIds] = useState<string[]>([]);
  const [editProjectNameId, setEditProjectNameId] = useState<string | null>(null);
  const [editProjectNameValue, setEditProjectNameValue] = useState("");

  const [gameToast, setGameToast] = useState<{ message: string; type: "success" | "warning" | "info" } | null>(null);

  const triggerToast = (msg: string, type: "success" | "warning" | "info" = "success") => {
    setGameToast({ message: msg, type });
    setTimeout(() => {
      setGameToast((curr) => curr?.message === msg ? null : curr);
    }, 4000);
  };

  const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const GAMES_LIST: GameModel[] = [
    {
      id: "game-ai-lab",
      name: "IA Game Engine Coder Pro 🚀",
      type: "free",
      priceCoins: 0,
      unlocked: true,
      category: "ai-builder",
      description: "Imagine ton jeu mobile idéal avec l'IA créative, paramètre la gravité et code instantanément ton propre jeu jouable !",
      rating: 5,
      ageBand: "8-18 ans",
      artGradient: "from-violet-600 via-indigo-600 to-purple-600"
    },
    {
      id: "game-chess",
      name: "Échecs Stellaires : Mat en 1 ♟️",
      type: "free",
      priceCoins: 0,
      unlocked: true,
      category: "chess",
      description: "Apprends à décoder les tactiques d'échecs du grand Cachalot de l'espace. Trouve le bon coup et gagne des points !",
      rating: 4.5,
      ageBand: "6-18 ans",
      artGradient: "from-blue-600 via-cyan-600 to-indigo-600"
    },
    {
      id: "game-memory",
      name: "Memory Galactique Kid 🃏",
      type: "premium",
      priceCoins: 30,
      unlocked: false,
      category: "memory",
      description: "Un jeu de memory magique pour entraîner ta mémoire en associant Bastien, l'androïde et la baleine de lumière.",
      rating: 4.8,
      ageBand: "4-12 ans",
      artGradient: "from-pink-500 via-purple-500 to-rose-500"
    },
    {
      id: "game-kidi-educatif",
      name: "Espace Kidi Éducatif & Classiques 🎓",
      type: "free",
      priceCoins: 0,
      unlocked: true,
      category: "kidi-educatif",
      description: "Découvre des jeux classiques familiers (Morpion, Simon Music) et des défis éducatifs de physique et de mathématique !",
      rating: 4.9,
      ageBand: "4-16 ans",
      artGradient: "from-emerald-500 via-green-600 to-teal-500"
    }
  ];

  const hasAccessToGame = (game: GameModel) => {
    return game.type === "free" || premiumPurchasedIds.includes(game.id) || session.isPremiumMember;
  };

  const handlePurchasePremiumGame = (game: GameModel) => {
    if (session.kidiCoins >= game.priceCoins) {
      if (window.confirm(language === "fr" 
        ? `Débloquer définitivement "${game.name}" pour ${game.priceCoins} KidiCoins ?`
        : `Unlock permanently "${game.name}" for ${game.priceCoins} KidiCoins?`)) {
        onUpdateSession({
          ...session,
          kidiCoins: session.kidiCoins - game.priceCoins
        });
        setPremiumPurchasedIds((prev) => [...prev, game.id]);
        triggerToast(language === "fr" ? "🎉 Jeu activé ! Amuse-toi bien." : "🎉 Game unlocked!");
      }
    } else {
      triggerToast(language === "fr" 
        ? "⚠️ Oups ! Solde insuffisant. Fais d'autres exercices créatifs pour collecter des pièces !"
        : "⚠️ Not enough coins! Build more screenplay stories to obtain coins!", "warning");
    }
  };

  // 1. CHESS PUZZLE ACTIONS
  const handleSelectChessPiece = () => {
    if (chessMoveStep === "not-started") {
      setChessMoveStep("piece-selected");
    }
  };

  const handleChessMove = (isCorrectSquare: boolean) => {
    if (chessMoveStep === "piece-selected") {
      if (isCorrectSquare) {
        setChessMoveStep("solved");
        setChessScore((s) => s + 10);
        
        // Give KidiCoins
        onUpdateSession({
          ...session,
          kidiCoins: session.kidiCoins + 25
        });
        setCoinsReward(language === "fr" ? "+25 KidiCoins gagnés en tactique !" : "+25 KidiCoins earned!");
        setTimeout(() => setCoinsReward(""), 4000);
      } else {
        setChessMoveStep("failed");
      }
    }
  };

  const handleResetChess = () => {
    setChessMoveStep("not-started");
  };

  // 2. MEMORY GAME ACTIONS
  const CARD_DESIGNS = [
    { id: 1, text: "🐳 Baleine", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { id: 2, text: "🚀 Bastien", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { id: 3, text: "🤖 Robot", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
    { id: 4, text: "⚓ Harpon", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { id: 5, text: "🌟 Étoile", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
    { id: 6, text: "🪐 Planète", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" }
  ];

  const initMemory = () => {
    // Duplicate & shuffle pool
    const pool = [...CARD_DESIGNS, ...CARD_DESIGNS].map((item, idx) => ({
      ...item,
      uniqueId: idx,
      isFlipped: false
    }));
    
    // Simple shuffle
    pool.sort(() => Math.random() - 0.5);
    
    setMemoryCards(pool);
    setSelectedIndices([]);
    setMatchedPairs([]);
    setMemoryMoves(0);
    setMemoryVictory(false);
  };

  // 3a. Tic Tac Toe Morpion Actions
  const handleTttClick = (index: number) => {
    if (tttBoard[index] || tttWinner || tttTurn === "O") return;

    const nextBoard = [...tttBoard];
    nextBoard[index] = "X"; // Player is X
    setTttBoard(nextBoard);

    // Check if player won
    const checkWinner = (board: (string | null)[]) => {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]            // diagonals
      ];
      for (const line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
      return board.includes(null) ? null : "draw";
    };

    const pWin = checkWinner(nextBoard);
    if (pWin) {
      handleTttEnd(pWin);
      return;
    }

    // Small delay, then Robot "O" plays
    setTttTurn("O");
    setTimeout(() => {
      const emptyIndices = nextBoard.map((v, i) => v === null ? i : null).filter((v) => v !== null) as number[];
      if (emptyIndices.length > 0) {
        // Simple smart block: check if can win or player has 2 in a row, otherwise play center, else random (all in bounds)
        let botMoveIndex = emptyIndices[0];
        const center = 4;
        if (emptyIndices.includes(center)) {
          botMoveIndex = center;
        } else {
          botMoveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }

        const finalBoard = [...nextBoard];
        finalBoard[botMoveIndex] = "O";
        setTttBoard(finalBoard);

        const botWin = checkWinner(finalBoard);
        if (botWin) {
          handleTttEnd(botWin);
        } else {
          setTttTurn("X");
        }
      }
    }, 400);
  };

  const handleTttEnd = (winResult: string) => {
    setTttWinner(winResult);
    if (winResult === "X") {
      setTttScore((s) => ({ ...s, player: s.player + 1 }));
      onUpdateSession({
        ...session,
        kidiCoins: session.kidiCoins + 15
      });
      setCoinsReward(language === "fr" ? "🏆 Superbe ! Tu as battu l'androïde : +15 KidiCoins !" : "🏆 Victory against Android: +15 KidiCoins!");
      setTimeout(() => setCoinsReward(""), 4000);
    } else if (winResult === "O") {
      setTttScore((s) => ({ ...s, ai: s.ai + 1 }));
      triggerToast(language === "fr" ? "👾 L'androïde a gagné cette manche ! Recommence !" : "👾 Copilot wins this round!", "warning");
    } else {
      triggerToast(language === "fr" ? "🤝 Match nul ! Belle partie !" : "🤝 Draw! Well played!");
    }
  };

  const handleResetTtt = () => {
    setTttBoard(Array(9).fill(null));
    setTttWinner(null);
    setTttTurn("X");
  };

  // 3b. Simon Spatial Actions
  const playSimonTone = (freq: number, duration = 0.3) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  const simonButtons = [
    { id: 0, color: "bg-rose-600", litColor: "bg-rose-400 shadow-rose-500/80 shadow-2xl scale-105", freq: 261.63, title: "Do Spatial" },     // Red
    { id: 1, color: "bg-blue-600", litColor: "bg-blue-400 shadow-blue-500/80 shadow-2xl scale-105", freq: 329.63, title: "Mi Sidéral" },     // Blue
    { id: 2, color: "bg-amber-600", litColor: "bg-amber-400 shadow-amber-500/80 shadow-2xl scale-105", freq: 392.00, title: "Sol Pulsar" },   // Yellow
    { id: 3, color: "bg-emerald-600", litColor: "bg-emerald-400 shadow-emerald-500/80 shadow-2xl scale-105", freq: 523.25, title: "Do Céleste" } // Green
  ];

  const handleStartSimon = () => {
    const startSeq = [Math.floor(Math.random() * 4)];
    setSimonSequence(startSeq);
    setSimonPlayerSeq([]);
    setSimonRound(1);
    setSimonIsPlaying(true);
    triggerSimonSequence(startSeq);
  };

  const triggerSimonSequence = (seq: number[]) => {
    setSimonIsShowing(true);
    let i = 0;
    const interval = setInterval(() => {
      const btnIndex = seq[i];
      setSimonLitButton(btnIndex);
      playSimonTone(simonButtons[btnIndex].freq, 0.35);
      
      // Turn off light
      setTimeout(() => {
        setSimonLitButton(null);
      }, 350);

      i++;
      if (i >= seq.length) {
        clearInterval(interval);
        setTimeout(() => {
          setSimonIsShowing(false);
          setSimonPlayerSeq([]);
        }, 400);
      }
    }, 650);
  };

  const handleSimonButtonClick = (index: number) => {
    if (simonIsShowing || !simonIsPlaying) return;
    
    // Light and play single
    setSimonLitButton(index);
    playSimonTone(simonButtons[index].freq, 0.25);
    setTimeout(() => setSimonLitButton(null), 180);

    const nextPlayerSeq = [...simonPlayerSeq, index];
    setSimonPlayerSeq(nextPlayerSeq);

    // Verify index
    const checkIndex = nextPlayerSeq.length - 1;
    if (nextPlayerSeq[checkIndex] !== simonSequence[checkIndex]) {
      // Wrong move!
      setSimonIsPlaying(false);
      triggerToast(language === "fr" ? "💥 Oups ! Mauvaise note ! Trouve le bon rythme la prochaine fois." : "💥 Oops! Sequence broken!", "warning");
      return;
    }

    // Correct move, check if sequence completed
    if (nextPlayerSeq.length === simonSequence.length) {
      // Completed, load next level
      const nextSequence = [...simonSequence, Math.floor(Math.random() * 4)];
      setSimonSequence(nextSequence);
      setSimonRound((r) => r + 1);
      
      // Award Coins
      onUpdateSession({
        ...session,
        kidiCoins: session.kidiCoins + 8
      });
      setCoinsReward(language === "fr" ? `🎵 Bravissimo ! Étape ${simonRound} validée ! +8 KidiCoins.` : `🎵 Perfect! Round ${simonRound} cleared! +8 Coins.`);
      setTimeout(() => setCoinsReward(""), 3500);

      setTimeout(() => {
        triggerSimonSequence(nextSequence);
      }, 1000);
    }
  };

  // 3c. Physics Astronomy Balance Quiz
  const planetQuizQuestions = [
    {
      question: language === "fr" 
        ? "Sur quel astre pèse-t-on le plus lourd ? (Là où la gravité physique t'écrase)"
        : "On which celestial body do you weigh the most? (Where gravity crushes you)",
      choices: language === "fr"
        ? ["🌌 Jupiter (la géante)", "🌍 La Terre", "🌙 La Lune", "🪐 Pluton"]
        : ["🌌 Jupiter (the giant)", "🌍 Earth", "🌙 The Moon", "🪐 Pluto"],
      correctIndex: 0,
      explanation: language === "fr"
        ? "Jupiter est 318 fois plus massive que la Terre ! Sa force d'attraction est énorme : tu y pèserais 2,5 fois plus lourd !"
        : "Jupiter is 318 times more massive than Earth! Its gravitational pull is so immense that you would weigh 2.5 times more there!"
    },
    {
      question: language === "fr"
        ? "Si tu tentes de sauter sur la Lune (qui a 6 fois moins de gravité que la Terre) :"
        : "If you try to jump on the Moon (which has 6 times less gravity than Earth):",
      choices: language === "fr"
        ? ["🤠 Tu tombes instantanément comme du plomb", "🚀 Tu t'envoles à plus de 3 mètres de haut doucement", "🥶 Tu t'enfuis dans l'espace à l'infini", "🥞 Tu es écrasé au sol"]
        : ["🤠 You instantly fall like lead", "🚀 You drift slowly up to 3 meters high", "🥶 You float away into space forever", "🥞 You are crushed on the ground"],
      correctIndex: 1,
      explanation: language === "fr"
        ? "La gravité lunaire est très douce. En sautant, tu flottes comme un super-héros au ralenti !"
        : "Lunar gravity is very weak. While jumping, you float slowly like a superhero in slow motion!"
    },
    {
      question: language === "fr"
        ? "La planète rouge Mars possède-t-elle une gravité plus forte ou faible que la Terre ?"
        : "Does the red planet Mars have a stronger or weaker gravity than Earth?",
      choices: language === "fr"
        ? ["⚖️ Plus faible (environ 3 fois moins)", "💪 Plus forte (environ 2 fois de plus)", "⚖️ Exactement identique", "🛸 Zéro gravité"]
        : ["⚖️ Weaker (about 3 times less)", "💪 Stronger (about 2 times more)", "⚖️ Exactly identical", "🛸 Zero gravity"],
      correctIndex: 0,
      explanation: language === "fr"
        ? "Mars est plus petite que la Terre. Tu y sauterais 3 fois plus haut et te sentirais super léger !"
        : "Mars is smaller than Earth. You would jump 3 times higher and feel super light!"
    },
    {
      question: language === "fr"
        ? "D'où provient la force d'attraction invisible de la Gravité ?"
        : "Where does the invisible pulling force of Gravity come from?",
      choices: language === "fr"
        ? ["🧪 Du vent de l'atmosphère", "💎 De la vitesse de rotation magique", "🌌 De la masse de l'objet céleste", "🪐 Des marées d'eau"]
        : ["🧪 From atmospheric wind", "💎 From magical rotation speed", "🌌 From the object's mass", "🪐 From ocean tides"],
      correctIndex: 2,
      explanation: language === "fr"
        ? "Plus un objet a de la masse (matière), plus il tire le reste vers son centre comme un aimant cosmique !"
        : "The more mass (matter) an object has, the stronger it pulls everything toward its center like a cosmic magnet!"
    },
    {
      question: language === "fr"
        ? "Qu'est-ce qu'un Trou Noir dans notre Univers ?"
        : "What is a Black Hole in our Universe?",
      choices: language === "fr"
        ? ["🌟 Une étoile brillante d'or", "🕳️ Une zone si dense que même la lumière ne peut s'échapper", "💨 Un nuage de vent stérile", "🛰️ Une station soviétique perdue"]
        : ["🌟 A shining golden star", "🕳️ A region so dense that even light can't escape it", "💨 A sterile gust of cosmic wind", "🛰️ A lost Soviet space station"],
      correctIndex: 1,
      explanation: language === "fr"
        ? "Un trou noir a une force de gravité tellement phénoménale et concentrée que rien ne résiste à son aspiration, pas même la lumière !"
        : "A black hole has gravity so powerful and compact that nothing can avoid its attraction, not even light!"
    },
    {
      question: language === "fr"
        ? "Comment nomme-t-on l'état d'un astronaute flottant à bord de la Station Spatiale Internationale (ISS) ?"
        : "What is the term for an astronaut floating aboard the International Space Station (ISS)?",
      choices: language === "fr"
        ? ["🧘 L'apesanteur ou microgravité", "⚡ L'aimantation quantique", "🧪 L'oxygénation supersonique", "🎈 La lévitation atomique"]
        : ["🧘 Weightlessness or microgravity", "⚡ Quantum magnetization", "🧪 Supersonic oxygenation", "🎈 Atomic levitation"],
      correctIndex: 0,
      explanation: language === "fr"
        ? "En orbite, l'ISS et les astronautes sont en chute libre permanente autour de la Terre, annulant tout effet de poids !"
        : "In orbit, the ISS and its astronauts are in permanent free fall around the Earth, which cancels out any feeling of weight!"
    },
    {
      question: language === "fr"
        ? "Quelle imposante étoile maintient toutes les planètes dans leur orbite ?"
        : "Which massive star keeps all planets aligned on their orbits?",
      choices: language === "fr"
        ? ["🌟 L'étoile Polaire", "🪐 Saturne la majestueuse", "☀ Le Soleil", "☄ Halley la comète"]
        : ["🌟 The North Star", "🪐 Majestic Saturn", "☀ The Sun", "☄ Halley's Comet"],
      correctIndex: 2,
      explanation: language === "fr"
        ? "Le Soleil possède 99.8% de toute la matière de notre système solaire. C'est le roi suprême de la gravité !"
        : "The Sun has 99.8% of all matter in our solar system. It is the absolute king of gravity!"
    },
    {
      question: language === "fr"
        ? "Pourquoi la Terre ne fonce-t-elle pas s'écraser directement sur le Soleil ?"
        : "Why doesn't the Earth crash directly into the Sun?",
      choices: language === "fr"
        ? ["🌀 Grâce à sa vitesse orbitale qui crée un équilibre parfait", "⚡ À cause de forces électriques magnifiques", "🌡 Grâce à la chaleur qui la repousse", "🛡 À cause du bouclier d'ozone"]
        : ["🌀 Because its orbital speed creates a perfect equilibrium", "⚡ Due to magnificent electric fields", "🌡 Because of core heat pushing it back", "🛡 Due to the ozone layer shield"],
      correctIndex: 0,
      explanation: language === "fr"
        ? "La Terre avance si vite de côté qu'elle rate continuellement son plongeon vers le Soleil ! Cet équilibre crée son orbite stable."
        : "The Earth moves sideways so fast that it perpetually misses its fall toward the sun! This balance creates its stable orbit."
    }
  ];

  const handleQuizAnswer = (choiceIndex: number) => {
    if (quizStatus !== "unsolved") return;
    setQuizSelected(choiceIndex);
    if (choiceIndex === planetQuizQuestions[quizPlanet].correctIndex) {
      setQuizStatus("success");
      onUpdateSession({
        ...session,
        kidiCoins: session.kidiCoins + 15
      });
      setCoinsReward(language === "fr" ? "🧠 Merveilleux ! Bonne réponse : +15 KidiCoins !" : "🧠 Brilliant! Good answer: +15 KidiCoins!");
      setTimeout(() => setCoinsReward(""), 4000);
    } else {
      setQuizStatus("wrong");
    }
  };

  const handleNextQuiz = () => {
    setQuizSelected(null);
    setQuizStatus("unsolved");
    setQuizPlanet((p) => (p + 1) % planetQuizQuestions.length);
  };

  // 3d. Comet Math Rocket Launcher Actions
  const handleStartMath = () => {
    setMathScore(0);
    setMathTimer(15);
    setMathIsActive(true);
    generateMathEquation();
  };

  const generateMathEquation = () => {
    // Basic operations suited for kids 5-14
    const ops: ("+" | "-" | "*")[] = ["+", "-", "*"];
    const randomOp = ops[Math.floor(Math.random() * ops.length)];
    let n1 = Math.floor(Math.random() * 10) + 2;
    let n2 = Math.floor(Math.random() * 8) + 1;
    
    // adjust multiplication to remain fun and accessible
    if (randomOp === "*") {
      n1 = Math.floor(Math.random() * 6) + 2;
      n2 = Math.floor(Math.random() * 5) + 2;
    }

    setMathNum1(n1);
    setMathNum2(n2);
    setMathOp(randomOp);

    let answer = 0;
    if (randomOp === "+") answer = n1 + n2;
    if (randomOp === "-") answer = n1 - n2;
    if (randomOp === "*") answer = n1 * n2;

    // Generate 3 choices (1 true, 2 wrong)
    const setOfChoices = new Set<number>();
    setOfChoices.add(answer);
    while (setOfChoices.size < 3) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
      const choice = answer + offset;
      if (choice >= 1) setOfChoices.add(choice);
    }

    // Convert to shuffled array
    const arr = Array.from(setOfChoices).sort(() => Math.random() - 0.5);
    setMathChoices(arr);
  };

  const handleMathChoiceClick = (choice: number) => {
    if (!mathIsActive) return;

    let correctAnswer = 0;
    if (mathOp === "+") correctAnswer = mathNum1 + mathNum2;
    if (mathOp === "-") correctAnswer = mathNum1 - mathNum2;
    if (mathOp === "*") correctAnswer = mathNum1 * mathNum2;

    if (choice === correctAnswer) {
      setMathScore((s) => s + 1);
      setMathTimer((prev) => Math.min(prev + 5, 20)); // add time on correct answers
      playSimonTone(523.25, 0.15); // pleasant sound
      
      // Award Coins
      onUpdateSession({
        ...session,
        kidiCoins: session.kidiCoins + 5
      });
      triggerToast(language === "fr" ? "✍️ Bravo ! Rocket Boosté : +5 KidiCoins !" : "✍️ Comet Math Rocket Boosted: +5 Coins!");
      generateMathEquation();
    } else {
      playSimonTone(200, 0.25); // wrong buzzer sound
      triggerToast(language === "fr" ? "💥 Oups ! Mauvais calcul ! Recommence une équation." : "💥 Math error!", "warning");
      // Don't stop but give next
      generateMathEquation();
    }
  };

  // Run countdown ticker for math game
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (mathIsActive && mathTimer > 0) {
      interval = setInterval(() => {
        setMathTimer((t) => t - 1);
      }, 1000);
    } else if (mathTimer <= 0 && mathIsActive) {
      setMathIsActive(false);
      triggerToast(language === "fr" ? `⏱️ Temps écoulé ! Tu as calculé ${mathScore} comètes !` : `⏱️ Time is up! You solved ${mathScore} equations!`);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mathIsActive, mathTimer]);

  useEffect(() => {
    if (activeGameCategory === "memory") {
      initMemory();
    }
  }, [activeGameCategory]);

  const handleCardClick = (index: number) => {
    if (selectedIndices.length >= 2 || matchedPairs.includes(memoryCards[index].uniqueId) || selectedIndices.includes(index)) {
      return;
    }

    const nextSelected = [...selectedIndices, index];
    setSelectedIndices(nextSelected);

    if (nextSelected.length === 2) {
      setMemoryMoves((m) => m + 1);
      const cardA = memoryCards[nextSelected[0]];
      const cardB = memoryCards[nextSelected[1]];

      if (cardA.id === cardB.id) {
        // Pairs match
        setMatchedPairs((prev) => [...prev, cardA.uniqueId, cardB.uniqueId]);
        setSelectedIndices([]);
        
        // Check Victory
        if (matchedPairs.length + 2 === memoryCards.length) {
          setMemoryVictory(true);
          onUpdateSession({
            ...session,
            kidiCoins: session.kidiCoins + 30
          });
          setCoinsReward(language === "fr" ? "🎉 Memory résolu ! +30 KidiCoins ajoutés." : "🎉 Pairs solved! +30 KidiCoins added.");
          setTimeout(() => setCoinsReward(""), 4000);
        }
      } else {
        // Not Match - reset after delay
        setTimeout(() => {
          setSelectedIndices([]);
        }, 1000);
      }
    }
  };


  // 3. AI GAME ENGINE COMPILER SYSTEM HELPERS
  const getDerivedGameplayType = (promptText: string): "space-shooter" | "candy-catcher" | "gravity-jumper" | "classic-catcher" => {
    const text = promptText.toLowerCase();
    
    // Space shooter criteria
    if (
      text.includes("espace") || 
      text.includes("space") || 
      text.includes("astéroïde") || 
      text.includes("asteroid") || 
      text.includes("laser") || 
      text.includes("alien") || 
      text.includes("monstre") ||
      text.includes("combattre") ||
      text.includes("tirer") ||
      text.includes("vaisseau") ||
      text.includes("star wars")
    ) {
      return "space-shooter";
    }
    
    // Candy/Food catcher criteria
    if (
      text.includes("mang") ||
      text.includes("eat") ||
      text.includes("candy") ||
      text.includes("bonbon") ||
      text.includes("nourriture") ||
      text.includes("chocolat") ||
      text.includes("bambou") ||
      text.includes("fruit") ||
      text.includes("pomme") ||
      text.includes("pêche") ||
      text.includes("gâteau") ||
      text.includes("cookie") ||
      text.includes("carotte") ||
      text.includes("miel") ||
      text.includes("honey")
    ) {
      return "candy-catcher";
    }

    // Gravity jumper criteria
    if (
      text.includes("saut") ||
      text.includes("jump") ||
      text.includes("vol") ||
      text.includes("fly") ||
      text.includes("phénix") ||
      text.includes("phoenix") ||
      text.includes("oiseau") ||
      text.includes("gravité") ||
      text.includes("vent") ||
      text.includes("comète") ||
      text.includes("flappy") ||
      text.includes("boune") ||
      text.includes("plane")
    ) {
      return "gravity-jumper";
    }

    // Default classic catcher
    return "classic-catcher";
  };

  const getPromptEmoji = (promptText: string): string => {
    const text = promptText.toLowerCase();
    if (text.includes("panda")) return "🐼";
    if (text.includes("chat") || text.includes("cat")) return "🐱";
    if (text.includes("méduse") || text.includes("jelly")) return "🪼";
    if (text.includes("phénix") || text.includes("phoenix")) return "🐦";
    if (text.includes("baleine") || text.includes("whale")) return "🐳";
    if (text.includes("ourson") || text.includes("bear")) return "🐻";
    if (text.includes("dauphin") || text.includes("dolphin")) return "🐬";
    if (text.includes("robot")) return "🤖";
    if (text.includes("alien") || text.includes("martien") || text.includes("monster")) return "👽";
    if (text.includes("vaisseau") || text.includes("space")) return "🚀";
    if (text.includes("licorne") || text.includes("unicorn")) return "🦄";
    if (text.includes("dinosaure") || text.includes("dino")) return "🦖";
    if (text.includes("papillon") || text.includes("butterfly")) return "🦋";
    if (text.includes("superman") || text.includes("héros") || text.includes("hero")) return "🦸";
    return "👾";
  };

  // Sync draft list when active project parameters are tweaked
  const handleUpdateActiveProject = (updatedFields: Partial<SavedProject>) => {
    const updated = savedProjects.map((p) => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          ...updatedFields,
          lastUpdated: new Date().toISOString()
        };
      }
      return p;
    });
    setSavedProjects(updated);
    try {
      localStorage.setItem("kidi_saved_projects", JSON.stringify(updated));
    } catch {}
  };

  // Load selected project draft
  const handleLoadProject = (proj: SavedProject) => {
    setActiveProjectId(proj.id);
    setAiPrompt(proj.prompt);
    setAiGravity(proj.gravity);
    setAiSpeed(proj.speed);
    setGenerationCount(proj.generationCount);
    setIsGameRunning(false);
    setArcadeScore(0);
    setArcadeStatus("playing");
    setActiveSubTab("game");
  };

  // Create new blank project draft
  const handleCreateNewProject = () => {
    const defaultName = language === "fr" 
      ? `Création #${savedProjects.length + 1}` 
      : `Creation #${savedProjects.length + 1}`;
    
    const newProj: SavedProject = {
      id: "proj-" + Date.now(),
      name: defaultName,
      prompt: language === "fr" 
        ? "Un astronaute koala sautant dans un nuage d'étoiles dorées" 
        : "A koala astronaut leaping in gold clouds",
      gravity: 1.4,
      speed: 12,
      generationCount: 0,
      lastUpdated: new Date().toISOString()
    };
    
    const nextList = [newProj, ...savedProjects];
    setSavedProjects(nextList);
    try {
      localStorage.setItem("kidi_saved_projects", JSON.stringify(nextList));
    } catch {}
    handleLoadProject(newProj);
  };

  // Delete project from workspace database
  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedProjects.length <= 1) {
      triggerToast(language === "fr" 
        ? "⚠️ Impossible : tu dois conserver au moins un projet créatif actif !" 
        : "⚠️ Impossible: keep at least one active project!", "warning");
      return;
    }
    setConfirmModal({ isOpen: true, projectId: id });
  };

  const confirmDeleteProject = () => {
    const id = confirmModal.projectId;
    if (!id) return;
    const filtered = savedProjects.filter(p => p.id !== id);
    setSavedProjects(filtered);
    try {
      localStorage.setItem("kidi_saved_projects", JSON.stringify(filtered));
    } catch {}
    if (activeProjectId === id) {
      handleLoadProject(filtered[0]);
    }
    setConfirmModal({ isOpen: false, projectId: null });
  };

  // Simulated countdown ticking til tomorrow
  const [fakeDateReset, setFakeDateReset] = useState("");
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = 23 - now.getHours();
      const mins = 59 - now.getMinutes();
      const secs = 59 - now.getSeconds();
      setFakeDateReset(`${hours}h ${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSimulateNextDay = () => {
    setGenerationCount(0);
    handleUpdateActiveProject({ generationCount: 0 });
    setShowPaywallModal(false);
    setCoinsReward(language === "fr" ? "☀️ Nouveau jour simulé ! Tes 3 essais gratuits ont été renouvelés." : "☀️ New day simulated! 3 free compiles refilled.");
    setTimeout(() => setCoinsReward(""), 4000);
  };

  const promptSamples = [
    "Une méduse cosmique qui esquive des astéroïdes roses avec tirs laser",
    "Un panda roux astronaute mangeant des bonbons fuchsia tombant du ciel",
    "Un dauphin doré planant au milieu d'un blizzard d'étoiles filantes",
    "Un robot explorateur récoltant des diamants sous des éclairs spatiaux"
  ];

  const handleResetGenerationsWithKidiCoins = () => {
    if (session.kidiCoins >= 25) {
      onUpdateSession({
        ...session,
        kidiCoins: session.kidiCoins - 25
      });
      setGenerationCount(0);
      handleUpdateActiveProject({ generationCount: 0 });
      setShowPaywallModal(false);
      setCoinsReward(language === "fr" ? "🔑 Bonus +3 essais activés avec 25 KidiCoins !" : "🔑 Bonus +3 tests activated with 25 KidiCoins!");
      setTimeout(() => setCoinsReward(""), 4000);
    } else {
      triggerToast(language === "fr" 
        ? "⚠️ Oh mince ! Tu n'as pas assez de KidiCoins. Gagne des pièces en résolvant d'autres défis, ou utilise la carte de crédit de tes parents !" 
        : "⚠️ Not enough coins! Build more screenplay stories or ask your parents!", "warning");
    }
  };

  const handleCompileGame = () => {
    const currentProjCount = activeProject ? activeProject.generationCount : generationCount;
    if (!session.isPremiumMember && currentProjCount >= 3) {
      setCheckoutStep("options");
      setShowPaywallModal(true);
      return;
    }

    if (aiCompiling) return;
    setAiCompiling(true);
    setCompilingLogs([]);
    setIsGameRunning(false);

    const derivedPlayType = getDerivedGameplayType(aiPrompt);
    const logs = [
      `[PROMPT ANALYZER] Recherche d'intentions : "${aiPrompt}"`,
      `[PROMPT ANALYZER] Thème de Jeu : ${derivedPlayType.toUpperCase()} avec l'avatar ${getPromptEmoji(aiPrompt)}`,
      `[PHYSICS CORE] Constante de Gravité : ${aiGravity}g`,
      `[COMPILER ENGINE] Configuration cadencée à : ${aiSpeed} FPS`,
      `[IA COMPILER] Génération de la boucle TypeScript compilée d'après l'imagination de l'enfant...`,
      `[IA COMPILER] Bundle transpilé avec succès sur port 3000 local.`,
      `[LAUNCHER] Démarrage du prototype #${Math.min(3, currentProjCount + 1)} en direct !`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setCompilingLogs((prev) => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setAiCompiling(false);
        setIsGameRunning(true);
        
        // Track the compilation version specifically on current active project draft
        const nextCount = currentProjCount + 1;
        setGenerationCount(nextCount);
        handleUpdateActiveProject({
          prompt: aiPrompt,
          gravity: aiGravity,
          speed: aiSpeed,
          generationCount: nextCount
        });

        // Start live action
        setArcadeScore(0);
        setArcadeLives(3);
        setArcadeStatus("playing");
        setActiveSubTab("game");
      }
    }, 450);
  };

  // Live Canvas adaptive Game Runner
  useEffect(() => {
    if (!isGameRunning || arcadeStatus !== "playing") return;
    const canvas = gameCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;

    // Determine derived type & emoji assets
    const derivedType = getDerivedGameplayType(aiPrompt);
    const heroEmoji = getPromptEmoji(aiPrompt);

    // Dynamic obstacle emojis and star target emojis
    let targetEmoji = "⭐";
    let obstacleEmoji = "🔥";

    if (derivedType === "space-shooter") {
      targetEmoji = "🛸";
      obstacleEmoji = "☄️";
    } else if (derivedType === "candy-catcher") {
      targetEmoji = "🍬"; 
      obstacleEmoji = "🥦"; 
    } else if (derivedType === "gravity-jumper") {
      targetEmoji = "🪙";
      obstacleEmoji = "⚡";
    }

    // Coordinates variables
    let playerX = width / 2;
    let playerY = height - 30; 
    let playerWidth = 40;
    let playerHeight = 35;

    // Premium Game Feel Effects
    let screenShake = 0;
    let starfield: { x: number, y: number, size: number, speed: number }[] = [];
    for (let i = 0; i < 30; i++) {
      starfield.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.5 + 0.15
      });
    }

    if (derivedType === "gravity-jumper") {
      playerX = 80;
      playerY = height / 2;
    }

    let isMovingLeft = false;
    let isMovingRight = false;
    let jumpVelocity = 0;
    
    let bullets: { x: number, y: number, active: boolean }[] = [];
    let targetsList: { x: number, y: number, speed: number, size: number, emoji: string }[] = [];
    let obstaclesList: { x: number, y: number, speed: number, size: number, emoji: string }[] = [];
    let particlesList: { x: number, y: number, vx: number, vy: number, color: string, alpha: number, life: number }[] = [];

    // Initialize lists
    if (derivedType === "space-shooter") {
      for (let i = 0; i < 3; i++) {
        targetsList.push({
          x: Math.random() * (width - 40) + 20,
          y: Math.random() * -150 - 30,
          speed: (aiSpeed * 0.2 + 0.8) * (Math.random() * 0.4 + 0.8),
          size: 14,
          emoji: Math.random() > 0.5 ? "👽" : "🛸"
        });
      }
      for (let i = 0; i < 2; i++) {
        obstaclesList.push({
          x: Math.random() * (width - 40) + 20,
          y: Math.random() * -180 - 60,
          speed: (aiSpeed * 0.25 + 1.2) * (Math.random() * 0.4 + 0.8),
          size: 15,
          emoji: "☄️"
        });
      }
    } else if (derivedType === "candy-catcher" || derivedType === "classic-catcher") {
      let treats = ["🍬", "🍩", "🍰", "🍭", "🍪"];
      if (derivedType === "classic-catcher") treats = ["⭐", "🔑", "💎", "🌟"];
      for (let i = 0; i < 2; i++) {
        targetsList.push({
          x: Math.random() * (width - 40) + 20,
          y: Math.random() * -100 - 10,
          speed: (aiSpeed * 0.18 + 0.7) * aiGravity,
          size: 14,
          emoji: treats[Math.floor(Math.random() * treats.length)]
        });
      }
      obstaclesList.push({
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * -150 - 50,
        speed: (aiSpeed * 0.22 + 0.9) * aiGravity,
        size: 15,
        emoji: derivedType === "candy-catcher" ? "🥦" : "🔥"
      });
    } else if (derivedType === "gravity-jumper") {
      for (let i = 0; i < 3; i++) {
        targetsList.push({
          x: width + Math.random() * 200 + i * 100,
          y: Math.random() * (height - 60) + 30,
          speed: aiSpeed * 0.25 + 0.8,
          size: 12,
          emoji: "⭐"
        });
      }
      obstaclesList.push({
        x: width + 250,
        y: Math.random() * (height - 60) + 30,
        speed: (aiSpeed * 0.3 + 1.2),
        size: 13,
        emoji: "⚡"
      });
    }

    let scoreVal = arcadeScore;
    let livesVal = arcadeLives;

    // Controls listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "q" || key === "a") isMovingLeft = true;
      if (key === "arrowright" || key === "d") isMovingRight = true;
      
      if (e.key === " " || key === "arrowup" || key === "z" || key === "w") {
        if (derivedType === "gravity-jumper") {
          jumpVelocity = -3.8 - (aiGravity * 0.7);
          for (let k = 0; k < 5; k++) {
            particlesList.push({
              x: playerX + 10,
              y: playerY + 15,
              vx: Math.random() * 2 - 4,
              vy: Math.random() * 2 + 1,
              color: "#a855f7",
              alpha: 1,
              life: 12
            });
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "q" || key === "a") isMovingLeft = false;
      if (key === "arrowright" || key === "d") isMovingRight = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Mouse or Touch canvas interactions
    const handleCanvasInteraction = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      if (relativeX > 0 && relativeX < width) {
        playerX = relativeX - playerWidth / 2;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (derivedType !== "gravity-jumper") {
        handleCanvasInteraction(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (derivedType !== "gravity-jumper" && e.touches.length > 0) {
        handleCanvasInteraction(e.touches[0].clientX);
      }
    };

    const handleCanvasClick = () => {
      if (derivedType === "gravity-jumper") {
        jumpVelocity = -3.8 - (aiGravity * 0.7);
        for (let k = 0; k < 5; k++) {
          particlesList.push({
            x: playerX + 10,
            y: playerY + 15,
            vx: Math.random() * 2 - 4,
            vy: Math.random() * 2 + 1,
            color: "#ec4899",
            alpha: 1,
            life: 12
          });
        }
      } else if (derivedType === "space-shooter") {
        bullets.push({
          x: playerX + playerWidth / 2,
          y: playerY,
          active: true
        });
        for (let k = 0; k < 3; k++) {
          particlesList.push({
            x: playerX + playerWidth / 2,
            y: playerY - 4,
            vx: Math.random() * 4 - 2,
            vy: Math.random() * -2,
            color: "#fbbf24",
            alpha: 1,
            life: 8
          });
        }
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("mousedown", handleCanvasClick);

    // Spawn sparks particle explosions helper
    const triggerExplosionAt = (x: number, y: number, colorArr = ["#a855f7", "#ec4899", "#fbbf24"]) => {
      // Increase screen shake on hitting obstacles or getting caught
      screenShake = Math.max(screenShake, colorArr.includes("#f87171") || colorArr.includes("#f43f5e") || colorArr.includes("#ef4444") ? 13 : 5.5);

      for (let i = 0; i < 12; i++) {
        particlesList.push({
          x,
          y,
          vx: (Math.random() * 6 - 3) * (aiSpeed * 0.08 + 0.5),
          vy: (Math.random() * 6 - 3) * (aiSpeed * 0.08 + 0.5),
          color: colorArr[Math.floor(Math.random() * colorArr.length)],
          alpha: 1,
          life: Math.random() * 15 + 8
        });
      }
    };

    let animationFrameId: number;

    // Core Frame execution loop
    const gameLoop = () => {
      ctx.clearRect(0, 0, width, height);

      // Save baseline scale coordinates for physics camera jitter
      ctx.save();
      if (screenShake > 0) {
        const dx = (Math.random() - 0.5) * screenShake * 1.5;
        const dy = (Math.random() - 0.5) * screenShake * 1.5;
        ctx.translate(dx, dy);
        screenShake *= 0.88;
        if (screenShake < 0.1) screenShake = 0;
      }

      // Draw dark background
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, width, height);

      // Render descending magical space stars
      ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
      starfield.forEach((star) => {
        // Star travels downward depending on game execution speed
        star.y += star.speed * (aiSpeed / 5 + 0.4);
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw space playground grid background
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // Add neat backdrop label
      ctx.fillStyle = "rgba(99, 102, 241, 0.07)";
      ctx.font = "italic bold 16px font-sans";
      ctx.textAlign = "center";
      ctx.fillText(derivedType.replace("-", " ").toUpperCase(), width / 2, height / 2 + 6);

      if (derivedType !== "gravity-jumper") {
        if (isMovingLeft) playerX = Math.max(0, playerX - 5.5);
        if (isMovingRight) playerX = Math.min(width - playerWidth, playerX + 5.5);
      }

      // Physics & Logic per derived gameplay style
      if (derivedType === "space-shooter") {
        if (Math.random() < 0.07) {
          bullets.push({ x: playerX + playerWidth / 2, y: playerY, active: true });
        }

        bullets.forEach((b) => {
          if (!b.active) return;
          b.y -= 7.5; 
          if (b.y < 0) b.active = false;

          ctx.strokeStyle = "#22c55e";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x, b.y + 10);
          ctx.stroke();

          ctx.fillStyle = "rgba(34, 197, 94, 0.4)";
          ctx.beginPath();
          ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
          ctx.fill();
        });
        bullets = bullets.filter((b) => b.active);

        targetsList.forEach((tar) => {
          tar.y += tar.speed * aiGravity;
          if (tar.y > height) {
            tar.x = Math.random() * (width - 40) + 20;
            tar.y = Math.random() * -100 - 20;
          }

          bullets.forEach((b) => {
            if (!b.active) return;
            const dist = Math.hypot(b.x - tar.x, b.y - tar.y);
            if (dist < tar.size + 10) {
              b.active = false;
              tar.x = Math.random() * (width - 40) + 20;
              tar.y = Math.random() * -120 - 40;
              scoreVal += 1;
              setArcadeScore(scoreVal);
              triggerExplosionAt(tar.x, tar.y, ["#a855f7", "#ec4899", "#22c55e"]);
              
              if (scoreVal >= 10) {
                setArcadeStatus("won");
                const nextKidiCoins = session.kidiCoins + 35;
                onUpdateSession({ ...session, kidiCoins: nextKidiCoins });
                setCoinsReward(language === "fr" ? "🏆 Génie Cosmique ! Scénario validé. +35 Coins !" : "🏆 Cosmic Genius! Scenario validated. +35 Coins!");
                setTimeout(() => setCoinsReward(""), 4000);
              }
            }
          });

          ctx.font = `${tar.size * 1.5}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(tar.emoji, tar.x, tar.y);
        });

        obstaclesList.forEach((obs) => {
          obs.y += obs.speed * aiGravity;
          if (obs.y > height) {
            obs.x = Math.random() * (width - 40) + 20;
            obs.y = Math.random() * -180 - 60;
          }

          bullets.forEach((b) => {
            if (b.active && Math.hypot(b.x - obs.x, b.y - obs.y) < obs.size + 8) {
              b.active = false;
              triggerExplosionAt(obs.x, obs.y, ["#f43f5e", "#ef4444", "#ea580c"]);
              obs.x = Math.random() * (width - 40) + 20;
              obs.y = Math.random() * -180 - 60;
            }
          });

          const distToHero = Math.hypot(obs.x - (playerX + playerWidth / 2), obs.y - (playerY + playerHeight / 2));
          if (distToHero < obs.size + 13) {
            livesVal -= 1;
            setArcadeLives(livesVal);
            triggerExplosionAt(obs.x, obs.y, ["#f43f5e", "#ea580c"]);
            obs.x = Math.random() * (width - 40) + 20;
            obs.y = Math.random() * -180 - 60;
            if (livesVal <= 0) setArcadeStatus("game-over");
          }

          ctx.font = `${obs.size * 1.4}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(obs.emoji, obs.x, obs.y);
        });

      } else if (derivedType === "candy-catcher" || derivedType === "classic-catcher") {
        targetsList.forEach((tar) => {
          tar.y += tar.speed * aiGravity;
          if (tar.y > height) {
            tar.x = Math.random() * (width - 40) + 20;
            tar.y = Math.random() * -100 - 10;
          }

          const isCaught = (
            tar.y >= playerY - 10 &&
            tar.y <= playerY + 25 &&
            tar.x >= playerX - 10 &&
            tar.x <= playerX + playerWidth + 10
          );

          if (isCaught) {
            scoreVal += 1;
            setArcadeScore(scoreVal);
            triggerExplosionAt(tar.x, tar.y, ["#fbbf24", "#f59e0b", "#6366f1"]);
            tar.x = Math.random() * (width - 40) + 20;
            tar.y = Math.random() * -100 - 10;

            if (scoreVal >= 10) {
              setArcadeStatus("won");
              const nextKidiCoins = session.kidiCoins + 35;
              onUpdateSession({ ...session, kidiCoins: nextKidiCoins });
              setCoinsReward(language === "fr" ? "🏆 Scénario validé ! Mission accomplie ! +35 Coins !" : "🏆 Scenario validated! Mission accomplished! +35 Coins!");
              setTimeout(() => setCoinsReward(""), 4000);
            }
          }

          ctx.font = `${tar.size * 1.5}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(tar.emoji, tar.x, tar.y);
        });

        obstaclesList.forEach((obs) => {
          obs.y += obs.speed * aiGravity;
          if (obs.y > height) {
            obs.x = Math.random() * (width - 40) + 20;
            obs.y = Math.random() * -150 - 50;
          }

          const isHit = (
            obs.y >= playerY - 10 &&
            obs.y <= playerY + 25 &&
            obs.x >= playerX - 10 &&
            obs.x <= playerX + playerWidth + 10
          );

          if (isHit) {
            livesVal -= 1;
            setArcadeLives(livesVal);
            triggerExplosionAt(obs.x, obs.y, ["#f43f5e", "#ef4444"]);
            obs.x = Math.random() * (width - 40) + 20;
            obs.y = Math.random() * -150 - 50;
            if (livesVal <= 0) setArcadeStatus("game-over");
          }

          ctx.font = `${obs.size * 1.5}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(obs.emoji, obs.x, obs.y);
        });

      } else if (derivedType === "gravity-jumper") {
        jumpVelocity += 0.14 * aiGravity; 
        playerY += jumpVelocity;

        if (playerY < 0) {
          playerY = 0;
          jumpVelocity = 0;
        }
        if (playerY > height - playerHeight) {
          playerY = height - playerHeight;
          jumpVelocity = 0;
          livesVal -= 1;
          setArcadeLives(livesVal);
          triggerExplosionAt(playerX, playerY + 10, ["#f43f5e", "#ef4444"]);
          if (livesVal <= 0) {
            setArcadeStatus("game-over");
          } else {
            playerY = height / 3;
            jumpVelocity = 0;
          }
        }

        targetsList.forEach((tar) => {
          tar.x -= tar.speed;
          if (tar.x < -30) {
            tar.x = width + Math.random() * 150 + 50;
            tar.y = Math.random() * (height - 60) + 30;
          }

          const dist = Math.hypot(playerX + playerWidth / 2 - tar.x, playerY + playerHeight / 2 - tar.y);
          if (dist < tar.size + 15) {
            scoreVal += 1;
            setArcadeScore(scoreVal);
            triggerExplosionAt(tar.x, tar.y, ["#3b82f6", "#60a5fa", "#fbbf24"]);
            tar.x = width + Math.random() * 200 + 100;
            tar.y = Math.random() * (height - 60) + 30;

            if (scoreVal >= 10) {
              setArcadeStatus("won");
              const nextCoins = session.kidiCoins + 35;
              onUpdateSession({ ...session, kidiCoins: nextCoins });
              setCoinsReward(language === "fr" ? "🏆 Vol acrobatique réussi ! +35 KidiCoins !" : "🏆 Acrobat flight victory! +35 KidiCoins!");
              setTimeout(() => setCoinsReward(""), 4000);
            }
          }

          ctx.font = `${tar.size * 1.5}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(tar.emoji, tar.x, tar.y);
        });

        obstaclesList.forEach((obs) => {
          obs.x -= obs.speed;
          if (obs.x < -30) {
            obs.x = width + Math.random() * 300 + 200;
            obs.y = Math.random() * (height - 60) + 30;
          }

          const dist = Math.hypot(playerX + playerWidth / 2 - obs.x, playerY + playerHeight / 2 - obs.y);
          if (dist < obs.size + 15) {
            livesVal -= 1;
            setArcadeLives(livesVal);
            triggerExplosionAt(obs.x, obs.y, ["#f43f5e", "#f59e0b"]);
            obs.x = width + Math.random() * 400 + 300;
            obs.y = Math.random() * (height - 60) + 30;
            if (livesVal <= 0) setArcadeStatus("game-over");
          }

          ctx.font = `${obs.size * 1.5}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(obs.emoji, obs.x, obs.y);
        });
      }

      // Render sparks particles
      particlesList.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.04;
        p.life -= 1;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.life * 0.15 + 1), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1; 
      particlesList = particlesList.filter((p) => p.life > 0 && p.alpha > 0);

      // Render main Player Hero character custom emoji dynamically!
      ctx.fillStyle = "#ffffff";
      ctx.font = `${playerHeight * 1.15}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(heroEmoji, playerX + playerWidth / 2, playerY + playerHeight / 2);

      if (derivedType !== "gravity-jumper") {
        ctx.fillStyle = "rgba(99, 102, 241, 0.4)";
        ctx.beginPath();
        ctx.arc(playerX + playerWidth / 2, playerY + playerHeight + 2, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("mousedown", handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isGameRunning, arcadeStatus, aiGravity, aiSpeed, aiPrompt]);

  return (
    <div id="kidi-gaming-container" className="space-y-6 text-left">
      
      {/* Dynamic Game Switcher Card Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-white flex items-center gap-2 animate-fade-in">
            <Smartphone className="text-amber-500 w-5.5 h-5.5" />
            {language === "fr" ? "Labo de Jeux Mobiles KIDI GAMES" : "KIDI GAMES & AI Playground"}
          </h2>
          <p className="text-xs text-slate-400">
            {language === "fr" ? "Teste tes compétences, connecte-toi à l'IA d'apprentissage et fabrique ton propre jeu" : "Play tactical chess or test AI compilations"}
          </p>
        </div>

        {/* Sleek Search Bar */}
        <div className="relative w-full lg:w-64">
          <input
            id="challenge-search-input"
            type="text"
            placeholder={language === "fr" ? "Rechercher par titre/mot-clé..." : "Search by title/keyword..."}
            value={challengeSearchQuery}
            onChange={(e) => setChallengeSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-8 pr-8 py-2 focus:outline-none focus:border-amber-500 hover:border-slate-700 transition font-medium text-left"
          />
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
          {challengeSearchQuery && (
            <button
              onClick={() => setChallengeSearchQuery("")}
              className="absolute right-2.5 top-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-slate-855 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories selector switches */}
        <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-850 flex gap-2 w-full lg:w-auto overflow-x-auto">
          {GAMES_LIST.map((ga) => (
            <button
              key={ga.id}
              onClick={() => {
                setActiveGameCategory(ga.category);
                setChallengeSearchQuery("");
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
                activeGameCategory === ga.category 
                  ? "bg-amber-500 text-slate-950 font-black shadow-md" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {ga.name}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH RESULTS VIEW FOR ALL CHALLENGES */}
      {challengeSearchQuery.trim() !== "" && (
        <div id="search-challenges-results-panel" className="bg-slate-900/90 border border-amber-500/35 p-5 rounded-3xl space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-450 animate-pulse" />
              {language === "fr" 
                ? `Résultats de recherche pour "${challengeSearchQuery}"` 
                : `Search results for "${challengeSearchQuery}"`}
            </h4>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
              {GAMES_LIST.filter(game => {
                const q = challengeSearchQuery.toLowerCase().trim();
                return (
                  game.name.toLowerCase().includes(q) ||
                  game.category.toLowerCase().includes(q) ||
                  game.description.toLowerCase().includes(q)
                );
              }).length} {language === "fr" ? "défi(s) trouvé(s)" : "challenge(s) found"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GAMES_LIST.map(game => {
              const q = challengeSearchQuery.toLowerCase().trim();
              const isMatch = (
                game.name.toLowerCase().includes(q) ||
                game.category.toLowerCase().includes(q) ||
                game.description.toLowerCase().includes(q)
              );

              if (!isMatch) return null;

              return (
                <div 
                  key={game.id} 
                  className={`border rounded-2xl p-4 flex flex-col justify-between space-y-3 transition group ${
                    activeGameCategory === game.category
                      ? "bg-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/5"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono uppercase bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
                        {game.category === "ai-builder" ? "IA & Code" : game.category === "chess" ? "Échecs" : game.category === "kidi-educatif" ? "Éducatif" : "Mémoire"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">{game.ageBand}</span>
                    </div>
                    <h5 className="text-xs font-black text-slate-100 group-hover:text-amber-400 transition">
                      {game.name}
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {game.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveGameCategory(game.category);
                      setChallengeSearchQuery("");
                    }}
                    className="w-full bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-slate-800 hover:border-transparent text-slate-300 transition text-[10px] font-black py-1.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer hover:shadow-lg hover:shadow-amber-550/15"
                  >
                    Lancer le Défi <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            {GAMES_LIST.filter(game => {
              const q = challengeSearchQuery.toLowerCase().trim();
              return (
                game.name.toLowerCase().includes(q) ||
                game.category.toLowerCase().includes(q) ||
                game.description.toLowerCase().includes(q)
              );
            }).length === 0 && (
              <div className="col-span-full py-6 text-center space-y-1 bg-slate-950/40 rounded-2xl border border-dashed border-slate-850">
                <p className="text-xs font-bold text-slate-400">Aucun défi ne correspond exactement à ton mot-clé 🧩</p>
                <p className="text-[10px] text-slate-500">Essaie \"IA\", \"Code\", \"Mat\", \"Échecs\" ou \"Memory\" !</p>
              </div>
            )}
          </div>
        </div>
      )}

      {coinsReward && (
        <div id="kidi-gaming-coins-banner" className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold animate-pulse text-center">
          {coinsReward}
        </div>
      )}

      {/* A. AI MOBILE GAME PROTOTYPER ENGINE & MULTI-DRAFT WORKSPACE */}
      {activeGameCategory === "ai-builder" && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          
          {/* COLUMN 1: SUSPENDED PROJECTS & DRAFTS LIST (1 Column) */}
          <div className="xl:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div className="space-y-0.5">
                <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Folder className="w-4 h-4 text-amber-500" />
                  {language === "fr" ? "Projets en suspens" : "Suspended Arena"}
                </h3>
                <p className="text-[10px] text-slate-500">
                  {language === "fr" ? "Sauvegarde automatique" : "Saves and drafts state"}
                </p>
              </div>
              
              {/* New Draft Creation button */}
              <button
                onClick={handleCreateNewProject}
                className="p-1 px-2.5 bg-indigo-500/10 hover:bg-indigo-500 truncate text-[11px] font-black text-indigo-400 hover:text-white rounded-lg transition border border-indigo-505/20 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {language === "fr" ? "Nouveau" : "New"}
              </button>
            </div>

            {/* List scrollable drafts */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {savedProjects.map((proj) => {
                const isActive = proj.id === activeProjectId;
                const isEditing = editProjectNameId === proj.id;
                const gameType = getDerivedGameplayType(proj.prompt);
                const emoji = getPromptEmoji(proj.prompt);
                
                return (
                  <div
                    key={proj.id}
                    onClick={() => handleLoadProject(proj)}
                    className={`p-3 rounded-2xl border transition-all text-left relative group ${
                      isActive 
                        ? "bg-slate-950 border-amber-500/60 shadow-lg" 
                        : "bg-slate-950/45 border-slate-850 hover:bg-slate-950/80"
                    }`}
                  >
                    {/* Active highlight bulb */}
                    {isActive && (
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    )}

                    <div className="space-y-1.5 max-w-[90%]">
                      {/* Name editing inline or reading state */}
                      {isEditing ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editProjectNameValue}
                            onChange={(e) => setEditProjectNameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const nextName = editProjectNameValue.trim() || proj.name;
                                handleUpdateActiveProject({ name: nextName });
                                setEditProjectNameId(null);
                              }
                            }}
                            className="bg-slate-900 border border-slate-700 text-xs text-white rounded px-1.5 py-0.5 focus:outline-none w-full"
                          />
                          <button
                            onClick={() => {
                              const nextName = editProjectNameValue.trim() || proj.name;
                              handleUpdateActiveProject({ name: nextName });
                              setEditProjectNameId(null);
                            }}
                            className="bg-emerald-500 text-slate-950 p-1 rounded text-[10px] font-bold"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white max-w-[130px] truncate">
                            {proj.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditProjectNameId(proj.id);
                              setEditProjectNameValue(proj.name);
                            }}
                            className="text-slate-500 hover:text-white transition opacity-0 group-hover:opacity-100"
                            title="Modifier le titre"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Prompt subtitle preview */}
                      <p className="text-[10px] text-slate-400 line-clamp-1 italic">
                        "{proj.prompt}"
                      </p>

                      {/* Metadata row */}
                      <div className="flex items-center gap-2 pt-1.5 text-[9px] font-mono text-slate-500">
                        <span className="text-amber-400 font-bold bg-amber-400/5 px-1 rounded">
                          {emoji} {gameType.replace("-", " ")}
                        </span>
                        <span>•</span>
                        <span>v#{proj.generationCount}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute right-2 bottom-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleDeleteProject(proj.id, e)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition"
                        title="Jeter ce projet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 bg-slate-950 p-3 rounded-2xl border border-slate-850 flex items-center gap-2">
              <Hourglass className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
              <div className="text-[9px] text-slate-400 font-sans leading-snug">
                {language === "fr" 
                  ? "Atelier persistant. Reprends tes créations suspendues à n'importe quel moment !"
                  : "Saved drafts remain intact. Re-open design story any day!"}
              </div>
            </div>
          </div>

          {/* COLUMN 2: SETTINGS & SLIDERS (1 Column) */}
          <div className="xl:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl text-left">
            <div className="space-y-1">
              <span className="text-[9px] bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider inline-block">
                🧙‍♂️ Modulateur de gameplay
              </span>
              <h3 className="text-sm font-black text-white">
                {language === "fr" ? "Mémoire de Scénario" : "Brain of Prompt"}
              </h3>
            </div>

            {/* Prompt suggestion helper */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">
                {language === "fr" ? "Aventure du jeu :" : "Game Scenario :"}
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => {
                  setAiPrompt(e.target.value);
                  handleUpdateActiveProject({ prompt: e.target.value });
                }}
                placeholder="Ex: Un panda roux astronaute mangeant des bonbons fuchsia tombant..."
                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-3 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-amber-500 h-24 resize-none font-medium leading-relaxed"
              />
              <div className="flex flex-col gap-1.5 max-h-[110px] overflow-y-auto pr-1">
                {promptSamples.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAiPrompt(p);
                      handleUpdateActiveProject({ prompt: p });
                    }}
                    className="text-[9px] bg-slate-950 hover:bg-slate-850 hover:text-slate-200 transition text-slate-400 border border-slate-850 px-2 py-1 rounded-md text-left truncate cursor-pointer"
                  >
                    💡 {p}
                  </button>
                ))}
              </div>

              {/* Pro presets templates launcher */}
              <div className="pt-2.5">
                <label className="text-[9px] text-indigo-400 uppercase tracking-widest font-mono font-bold block mb-1.5">
                  ⚙️ Modèles Moteurs Pro (1-Click) :
                </label>
                <div className="grid grid-cols-1 gap-1">
                  {[
                    {
                      name: "🐋 Astro-Flappy Whale (Lente & Gravitationnelle)",
                      prompt: "Baleine de lumière flottant dans un océan cosmique en évitant des coraux de néon fuchsia",
                      grav: 2.4,
                      sp: 8
                    },
                    {
                      name: "🚀 Galactic Space Shooter (Super Rapide)",
                      prompt: "Mini navette chassant des nuages de décombes scintillants",
                      grav: 0.7,
                      sp: 16
                    },
                    {
                      name: "👾 Alien Runner Pro (Réflexes Instantanés)",
                      prompt: "Extraterrestre Bondissant sur des astéroïdes roses",
                      grav: 1.6,
                      sp: 12
                    }
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => {
                        setAiPrompt(preset.prompt);
                        setAiGravity(preset.grav);
                        setAiSpeed(preset.sp);
                        handleUpdateActiveProject({ 
                          prompt: preset.prompt,
                          gravity: preset.grav,
                          speed: preset.sp
                        });
                        triggerToast(language === "fr" ? `Configuration Pro "${preset.name}" chargée !` : `Pro preset loaded!`);
                      }}
                      className="text-[9px] bg-indigo-950/40 hover:bg-indigo-900/40 hover:text-indigo-200 border border-indigo-500/10 hover:border-indigo-500/25 transition text-indigo-300 py-1 px-2 rounded-lg text-left truncate font-mono flex items-center justify-between cursor-pointer"
                    >
                      <span>{preset.name}</span>
                      <span className="text-[8px] bg-indigo-500/10 px-1.5 py-0.2 rounded text-indigo-455 font-bold uppercase tracking-wider shrink-0">Pro</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Micro parameters Adjusters */}
            <div className="space-y-3 pt-3 border-t border-slate-850">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold uppercase">
                  <span>⚓ {language === "fr" ? "Gravité d'IA" : "AI Gravity"} :</span>
                  <span className="text-amber-500 font-bold">{aiGravity}g</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={aiGravity}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setAiGravity(value);
                    handleUpdateActiveProject({ gravity: value });
                  }}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold uppercase">
                  <span>⚡ {language === "fr" ? "Fréquence Moteur" : "Frame Speed"} :</span>
                  <span className="text-indigo-400 font-bold">{aiSpeed} FPS</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="1"
                  value={aiSpeed}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setAiSpeed(value);
                    handleUpdateActiveProject({ speed: value });
                  }}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            {/* Quota limit tracker indicator */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-855 flex items-center justify-between text-[10px] font-sans">
              <span className="text-slate-400">{language === "fr" ? "Essais dans ce projet :" : "Project compilations :"}</span>
              {session.isPremiumMember ? (
                <span className="font-bold text-amber-400 flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3 text-amber-400 animate-pulse fill-amber-500" />
                  KidiClub Pro
                </span>
              ) : (
                <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                  (activeProject ? activeProject.generationCount : generationCount) >= 3 
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {Math.max(0, 3 - (activeProject ? activeProject.generationCount : generationCount))} / 3 {language === "fr" ? "gratuits" : "free"}
                </span>
              )}
            </div>

            <button
              onClick={handleCompileGame}
              disabled={aiCompiling}
              className={`w-full py-3 rounded-2xl font-black text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                aiCompiling 
                  ? "bg-slate-950 text-slate-500 border border-slate-800"
                  : "bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-500 text-white active:scale-95"
              }`}
            >
              <Cpu className={`w-4 h-4 text-amber-400 ${aiCompiling ? "animate-spin" : "animate-pulse"}`} />
              {aiCompiling ? (language === "fr" ? "IA compile le projet..." : "AI compiling TS...") : (language === "fr" ? "Générer le Jeu & Jouer" : "Compile Draft & Play")}
            </button>
          </div>

          {/* COLUMN 3-4: DEVICE EMULATOR OR SOURCES OUTLET (2 Columns) */}
          <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[480px] relative overflow-hidden text-left">
            
            {/* If compiling, show terminal emulator */}
            {aiCompiling && (
              <div className="absolute inset-0 bg-slate-950/95 z-20 p-6 font-mono text-xs flex flex-col justify-between text-left">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-850 pb-2 mb-2">
                    <span className="w-3 h-3 bg-rose-500 rounded-full inline-block animate-pulse" />
                    <span className="w-3 h-3 bg-amber-500 rounded-full inline-block" />
                    <span className="w-3 h-3 bg-green-500 rounded-full inline-block" />
                    <span className="text-[10px] text-slate-400 ml-2">Compiler Simulator sandboxed terminal...</span>
                  </div>
                  
                  <div className="space-y-2">
                    {compilingLogs.map((log, idx) => (
                      <div key={idx} className="text-emerald-400 flex items-start gap-2">
                        <span className="text-slate-600 select-none">&gt;&gt;</span>
                        <span className="leading-relaxed font-mono">{log}</span>
                      </div>
                    ))}
                    <div className="w-2 h-4 bg-emerald-400/80 animate-ping inline-block" />
                  </div>
                </div>

                <div className="text-slate-500 text-[10px] border-t border-slate-850 pt-2 flex justify-between items-center">
                  <span>Port 3000 custom web mapping proxy</span>
                  <span>TypeScript pipeline v4.4</span>
                </div>
              </div>
            )}

            {/* Multitier Paywall Overlay blocking tests after 3 compilations */}
            {showPaywallModal && (
              <div className="absolute inset-0 bg-slate-950/95 z-30 p-6 flex flex-col justify-between overflow-y-auto animate-fadeIn text-left">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5.5 h-5.5 text-rose-400" />
                      <div>
                        <h4 className="text-sm font-black text-white">Sécurité KidiSafe Parents & Enfants</h4>
                        <p className="text-[10px] text-slate-400">Contrôle de consommation saine KidiWorld</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowPaywallModal(false)}
                      className="text-xs font-mono text-slate-500 hover:text-white transition px-2.5 py-1 rounded bg-slate-900 border border-slate-850 cursor-pointer"
                    >
                      [×] Fermer
                    </button>
                  </div>

                  {checkoutStep === "options" && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-rose-500/10 to-transparent p-4 rounded-2xl border border-rose-500/20 space-y-1.5 animate-pulse">
                        <span className="text-[10px] uppercase font-mono bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded font-bold">
                          Limite atteinte (3/3)
                        </span>
                        <h5 className="text-white font-bold text-sm">Fin de quota pour ce projet aujourd'hui !</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          La création sémantique sollicite nos serveurs de calcul d'écriture de code TypeScript interactif. Tu as trois options pour poursuivre tes compilations créatives :
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Option 1: Pays with KidiCoins */}
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow hover:border-slate-700 transition">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-amber-400 uppercase font-mono tracking-wider flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-500" /> tirelire kidicoins
                            </span>
                            <h6 className="text-xs font-bold text-white">Bonus +3 Essais IA</h6>
                            <p className="text-[9px] text-slate-400 leading-normal">
                              Utilise tes KidiCoins collectés en résolvant d'autres ateliers ludiques.
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                            <span className="text-xs font-black text-amber-500 font-mono">25 Coins</span>
                            <button
                              onClick={handleResetGenerationsWithKidiCoins}
                              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] py-1 px-2.5 rounded-lg transition"
                            >
                              Débloquer
                            </button>
                          </div>
                        </div>

                        {/* Option 2: Life Premium with KidiCoins */}
                        <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow hover:border-slate-700 transition">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-indigo-400 uppercase font-mono tracking-wider flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" /> membre pro
                            </span>
                            <h6 className="text-xs font-bold text-white">Passer Premium KidiClub</h6>
                            <p className="text-[9px] text-slate-400 leading-normal">
                              Économise pour activer l'éveil créatif illimité sur toute la plateforme.
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                            <span className="text-xs font-black text-indigo-400 font-mono">100 Coins</span>
                            <button
                              onClick={() => {
                                if (session.kidiCoins >= 100) {
                                  onUpdateSession({
                                    ...session,
                                    isPremiumMember: true,
                                    kidiCoins: session.kidiCoins - 100
                                  });
                                  setGenerationCount(0);
                                  handleUpdateActiveProject({ generationCount: 0 });
                                  setShowPaywallModal(false);
                                  triggerToast(language === "fr" ? "🎉 Extraordinaire ! Tu es membre Premium à vie de KidiClub !" : "🎉 Lifetime Premium unlocked!");
                                } else {
                                  triggerToast(language === "fr" ? "⚠️ Pas assez de pièces !" : "⚠️ Not enough coins!", "warning");
                                }
                              }}
                              className="bg-indigo-500 hover:bg-indigo-400 text-white font-black text-[10px] py-1 px-2.5 rounded-lg transition"
                            >
                              Acheter
                            </button>
                          </div>
                        </div>

                        {/* Option 3: ATTENDRE LE LENDEMAIN SIMULATE reset countdown */}
                        <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow hover:border-slate-700 transition">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-emerald-400 uppercase font-mono tracking-wider flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> attendre demain
                            </span>
                            <h6 className="text-xs font-bold text-white">Recharge Gratuite</h6>
                            <p className="text-[9px] text-slate-400 leading-normal">
                              Recharge gratuite de 24h. Ticking avant le reset :
                            </p>
                            <span className="text-[12px] font-mono font-bold text-emerald-400 block pt-1">
                              {fakeDateReset || "23h 59m 59s"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                            <span className="text-[9px] text-slate-500 font-mono">Simulateur</span>
                            <button
                              onClick={handleSimulateNextDay}
                              className="bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 font-bold text-emerald-400 text-[9px] py-1 px-2 rounded transition"
                              title="Passe le temps de 24 heures pour tester immédiatement"
                            >
                              Simuler demain
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Option 4: Parents credit card bank sandbox simulator */}
                      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 p-4 rounded-2xl border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-4 mt-1">
                        <div className="space-y-1 text-left">
                          <span className="text-[9px] uppercase font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-bold">
                            Espace parent sécurisé - 0 €
                          </span>
                          <h6 className="text-xs font-bold text-white">Abonner l'Atelier en Forfait Illimité Total</h6>
                          <p className="text-[10px] text-slate-400 leading-relaxed max-w-lg">
                            Active instantanément le Pass KidiClub Créatif en validant la démo parentale sécurisée. Sans frais réel !
                          </p>
                        </div>
                        <button
                          onClick={() => setCheckoutStep("card-form")}
                          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-505 text-white font-black text-xs py-2 px-3.5 rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Simuler Pass Parent
                        </button>
                      </div>
                    </div>
                  )}

                  {checkoutStep === "card-form" && (
                    <div className="space-y-4 max-w-md mx-auto bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
                      <span className="text-[10px] tracking-wider text-indigo-400 uppercase font-mono font-bold block">
                        💳 Simulateur de Paiement Éducatif KidiPay
                      </span>
                      <h5 className="text-sm font-black text-white">Validation d'accord parental saine</h5>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Rentre les codes de démonstration ci-dessous pour débloquer l'aventure créative de ton enfant à vie.
                      </p>

                      <div className="space-y-3 text-left">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 uppercase font-mono block">Code magique d'agrément parent (ex: superparent) :</label>
                          <input 
                            type="password"
                            placeholder="Saisis le mot de passe d'accord"
                            value={parentApprovalCode}
                            onChange={(e) => setParentApprovalCode(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 uppercase font-mono block">Numéro de carte bancaire factice :</label>
                          <div className="relative">
                            <input 
                              type="text"
                              maxLength={19}
                              placeholder="4242 4242 4242 4242"
                              value={creditCardNumber}
                              onChange={(e) => setCreditCardNumber(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 pl-10 text-xs text-white focus:outline-none focus:border-indigo-500"
                            />
                            <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-1">
                        <button
                          onClick={() => setCheckoutStep("options")}
                          className="w-1/3 py-2 bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-400 text-xs font-bold rounded-xl transition"
                        >
                          Retour
                        </button>
                        <button
                          onClick={() => {
                            if (!parentApprovalCode || !creditCardNumber) {
                              triggerToast(language === "fr" ? "⚠️ Veuillez remplir le code d'agrément parent." : "⚠️ Please fill credentials first.", "warning");
                              return;
                            }
                            setCheckoutStep("success");
                          }}
                          className="w-2/3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black rounded-xl transition shadow-lg shrink-0"
                        >
                          Débloquer KidiClub (0 €)
                        </button>
                      </div>
                    </div>
                  )}

                  {checkoutStep === "success" && (
                    <div className="space-y-4 max-w-sm mx-auto text-center py-4">
                      <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/25 rounded-full flex items-center justify-center text-2xl mx-auto text-emerald-400 animate-bounce">
                        👑
                      </div>
                      <div className="space-y-1.5">
                        <h5 className="text-base font-black text-emerald-400">Abonnement KidiClub Activé !</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          La passerelle éducative parents-enfants a accordé le mode créatif illimité total à vie. +500 KidiCoins transférés dans votre tirelire générale KidiWorld !
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          onUpdateSession({
                            ...session,
                            isPremiumMember: true,
                            kidiCoins: session.kidiCoins + 500
                          });
                          setGenerationCount(0);
                          handleUpdateActiveProject({ generationCount: 0 });
                          setShowPaywallModal(false);
                        }}
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-md"
                      >
                        Retourner à mon Studio IA !
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 border-t border-slate-850/60 pt-3 flex flex-col sm:flex-row justify-between items-center gap-2">
                  <span>© KidiWorld 2026 - Conforme aux directives COPPA Safe</span>
                  <span>Option d'attente saine 24h</span>
                </div>
              </div>
            )}

            {!isGameRunning ? (
              // Game placeholder intro
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
                <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shadow-xl">
                  <Smartphone className="w-7 h-7 text-indigo-400" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="text-sm font-black text-white">Un mini-jeu lié à ce que tu as écrit !</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Saisis quelques mots simples sur ton héros ou ton univers à gauche (ex: panda roux, méduse cosmique) puis clique sur le bouton <strong>Générer</strong>. L'IA va créer ta boucle de jeu interactive !
                  </p>
                </div>
                <button
                  onClick={handleCompileGame}
                  className="bg-slate-950 border border-slate-800 hover:text-white hover:bg-slate-900 py-2 px-4 rounded-xl text-xs font-bold text-indigo-400 flex items-center gap-1.5 cursor-pointer"
                >
                  Générer le projet par défaut
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              // Active Playable Canvas or Source code output
              <div className="flex-1 flex flex-col justify-between h-full space-y-4">
                
                {/* Visual sub tabs to switch between code and game */}
                <div className="flex border-b border-slate-850 justify-between items-center pb-2">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveSubTab("game")}
                      className={`pb-2 text-xs font-bold relative transition flex items-center gap-1.5 cursor-pointer ${
                        activeSubTab === "game" ? "text-amber-400 font-extrabold" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>🕹️ Console Interactive</span>
                      {activeSubTab === "game" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded" />}
                    </button>
                    <button
                      onClick={() => setActiveSubTab("code")}
                      className={`pb-2 text-xs font-bold relative transition flex items-center gap-1.5 cursor-pointer ${
                        activeSubTab === "code" ? "text-indigo-400 font-extrabold" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>💻 Code source TypeScript (.ts)</span>
                      {activeSubTab === "code" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded" />}
                    </button>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 bg-slate-950 rounded-md px-1.5 py-0.5 uppercase">
                    PROJET v#{(activeProject ? activeProject.generationCount : generationCount)}
                  </span>
                </div>

                {activeSubTab === "game" ? (
                  // Active interactive canvas views
                  <div className="flex flex-col justify-between flex-1 space-y-4">
                    <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-2xl border border-slate-850">
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase font-mono text-slate-500 font-bold block">Score du scénario</span>
                        <strong className="text-sm font-black text-amber-400 font-mono">{arcadeScore} / 10</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">Essais restants :</span>
                        <div className="flex gap-1">
                          {Array(3).fill(null).map((_, idx) => (
                            <div 
                              key={idx} 
                              className={`w-3 h-3 rounded-full border transition ${
                                idx < arcadeLives ? "bg-rose-500 border-rose-400 shadow-sm" : "bg-slate-950 border-slate-800"
                              }`} 
                            />
                          ))}
                        </div>
                      </div>

                      {arcadeStatus !== "playing" && (
                        <button
                          onClick={() => {
                            setArcadeScore(0);
                            setArcadeLives(3);
                            setArcadeStatus("playing");
                          }}
                          className="bg-indigo-500 hover:bg-indigo-400 py-1 px-2.5 rounded-lg text-[10px] font-bold text-white flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCcw className="w-2.5 h-2.5" /> Recommencer
                        </button>
                      )}
                    </div>

                    {/* Canvas renderer wrapper */}
                    <div className="relative border border-slate-950 rounded-2xl overflow-hidden self-center outline-none bg-slate-950 shadow-inner w-full flex justify-center">
                      <canvas 
                        ref={gameCanvasRef} 
                        width={380} 
                        height={200} 
                        className="max-w-[380px] h-[200px] cursor-crosshair block" 
                      />

                      {/* Absolute overlays for victory/defeat screen */}
                      {arcadeStatus === "game-over" && (
                        <div className="absolute inset-0 bg-slate-950/95 z-10 flex flex-col items-center justify-center text-center p-6 space-y-2">
                          <span className="text-3xl">💀</span>
                          <h4 className="text-xs font-black text-rose-400">Prototype hors-service !</h4>
                          <p className="text-[10px] text-slate-400 leading-normal max-w-xs">
                            Tu as heurté trop d'obstacles. Ajuste la vitesse de chute ou la gravité d'IA à gauche et réessaie !
                          </p>
                          <button
                            onClick={() => {
                              setArcadeScore(0);
                              setArcadeLives(3);
                              setArcadeStatus("playing");
                            }}
                            className="bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs py-1.5 px-4 rounded-xl transition cursor-pointer"
                          >
                            Reprendre la partie
                          </button>
                        </div>
                      )}

                      {arcadeStatus === "won" && (
                        <div className="absolute inset-0 bg-slate-950/95 z-10 flex flex-col items-center justify-center text-center p-6 space-y-2">
                          <span className="text-3xl">🏆</span>
                          <h4 className="text-xs font-black text-amber-400">Scénario Validé avec succès !</h4>
                          <p className="text-[10px] text-slate-300 leading-normal max-w-xs">
                            Incroyable ! Tu as prouvé ton imagination avec le scénario <strong>"{aiPrompt}"</strong> ! +35 KidiCoins déposés.
                          </p>
                          <div className="flex gap-2.5">
                            <button
                              onClick={() => {
                                setArcadeScore(0);
                                setArcadeLives(3);
                                setArcadeStatus("playing");
                              }}
                              className="bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs py-1.5 px-3 rounded-xl transition cursor-pointer"
                            >
                              Rejouer
                            </button>
                            <button
                              onClick={() => {
                                const tsCode = `import { PhysicsEngine, Canvas2D } from "@kidiworld/core";

/**
 * 🎮 MINI-JEU CRÉATIF : "${aiPrompt.replace(/"/g, '\\"')}"
 * Transpilé par KidiWorld-AI Compiler v4.4
 * Paramètres physiques : Gravité=${aiGravity}g, Vitesse=${aiSpeed} FPS
 */
@AIPrototyper({
  prompt: "${aiPrompt.replace(/"/g, '\\"')}",
  gameplay: "${getDerivedGameplayType(aiPrompt)}",
  vibe: "pixel-creativity",
  emoji: "${getPromptEmoji(aiPrompt)}",
  targetScore: 10
})
export class CustomGameEngine extends PhysicsEngine {
  private character = "${aiPrompt.substring(0, 30).replace(/"/g, '\\"')}";
  private gravityConstant = ${aiGravity} * 9.81; 
  private renderSpeedFps = ${aiSpeed}; 
 
  constructor() {
    super();
    this.initCanvas2D();
    console.log("🚀 Lancement du jeu : " + this.character);
  }
 
  // Boucle de gameplay sémantique synchronisée à ${aiSpeed} FPS
  public onTick(deltaTime: number) {
    this.updatePlayerCoordinates(this.gravityConstant, deltaTime);
    this.checkCollisions();
    this.renderFrame();
  }
}`;
                                if (navigator.clipboard) {
                                  navigator.clipboard.writeText(tsCode);
                                }
                                triggerToast(language === "fr" 
                                  ? "💾 Code source TypeScript copié dans ton presse-papier !" 
                                  : "💾 TypeScript Source Code written to clipboard!");
                              }}
                              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-1.5 px-3 rounded-xl transition cursor-pointer"
                            >
                              Exporter le Code source
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-950/45 p-2.5 rounded-xl border border-slate-905 text-[10px] text-slate-500 flex justify-between items-center">
                      <span>🕹️ Bouge ta souris ou ton doigt pour faire glisser ton héros de gauche à droite ou clique pour sauter/tirer !</span>
                      <span className="text-[9px] font-mono uppercase bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded">
                        Moteur Canvas 2D
                      </span>
                    </div>
                  </div>
                ) : (
                  // Gorgeous Code Source TS view with visual compiler highlights
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800/60 font-mono text-[10px] text-slate-350 h-[210px] overflow-y-auto relative text-left">
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-bold uppercase text-[9px]">
                        <FileCode className="w-3 h-3" /> compiled.ts
                      </div>
                      <pre className="whitespace-pre overflow-x-auto leading-relaxed text-slate-300 text-[10px]">
{`import { PhysicsEngine, Canvas2D } from "@kidiworld/core";
 
/**
 * 🎮 MINI-JEU CRÉATIF : "${aiPrompt}"
 * Transpilé par KidiWorld-AI Compiler v4.4
 * Paramètres physiques : Gravité=${aiGravity}g, Vitesse=${aiSpeed} FPS
 */
@AIPrototyper({
  prompt: "${aiPrompt.replace(/"/g, '\\"')}",
  gameplay: "${getDerivedGameplayType(aiPrompt)}",
  vibe: "pixel-creativity",
  emoji: "${getPromptEmoji(aiPrompt)}",
  targetScore: 10
})
export class CustomGameEngine extends PhysicsEngine {
  private character = "${aiPrompt.substring(0, 30).replace(/"/g, '\\"')}";
  private gravityConstant = ${aiGravity} * 9.81; 
  private renderSpeedFps = ${aiSpeed}; 
 
  constructor() {
    super();
    this.initCanvas2D();
    console.log("🚀 Lancement du jeu : " + this.character);
  }
 
  // Boucle de gameplay sémantique synchronisée à ${aiSpeed} FPS
  public onTick(deltaTime: number) {
    this.updatePlayerCoordinates(this.gravityConstant, deltaTime);
    this.checkCollisions();
    this.renderFrame();
  }
 
  private updatePlayerCoordinates(g: number, dt: number) {
    // Calcul de la chute libre basé sur les curseurs du joueur
    this.actorY += g * dt * (this.renderSpeedFps / 10);
    if (this.actorY > this.canvas.height) {
      this.actorY = 0;
      this.actorX = Math.random() * this.canvas.width;
    }
  }
 
  private checkCollisions() {
    // Distance entre l'avatar "${aiPrompt.substring(0, 20)}" et les cibles
    const distanceToStar = Math.hypot(this.paddleX - this.starX, this.height - this.starY);
    if (distanceToStar < 30) {
      this.score += 1;
      this.playSound("collect_star.wav");
    }
  }
 
  private renderFrame() {
    // Nettoyer l'affichage avant de repeindre l'arène
    this.ctx.fillStyle = "#020617";
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Rendre l'Univers IA : ${aiPrompt.substring(0, 35)}
    this.drawAvatarSprite(this.character, this.actorX, this.actorY);
    this.drawThrusters();
  }
}`}
                      </pre>
                    </div>

                    <div className="bg-slate-950/45 p-2.5 rounded-xl border border-slate-905 text-[10px] text-slate-500 flex justify-between items-center">
                      <span>💻 Code source TypeScript généré en temps réel d'après ton imagination !</span>
                      <button
                        onClick={() => {
                          const tsCode = `import { PhysicsEngine, Canvas2D } from "@kidiworld/core";

/**
 * 🎮 MINI-JEU CRÉATIF : "${aiPrompt}"
 * Transpilé par KidiWorld-AI Compiler v4.4
 * Paramètres physiques : Gravité=${aiGravity}g, Vitesse=${aiSpeed} FPS
 */
@AIPrototyper({
  prompt: "${aiPrompt.replace(/"/g, '\\"')}",
  gameplay: "${getDerivedGameplayType(aiPrompt)}",
  vibe: "pixel-creativity",
  emoji: "${getPromptEmoji(aiPrompt)}",
  targetScore: 10
})
export class CustomGameEngine extends PhysicsEngine {
  private character = "${aiPrompt.substring(0, 30).replace(/"/g, '\\"')}";
  private gravityConstant = ${aiGravity} * 9.81; 
  private renderSpeedFps = ${aiSpeed}; 
 
  constructor() {
    super();
    this.initCanvas2D();
    console.log("🚀 Lancement du jeu : " + this.character);
  }
}`;
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(tsCode);
                          }
                          triggerToast(language === "fr" 
                            ? "💾 Code source TypeScript copié dans ton presse-papier !" 
                            : "💾 TypeScript Source Code written to clipboard!");
                        }}
                        className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-[9px] px-2 py-1 rounded uppercase pointer-events-auto cursor-pointer"
                      >
                        Copier
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* B. COSMIC CHESS MAT IN 1 PUZZLE */}
      {activeGameCategory === "chess" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-black text-white">♟️ Les Échecs Stellaires : Le Gambit du Cachalot</h3>
            <p className="text-xs text-slate-400">
              Le roi des noirs est acculé au milieu des nébuleuses ! Es-tu capable de trouver le coup fatal de mat en 1 avec la Tour blanche pour gagner des KidiCoins ?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Chess interactive grid design */}
            <div className="max-w-[280px] mx-auto bg-slate-950 p-3 rounded-3xl border border-slate-800">
              <div className="grid grid-cols-4 grid-rows-4 gap-1 font-mono text-center relative">
                {/* 16 cell grid setup */}
                {Array(16).fill(null).map((_, i) => {
                  const row = Math.floor(i / 1);
                  const cell = i % 2 === 0;
                  const isBlackBg = cell;

                  // Define puzzle pieces positioning:
                  // Target Black King is at cell 1 (top-right-ish)
                  // White Rook is at cell 12 (bottom-left-ish)
                  // Correct target square is cell 0 (mat)
                  const isBlackKing = i === 1;
                  const isWhiteRook = i === 12;
                  
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (chessMoveStep === "piece-selected") {
                          handleChessMove(i === 0);
                        }
                      }}
                      className={`h-14 rounded-lg flex items-center justify-center text-xl cursor-pointer relative transition-all duration-300 ${
                        isBlackBg ? "bg-slate-900" : "bg-slate-800"
                      } ${
                        isWhiteRook && chessMoveStep === "not-started" ? "ring-2 ring-amber-500 animate-pulse bg-amber-500/10" : ""
                      } ${
                        isWhiteRook && chessMoveStep === "piece-selected" ? "bg-amber-500/30 text-white" : ""
                      } ${
                        chessMoveStep === "solved" && i === 0 ? "bg-green-500/20 ring-2 ring-green-500 font-bold" : ""
                      } ${
                        chessMoveStep === "failed" && i !== 0 && !isWhiteRook && !isBlackKing ? "bg-rose-500/10 hover:bg-rose-500/20" : ""
                      }`}
                    >
                      {isBlackKing && (
                        <span className="text-2xl select-none" title="Roi Noir">♚</span>
                      )}

                      {isWhiteRook && chessMoveStep !== "solved" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectChessPiece();
                          }}
                          className="text-2xl select-none text-white focus:outline-none focus:scale-110 active:scale-95 transition"
                          title="Tour Blanche (Clique pour lever)"
                        >
                          ♖
                        </button>
                      )}

                      {chessMoveStep === "solved" && i === 3 && (
                        <span className="text-2xl select-none text-emerald-400">♖</span>
                      )}

                      {/* Display coordinates index indicators */}
                      <span className="absolute bottom-1 right-1 text-[8px] text-slate-600 select-none">
                        {String.fromCharCode(65 + (i % 4))}${4 - Math.floor(i / 4)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instruction right block */}
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-left space-y-3">
                <span className="text-[10px] uppercase font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                  Objectif du Puzzle
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  1. Clique sur la <strong>Tour Blanche (♖)</strong> rougeoyante en bas à gauche de ton plateau pour la sélectionner.<br />
                  2. Glisse ou clique sur la case supérieure de destination pour mettre le roi noir hors-jeu (Mat en 1 coup). Le coup gagnant réside sur la colonne A pour étouffer l'adversaire !
                </p>
              </div>

              {chessMoveStep === "not-started" && (
                <div className="p-3 bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 rounded-xl text-xs text-center font-bold">
                  💡 Clique sur la Tour Blanche pour initier le coup !
                </div>
              )}

              {chessMoveStep === "piece-selected" && (
                <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-xs text-center font-bold animate-pulse">
                  🎯 Clique sur la case supérieure gauche (A4) pour porter le coup décisif !
                </div>
              )}

              {chessMoveStep === "solved" && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs space-y-1.5">
                  <strong className="block text-sm">✓ Checkmate ! Magnifique combinatoire !</strong>
                  <p>Tu as sécurisé le périmètre de la constellation d'or. +25 KidiCoins déposés !</p>
                  <button
                    onClick={handleResetChess}
                    className="mt-2 bg-emerald-600 font-bold px-3 py-1 rounded text-[10px] text-slate-950"
                  >
                    Effacer & recommencer
                  </button>
                </div>
              )}

              {chessMoveStep === "failed" && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-xs space-y-1.5">
                  <strong className="block text-sm">❌ Mauvais choix tactique !</strong>
                  <p>Ton adversaire a réussi à esquiver en diagonale. Courage, réessaie !</p>
                  <button
                    onClick={handleResetChess}
                    className="mt-2 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 font-bold px-3 py-1 rounded text-[10px]"
                  >
                    Réessayer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* C. MEMORY CARD MATCH */}
      {activeGameCategory === "memory" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-base font-black text-white">🃏 Combat de Cartes Sidérales (Mémoire)</h3>
              <p className="text-xs text-slate-400">
                Retrouve toutes les paires identiques de l'équipage pour remporter le badge d'attention !
              </p>
            </div>
            <button
              onClick={initMemory}
              className="bg-slate-950 hover:bg-slate-850 py-1.5 px-3 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Réinitialiser
            </button>
          </div>

          {!hasAccessToGame(GAMES_LIST[2]) ? (
            // Premium Locker panel overlay
            <div className="bg-slate-950 p-8 rounded-3xl border border-rose-500/20 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-center justify-center text-rose-400 mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">Activité Premium KidiClub</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ce jeu de memory incubé aux couleurs de LinkYourArt nécessite une clé d'accès de 30 KidiCoins pour être joué.
                </p>
              </div>
              <button
                onClick={() => handlePurchasePremiumGame(GAMES_LIST[2])}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs py-2 px-5 rounded-xl shadow-md transition cursor-pointer"
              >
                Déverrouiller (30 KidiCoins)
              </button>
            </div>
          ) : (
            // Playable Memory Grid
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="grid grid-cols-4 gap-2 max-w-[320px] mx-auto w-full">
                {memoryCards.map((card, idx) => {
                  const isFlipped = selectedIndices.includes(idx) || matchedPairs.includes(card.uniqueId);
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => handleCardClick(idx)}
                      className={`h-16 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 transform select-none cursor-pointer ${
                        isFlipped 
                          ? `${card.color} rotate-y-180 ring-1 ring-white/10` 
                          : "bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800 text-indigo-400 hover:border-indigo-500 hover:-translate-y-0.5"
                      }`}
                    >
                      {isFlipped ? (
                        <span className="scale-[1.15]">{card.text}</span>
                      ) : (
                        <span className="text-lg">✨</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status bar details */}
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-left space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">{language === "fr" ? "Tentatives :" : "Attempts:"}</span>
                    <strong className="text-white">{memoryMoves} {language === "fr" ? "coups" : "moves"}</strong>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">{language === "fr" ? "Trouvées :" : "Matched:"}</span>
                    <strong className="text-emerald-400">{matchedPairs.length / 2} / 6 {language === "fr" ? "paires" : "pairs"}</strong>
                  </div>
                </div>

                {memoryVictory && (
                  <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs space-y-2">
                    <span className="text-lg block">
                      {language === "fr" 
                        ? `🎉 Splendide ! Tu as tout résolu en ${memoryMoves} coups !` 
                        : `🎉 Splendid! Solved in ${memoryMoves} moves!`}
                    </span>
                    <p>
                      {language === "fr" 
                        ? "Félicitations ! 30 KidiCoins ont été ajoutés à ton coffre-fort." 
                        : "Congratulations! +30 KidiCoins have been deposited in your safe."}
                    </p>
                    <button
                      onClick={initMemory}
                      className="bg-emerald-600 font-bold px-4 py-1.5 rounded-xl text-slate-950 cursor-pointer"
                    >
                      {language === "fr" ? "Rejouer une partie" : "Play Again"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* D. KIDI ÉDUCATIF & CLASSICS SECTION */}
      {activeGameCategory === "kidi-educatif" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-emerald-600/25 via-teal-900/15 to-indigo-950/40 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
            <span className="text-[10px] bg-emerald-500/15 font-bold text-emerald-400 px-3 py-1 rounded-full uppercase tracking-wider font-mono border border-emerald-500/25">
              {language === "fr" ? "Académie KidiWorld & Web Libres 🎓" : "KidiWorld Academy & Free Web Classics 🎓"}
            </span>
            <h3 className="text-xl font-black text-white mt-3 tracking-tight">
              {language === "fr" ? "Espace Récréatif Intelligent & Jeux Familiers" : "Smart Creative Zone & Familiar Games"}
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {language === "fr" 
                ? "Travaille tes neurones en t'amusant ! Relève de petites énigmes de mathématiques, entraîne ta mémoire auditive, ou explore notre sélection de jeux cultes de la toile mondiale !"
                : "Unlock your cognitive powers while having fun! Train your musical ear, challenge your math agility, or launch handpicked timeless safe web games!"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Area (2 Columns) - Current Active Edu Game */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              
              {/* Internal Educational Sub-Tabs Switches */}
              <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-800/80">
                <button
                  onClick={() => {
                    setActiveEduGameId("tictactoe");
                    handleResetTtt();
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeEduGameId === "tictactoe"
                      ? "bg-amber-500 text-slate-950 font-black shadow-md"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-850"
                  }`}
                >
                  {language === "fr" ? "🪐 Morpion Étoilé" : "🪐 Cosmic Star Board"}
                </button>
                <button
                  onClick={() => {
                    setActiveEduGameId("simon");
                    setSimonIsPlaying(false);
                    setSimonLitButton(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeEduGameId === "simon"
                      ? "bg-rose-500 text-white font-black shadow-md"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-850"
                  }`}
                >
                  {language === "fr" ? "🎵 Simon Spatial" : "🎵 Space Simon"}
                </button>
                <button
                  onClick={() => {
                    setActiveEduGameId("quiz");
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeEduGameId === "quiz"
                      ? "bg-indigo-500 text-white font-black shadow-md"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-850"
                  }`}
                >
                  {language === "fr" ? "⚖️ Quiz Astronomique" : "⚖️ Astronomy Quiz"}
                </button>
                <button
                  onClick={() => {
                    setActiveEduGameId("math");
                    setMathIsActive(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeEduGameId === "math"
                      ? "bg-emerald-500 text-slate-950 font-black shadow-md animate-pulse"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-850"
                  }`}
                >
                  {language === "fr" ? "🚀 Calculateur de Math comètes" : "🚀 Comet Math Rocket"}
                </button>
              </div>

              {/* GAME PLAY ZONE */}

              {/* 1. Tic Tac Toe */}
              {activeEduGameId === "tictactoe" && (
                <div className="space-y-4 text-center py-2">
                  <div className="flex justify-between items-center max-w-sm mx-auto bg-slate-950 px-4 py-2 rounded-xl border border-slate-850">
                    <div className="text-left font-sans text-xs">
                      <span className="text-slate-500 block">{language === "fr" ? "Moi (🌟)" : "Me (🌟)"}</span>
                      <strong className="text-amber-400 text-sm font-mono">
                        {tttScore.player} {language === "fr" ? "victoires" : "victories"}
                      </strong>
                    </div>
                    <div className="text-right font-sans text-xs">
                      <span className="text-slate-500 block">{language === "fr" ? "Androïde (☄️)" : "Android (☄️)"}</span>
                      <strong className="text-purple-400 text-sm font-mono">
                        {tttScore.ai} {language === "fr" ? "victoires" : "victories"}
                      </strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300">
                    {tttWinner === "draw" && (language === "fr" ? "🤝 Match nul ! Quelle perspicacité !" : "🤝 Draw game! Well calculated!")}
                    {tttWinner === "X" && (language === "fr" ? "🎉 Tu as battu le robot ! Bien joué (+15 KidiCoins) !" : "🎉 You defeated the bot! Great job (+15 KidiCoins)!")}
                    {tttWinner === "O" && (language === "fr" ? "🤖 L'Androïde magique a fait un alignement !" : "🤖 The magical Android aligned 3 planets!")}
                    {!tttWinner && (tttTurn === "X" 
                      ? (language === "fr" ? "👉 C'est ton tour d'aligner trois étoiles (🌟)" : "👉 Your turn to align three shiny stars (🌟)") 
                      : (language === "fr" ? "🤖 L'Androïde réfléchit..." : "🤖 The Android is processing computations..."))}
                  </p>

                  {/* 3x3 Grid Board */}
                  <div className="grid grid-cols-3 gap-3 max-w-[245px] mx-auto pt-2">
                    {tttBoard.map((val, idx) => {
                      return (
                        <button
                          key={idx}
                          onClick={() => handleTttClick(idx)}
                          disabled={!!val || !!tttWinner || tttTurn === "O"}
                          className={`w-[75px] h-[75px] rounded-2xl flex items-center justify-center text-2xl transition transform active:scale-95 cursor-pointer ${
                            val === "X"
                              ? "bg-amber-500/10 border-2 border-amber-500 text-amber-400"
                              : val === "O"
                              ? "bg-purple-500/10 border-2 border-purple-500 text-purple-400 animate-fadeIn"
                              : "bg-slate-950 border border-slate-850 hover:border-slate-700"
                          }`}
                        >
                          {val === "X" && "🌟"}
                          {val === "O" && "☄️"}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleResetTtt}
                    className="mt-4 px-4 py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-200 rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-500" /> {language === "fr" ? "Recommencer la partie" : "Reset Match"}
                  </button>
                </div>
              )}

              {/* 2. Simon Spatial */}
              {activeEduGameId === "simon" && (
                <div className="space-y-4 text-center py-2">
                  <div className="flex justify-between items-center max-w-sm mx-auto bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850">
                    <span className="text-slate-400 text-xs font-semibold">
                      {language === "fr" ? "Note / Étape :" : "Score / Round:"}
                    </span>
                    <strong className="text-rose-400 font-mono text-sm">
                      {simonIsPlaying ? (language === "fr" ? `Étape ${simonRound}` : `Round ${simonRound}`) : (language === "fr" ? "Pas commencé" : "Inactive")}
                    </strong>
                  </div>

                  <p className="text-xs text-slate-300">
                    {!simonIsPlaying && (language === "fr" ? "👉 Clique sur Démarrer et reproduis la suite lumineuse et sonore !" : "👉 Click Start and replicate the glowing cosmic tune sequence!")}
                    {simonIsPlaying && simonIsShowing && (language === "fr" ? "👂 Écoute attentivement la séquence spatiale..." : "👂 Listen closely to the astronomical notes...")}
                    {simonIsPlaying && !simonIsShowing && (language === "fr" ? "👉 À toi de jouer ! Tape la bonne séquence dans l'ordre !" : "👉 Your turn! Hit the panels in the exact same order!")}
                  </p>

                  {/* Gigantic Arcade glowing panels (Red, Blue, Yellow, Green) */}
                  <div className="grid grid-cols-2 gap-4 max-w-[250px] mx-auto pt-3">
                    {simonButtons.map((btn) => {
                      const isLit = simonLitButton === btn.id;
                      return (
                        <button
                          key={btn.id}
                          onClick={() => handleSimonButtonClick(btn.id)}
                          disabled={simonIsShowing || !simonIsPlaying}
                          className={`w-[110px] h-[110px] rounded-3xl transition-all duration-150 transform active:scale-95 relative border border-slate-950 shadow-inner group cursor-pointer ${
                            isLit ? btn.litColor : `${btn.color} opacity-40 hover:opacity-60`
                          }`}
                          title={btn.title}
                        >
                          {/* Beautiful neon core */}
                          <div className="absolute inset-2 bg-black/10 rounded-2xl border border-white/5 flex items-center justify-center text-[10px] font-bold text-white/40 group-hover:text-white/80 uppercase font-mono tracking-wider">
                            ✨
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    {!simonIsPlaying ? (
                       <button
                        onClick={handleStartSimon}
                        className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition flex items-center gap-1.5 mx-auto"
                      >
                         <Play className="w-4 h-4" /> {language === "fr" ? "Démarrer le Défi Simon Spatial" : "Start Space Simon Challenge"}
                      </button>
                    ) : (
                      <button
                        onClick={() => setSimonIsPlaying(false)}
                        className="px-4 py-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs rounded-xl cursor-pointer"
                      >
                        {language === "fr" ? "Abandonner / Reset" : "Abandon Session"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 3. Physics Planet Quiz */}
              {activeEduGameId === "quiz" && (
                <div className="space-y-4 text-left py-2">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 relative space-y-2">
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 px-2 py-0.5 rounded-full inline-block font-mono">
                      Question {quizPlanet + 1} / {planetQuizQuestions.length}
                    </span>
                    <h4 className="text-sm font-black text-white leading-relaxed">
                      {planetQuizQuestions[quizPlanet].question}
                    </h4>
                  </div>

                  {/* Quiz Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {planetQuizQuestions[quizPlanet].choices.map((choice, cIdx) => {
                      const isSelected = quizSelected === cIdx;
                      const isCorrectAnswer = cIdx === planetQuizQuestions[quizPlanet].correctIndex;
                      
                      let choiceStyle = "bg-slate-950 border-slate-850 hover:border-slate-700";
                      if (quizStatus !== "unsolved") {
                        if (isCorrectAnswer) {
                          choiceStyle = "bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 font-bold";
                        } else if (isSelected) {
                          choiceStyle = "bg-rose-500/10 border border-rose-500 text-rose-400 line-through";
                        } else {
                          choiceStyle = "bg-slate-950/40 border-slate-900 opacity-50";
                        }
                      }

                      return (
                        <button
                          key={cIdx}
                          disabled={quizStatus !== "unsolved"}
                          onClick={() => handleQuizAnswer(cIdx)}
                          className={`p-3.5 rounded-xl text-xs text-left transition select-none cursor-pointer flex items-center justify-between gap-1 border ${choiceStyle}`}
                        >
                          <span>{choice}</span>
                          {quizStatus !== "unsolved" && isCorrectAnswer && <span className="text-emerald-400 text-xs">✓ Correct</span>}
                          {quizStatus !== "unsolved" && isSelected && !isCorrectAnswer && <span className="text-rose-400 text-xs">× {language === "fr" ? "Erreur" : "Wrong"}</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {quizStatus !== "unsolved" && (
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-3.5 animate-fadeIn text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        <p className="text-xs text-slate-300 italic font-sans leading-relaxed">
                          {planetQuizQuestions[quizPlanet].explanation}
                        </p>
                      </div>
                      <button
                        onClick={handleNextQuiz}
                        className="w-full md:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs rounded-xl text-white block text-center cursor-pointer transition shadow-md"
                      >
                        {language === "fr" ? "Défi Suivant →" : "Next Question →"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Comet Math Rocket */}
              {activeEduGameId === "math" && (
                <div className="space-y-4 text-center py-2">
                  {mathIsActive ? (
                    <div className="space-y-5 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-slate-950 p-4 rounded-xl border border-slate-850 items-center">
                        <div className="text-left font-mono">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">
                            {language === "fr" ? "⏱️ Horloge" : "⏱️ Timer"}
                          </span>
                          <strong className={`text-base font-black tracking-tight ${mathTimer <= 4 ? "text-rose-400 animate-pulse font-bold" : "text-white"}`}>
                            {mathTimer} {language === "fr" ? "secondes" : "seconds"}
                          </strong>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">🚀 Score</span>
                          <strong className="text-emerald-450 text-base font-black">
                            {mathScore} {language === "fr" ? "comètes" : "comets"}
                          </strong>
                        </div>
                      </div>

                      {/* Floating rocket background visual */}
                      <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-50 blur-xl rounded-full" />
                        <span className="text-xs font-mono uppercase text-slate-500 tracking-widest block">
                          {language === "fr" ? "Équation cosmique active" : "Active Cosmic Equation"}
                        </span>
                        <h3 className="text-3xl font-black text-white tracking-wider font-mono">
                          {mathNum1} {mathOp === "*" ? "×" : mathOp} {mathNum2} = ?
                        </h3>
                      </div>

                      {/* Math Selection buttons */}
                      <div className="flex justify-center gap-3">
                        {mathChoices.map((choice) => (
                          <button
                            key={choice}
                            onClick={() => handleMathChoiceClick(choice)}
                            className="w-[70px] h-[60px] rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-lg font-black text-amber-400 hover:text-slate-950 hover:bg-emerald-500 shadow-md transition transform active:scale-95 cursor-pointer flex items-center justify-center font-mono"
                          >
                            {choice}
                          </button>
                        ))}
                      </div>

                      <p className="text-[10px] text-slate-500 leading-normal">
                        {language === "fr" 
                          ? "Chaque bonne réponse Boost de 5 secondes l'horloge et te rapporte 5 KidiCoins !"
                          : "Each correct calculation adds 5 seconds to the timer and grants 5 KidiCoins!"}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-950/80 p-8 rounded-3xl border border-slate-800 text-center max-w-md mx-auto space-y-4">
                      <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto text-xl">
                        🧮
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-black text-white">
                          {language === "fr" ? "L'Énigme du Calculateur de Comètes" : "The Comet Math Equation Challenge"}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {language === "fr"
                            ? "Prépare tes fusées en résolvant le plus de calculs de mathématiques simples en moins de 15 secondes."
                            : "Warm up your space shuttles by solving as many simple calculations as possible in less than 15 seconds."}
                        </p>
                      </div>
                      <button
                        onClick={handleStartMath}
                        className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-xs py-2 px-5 rounded-xl shadow-md transition cursor-pointer"
                      >
                        {language === "fr" ? "Lancer le Booster Math (+5 KidiCoins par réponse !)" : "Launch Math Booster (+5 KidiCoins per answer!)"}
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Right Area (1 Column) - Free Web Familiars Library (La Toile Mondiale) */}
            <div className="lg:col-span-1 bg-slate-900 border border-slate-900/60 rounded-3xl p-5 space-y-4 shadow-xl text-left relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="pb-3 border-b border-indigo-950">
                  <span className="text-[9px] bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 font-extrabold px-2.5 py-0.5 rounded-full block tracking-wide uppercase font-mono w-max">
                    {language === "fr" ? "🌐 Jeux Libres Mondiaux" : "🌐 Free Global Web Games"}
                  </span>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans mt-2">
                    {language === "fr" ? "Ludo-Bibliothèque Célèbre" : "World Famous Web Library"}
                  </h3>
                  <p className="text-[9px] text-slate-400 leading-relaxed mt-1">
                    {language === "fr" 
                      ? "Retrouve des classiques familiers gratuits de la toile disponibles immédiatement pour jouer sans quitter ton école !"
                      : "Enjoy these world-famous classic free familiar safety games of our beautiful planet instantly!"}
                  </p>
                </div>

                {/* Simulated list of top familiar game containers with links */}
                <div className="space-y-3">
                  {[
                    {
                      name: "👾 Pac-Man Retro Arcade",
                      url: "https://free-pacman.org",
                      desc: language === "fr" 
                        ? "Échappe aux fantômes de comètes dans un labyrinthe rétro mythique." 
                        : "Dodge comet ghosts in the world-famous classic retro neon labyrinth.",
                      tag: language === "fr" ? "Gratuit Mondial" : "Free Worldwide",
                      bg: "from-amber-500/5 to-slate-950"
                    },
                    {
                      name: "🚀 Asteroids Physics",
                      url: "https://playclassic.games/games/retro-arcade-games-online/play-asteroids-online/play/",
                      desc: language === "fr" 
                        ? "Dirige ton petit engin spatial triangulaire et explose les débris de krypton." 
                        : "Steer and thrust your retro spacecraft to blast incoming magnetic meteorites.",
                      tag: language === "fr" ? "Classique Web" : "Web Retro Legacy",
                      bg: "from-blue-500/5 to-slate-950"
                    },
                    {
                      name: "🧱 Cosmic Tetris Quad",
                      url: "https://tetris.com/play-tetris",
                      desc: language === "fr" 
                        ? "Forme des briques géométriques pour éviter que ton terminal ne déborde !" 
                        : "Align space bricks logically with gravity to maintain terminal sanity!",
                      tag: language === "fr" ? "Logique Céleste" : "Mind Agility",
                      bg: "from-purple-500/5 to-slate-950"
                    },
                    {
                      name: "🐍 Snake Spatial",
                      url: "https://google.com/search?q=play+snake",
                      desc: language === "fr" 
                        ? "Le jeu du serpent familier ! Grandis en récoltant de la bio-luminiscence." 
                        : "The beloved retro worm! Grow longer by consuming sparkling star fuels.",
                      tag: language === "fr" ? "Réflexes" : "Fast Coordination",
                      bg: "from-emerald-500/5 to-slate-950"
                    }
                  ].map((gameLib) => (
                    <div
                      key={gameLib.name}
                      className={`p-3 rounded-2xl border border-slate-900 bg-gradient-to-r ${gameLib.bg} hover:border-slate-800 transition relative flex flex-col justify-between space-y-2`}
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-indigo-400 font-mono">
                            {gameLib.tag}
                          </span>
                          <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/5 px-1.5 py-0.5 rounded">
                            {language === "fr" ? "Disponible" : "Ready to Play"}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-white">{gameLib.name}</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          {gameLib.desc}
                        </p>
                      </div>

                      <a
                        href={gameLib.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-slate-950 hover:bg-emerald-500 hover:text-slate-950 border border-slate-800 text-slate-300 transition text-[9px] font-black py-1 rounded-xl text-center select-none block"
                      >
                        {language === "fr" ? "Jouer Gratuitement en plein écran ↗" : "Play Free Fullscreen ↗"}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 bg-slate-950 p-3 rounded-2xl border border-slate-850 flex items-center gap-2 mt-4">
                <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-[9px] text-slate-400 font-sans leading-snug">
                  {language === "fr" 
                    ? "Tous les jeux mondiaux répertoriés sont garantis kid-safe, sans achats intégrés forcés, ni pistages publicitaires."
                    : "All world-famous classic items listed are strictly safe for kids, with no credit card requirements or trackers."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Safe GameToast Notification Overlay */}
      {gameToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/50 p-3 rounded-2xl shadow-2xl flex items-center gap-3 font-sans text-xs max-w-sm">
          <div className={`p-2 rounded-xl text-white font-bold leading-none shrink-0 ${gameToast.type === 'warning' ? 'bg-amber-600' : 'bg-emerald-600'}`}>
            {gameToast.type === 'warning' ? '⚠️' : '🏆'}
          </div>
          <div className="text-left">
            <span className="font-extrabold text-slate-100 block text-[10.5px]">Alerte KidiWorld</span>
            <p className="text-slate-300 font-medium text-[10px] mt-0.5 leading-snug">{gameToast.message}</p>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Supprimer ce projet ?"
        message="Cette action est irréversible. Ton projet sera définitivement supprimé de l'espace de travail."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={confirmDeleteProject}
        onCancel={() => setConfirmModal({ isOpen: false, projectId: null })}
      />
    </div>
  );
}

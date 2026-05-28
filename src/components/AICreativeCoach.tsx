import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, Bot, User, Wand, Film, Music as MusicIcon, X, Minimize2, Maximize2, ChevronDown } from "lucide-react";
import { Message } from "../types";

interface AICreativeCoachProps {
  challengeTitle: string;
  unlockedClues: string[];
  draftScreenplay?: { title: string; act1: string; act2: string; act3: string };
  draftMusic?: any;
  draftCostume?: any;
}

export type CoachType = "linky" | "jerome" | "hans";

export default function AICreativeCoach({
  challengeTitle,
  unlockedClues,
  draftScreenplay,
  draftMusic,
  draftCostume,
}: AICreativeCoachProps) {
  const [activeCoach, setActiveCoach] = useState<CoachType>("linky");
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState<number | null>(null);

  const coaches = {
    linky: {
      name: "Linky 🚀",
      role: "Coach Mascot Céleste",
      avatar: "🪐",
      desc: "Création fantastique & humour spatial",
      hello: "Salut jeune prodige ! Je suis Linky, ton coach robotique KIDIWORLD. 🚀\n\nTu participes au défi ? Je suis là pour t'aider à associer nos indices stellaires et libérer ton imagination ! De quoi veux-tu parler au jury aujourd'hui ?"
    },
    jerome: {
      name: "Jérôme Salle 🎬",
      role: "Parrain Réalisateur Pro",
      avatar: "🎬",
      desc: "Conseils de cadrage, rythme & suspense",
      hello: "Bonjour l'artiste ! C'est Jérôme Salle. Un bon film d'animation ou screenplay commence par un plan puissant. Dis-moi, comment avance ta structure de l'Acte I ?"
    },
    hans: {
      name: "Hans Zimmer 🎼",
      role: "Parrain Compositeur",
      avatar: "🎹",
      desc: "Atmosphères cosmiques & Sound Design",
      hello: "Salutations musicales. L'harmonie traduit les silences de l'espace en émotions. Quel type de mélodie souhaites-tu composer pour accompagner ton astronaute ?"
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "coach",
      text: coaches.linky.hello,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Switch Mentor personality & greeting
  const handleSwitchCoach = (coachKey: CoachType) => {
    setActiveCoach(coachKey);
    // Cancel sound
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingSpeech(null);

    setMessages([
      {
        role: "coach",
        text: coaches[coachKey].hello,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    ]);
  };

  // Text-to-Speech function
  const speakText = (textToSpeak: string, msgIndex: number) => {
    if ("speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if (isPlayingSpeech === msgIndex) {
          setIsPlayingSpeech(null);
          return;
        }
      }

      // Strip emojis from reading out to prevent robotic string explanations
      const cleanText = textToSpeak.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "fr-FR";

      if (activeCoach === "linky") {
        utterance.pitch = 1.35; // high futuristic robot voice
        utterance.rate = 1.05;
      } else if (activeCoach === "jerome") {
        utterance.pitch = 0.95; // professional human
        utterance.rate = 0.95;
      } else {
        utterance.pitch = 0.85; // deep resonance
        utterance.rate = 0.9;
      }

      utterance.onend = () => {
        setIsPlayingSpeech(null);
      };
      utterance.onerror = () => {
        setIsPlayingSpeech(null);
      };

      setIsPlayingSpeech(msgIndex);
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis API is not supported in this frame context.");
    }
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");

    const newMsg: Message = {
      role: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    // Build context to assist Gemini with children creation
    const context = {
      challengeTitle,
      cluesRevealed: unlockedClues,
      currentClue: unlockedClues[unlockedClues.length - 1] || "Libre création",
      draft: `Scénario: ${draftScreenplay?.title || "Sans titre"}. Acte 1: ${draftScreenplay?.act1?.slice(0, 150) || ""}. Musique: ${draftMusic?.lyrics?.slice(0, 100) || ""}. Costume: ${draftCostume?.name || ""}.`,
    };

    try {
      // API request to server-side Gemini 3.5 Flash endpoint
      const response = await fetch("/api/gemini/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userText,
          context,
          history: messages.slice(-10).map((m) => ({
            role: m.role === "user" ? "user" : "model",
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur de communication avec le serveur.");
      }

      const data = await response.json();
      const coachText = data.text;

      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: coachText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (error) {
      console.error("Coach API error:", error);
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: "Oups ! Un orage électromagnétique dans la nébuleuse perturbe notre connexion. Dis-moi, as-tu déjà bien intégré tous les mots clés dans ton scénario ?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Preset smart questions to guide youth
  const smartQuestions = [
    "Aide-moi à commencer l'Acte I !",
    "Comment insérer l'androïde buggé ?",
    "Idées pour le costume de l'astronaute ?",
    "Écris-moi une rime sur le cachalot",
  ];

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[100] group flex items-center gap-3 pl-4 pr-5 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 shadow-2xl shadow-violet-900/50 transition-all duration-300 hover:scale-105 active:scale-95 border border-violet-400/20"
          style={{ animation: "floatPulse 3s ease-in-out infinite" }}
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-violet-600 animate-pulse" />
          </div>
          <div className="text-left">
            <div className="text-white font-black text-sm leading-none">Coach Linky</div>
            <div className="text-violet-300 text-[10px] font-medium mt-0.5">Ton mentor IA 🚀</div>
          </div>
          <span className="ml-1 text-[18px] animate-bounce">💬</span>
        </button>
      )}

      {/* Floating chat window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-[100] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.7)] transition-all duration-300 overflow-hidden ${
            isExpanded
              ? "w-[560px] h-[680px]"
              : "w-[380px] h-[540px]"
          }`}
        >
          {/* Titlebar */}
          <div className="bg-gradient-to-r from-violet-900/80 via-indigo-900/80 to-violet-900/80 border-b border-violet-800/40 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center shadow-lg relative shrink-0">
                {activeCoach === "linky" ? (
                  <Bot className="w-4 h-4 text-white animate-pulse" />
                ) : activeCoach === "jerome" ? (
                  <Film className="w-4 h-4 text-white" />
                ) : (
                  <MusicIcon className="w-4 h-4 text-white" />
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900" />
              </div>
              <div>
                <div className="text-white font-black text-sm leading-none flex items-center gap-2">
                  {coaches[activeCoach].name}
                  <span className="text-[9px] uppercase font-mono bg-violet-500/20 text-violet-300 border border-violet-500/20 px-1.5 py-0.5 rounded">Mentor IA</span>
                </div>
                <div className="text-[10px] text-violet-300/80 mt-0.5">{coaches[activeCoach].desc}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-7 h-7 rounded-lg bg-slate-800/60 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
                title={isExpanded ? "Réduire" : "Agrandir"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800/60 hover:bg-rose-500/80 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
                title="Fermer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mentor selector */}
          <div className="bg-slate-950/80 px-3 py-2 border-b border-slate-800/60 flex items-center gap-1.5 shrink-0">
            <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest shrink-0">Parrain :</span>
            <div className="flex gap-1.5 flex-1">
              {(Object.keys(coaches) as CoachType[]).map((coachKey) => {
                const isActive = activeCoach === coachKey;
                const c = coaches[coachKey];
                return (
                  <button
                    key={coachKey}
                    onClick={() => handleSwitchCoach(coachKey)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer flex-1 justify-center ${
                      isActive
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>{c.avatar}</span>
                    <span className="hidden sm:inline">{c.name.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/60 font-sans">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "coach" && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center shrink-0 mt-0.5 shadow-md text-sm">
                    {coaches[activeCoach].avatar}
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[11.5px] leading-relaxed font-sans shadow-md ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm"
                    : "bg-slate-800/80 text-slate-200 rounded-bl-sm border border-slate-700/40"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-[9px] mt-1 ${msg.role === "user" ? "text-violet-300" : "text-slate-500"}`}>{msg.timestamp}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center shrink-0 text-sm">
                  {coaches[activeCoach].avatar}
                </div>
                <div className="bg-slate-800/80 border border-slate-700/40 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Smart questions */}
          <div className="px-3 py-2 bg-slate-950/70 border-t border-slate-800/40 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {smartQuestions.map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="whitespace-nowrap text-[9.5px] px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition cursor-pointer font-bold shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="px-3 py-3 bg-slate-950/80 border-t border-slate-800/60 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Écris à ${coaches[activeCoach].name.split(" ")[0]}...`}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 flex items-center justify-center transition cursor-pointer shadow-lg shadow-violet-900/30 active:scale-95"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes floatPulse {
          0%, 100% { transform: translateY(0px); box-shadow: 0 20px 60px rgba(109,40,217,0.5); }
          50% { transform: translateY(-4px); box-shadow: 0 28px 70px rgba(109,40,217,0.65); }
        }
      `}</style>
    </>
  );
}

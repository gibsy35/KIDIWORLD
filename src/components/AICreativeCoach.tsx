import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, Smile, Bot, VolumeX, Volume2, User, Wand, Film, Music as MusicIcon, AudioLines } from "lucide-react";
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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[545px]">
      {/* Mentor Selection Row */}
      <div className="bg-slate-950 p-2.5 border-b border-slate-900/80 flex items-center justify-between gap-1.5 overflow-x-auto select-none shrink-0 scrollbar-none">
        <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest pl-1 shrink-0">Sélectionne Ton Parrain :</span>
        <div className="flex gap-1.5">
          {(Object.keys(coaches) as CoachType[]).map((coachKey) => {
            const isActive = activeCoach === coachKey;
            const c = coaches[coachKey];
            return (
              <button
                key={coachKey}
                onClick={() => handleSwitchCoach(coachKey)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10.5px] font-bold transition cursor-pointer ${
                  isActive 
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-900/20"
                    : "bg-slate-900 border border-slate-850 text-slate-400 hover:text-white"
                }`}
              >
                <span>{c.avatar}</span>
                <span>{c.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Header Info */}
      <div className="bg-slate-950/70 p-3 border-b border-slate-800/80 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center shadow-lg relative shrink-0">
            {activeCoach === "linky" ? (
              <Bot className="w-5 h-5 text-white animate-pulse" />
            ) : activeCoach === "jerome" ? (
              <Film className="w-5 h-5 text-white" />
            ) : (
              <MusicIcon className="w-5 h-5 text-white" />
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-black text-white flex items-center gap-1 leading-none">
              {coaches[activeCoach].name} 
              <span className="text-[9px] uppercase font-mono bg-violet-500/10 text-violet-400 border border-violet-500/25 px-1.5 py-0.25 rounded">Mentor IA</span>
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold leading-normal mt-0.5">{coaches[activeCoach].desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
          <span className="text-[9.5px] font-mono font-bold text-amber-400 tracking-wider">LINKYOURART SPONSOR</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/60 font-sans">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role !== "user" && (
              <div className="w-8 h-8 rounded-lg bg-violet-600/15 flex items-center justify-center text-violet-400 self-end border border-violet-600/20 shrink-0">
                {activeCoach === "linky" ? <Bot className="w-4 h-4" /> : activeCoach === "jerome" ? <Film className="w-4 h-4" /> : <MusicIcon className="w-4 h-4" />}
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-xs text-left leading-relaxed shadow-md relative ${
                msg.role === "user"
                  ? "bg-violet-600 text-white rounded-br-none"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none font-medium whitespace-pre-line"
              }`}
            >
              {msg.text}
              <div className="flex justify-between items-center gap-4 mt-1.5 border-t border-slate-800/20 pt-1">
                <span className={`text-[9px] block opacity-60 font-mono`}>{msg.timestamp}</span>
                {msg.role !== "user" && (
                  <button
                    type="button"
                    onClick={() => speakText(msg.text, index)}
                    className="text-[10px] flex items-center gap-1 text-violet-400 hover:text-violet-300 font-bold pointer-events-auto cursor-pointer"
                    title="Lire à haute voix"
                  >
                    {isPlayingSpeech === index ? (
                      <>
                        <AudioLines className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                        <span className="text-amber-400 text-[9px] font-semibold">Lecture...</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-semibold">Écouter</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-indigo-600/15 flex items-center justify-center text-indigo-400 self-end border border-indigo-600/20 shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-8 h-8 rounded-lg bg-violet-600/15 flex items-center justify-center text-violet-400 self-end border border-violet-600/20 shrink-0">
              {activeCoach === "linky" ? <Bot className="w-4 h-4" /> : activeCoach === "jerome" ? <Film className="w-4 h-4" /> : <MusicIcon className="w-4 h-4" />}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 rounded-bl-none max-w-[80%]">
              <div className="flex gap-1.5 justify-center items-center py-1 px-2">
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested fast buttons for younger users */}
      <div className="bg-slate-950 p-2 border-t border-slate-900 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0">
        {smartQuestions.map((q, idx) => (
          <button
            key={idx}
            disabled={isTyping}
            onClick={() => {
              setInput(q);
            }}
            className="text-[10px] font-bold bg-slate-900 hover:bg-slate-800 active:bg-slate-800 text-violet-300 border border-violet-850/20 px-3 py-1.5 rounded-full transition shrink-0 pointer-events-auto cursor-pointer"
          >
            💡 {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="bg-slate-950 p-3 border-t border-slate-900 flex gap-2 shrink-0 font-sans">
        <input
          type="text"
          placeholder={`Pose une question à ${activeCoach === "linky" ? "Linky" : activeCoach === "jerome" ? "Jérôme" : "Hans"}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          className="flex-1 bg-slate-900 border border-slate-800 text-xs px-3.5 py-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="bg-violet-600 hover:bg-violet-500 active:scale-95 text-white p-2.5 rounded-xl shadow transition disabled:opacity-40 pointer-events-auto cursor-pointer select-none"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

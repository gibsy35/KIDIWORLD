import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, X, Heart, Star, Send, Volume2, Sparkles, Minimize2, Award, Tv, MessageSquare } from "lucide-react";
import { StreamItem } from "../types";
import { t } from "../utils/i18n";

interface KidiStreamPlayerProps {
  item: StreamItem;
  onClose: () => void;
  language: "fr" | "en";
  likesCount: number;
  onLike: (id: string) => void;
  playCelebration: () => void;
}

export default function KidiStreamPlayer({
  item,
  onClose,
  language,
  likesCount,
  onLike,
  playCelebration,
}: KidiStreamPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(42); // start in middle
  const [duration] = useState(210); // 3:30 duration
  const [volume, setVolume] = useState(75);
  const [videoFilter, setVideoFilter] = useState<"standard" | "cyber" | "vintage" | "monochrome">("standard");
  const [hasLiked, setHasLiked] = useState(false);
  const [hasVotedStars, setHasVotedStars] = useState(false);

  // Comments Log State
  const [comments, setComments] = useState<{ id: string; author: string; text: string; time: string; isCoach?: boolean }[]>([
    { id: "1", author: "Jésus Lalumière (Coach LinkYourArt)", text: "Une approche créative ébouriffante ! On sent l'influence du space-opera historique.", time: "Il y a 2h", isCoach: true },
    { id: "2", author: "Alizée_Space", text: "Trop cool Poulpy ! J'adore les nuances dorées.", time: "Il y a 4h" },
    { id: "3", author: "Jules_Gamer", text: "Est-ce qu'on peut jouer la bande son sur Roblox ?", time: "Il y a 1j" },
  ]);
  const [newCommentText, setNewCommentText] = useState("");

  // Web Audio Synth references for live cosmic music
  const audioCtxRef = useRef<AudioContext | null>(null);
  const loopTimerRef = useRef<any>(null);

  // Formatting time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Sound generator parameters (synthesizing a genuine ambient space arpeggio when playing)
  const [synthesizerStep, setSynthesizerStep] = useState(0);

  useEffect(() => {
    // Progress bar runner
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
        setSynthesizerStep((prev) => (prev + 1) % 6);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Audio synthesizer player helper loop to make actual audio feedback
  useEffect(() => {
    if (isPlaying && volume > 0) {
      // Lazy init AudioContext on child click block to bypass browser strict autoplay constraints
      const playSpaceSine = () => {
        try {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          const ctx = audioCtxRef.current;
          if (ctx.state === "suspended") {
            ctx.resume();
          }
          
          const now = ctx.currentTime;
          const notes = [
            261.63, // C4
            293.66, // D4
            329.63, // E4
            392.00, // G4
            440.00, // A4
            523.25, // C5
          ];
          const chosenNote = notes[synthesizerStep % notes.length];
          
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          // Ambient pulse instrument
          osc.type = item.mediaType === "music" ? "triangle" : "sine";
          osc.frequency.setValueAtTime(chosenNote, now);
          
          // Soft volume scaling with user preferences slider
          const volFactor = volume / 100;
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.08 * volFactor, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.85);
        } catch (e) {
          console.warn("Muted background synth:", e);
        }
      };

      // Trigger chord notes every second
      playSpaceSine();
    }
  }, [synthesizerStep, isPlaying, volume, item.mediaType]);

  // Clean up audio context
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Submit Comments
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const userComment = {
      id: `comment-${Date.now()}`,
      author: "Toi (Jeune Talent)",
      text: newCommentText.trim(),
      time: "A l'instant",
    };

    setComments((prev) => [...prev, userComment]);
    setNewCommentText("");
    playCelebration(); // light up confetti on commenting!

    // Simulated magical AI coach feedback within 1.5 seconds to guide children interactively
    setTimeout(() => {
      setComments((prev) => [
        ...prev,
        {
          id: `comment-coach-${Date.now()}`,
          author: "Jury LinkYourArt ⭐ Autocoach",
          text: `Incroyable partage d'idée ! Notre lutherie de codage valide ton avis. Continue d'alimenter le KidiStream avec tes propres projets de Mon Studio !`,
          time: "Il y a quelques secondes",
          isCoach: true,
        },
      ]);
      playCelebration();
    }, 1500);
  };

  const triggerLikeChange = () => {
    if (!hasLiked) {
      setHasLiked(true);
      onLike(item.id);
      playCelebration();
    }
  };

  const triggerStarsVote = () => {
    if (!hasVotedStars) {
      setHasVotedStars(true);
      playCelebration();
      // Shoot double confetti for premium stars feedback
      setTimeout(playCelebration, 300);
      alert("⭐ Splendide ! Tu as attribué 5 Stars galactiques à cet artiste. Son classement a été rehaussé instantanément !");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh] lg:max-h-[85vh]">
        
        {/* LEFT COMPONENT: CINEMATIC SCREEN & PLAYER WRAPPER */}
        <div className="flex-1 bg-black relative flex flex-col justify-between overflow-hidden group min-h-[300px] lg:min-h-0">
          
          {/* Top overlay navigation bar */}
          <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 to-transparent p-4 flex justify-between items-center z-20">
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div className="text-left">
                <span className="text-[9px] text-indigo-400 font-mono font-bold tracking-widest block uppercase">
                  {item.category}
                </span>
                <span className="text-xs font-black text-slate-100 font-sans block truncate max-w-[200px] md:max-w-xs">
                  {item.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-indigo-505/15 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-400/10">
                ACTIVE CODES
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                title="Quitter le Lecteur"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CINEMATIC VIEWPORT CANVAS SCREEN */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-slate-950 px-4">
            
            {/* Visual background artwork using the banner */}
            <div className="absolute inset-0 z-0">
              <img
                src={item.banner}
                alt={item.title}
                className={`w-full h-full object-cover opacity-35 transition-all duration-300 ${
                  videoFilter === "cyber" ? "hue-rotate-90 saturate-200 contrast-125" :
                  videoFilter === "vintage" ? "sepia saturate-150 contrast-85" :
                  videoFilter === "monochrome" ? "grayscale contrast-125" : ""
                }`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
            </div>

            {/* Simulated interactive elements based on category */}
            <div className="relative z-10 w-full max-w-md py-12 text-center pointer-events-none select-none">
              
              {item.mediaType === "cinema" && (
                <div className="space-y-4">
                  {/* Decorative film dust-overlay lines */}
                  <div className="absolute top-2 left-1/3 w-0.5 h-full bg-indigo-500/10 animate-pulse" />
                  <div className="absolute top-0 right-1/4 w-px h-full bg-white/5" />

                  {/* High quality dynamic scroll subtitles */}
                  <div className="bg-slate-950/80 border border-indigo-900/30 p-4 rounded-2xl md:min-h-[100px] text-center shadow-lg transition-transform duration-300 scale-95 md:scale-100 flex items-center justify-center">
                    <p className="text-amber-400 text-xs md:text-sm font-bold leading-relaxed whitespace-pre-line font-mono">
                      {item.contentSnippet.act1 || "BASTIEN: Le grand harpon cosmique est ancré !\nL'ANDROÏDE: Bip-bop... Alerte de chants abyssaux !"}
                    </p>
                  </div>
                  <span className="text-[10px] bg-red-600/25 text-red-400 font-mono px-2 py-0.5 rounded font-black border border-red-500/10">
                    🔴 LÉGENDE DE SCRIPT ACTIVE
                  </span>
                </div>
              )}

              {item.mediaType === "music" && (
                <div className="space-y-4">
                  {/* REAL-TIME SIMULATED REACTIVE BAND SPECTRUM */}
                  <div className="flex items-end justify-center gap-1.5 h-20">
                    {Array(15).fill(null).map((_, i) => {
                      const randHeight = isPlaying ? Math.abs(Math.sin((synthesizerStep * 2 + i) * 0.7)) * 100 : 15;
                      return (
                        <div
                          key={i}
                          style={{ height: `${Math.max(randHeight, 15)}%` }}
                          className={`w-2 rounded-t-full transition-all duration-300 ${
                            i % 3 === 0 ? "bg-pink-500" : i % 2 === 0 ? "bg-indigo-505" : "bg-cyan-400"
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-2xl md:min-h-[80px] text-center shadow-lg flex items-center justify-center">
                    <p className="text-indigo-300 text-center text-xs tracking-wide leading-relaxed italic font-mono font-medium">
                      "{item.contentSnippet.lyrics || "Dans la nébuleuse d'Or chantent les cachalots..."}"
                    </p>
                  </div>
                  <span className="text-[10px] bg-indigo-600/35 text-indigo-300 font-mono px-2 py-0.5 rounded font-black animate-pulse">
                    🔊 SYNTHÉTISATEUR COSMIC INTÉGRÉ ACTIF
                  </span>
                </div>
              )}

              {item.mediaType !== "cinema" && item.mediaType !== "music" && (
                <div className="space-y-4">
                  {/* Holographic costume styler widget with rotation ring */}
                  <div className="relative w-40 h-40 mx-auto rounded-full border-2 border-dashed border-indigo-500/40 flex items-center justify-center animate-spin" style={{ animationDuration: "35s" }}>
                    <div className="w-32 h-32 rounded-full border border-indigo-505/20 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-900 p-3 rounded-xl max-w-xs mx-auto text-center text-[10px] text-slate-300 font-mono">
                    🤖 HOLOGRAMME VECTORIEL PARTICULIER 3D
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* LOWER CINEMATIC PLAYER OPTIONS & MEDIA BAR */}
          <div className="bg-gradient-to-t from-black via-black/90 to-transparent p-4 md:p-6 space-y-4 z-10">
            
            {/* Range Scrubber Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span className="text-slate-500">MÉDIA DIRECT</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-amber-400 transition"
              />
            </div>

            {/* Controls panel */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              
              {/* Left keys for action playback */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-white hover:bg-amber-400 text-slate-950 flex items-center justify-center transition shadow-md hover:scale-105 transform cursor-pointer"
                  title={isPlaying ? "Mettre en Pause" : "Lancer la lecture"}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                </button>

                <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-900/40 border border-slate-800 rounded-xl">
                  <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-16 h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-300"
                    title="Ajuster le synthétiseur"
                  />
                </div>
              </div>

              {/* Filters selector for Cinema category */}
              <div className="flex items-center gap-1.5 bg-slate-900/40 border border-slate-800 p-1 rounded-xl">
                <span className="text-[8.5px] text-slate-500 font-mono font-bold px-1 hidden sm:inline">FILTRE :</span>
                {["standard", "cyber", "vintage", "monochrome"].map((filt) => (
                  <button
                    key={filt}
                    onClick={() => setVideoFilter(filt as any)}
                    className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-bold uppercase transition scale-90 ${
                      videoFilter === filt
                        ? "bg-indigo-600 text-white"
                        : "text-slate-500 hover:text-slate-300 bg-slate-950/30"
                    }`}
                  >
                    {filt}
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT COMPONENT: SOCIAL PANEL AND COMMENT BOARD */}
        <div className="w-full lg:w-[360px] bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800/80 p-5 md:p-6 flex flex-col justify-between max-h-[40vh] lg:max-h-none overflow-y-auto">
          
          <div className="space-y-4">
            
            {/* Header creator block */}
            <div className="text-left space-y-1">
              <div className="flex justify-between items-start gap-3">
                <h3 className="text-base font-black text-white leading-tight font-sans">
                  {item.title}
                </h3>
              </div>
              <span className="text-xs text-slate-400 block font-medium">
                Par <span className="text-indigo-400 font-extrabold">{item.author} ({item.authorAge} ans)</span>
              </span>
              <p className="text-[11.5px] text-slate-400 leading-relaxed font-semibold italic pt-1">
                "{item.description}"
              </p>
            </div>

            {/* Quick interactive action boxes to support and gain Stars */}
            <div className="grid grid-cols-2 gap-3.5 py-2">
              <button
                onClick={triggerLikeChange}
                className={`p-3 rounded-2xl border transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                  hasLiked 
                    ? "bg-pink-650/10 border-pink-500/40 text-pink-400" 
                    : "bg-slate-900 border-slate-805 text-slate-400 hover:text-white hover:bg-slate-850"
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? "fill-pink-500 text-pink-500" : ""}`} />
                <span className="text-[11px] font-mono font-extrabold uppercase">
                  {likesCount + (hasLiked ? 1 : 0)} LIKES
                </span>
              </button>

              <button
                onClick={triggerStarsVote}
                className={`p-3 rounded-2xl border transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                  hasVotedStars 
                    ? "bg-amber-550/10 border-amber-400/40 text-amber-400" 
                    : "bg-slate-900 border-slate-805 text-slate-400 hover:text-white hover:bg-slate-850"
                }`}
                disabled={hasVotedStars}
              >
                <Star className={`w-4 h-4 ${hasVotedStars ? "fill-amber-400 text-amber-400" : ""}`} />
                <span className="text-[11px] font-mono font-extrabold uppercase">
                  {hasVotedStars ? "VOTÉ !" : "VOTER ACCAD"}
                </span>
              </button>
            </div>

            {/* Coach Jury Official Comment */}
            <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl text-left space-y-1.5 shadow-inner">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[10.5px]">
                <Award className="w-3.5 h-3.5" />
                <span>RÉCOMPENSE OFFICIELLE DU JURY :</span>
              </div>
              <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                "{item.feedback}"
              </p>
            </div>

            {/* Live Comment list header */}
            <div className="text-left pt-2">
              <span className="text-[10.5px] text-slate-500 uppercase font-mono font-bold tracking-wider block">
                💬 Discussion Communautaire ({comments.length})
              </span>

              {/* Scrollable list of comments */}
              <div className="space-y-3 mt-3 max-h-[160px] lg:max-h-[220px] overflow-y-auto pr-1">
                {comments.map((comm) => (
                  <div key={comm.id} className="text-xs space-y-0.5 border-b border-slate-900/60 pb-2">
                    <div className="flex justify-between items-center">
                      <strong className={`font-mono text-[10.5px] ${comm.isCoach ? "text-amber-400 font-black animate-pulse" : "text-slate-300"}`}>
                        {comm.author}
                      </strong>
                      <span className="text-[9.5px] text-slate-500">{comm.time}</span>
                    </div>
                    <p className="text-slate-400 leading-normal text-[11px] font-medium font-sans">
                      {comm.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Form to post a direct comment comments */}
          <form onSubmit={handleAddComment} className="pt-4 border-t border-slate-900 mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Écris ton commentaire d'artiste..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            />
            <button
              type="submit"
              className="w-9 h-9 bg-indigo-650 hover:bg-indigo-650/80 text-white rounded-xl flex items-center justify-center cursor-pointer hover:scale-[1.03] transition-all"
              title="Envoyer mon avis"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}

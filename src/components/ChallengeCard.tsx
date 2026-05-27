import React from "react";
import { Challenge } from "../types";
import TranslatedText from "./TranslatedText";
import { ChevronRight, Award, Sparkles, AlertCircle, ArrowRight, User } from "lucide-react";

export interface ChallengeCardProps {
  key?: React.Key;
  challenge: Challenge;
  isActive: boolean;
  language: "fr" | "en" | "es" | "ja";
  onSelect: (challengeId: string) => void;
}

export default function ChallengeCard({
  challenge,
  isActive,
  language,
  onSelect,
}: ChallengeCardProps) {
  const subCount = challenge.submissions?.length || 0;
  
  // Discover and display the main professional reward/prize
  const mainReward = challenge.nestedChallenges && challenge.nestedChallenges.length > 0
    ? challenge.nestedChallenges[0].reward
    : "Casque KidiWorld Pro Edition";

  return (
    <div
      id={`challenge-card-${challenge.id}`}
      className={`group border rounded-[2rem] p-6 text-left flex flex-col justify-between h-[360px] transition-all duration-300 relative overflow-hidden ${
        isActive
          ? "bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-amber-500 shadow-2xl shadow-amber-500/15 ring-2 ring-amber-500/30 scale-[1.02]"
          : "bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900/40 border-slate-900/80 hover:border-slate-700 hover:shadow-[0_12px_40px_rgba(245,158,11,0.06)]"
      }`}
    >
      {/* Decorative Glow background accent */}
      <span className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:from-amber-500/10 transition-all duration-300" />
      {isActive && (
        <span className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-t-[2rem]" />
      )}

      <div className="space-y-3.5 flex-1 min-w-0">
        {/* Upper Badge Indicators Row */}
        <div className="flex justify-between items-start gap-2">
          {/* Age and Category Info badges */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span 
              id={`challenge-age-badge-${challenge.id}`}
              className="text-[9px] px-2.5 py-0.5 rounded-full font-mono font-black bg-slate-950/80 border border-slate-800 text-slate-300 uppercase shrink-0"
            >
              🧒 {challenge.ageGroup} ans
            </span>
            <span 
              id={`challenge-cat-badge-${challenge.id}`}
              className="text-[9px] bg-slate-950/80 text-amber-400 px-2.5 py-0.5 rounded-full border border-slate-800/80 font-black tracking-tight shrink-0"
            >
              {challenge.category === "cinema" ? "🎬 KIDI CINÉMA / SCÉNARIO" 
               : challenge.category === "music" ? "🎵 KIDI MUSIC" 
               : challenge.category === "design" ? "🎨 KIDI DESIGN & MODE"
               : challenge.category === "animation" ? "👾 KIDI 3D & JEUX"
               : challenge.category === "photography" ? "📸 KIDI PHOTOGRAPHY"
               : challenge.category === "architecture" ? "🏛️ KIDI ARCHITECTURE"
               : challenge.category}
            </span>
          </div>

          {/* Mode Banner Indicator: Demo vs Real Concours */}
          <div className="shrink-0">
            {challenge.isDemo ? (
              <span 
                id={`challenge-mode-demo-${challenge.id}`}
                className="text-[8px] bg-cyan-500/10 text-cyan-400 font-extrabold px-2.5 py-1 rounded-full border border-cyan-500/25 tracking-widest inline-flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: "12s" }} />
                DÉMO D'ESSAI
              </span>
            ) : (
              <span 
                id={`challenge-mode-real-${challenge.id}`}
                className="text-[8px] bg-red-500/10 text-rose-400 font-extrabold px-2.5 py-1 rounded-full border border-red-500/25 tracking-widest inline-flex items-center gap-1 animate-pulse"
              >
                <Award className="w-2.5 h-2.5 text-rose-400" />
                CONCOURS CLASSIQUE
              </span>
            )}
          </div>
        </div>

        {/* Challenge Titles */}
        <div className="space-y-1">
          <h3 
            id={`challenge-title-${challenge.id}`}
            className="text-base font-black text-white group-hover:text-amber-400 transition-colors leading-snug tracking-tight truncate"
          >
            <TranslatedText text={challenge.title} targetLang={language} />
          </h3>
          <p 
            id={`challenge-subtitle-${challenge.id}`}
            className="text-[10px] text-slate-400 font-semibold truncate"
          >
            <TranslatedText text={challenge.subtitle} targetLang={language} />
          </p>
        </div>

        {/* Sponsor Bio Row */}
        <div 
          id={`challenge-sponsor-${challenge.id}`}
          className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold"
        >
          <User className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="truncate">
            Propulsé par <span className="text-slate-300 font-extrabold">{challenge.sponsor}</span>
          </span>
        </div>

        {/* Active Prize Info Bar */}
        <div className="bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 p-2 rounded-xl flex items-center gap-2 text-[10px] text-amber-500 transition-colors">
          <Award className="w-4 h-4 text-amber-400 animate-bounce shrink-0" style={{ animationDuration: "2s" }} />
          <span className="font-extrabold truncate">
            Récompense Pro : <span className="text-white font-bold">{mainReward}</span>
          </span>
        </div>

        {/* Challenge Description Truncated visually using tailwind line clamp */}
        <div 
          id={`challenge-desc-${challenge.id}`}
          className="text-[11px] text-slate-300/90 leading-relaxed line-clamp-2 overflow-hidden"
        >
          <TranslatedText text={challenge.description} targetLang={language} isParagraph={true} />
        </div>
      </div>

      {/* Footer Submission metrics and Selection Actions */}
      <div className="pt-3.5 border-t border-slate-900/80 flex justify-between items-center mt-3.5">
        <span 
          id={`challenge-submissions-count-${challenge.id}`}
          className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
          {subCount} {subCount <= 1 ? "soumission" : "soumissions"}
        </span>

        <button
          id={`challenge-select-btn-${challenge.id}`}
          onClick={() => onSelect(challenge.id)}
          className={`py-1.5 px-4 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:shadow-lg ${
            isActive
              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black hover:brightness-110 active:scale-95 shadow-md"
              : "bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 active:scale-95"
          }`}
        >
          {isActive ? (
            <>
              Continuer
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Sélectionner
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

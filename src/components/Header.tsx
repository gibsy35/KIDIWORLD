import React from 'react';
import { Award, HelpCircle, Shield, Languages, Coins } from 'lucide-react';
import { useState, useEffect } from 'react';

// ─── AI Status Badge ────────────────────────────────────────────────────────
function AIStatusBadge() {
  const [status, setStatus] = useState<"checking" | "live" | "simulation">("checking");

  useEffect(() => {
    fetch("/api/gemini/health")
      .then(r => r.json())
      .then(d => setStatus(d.mode?.includes("Live") ? "live" : "simulation"))
      .catch(() => setStatus("simulation"));
  }, []);

  if (status === "checking") return null;

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-mono text-[9.5px] font-bold ${
      status === "live"
        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "live" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
      {status === "live" ? "🤖 IA Live" : "🤖 IA Sim"}
    </div>
  );
}

interface HeaderProps {
  starsCount: number;
  profileName: string;
  profileAge: number;
  profileLang: "fr" | "en" | "es" | "ja";
  onChangeLang?: (lang: "fr" | "en" | "es" | "ja") => void;
  onOpenProfile: () => void;
  isProfileActive: boolean;
  kidiCoins?: number;
  onOpenTutorial: () => void;
}

export default function Header({ 
  starsCount, 
  profileName, 
  profileAge, 
  profileLang, 
  onChangeLang,
  onOpenProfile,
  isProfileActive,
  kidiCoins,
  onOpenTutorial
}: HeaderProps) {

  const getAgeLabelBadge = (age: number) => {
    if (age <= 7) return "4-7 ans (Bout d'Chou)";
    if (age <= 11) return "8-11 ans (Explo)";
    if (age <= 15) return "12-15 ans (Junior)";
    return "16-18 ans (Senior)";
  };

  return (
    <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Branding Logo — KW monogram */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 flex-shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600 shadow-lg shadow-orange-500/30 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/5 rounded-2xl" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-500/30 rounded-full blur-md" />
              <span className="relative z-10 text-slate-950 font-black text-[15px] leading-none select-none" style={{ letterSpacing: '-0.05em' }}>
                KW
              </span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-300 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wide font-sans">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400">KIDI</span><span className="text-white">WORLD</span>
              </span>
              <span className="text-[9px] bg-amber-500/10 text-amber-400 font-bold px-1.5 py-0.5 rounded border border-amber-500/10">
                4-18 ANS SAFE
              </span>
            </div>
            <p className="text-[9px] font-mono tracking-wider text-slate-400 font-bold uppercase">
              Incubateur de Talents propulsé par LinkYourArt
            </p>
          </div>
        </div>

        {/* Dynamic Nav Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800/80 px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold text-slate-300 shadow-inner">
            <Languages className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span className="text-slate-500 hidden sm:inline">LANGUE :</span>
            <select
              value={profileLang}
              onChange={(e) => onChangeLang?.(e.target.value as any)}
              className="bg-transparent text-amber-400 border-none outline-none focus:ring-0 cursor-pointer pr-1 text-[10.5px] font-black focus:text-white"
              title="Traduire instantanément la plateforme via l'IA"
            >
              <option value="fr" className="bg-slate-950 text-slate-200">🇫🇷 Français (FR)</option>
              <option value="en" className="bg-slate-950 text-slate-200">🇬🇧 English (EN)</option>
              <option value="es" className="bg-slate-950 text-slate-200">🇪🇸 Español (ES)</option>
              <option value="ja" className="bg-slate-950 text-slate-200">🇯🇵 日本語 (JA)</option>
            </select>
          </div>

          {/* Tutorial Button */}
          <button
            onClick={onOpenTutorial}
            className="group relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-extrabold transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_22px_rgba(99,102,241,0.7)] cursor-pointer select-none active:scale-95 border border-indigo-400/30"
          >
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
            </span>
            <HelpCircle className="w-4 h-4 text-indigo-100 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide">Tutoriel Interactif 🚀</span>
          </button>

          {/* Parental Control */}
          <button
            onClick={onOpenProfile}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm ${
              isProfileActive
                ? "bg-pink-500/15 text-pink-400 border-pink-500/40"
                 : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-pink-500" />
            <span className="hidden sm:inline">Contrôle Parental</span>
          </button>

          {/* Age Badge */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800/80 px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold text-slate-400 shadow-inner">
            <span className="text-amber-500">{getAgeLabelBadge(profileAge)}</span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800/80 font-mono text-xs shadow-md">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-400">Étoiles :</span>
            <strong className="text-white font-bold">{starsCount}</strong>
          </div>

          {kidiCoins !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800/80 font-mono text-xs shadow-md text-amber-400">
              <Coins className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "12s" }} />
              <span className="text-slate-400">Coins :</span>
              <strong className="text-amber-300 font-bold">{kidiCoins}</strong>
            </div>
          )}

          {/* AI Status indicator */}
          <AIStatusBadge />
        </div>
      </div>
    </header>
  );
}

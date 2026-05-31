import React, { useState, useEffect } from "react";

// ─── Admin credentials (change these!) ──────────────────────
const ADMIN_PASSWORD = "KidiWorld2026!";
const ADMIN_KEY = "kidiworld_admin_access";

// ─── Launch date ─────────────────────────────────────────────
const LAUNCH_DATE = new Date("2026-09-01T00:00:00");

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [cd, setCd] = useState(calc);
  useEffect(() => { const t = setInterval(() => setCd(calc()), 1000); return () => clearInterval(t); }, []);
  return cd;
}

// ─── Admin Login Modal ────────────────────────────────────────
function AdminLogin({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_KEY, "true");
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPw("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className={`relative w-full max-w-sm bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/60 rounded-3xl p-8 shadow-2xl shadow-black/60 ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500 rounded-t-3xl" />

        <button onClick={onClose} className="absolute top-4 right-4 text-slate-600 hover:text-white transition text-lg">✕</button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
            <span className="text-slate-950 font-black text-[13px]" style={{ letterSpacing: '-0.05em' }}>KW</span>
          </div>
          <div>
            <div className="text-base font-black">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">KIDI</span>
              <span className="text-white">WORLD</span>
            </div>
            <div className="text-[9px] text-slate-500 font-mono uppercase">Accès Admin Restreint</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">🔑 Mot de passe admin</label>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false); }}
              placeholder="••••••••••••••"
              autoFocus
              className={`w-full bg-slate-800/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition ${error ? "border-rose-500/60 focus:border-rose-400" : "border-slate-700 focus:border-amber-500/60"}`}
            />
            {error && <p className="text-[10px] text-rose-400 mt-1.5 font-bold">❌ Mot de passe incorrect</p>}
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm transition active:scale-95 shadow-lg shadow-amber-500/20">
            ✨ Accéder à KIDIWORLD
          </button>
        </form>

        <p className="text-center text-[9.5px] text-slate-600 mt-4 font-mono">Accès réservé à l'équipe LinkYourArt</p>
      </div>
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }`}</style>
    </div>
  );
}

// ─── Newsletter signup ────────────────────────────────────────
function NewsletterForm({ lang }: { lang: "fr" | "en" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => setStatus("done"), 1200); // simulated
  };

  if (status === "done") {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm font-black">
        <span className="text-lg">🎉</span>
        {lang === "fr" ? "Tu es sur la liste ! On te prévient en premier." : "You're on the list! You'll be first to know."}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={lang === "fr" ? "Ton email pour être alerté(e)..." : "Your email to be notified..."}
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-400/50 transition"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950 font-black text-sm transition active:scale-95 hover:from-amber-400 hover:to-pink-400 whitespace-nowrap disabled:opacity-60"
      >
        {status === "loading" ? "..." : lang === "fr" ? "✨ M'alerter" : "✨ Notify me"}
      </button>
    </form>
  );
}

// ─── Main Teasing Page ────────────────────────────────────────
export default function Teasing({ onAdminAccess }: { onAdminAccess: () => void }) {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [showLogin, setShowLogin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const cd = useCountdown(LAUNCH_DATE);

  // Secret admin URL: /admin
  useEffect(() => {
    if (window.location.pathname === "/admin") setShowLogin(true);
    // Keyboard shortcut: Ctrl+Shift+A
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") setShowLogin(true);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const categories = [
    { icon: "🎵", label: lang === "fr" ? "MUSIQUE" : "MUSIC" },
    { icon: "🎬", label: lang === "fr" ? "CINÉMA" : "CINEMA" },
    { icon: "🎨", label: lang === "fr" ? "ARTS VISUELS" : "VISUAL ARTS" },
    { icon: "👾", label: lang === "fr" ? "GAMING" : "GAMING" },
    { icon: "📸", label: lang === "fr" ? "PHOTO" : "PHOTO" },
    { icon: "📺", label: lang === "fr" ? "TV SÉRIES" : "TV SERIES" },
    { icon: "🎙️", label: lang === "fr" ? "PODCAST" : "PODCAST" },
    { icon: "🏛️", label: lang === "fr" ? "ARCHITECTURE" : "ARCHITECTURE" },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans">
      {/* ── Animated background ───────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/12 blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[100px] animate-pulse" style={{ animationDuration: "11s" }} />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-pink-500/8 blur-[80px] animate-pulse" style={{ animationDuration: "6s" }} />
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-0.5 h-0.5 bg-white/20 rounded-full animate-pulse"
            style={{ left: `${5 + i * 4.7}%`, top: `${10 + ((i * 37) % 80)}%`, animationDelay: `${i * 0.3}s`, animationDuration: `${3 + (i % 4)}s` }} />
        ))}
      </div>

      {/* ── Top bar ────────────────────────────────────────────── */}
      <div className="relative z-10 flex justify-between items-center px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
              <span className="text-slate-950 font-black text-[12px]" style={{ letterSpacing: '-0.05em' }}>KW</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-300 rounded-full border-2 border-black animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-black">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">KIDI</span>
              <span className="text-white">WORLD</span>
            </span>
            <div className="text-[8px] text-white/30 font-mono uppercase tracking-widest">by LinkYourArt</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Lang toggle */}
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {(["fr", "en"] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${lang === l ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"}`}>
                {l === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
              </button>
            ))}
          </div>
          {/* Hidden admin trigger — visible small */}
          <button
            onClick={() => setShowLogin(true)}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/30 hover:text-white/60 hover:bg-white/10 transition font-mono"
            title="Admin"
          >
            ⚡
          </button>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────── */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-16 flex flex-col items-center text-center gap-10">

        {/* Age badge */}
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-lg">★</span>
          <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-white/60">
            4 – 18 {lang === "fr" ? "ANS" : "YEARS OLD"} · {lang === "fr" ? "BIENTÔT" : "COMING SOON"}
          </div>
          <span className="text-pink-400 text-lg">✦</span>
        </div>

        {/* Hero title */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none">
            <span className="text-white">KIDI</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-400">.</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400">WORLD</span>
          </h1>
          <p className="text-white/40 text-xs font-mono uppercase tracking-[0.3em]">A LINKYOURART UNIVERSE</p>
        </div>

        {/* Tagline */}
        <div className="space-y-3 max-w-xl">
          <p className="text-xl md:text-2xl font-black text-white leading-snug">
            {lang === "fr"
              ? "La scène mondiale des talents créatifs de demain."
              : "The world stage for tomorrow's creative talents."}
          </p>
          <p className="text-sm text-white/50 leading-relaxed">
            {lang === "fr"
              ? "KIDIWORLD est la première plateforme entièrement dédiée aux jeunes talents créatifs de 4 à 18 ans — musique, cinéma, arts visuels, design, gaming et bien plus. Un espace mondial où les enfants et adolescents expriment leur créativité, participent à des challenges professionnels et sont reconnus par des experts du secteur."
              : "KIDIWORLD is the first platform entirely dedicated to young creative talent between 4 and 18 years old — across music, cinema, visual arts, design, gaming and beyond. A global playground where children and teenagers can express their creativity, compete in professional challenges and get recognized by industry experts."}
          </p>
          <p className="text-sm text-white/40 leading-relaxed">
            {lang === "fr"
              ? "Professionnels et institutions créatives du monde entier peuvent lancer des challenges, découvrir des profils exceptionnels et investir dans les étoiles montantes de demain — bien avant qu'elles ne deviennent des icônes."
              : "Professionals and creative institutions from around the world can launch challenges, discover exceptional profiles and invest in tomorrow's rising stars — long before they become icons."}
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <span key={cat.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition cursor-default">
              {cat.icon} {cat.label}
            </span>
          ))}
        </div>

        {/* Countdown */}
        <div className="w-full max-w-lg">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono mb-4">
            {lang === "fr" ? "🚀 Lancement dans..." : "🚀 Launching in..."}
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: cd.days, label: lang === "fr" ? "JOURS" : "DAYS" },
              { value: cd.hours, label: lang === "fr" ? "HEURES" : "HOURS" },
              { value: cd.minutes, label: lang === "fr" ? "MINUTES" : "MINUTES" },
              { value: cd.seconds, label: lang === "fr" ? "SECONDES" : "SECONDS" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-3xl md:text-4xl font-black text-white tabular-nums leading-none">
                  {String(value).padStart(2, "0")}
                </div>
                <div className="text-[8px] text-white/30 font-mono uppercase tracking-widest mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="w-full flex flex-col items-center gap-3">
          <p className="text-xs text-white/40 font-mono uppercase tracking-widest">
            {lang === "fr" ? "📬 Sois le premier informé du lancement" : "📬 Be the first to know at launch"}
          </p>
          <NewsletterForm lang={lang} />
          <p className="text-[9px] text-white/20">
            {lang === "fr" ? "Zéro spam. Désabonnement en 1 clic." : "Zero spam. Unsubscribe in 1 click."}
          </p>
        </div>

        {/* Partners hint */}
        <div className="flex items-center gap-2 text-white/20 text-[10px] font-mono uppercase tracking-widest">
          <div className="h-px w-12 bg-white/10" />
          {lang === "fr" ? "En partenariat avec" : "In partnership with"}
          <div className="h-px w-12 bg-white/10" />
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-white/30 text-xs font-bold">
          {["LinkYourArt", "Canal+", "France Inter", "Pixar France"].map(p => (
            <span key={p} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg">{p}</span>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-[10px] text-white/20 font-mono text-center space-y-1 pt-4 border-t border-white/5 w-full">
          <p>© 2025-2026 KIDIWORLD — une entité de <strong className="text-white/40">LINKYOURART SAS</strong></p>
          <p>Plateforme 100% Safe · Zéro Pub · RGPD Compliant · Protection des Mineurs</p>
        </div>
      </main>

      {/* ── Admin Login Modal ─────────────────────────────────── */}
      {showLogin && (
        <AdminLogin
          onSuccess={onAdminAccess}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}

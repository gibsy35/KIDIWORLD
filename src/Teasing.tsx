import React, { useState, useEffect } from "react";

const ADMIN_PASSWORD = "KidiWorld2026!";
const ADMIN_KEY = "kidiworld_admin_access";
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
      setError(true); setShake(true);
      setTimeout(() => setShake(false), 600);
      setPw("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className={`relative w-full max-w-sm rounded-3xl p-8 shadow-2xl ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", border: "1px solid rgba(139,92,246,0.3)" }}>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-pink-500 to-violet-500 rounded-t-3xl" />
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition">✕</button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30"
            style={{ background: "linear-gradient(135deg, #f59e0b, #f97316, #ec4899)" }}>
            <span className="text-slate-950 font-black text-[14px]" style={{ letterSpacing: '-0.05em' }}>KW</span>
          </div>
          <div>
            <div className="text-base font-black">
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #f59e0b, #f97316)" }}>KIDI</span>
              <span className="text-white">WORLD</span>
            </div>
            <div className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Accès Admin Restreint</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">🔑 Mot de passe admin</label>
            <input type="password" value={pw} onChange={e => { setPw(e.target.value); setError(false); }}
              placeholder="••••••••••••••" autoFocus
              className={`w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition ${error ? "border-rose-500/60" : "border-violet-500/30 focus:border-amber-400/60"}`}
              style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(139,92,246,0.3)"}` }} />
            {error && <p className="text-[10px] text-rose-400 mt-1.5 font-bold">❌ Mot de passe incorrect</p>}
          </div>
          <button type="submit"
            className="w-full py-3 rounded-xl font-black text-sm transition active:scale-95 text-slate-950 shadow-lg"
            style={{ background: "linear-gradient(90deg, #f59e0b, #f97316, #ec4899)" }}>
            ✨ Accéder à KIDIWORLD
          </button>
        </form>
        <p className="text-center text-[9.5px] text-slate-600 mt-4 font-mono">Accès réservé à l'équipe LinkYourArt</p>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
    </div>
  );
}

function NewsletterForm({ lang }: { lang: "fr" | "en" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => setStatus("done"), 1200);
  };

  if (status === "done") return (
    <div className="flex items-center gap-2 text-emerald-400 text-sm font-black">
      <span className="text-lg">🎉</span>
      {lang === "fr" ? "Tu es sur la liste ! On te prévient en premier." : "You're on the list! You'll be first to know."}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
        placeholder={lang === "fr" ? "Ton email pour être alerté(e)..." : "Your email to be notified..."}
        className="flex-1 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }} />
      <button type="submit" disabled={status === "loading"}
        className="px-5 py-3 rounded-xl font-black text-sm text-slate-950 transition active:scale-95 disabled:opacity-60 whitespace-nowrap"
        style={{ background: "linear-gradient(90deg, #f59e0b, #ec4899)" }}>
        {status === "loading" ? "..." : lang === "fr" ? "✨ M'alerter" : "✨ Notify me"}
      </button>
    </form>
  );
}

export default function Teasing({ onAdminAccess }: { onAdminAccess: () => void }) {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [showLogin, setShowLogin] = useState(false);
  const cd = useCountdown(LAUNCH_DATE);

  useEffect(() => {
    if (window.location.pathname === "/admin") setShowLogin(true);
    const handler = (e: KeyboardEvent) => { if (e.ctrlKey && e.shiftKey && e.key === "A") setShowLogin(true); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const categories = [
    { icon: "🎵", label: lang === "fr" ? "MUSIQUE" : "MUSIC", color: "#8b5cf6" },
    { icon: "🎬", label: lang === "fr" ? "CINÉMA" : "CINEMA", color: "#f59e0b" },
    { icon: "🎨", label: lang === "fr" ? "ARTS VISUELS" : "VISUAL ARTS", color: "#ec4899" },
    { icon: "👾", label: lang === "fr" ? "GAMING" : "GAMING", color: "#06b6d4" },
    { icon: "📸", label: lang === "fr" ? "PHOTO" : "PHOTO", color: "#10b981" },
    { icon: "📺", label: lang === "fr" ? "TV SÉRIES" : "TV SERIES", color: "#f97316" },
    { icon: "🎙️", label: lang === "fr" ? "PODCAST" : "PODCAST", color: "#6366f1" },
    { icon: "🏛️", label: lang === "fr" ? "ARCHITECTURE" : "ARCHITECTURE", color: "#14b8a6" },
  ];

  const countdownItems = [
    { value: cd.days, label: lang === "fr" ? "JOURS" : "DAYS", color: "#f59e0b" },
    { value: cd.hours, label: lang === "fr" ? "HEURES" : "HOURS", color: "#ec4899" },
    { value: cd.minutes, label: lang === "fr" ? "MINUTES" : "MINUTES", color: "#8b5cf6" },
    { value: cd.seconds, label: lang === "fr" ? "SECONDES" : "SECONDS", color: "#06b6d4" },
  ];

  return (
    <div className="min-h-screen text-white overflow-hidden relative font-sans"
      style={{ background: "radial-gradient(ellipse at top left, #1e1b4b 0%, #0a0a0f 40%, #0f172a 70%, #0a0a0f 100%)" }}>

      {/* ── Animated blobs ─────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full blur-[160px] animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)", animationDuration: "8s" }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.14) 0%, transparent 70%)", animationDuration: "11s" }} />
        <div className="absolute top-[35%] right-[15%] w-[400px] h-[400px] rounded-full blur-[100px] animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)", animationDuration: "6s" }} />
        <div className="absolute top-[60%] left-[10%] w-[300px] h-[300px] rounded-full blur-[80px] animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)", animationDuration: "9s" }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Floating stars */}
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute rounded-full animate-pulse"
            style={{
              width: i % 3 === 0 ? "3px" : "1.5px", height: i % 3 === 0 ? "3px" : "1.5px",
              left: `${3 + i * 3.2}%`, top: `${5 + ((i * 41) % 90)}%`,
              background: ["#f59e0b","#ec4899","#8b5cf6","#06b6d4","#10b981"][i % 5],
              animationDelay: `${i * 0.2}s`, animationDuration: `${2 + (i % 4)}s`,
              opacity: 0.4 + (i % 3) * 0.2,
            }} />
        ))}
      </div>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex justify-between items-center px-6 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(10px)", background: "rgba(0,0,0,0.2)" }}>
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30"
              style={{ background: "linear-gradient(135deg, #f59e0b, #f97316, #ec4899)" }}>
              <span className="text-slate-950 font-black text-[13px]" style={{ letterSpacing: '-0.05em' }}>KW</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-black animate-pulse"
              style={{ background: "#f59e0b" }} />
          </div>
          <div>
            <div className="text-sm font-black">
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #f59e0b, #f97316)" }}>KIDI</span>
              <span className="text-white">WORLD</span>
            </div>
            <div className="text-[8px] font-mono uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>by LinkYourArt</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-xl p-1" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {(["fr", "en"] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className="px-3 py-1 rounded-lg text-xs font-bold transition"
                style={lang === l ? { background: "rgba(245,158,11,0.2)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" } : { color: "rgba(255,255,255,0.35)" }}>
                {l === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
              </button>
            ))}
          </div>
          <button onClick={() => setShowLogin(true)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs transition"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.2)" }}
            title="Admin">⚡</button>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-16 flex flex-col items-center text-center gap-10">

        {/* Badge */}
        <div className="flex items-center gap-2">
          <span style={{ color: "#f59e0b", fontSize: "1.2rem" }}>★</span>
          <div className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
            style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "rgba(245,158,11,0.8)" }}>
            4 – 18 {lang === "fr" ? "ANS" : "YEARS OLD"} · {lang === "fr" ? "BIENTÔT" : "COMING SOON"}
          </div>
          <span style={{ color: "#ec4899", fontSize: "1.2rem" }}>✦</span>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="font-black tracking-tight leading-none" style={{ fontSize: "clamp(4rem, 12vw, 7rem)" }}>
            <span className="text-white">KIDI</span>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b 0%, #ec4899 40%, #8b5cf6 80%, #06b6d4 100%)" }}>.</span>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 40%, #ec4899 80%, #f59e0b 100%)" }}>WORLD</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-[0.35em]" style={{ color: "rgba(255,255,255,0.3)" }}>A LINKYOURART UNIVERSE</p>
        </div>

        {/* Tagline */}
        <div className="space-y-4 max-w-xl">
          <p className="font-black text-white leading-snug" style={{ fontSize: "clamp(1.1rem, 3vw, 1.4rem)" }}>
            {lang === "fr"
              ? "La scène mondiale des talents créatifs de demain."
              : "The world stage for tomorrow's creative talents."}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            {lang === "fr"
              ? "KIDIWORLD est la première plateforme entièrement dédiée aux jeunes talents créatifs de 4 à 18 ans — musique, cinéma, arts visuels, design, gaming et bien plus. Un espace mondial où les enfants et adolescents expriment leur créativité, participent à des challenges professionnels et sont reconnus par des experts du secteur."
              : "KIDIWORLD is the first platform entirely dedicated to young creative talent between 4 and 18 years old — across music, cinema, visual arts, design, gaming and beyond. A global playground where children and teenagers express their creativity, compete in professional challenges and get recognized by industry experts."}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
            {lang === "fr"
              ? "Professionnels et institutions créatives du monde entier peuvent lancer des challenges, découvrir des profils exceptionnels et investir dans les étoiles montantes de demain — bien avant qu'elles ne deviennent des icônes."
              : "Professionals and creative institutions from around the world can launch challenges, discover exceptional profiles and invest in tomorrow's rising stars — long before they become icons."}
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <span key={cat.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-default hover:scale-105"
              style={{
                background: `${cat.color}15`,
                border: `1px solid ${cat.color}35`,
                color: cat.color,
              }}>
              {cat.icon} {cat.label}
            </span>
          ))}
        </div>

        {/* Countdown */}
        <div className="w-full max-w-lg space-y-4">
          <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
            🚀 {lang === "fr" ? "Lancement dans..." : "Launching in..."}
          </p>
          <div className="grid grid-cols-4 gap-3">
            {countdownItems.map(({ value, label, color }) => (
              <div key={label} className="rounded-2xl p-4 text-center relative overflow-hidden"
                style={{ background: `${color}0d`, border: `1px solid ${color}25` }}>
                <div className="absolute inset-0 opacity-5 blur-xl rounded-2xl" style={{ background: color }} />
                <div className="relative font-black tabular-nums leading-none mb-1"
                  style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color }}>
                  {String(value).padStart(2, "0")}
                </div>
                <div className="text-[8px] font-mono uppercase tracking-widest" style={{ color: `${color}80` }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="w-full flex flex-col items-center gap-3 p-6 rounded-3xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
            📬 {lang === "fr" ? "Sois le premier informé du lancement" : "Be the first to know at launch"}
          </p>
          <NewsletterForm lang={lang} />
          <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            {lang === "fr" ? "Zéro spam. Désabonnement en 1 clic." : "Zero spam. Unsubscribe in 1 click."}
          </p>
        </div>

        {/* Safe badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { icon: "🔒", label: "100% Safe", color: "#10b981" },
            { icon: "🚫📢", label: lang === "fr" ? "Zéro Pub" : "Ad-Free", color: "#6366f1" },
            { icon: "🇫🇷", label: "Made in France", color: "#3b82f6" },
            { icon: "👶", label: "RGPD & Mineurs", color: "#8b5cf6" },
          ].map(b => (
            <span key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold"
              style={{ background: `${b.color}10`, border: `1px solid ${b.color}25`, color: `${b.color}` }}>
              {b.icon} {b.label}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="text-[10px] font-mono text-center space-y-1 pt-4 w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)" }}>
          <p>© 2025-2026 KIDIWORLD — une entité de <strong style={{ color: "rgba(255,255,255,0.4)" }}>LINKYOURART SAS</strong></p>
          <p>Plateforme 100% Safe · Zéro Pub · RGPD Compliant · Protection des Mineurs</p>
        </div>
      </main>

      {showLogin && <AdminLogin onSuccess={onAdminAccess} onClose={() => setShowLogin(false)} />}
    </div>
  );
}

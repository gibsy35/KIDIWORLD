import React, { useState } from "react";
import {
  Mail, Phone, MapPin, Shield, FileText, HelpCircle,
  Instagram, Youtube, Twitter, Music2, ExternalLink,
  ChevronDown, ChevronUp, Heart, Star, Sparkles,
  BookOpen, Lock, Users, Globe, Tv, Mic2, Award
} from "lucide-react";

interface FooterProps {
  language: "fr" | "en";
}

const T = {
  fr: {
    tagline: "L'Incubateur de Talents Créatifs pour les 4-18 ans",
    description: "KIDIWORLD est une plateforme sécurisée dédiée à l'éveil et à l'expression artistique des jeunes talents. Sous la bienveillance de LinkYourArt, nous connectons tes créations avec de vrais jurys professionnels.",
    colPlatform: "La Plateforme",
    colCategories: "Catégories",
    colLegal: "Légal & Sécurité",
    colContact: "Contact",
    links: {
      platform: [
        { label: "Explorer les Challenges", icon: "🏆" },
        { label: "KidiStream — Galerie", icon: "🎬" },
        { label: "KidiGaming Workspace", icon: "👾" },
        { label: "Classement & Étoiles", icon: "⭐" },
        { label: "Coach IA Linky", icon: "🤖" },
        { label: "Jury & Partenaires", icon: "🎓" },
      ],
      categories: [
        { label: "🎬 KIDI Cinéma / Scénario" },
        { label: "🎵 KIDI Music" },
        { label: "🎨 KIDI Design & Mode" },
        { label: "👾 KIDI 3D & Jeux" },
        { label: "📸 KIDI Photography" },
        { label: "🏛️ KIDI Architecture" },
        { label: "📺 TV Séries" },
        { label: "🎙️ Podcast" },
      ],
      legal: [
        { label: "Mentions Légales", icon: FileText },
        { label: "Politique de Confidentialité", icon: Lock },
        { label: "CGU — Conditions d'Utilisation", icon: FileText },
        { label: "Protection des Mineurs (RGPD)", icon: Shield },
        { label: "Contrôle Parental", icon: Users },
        { label: "Charte de Modération", icon: BookOpen },
      ],
      contact: [
        { label: "contact@kidi.world", icon: Mail, href: "mailto:contact@kidi.world" },
        { label: "partenaires@linkyourart.com", icon: Mail, href: "mailto:partenaires@linkyourart.com" },
        { label: "Paris, France 🇫🇷", icon: MapPin, href: "#" },
        { label: "FAQ & Aide", icon: HelpCircle, href: "#" },
        { label: "Signaler un contenu", icon: Shield, href: "#" },
      ],
    },
    social: "Rejoins la communauté",
    awards: "Partenaires & Labels",
    copyright: "© 2025-2026 KIDIWORLD — une entité de",
    copyrightSub: "Tous droits réservés. Plateforme sécurisée 4-18 ans.",
    safeLabel: "Plateforme 100% Safe — Sans pub, sans tracking, sans achats forcés",
    legalBlock: "KIDIWORLD est une marque déposée et une entité créative à part entière appartenant à LINKYOURART SAS. Tout contenu soumis par les utilisateurs reste la propriété intellectuelle de leurs auteurs. LinkYourArt agit comme curateur et éditeur responsable de la plateforme, garantissant un environnement sécurisé conforme au RGPD et aux directives européennes de protection des mineurs.",
    madeWith: "Fait avec",
    madeFor: "pour les talents de demain",
  },
  en: {
    tagline: "The Creative Talent Incubator for ages 4-18",
    description: "KIDIWORLD is a secure platform dedicated to awakening and artistic expression for young talents. Under the care of LinkYourArt, we connect your creations with real professional juries.",
    colPlatform: "Platform",
    colCategories: "Categories",
    colLegal: "Legal & Safety",
    colContact: "Contact",
    links: {
      platform: [
        { label: "Explore Challenges", icon: "🏆" },
        { label: "KidiStream — Gallery", icon: "🎬" },
        { label: "KidiGaming Workspace", icon: "👾" },
        { label: "Rankings & Stars", icon: "⭐" },
        { label: "AI Coach Linky", icon: "🤖" },
        { label: "Jury & Partners", icon: "🎓" },
      ],
      categories: [
        { label: "🎬 KIDI Cinema / Screenplay" },
        { label: "🎵 KIDI Music" },
        { label: "🎨 KIDI Design & Fashion" },
        { label: "👾 KIDI 3D & Games" },
        { label: "📸 KIDI Photography" },
        { label: "🏛️ KIDI Architecture" },
        { label: "📺 TV Series" },
        { label: "🎙️ Podcast" },
      ],
      legal: [
        { label: "Legal Notice", icon: FileText },
        { label: "Privacy Policy", icon: Lock },
        { label: "Terms of Use", icon: FileText },
        { label: "Child Protection (GDPR)", icon: Shield },
        { label: "Parental Control", icon: Users },
        { label: "Moderation Charter", icon: BookOpen },
      ],
      contact: [
        { label: "contact@kidi.world", icon: Mail, href: "mailto:contact@kidi.world" },
        { label: "partners@linkyourart.com", icon: Mail, href: "mailto:partenaires@linkyourart.com" },
        { label: "Paris, France 🇫🇷", icon: MapPin, href: "#" },
        { label: "FAQ & Help", icon: HelpCircle, href: "#" },
        { label: "Report content", icon: Shield, href: "#" },
      ],
    },
    social: "Join the community",
    awards: "Partners & Labels",
    copyright: "© 2025-2026 KIDIWORLD — an entity of",
    copyrightSub: "All rights reserved. Secure platform for ages 4-18.",
    safeLabel: "100% Safe Platform — No ads, no tracking, no forced purchases",
    legalBlock: "KIDIWORLD is a registered trademark and a fully-fledged creative entity owned by LINKYOURART SAS. All content submitted by users remains the intellectual property of their authors. LinkYourArt acts as the responsible curator and publisher of the platform, guaranteeing a secure environment compliant with GDPR and European directives on the protection of minors.",
    madeWith: "Made with",
    madeFor: "for tomorrow's talents",
  },
};

export default function Footer({ language }: FooterProps) {
  const t = T[language] || T.fr;
  const [legalExpanded, setLegalExpanded] = useState(false);

  const socials = [
    { icon: Instagram, label: "Instagram", color: "hover:text-pink-400", href: "https://instagram.com/kidiworld" },
    { icon: Youtube, label: "YouTube", color: "hover:text-red-400", href: "https://youtube.com/@kidiworld" },
    { icon: Twitter, label: "X / Twitter", color: "hover:text-sky-400", href: "https://x.com/kidiworld" },
    { icon: Music2, label: "TikTok", color: "hover:text-violet-400", href: "https://tiktok.com/@kidiworld" },
  ];

  const awards = [
    { emoji: "🇫🇷", label: "Made in France" },
    { emoji: "🔒", label: "RGPD Compliant" },
    { emoji: "🌱", label: "Label Jeunesse" },
    { emoji: "🎓", label: "Certifié LinkYourArt" },
    { emoji: "🚫📢", label: "Zéro Publicité" },
  ];

  return (
    <footer className="mt-0 bg-gradient-to-b from-slate-950 via-slate-950 to-black border-t border-slate-800/60 font-sans">

      {/* Safe banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border-b border-emerald-500/10 py-2.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
          <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="text-[10.5px] text-emerald-400 font-black tracking-wide uppercase">{t.safeLabel}</span>
          <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column — spans 2 */}
          <div className="lg:col-span-2 space-y-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600 shadow-xl shadow-orange-500/25 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/5" />
                  <span className="relative z-10 text-slate-950 font-black text-[17px] leading-none" style={{ letterSpacing: '-0.05em' }}>KW</span>
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-300 rounded-full border-2 border-slate-950 animate-pulse" />
              </div>
              <div>
                <div className="text-xl font-black">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400">KIDI</span>
                  <span className="text-white">WORLD</span>
                </div>
                <div className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">by LinkYourArt</div>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-xs text-amber-400/80 font-bold tracking-wide leading-relaxed">{t.tagline}</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">{t.description}</p>

            {/* Social links */}
            <div className="space-y-2">
              <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">{t.social}</p>
              <div className="flex items-center gap-3">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className={`w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 ${s.color} transition-all duration-200 hover:border-slate-600 hover:scale-110`}
                    title={s.label}>
                    <s.icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div className="space-y-2">
              <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">{t.awards}</p>
              <div className="flex flex-wrap gap-1.5">
                {awards.map((a) => (
                  <span key={a.label} className="flex items-center gap-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[9.5px] text-slate-400 font-bold">
                    {a.emoji} {a.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Platform links */}
          <div className="space-y-4">
            <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {t.colPlatform}
            </h4>
            <ul className="space-y-2">
              {t.links.platform.map((link) => (
                <li key={link.label}>
                  <a href="#" className="group flex items-center gap-2 text-[11px] text-slate-500 hover:text-amber-400 transition-colors duration-200">
                    <span className="text-base leading-none">{link.icon}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <Star className="w-3 h-3 text-pink-500" />
              {t.colCategories}
            </h4>
            <ul className="space-y-2">
              {t.links.categories.map((link) => (
                <li key={link.label}>
                  <a href="#" className="text-[11px] text-slate-500 hover:text-white transition-colors duration-200 block hover:translate-x-0.5 transform">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Contact */}
          <div className="space-y-6">
            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-indigo-400" />
                {t.colLegal}
              </h4>
              <ul className="space-y-2">
                {t.links.legal.map((link) => (
                  <li key={link.label}>
                    <a href="#" className="group flex items-center gap-2 text-[11px] text-slate-500 hover:text-indigo-400 transition-colors duration-200">
                      <link.icon className="w-3 h-3 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-teal-400" />
                {t.colContact}
              </h4>
              <ul className="space-y-2">
                {t.links.contact.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="group flex items-center gap-2 text-[11px] text-slate-500 hover:text-teal-400 transition-colors duration-200">
                      <link.icon className="w-3 h-3 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Expandable legal block */}
        <div className="mt-10 border border-slate-800/60 rounded-2xl overflow-hidden">
          <button
            onClick={() => setLegalExpanded(!legalExpanded)}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-900/60 hover:bg-slate-900 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10.5px] text-slate-400 font-black uppercase tracking-wider">
                ⚖️ {language === "fr" ? "Mentions Légales complètes — KIDIWORLD / LinkYourArt" : "Full Legal Notice — KIDIWORLD / LinkYourArt"}
              </span>
            </div>
            {legalExpanded
              ? <ChevronUp className="w-4 h-4 text-slate-500" />
              : <ChevronDown className="w-4 h-4 text-slate-500" />
            }
          </button>
          {legalExpanded && (
            <div className="px-5 py-4 bg-slate-950/60 border-t border-slate-800/40">
              <p className="text-[10.5px] text-slate-500 leading-relaxed">{t.legalBlock}</p>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-[10px] text-slate-600 font-mono text-center md:text-left">
            <span>{t.copyright} </span>
            <a href="https://linkyourart.com" target="_blank" rel="noopener noreferrer"
              className="text-amber-500/70 hover:text-amber-400 transition font-black">
              LINKYOURART
            </a>
            <span className="ml-1 text-slate-700">— {t.copyrightSub}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-mono">
            <span>{t.madeWith}</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>{t.madeFor}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

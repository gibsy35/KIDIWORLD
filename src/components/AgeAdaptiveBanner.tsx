import React from "react";
import { getAgeGroup, AGE_META, getAgeTools, v, getRewardLabel } from "../utils/ageAdapter";

type Lang = "fr" | "en";

interface AgeAdaptiveBannerProps {
  age: number;
  lang: Lang;
  stars: number;
  coins: number;
}

export default function AgeAdaptiveBanner({ age, lang, stars, coins }: AgeAdaptiveBannerProps) {
  const ageGroup = getAgeGroup(age);
  const meta = AGE_META[ageGroup];
  const tools = getAgeTools(ageGroup);
  const rewards = getRewardLabel(ageGroup, lang);

  const tips: Record<typeof ageGroup, Record<Lang, string[]>> = {
    "4-7": {
      fr: ["🌟 Dessine ce que tu imagines !", "🎵 Chante ta mélodie préférée !", "🖍️ Utilise toutes les couleurs !"],
      en: ["🌟 Draw what you imagine!", "🎵 Sing your favourite melody!", "🖍️ Use all the colours!"],
    },
    "8-11": {
      fr: ["🚀 Explore les indices un par un !", "🎯 Suis le brief du challenge !", "💡 Ose les idées folles !"],
      en: ["🚀 Explore clues one by one!", "🎯 Follow the challenge brief!", "💡 Dare to think wild!"],
    },
    "12-15": {
      fr: ["💡 Lis attentivement le brief avant de créer.", "🎬 Structure ton œuvre en actes.", "🤝 Le coach Linky peut t'aider à tout moment."],
      en: ["💡 Read the brief carefully before creating.", "🎬 Structure your work in acts.", "🤝 Coach Linky can help you anytime."],
    },
    "16-18": {
      fr: ["📊 Soigne la qualité de présentation de ton dossier.", "🏆 Le jury note l'originalité et la maîtrise technique.", "🔗 Ton profil est visible par les recruteurs LinkYourArt."],
      en: ["📊 Pay attention to your portfolio presentation quality.", "🏆 The jury scores originality and technical mastery.", "🔗 Your profile is visible to LinkYourArt recruiters."],
    },
  };

  const tip = tips[ageGroup][lang][Math.floor(Date.now() / 30000) % 3];

  return (
    <div className={`relative overflow-hidden rounded-3xl p-5 bg-gradient-to-r ${meta.color} bg-opacity-10`}
      style={{ background: `linear-gradient(135deg, ${meta.colorHex}18 0%, ${meta.colorHex}08 100%)`, border: `1px solid ${meta.colorHex}30` }}>

      {/* Ambient glow */}
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-20"
        style={{ background: meta.colorHex }} />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Age badge */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg"
            style={{ background: `${meta.colorHex}25`, border: `2px solid ${meta.colorHex}40` }}>
            {meta.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-black text-sm">{meta.label[lang]}</span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: `${meta.colorHex}20`, color: meta.colorHex, border: `1px solid ${meta.colorHex}30` }}>
                {meta.tagline[lang]}
              </span>
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: `${meta.colorHex}cc` }}>{tip}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center px-3 py-2 rounded-xl"
            style={{ background: `${meta.colorHex}15`, border: `1px solid ${meta.colorHex}25` }}>
            <div className="text-lg font-black text-white">{stars}</div>
            <div className="text-[9px] font-mono uppercase" style={{ color: `${meta.colorHex}99` }}>{rewards.stars.split(" ")[0]}</div>
          </div>
          <div className="text-center px-3 py-2 rounded-xl"
            style={{ background: `${meta.colorHex}15`, border: `1px solid ${meta.colorHex}25` }}>
            <div className="text-lg font-black text-white">{coins}</div>
            <div className="text-[9px] font-mono uppercase" style={{ color: `${meta.colorHex}99` }}>Coins</div>
          </div>
          {/* Tools available */}
          <div className="hidden sm:flex flex-col gap-1">
            <div className="text-[9px] font-mono uppercase tracking-widest" style={{ color: `${meta.colorHex}80` }}>
              {lang === "fr" ? "Outils actifs" : "Active tools"}
            </div>
            <div className="flex gap-1 flex-wrap">
              {tools.showScreenplay && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60">✏️</span>}
              {tools.showMusic && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60">🎵</span>}
              {tools.showDesign && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60">🎨</span>}
              {tools.showPodcast && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60">🎙️</span>}
              {tools.showTvSeries && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60">📺</span>}
              {tools.showGaming && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60">👾</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

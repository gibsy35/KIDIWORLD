import React, { useState } from "react";
import { Sparkles, Award, Film, Camera, Palette, Gamepad2, Landmark, Music, CheckCircle2, Star, ShieldCheck, HelpCircle, Download, User, Calendar, Check, PenTool } from "lucide-react";
import TranslatedText from "./TranslatedText";
import { jsPDF } from "jspdf";

interface PrestigeAwardsProps {
  language: "fr" | "en" | "es" | "ja";
}

export default function PrestigeAwards({ language }: PrestigeAwardsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Dynamic Certificate of Achievement state variables
  const [certName, setCertName] = useState("Bastien");
  const [certMajor, setCertMajor] = useState("Scénariste d'Animation Spatial");
  const [certDistinction, setCertDistinction] = useState("Félicitations Unanimes du Jury d'Élite");
  const [certMentorName, setCertMentorName] = useState("Jérôme Salle (Canal+ & Mikros)");
  const [certIsGenerating, setCertIsGenerating] = useState(false);
  const [certSuccess, setCertSuccess] = useState(false);

  const categories = [
    { id: "all", labelFr: "🏆 Tous les Prix", labelEn: "🏆 All Awards", labelEs: "🏆 Todos los Premios", labelJa: "🏆 すべての賞" },
    { id: "cinema", labelFr: "🎬 Cinéma", labelEn: "🎬 Cinema", labelEs: "🎬 Cine", labelJa: "🎬 映画・脚本" },
    { id: "photography", labelFr: "📷 Photo", labelEn: "📷 Photo", labelEs: "📷 Foto", labelJa: "📷 写真" },
    { id: "design", labelFr: "👗 Mode & Design", labelEn: "👗 Fashion & Design", labelEs: "👗 Moda y Diseño", labelJa: "👗 ファッション" },
    { id: "animation", labelFr: "👾 Jeux & 3D", labelEn: "👾 Games & 3D", labelEs: "👾 Juegos y 3D", labelJa: "👾 ゲーム＆3D" },
    { id: "music", labelFr: "🎼 Musique", labelEn: "🎼 Music", labelEs: "🎼 Música", labelJa: "🎼 音楽" },
    { id: "architecture", labelFr: "🏛️ Architecture", labelEn: "🏛️ Architecture", labelEs: "🏛️ Arquitectura", labelJa: "🏛️ 建築" },
  ];

  const grandPrix = [
    {
      id: "cinema",
      icon: <Film className="w-6 h-6 text-amber-500 animate-pulse" />,
      titleFr: "🎬 KIDI CINÉMA & SCÉNARIO",
      titleEn: "🎬 KIDI CINEMA & SCREENPLAY",
      titleEs: "🎬 KIDI CINE & GUION",
      titleJa: "🎬 KIDI シネマ＆脚本",
      sponsor: "Jérôme Salle & Canal+ Création",
      prizeFr: "Prix du Meilleur Scénario Original Junior",
      prizeEn: "Best Junior Original Screenplay Award",
      prizeEs: "Premio al Mejor Guion Original Junior",
      prizeJa: "最優秀ジュニアオリジナル脚本賞",
      accent: "from-amber-500/10 to-transparent border-amber-500/20 hover:border-amber-500/60",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      rewardsFr: [
        "Rencontre en tête-à-tête et masterclass privée avec le réalisateur Jérôme Salle.",
        "Stage d'observation immersif de 5 jours dans les studios d'animation partenaires à Paris (Mikros / Folimage).",
        "Visite guidée exclusive VIP des plateaux d'écriture et de diffusion de Canal+.",
      ],
      rewardsEn: [
        "One-on-one masterclass session with renowned French director Jérôme Salle.",
        "5-day professional observation internship inside top animation studios (Mikros Animation Paris).",
        "Exclusive VIP back-stage tour of Canal+ broadcasting sets.",
      ],
      rewardsEs: [
        "Clase magistral individual con el aclamado director de cine Jérôme Salle.",
        "Pasantía de observación de 5 días en famosos estudios de animación en París (Mikros / Folimage).",
        "Visita guiada exclusiva VIP detrás de escena en los sets de Canal+.",
      ],
      rewardsJa: [
        "フランスの著名映画監督ジェローム・サールによるプライベート・個別マンツーマン授業（対面）。",
        "パリの超名門アニメーション制作スタジオ（Mikros Image等）での5日間の特別インターンシップ研修。",
        "Canal+（キャナル・プリュス）TV局の放送スタジオおよび撮影現場特別VIPバックステージツアー。",
      ],
    },
    {
      id: "photography",
      icon: <Camera className="w-6 h-6 text-cyan-500 animate-pulse" />,
      titleFr: "📷 KIDI PHOTOGRAPHY",
      titleEn: "📷 KIDI PHOTOGRAPHY",
      titleEs: "📷 KIDI FOTOGRAFÍA",
      titleJa: "📷 KIDI 写真クリエイティブ",
      sponsor: "Yann Arthus-Bertrand & National Geographic Reporters",
      prizeFr: "Grand Prix de la Rétrospective Visuelle LinkYourArt",
      prizeEn: "LinkYourArt Visual Retrospective Award",
      prizeEs: "Gran Premio de la Retrospectiva Visual LinkYourArt",
      prizeJa: "最優秀ビジュアルレトロスペクティブ賞（リンクユアアート後援）",
      accent: "from-cyan-500/10 to-transparent border-cyan-500/20 hover:border-cyan-500/60",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      rewardsFr: [
        "Une demi-journée complète de mentorat individuel en plein air avec un reporter officiel de National Geographic.",
        "Exposition physique grand-format de ton chef-d'œuvre à la Biennale Internationale d'Art de LinkYourArt.",
        "Tirage d'art prestigieux numéroté, signé et publié dans notre catalogue officiel de talents d'avenir.",
      ],
      rewardsEn: [
        "Half-day private outdoor coaching with an official National Geographic photographer.",
        "Large-scale physical exhibition of your photograph at the major LinkYourArt International Art Biennial.",
        "High-end signed art print published and promoted in the national talent catalog.",
      ],
      rewardsEs: [
        "Media jornada completa de mentoría individual al aire libre con un reportero de National Geographic.",
        "Exposición física a gran escala de tu obra en la Bienal Internacional de Arte LinkYourArt.",
        "Impresión de arte numerada y firmada de cortesía, publicada en el catálogo oficial de jóvenes talentos.",
      ],
      rewardsJa: [
        "ナショナルジオグラフィック公式取材カメラマンによる特別野外・プライベートマンツーマン講習（半日）。",
        "リンクユアアート国際現代美術ビエンナーレでの受賞作品の豪華大型パネル物理展示権。",
        "若きアーティストとしての公式サイン＆シリアル入り高精細美術プリント、アート図録登載・全国配布。",
      ],
    },
    {
      id: "design",
      icon: <Palette className="w-6 h-6 text-pink-500 animate-pulse" />,
      titleFr: "👗 KIDI DESIGN & MODE",
      titleEn: "👗 KIDI FASHION & DESIGN",
      titleEs: "👗 KIDI DISENO & MODA",
      titleJa: "👗 KIDI ファッション＆製品デザイン",
      sponsor: "Maisons de Couture de Prestige & Chanel Associés",
      prizeFr: "Prix d'Or de l'Aiguille de la Mode Spatiale",
      prizeEn: "Golden Nebula Fashion Needle Grand Prize",
      prizeEs: "Premio de Oro de la Aguja de Moda Espacial",
      prizeJa: "最優秀スカイ・ファッションゴールドニードル賞（シャネル協力）",
      accent: "from-pink-500/10 to-transparent border-pink-500/20 hover:border-pink-500/60",
      badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      rewardsFr: [
        "Stage de découverte exclusif de 3 jours au sein des célèbres ateliers de Haute Couture Chanel.",
        "Modélisation en 3D professionnelle haute-fidélité de ta combinaison galactique par un infographiste de mode.",
        "Présentation officielle de ton patron de stylisme à un réseau de designers de mode internationaux.",
      ],
      rewardsEn: [
        "3-day immersive discovery internship deep within famous Chanel workshops.",
        "High-fidelity professional 3D model processing of your space flight suit designs.",
        "Official design portfolio introduction and pitch to elite international fashion brands.",
      ],
      rewardsEs: [
        "Pasantía de descubrimiento exclusiva de 3 días en los prestigiosos talleres de Chanel.",
        "Modelado en 3D profesional de alta fidelidad de tu traje espacial por un diseñador de moda.",
        "Presentación oficial de tu portafolio de moda a un jurado de estilistas profesionales.",
      ],
      rewardsJa: [
        "パリのハイブランド「シャネル」オートクチュール・モード特別アトリעでの夢の3日間限定観察体験研修。",
        "提出した宇宙飛行士衣装デザインを、パリのプロデジタル衣料モデラーが完全3Dデジタル立体再現化。",
        "若手モードコンクール候補として、海外大手テキスタイルデザイナーおよびブランド関係者への公式推薦。",
      ],
    },
    {
      id: "animation",
      icon: <Gamepad2 className="w-6 h-6 text-emerald-500 animate-pulse" />,
      titleFr: "👾 KIDI GAMES & IA",
      titleEn: "👾 KIDI GAMES & AI",
      titleEs: "👾 KIDI JUEGOS & IA",
      titleJa: "👾 KIDI ゲームプログラミング＆IA",
      sponsor: "Ubisoft & Pixar Animation Partners",
      prizeFr: "Trophée de l'Ingénieur Céleste 'Junior Game Changer'",
      prizeEn: "Junior Game Changer Excellence Trophy",
      prizeEs: "Trofeo al Joven Inventor 'Junior Game Changer'",
      prizeJa: "最優秀ジュニア・ゲームチェンジャーエンジニア賞",
      accent: "from-emerald-500/10 to-transparent border-emerald-500/20 hover:border-emerald-500/60",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      rewardsFr: [
        "Visite guidée privée VIP exclusive et immersive des bâtiments de développement d'Ubisoft.",
        "Session de Co-Design collaboratif de 2 heures en face-à-face avec un Lead Producer de jeux vidéo.",
        "Défis de codage de jeux illimités supportés par le fonds d'émergence des talents de LinkYourArt.",
      ],
      rewardsEn: [
        "Exclusive behind-the-scenes VIP tour of Ubisoft game-development campuses.",
        "2-hour private Game Design brainstorming session side-by-side with an Ubisoft Lead Producer.",
        "Complimentary professional programming tools sponsorship by the LinkYourArt fund.",
      ],
      rewardsEs: [
        "Visita guiada privada VIP exclusiva e inmersiva por los estudios centrales de Ubisoft.",
        "Sesión de Co-Diseño de videojuegos de 2 horas en directo con un Lead Producer oficial.",
        "Patrocinio y recursos de codificación ilimitados financiados por el programa LinkYourArt.",
      ],
      rewardsJa: [
        "大手ゲームメーカー「ユービーアイソフト（Ubisoft）」開発拠点内の、普段は入れない開発室VIP特別独占ツアー。",
        "ユービーアイソフト社リードゲームプロデューサーと2人きりで行う、2時間の対面企画コ・デザイン会議。",
        "自分の作ったゲームの製品化およびサーバー展開、リンクユアアート特別ファンドによる資金スポンサー枠申請権。",
      ],
    },
    {
      id: "music",
      icon: <Music className="w-6 h-6 text-indigo-500 animate-pulse" />,
      titleFr: "🎼 KIDI MUSIC",
      titleEn: "🎼 KIDI MUSIC",
      titleEs: "🎼 KIDI MÚSICA",
      titleJa: "🎼 KIDI 音楽制作・シンセ",
      sponsor: "Hans Zimmer Team & l'Orchestre de Radio France",
      prizeFr: "Grand Prix Soundscapes de l'Émergence Musicale",
      prizeEn: "Grand Prix Soundscapes of Musical Emergence",
      prizeEs: "Gran Premio Soundscapes del Talento Musical",
      prizeJa: "最優秀サウンドスケープ・音楽クリエイティブ大賞",
      accent: "from-indigo-500/10 to-transparent border-indigo-500/20 hover:border-indigo-500/60",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      rewardsFr: [
        "Ton morceau orchestré, arrangé et enregistré en direct par de vrais musiciens de l'Orchestre de Radio France !",
        "Journée magique d'initiation et enregistrement au cœur du Grand Studio 104 de Radio France.",
        "Sortie officielle digitale de ton hymne bioluminescent sur Spotify & Apple Music sous licence LinkYourArt.",
      ],
      rewardsEn: [
        "Your synth melody fully arranged and recorded live by professional musicians of the French Radio Symphony Orchestra!",
        "1-day professional masterclass inside the legendary Radio France Studio 104.",
        "Official global music streaming distribution (Spotify, Apple Music) with a LinkYourArt artist feature.",
      ],
      rewardsEs: [
        "¡Tu melodía orquestada, arreglada y grabada en vivo por músicos profesionales de la Orquesta de Radio France!",
        "Día de inducción mágica en composición de cine en el legendario Grand Studio 104.",
        "Lanzamiento oficial en plataformas de transmisión de música digital (Spotify, Apple-Music).",
      ],
      rewardsJa: [
        "あなたが作ったメロディーを一流の音楽家がフルオーケストラ用に特別アレンジ、フランス国立放送管弦楽団によるホール生中継実演収録！",
        "フランス・パリ最大の総合スタジオ「グランド・スタジオ104」での1日完全特別音楽編集ワークショップ体験。",
        "完成したオリジナル曲を「Spotify」「Apple Music」等の公式配信ストアを通じて全世界へメジャー配信（LinkYourArt名義）。",
      ],
    },
    {
      id: "architecture",
      icon: <Landmark className="w-6 h-6 text-teal-500 animate-pulse" />,
      titleFr: "🏛️ KIDI ARCHITECTURE",
      titleEn: "🏛️ KIDI ARCHITECTURE",
      titleEs: "🏛️ KIDI ARQUITECTURA",
      titleJa: "🏛️ KIDI 建築・空間デザイン",
      sponsor: "Ateliers Jean Nouvel & Urbanistes Célestes",
      prizeFr: "Prix d'Éco-Architecture d'Avenir Jean Nouvel",
      prizeEn: "Jean Nouvel Eco-Architecture of the Future Award",
      prizeEs: "Premio de Eco-Arquitectura del Futuro Jean Nouvel",
      prizeJa: "最優秀エコロジー宇宙都市建築省（ジャン・ヌーヴェル後援）",
      accent: "from-teal-500/10 to-transparent border-teal-500/20 hover:border-teal-500/60",
      badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      rewardsFr: [
        "Modélisation assistée et impression 3D échelle réelle de ta cité suspendue par les ateliers d'études.",
        "2 heures complètes d'analyse et critique constructive en direct avec la légende internationale Jean Nouvel.",
        "Exposition officielle et pérenne de ta maquette lors du prestigieux Concours de l'Arsenal.",
      ],
      rewardsEn: [
        "Full computer-assisted processing and giant 3D printing of your sky city plans for public exhibition.",
        "2 hours of personal constructive feedback session with world-famous architect Jean Nouvel.",
        "Official public architectural model presentation during the Parisian Arsenal Young Creator Fair.",
      ],
      rewardsEs: [
        "Modelado CAD e impresión en 3D a gran escala de tu maqueta arquitectónica de ciudad colgante.",
        "Sesión de crítica y análisis exclusivo de 2 horas en directo con la leyenda Jean Nouvel y su equipo directivo.",
        "Exposición oficial de tu prototipo seleccionado en el prestigioso Salón del Arsenal.",
      ],
      rewardsJa: [
        "あなたがプロットした未来型空中浮遊都市の3Dモデルデータを、有名研究所が大型3Dプリンターで大型立体彫刻モデル化。",
        "世界的ビッグネーム、世界的建築家ジャン・ヌーヴェル（Jean Nouvel）本人および専任チームによる、直接2時間の対面アドバイス＆批評会。",
        "若き都市空間の先駆者コンテストの代表作として、パリ・アーセナル建築ギャラリーにて一般物理展示枠の提供。",
      ],
    },
  ];

  const getSubText = () => {
    switch (language) {
      case "en": return "Every challenge you complete on KidiWorld isn't just a game: it matches a physical award program in collaboration with official world-renowned pros and prestigious corporate sponsors from LinkYourArt.";
      case "es": return "Cada desafío que completas en KidiWorld no es solo un juego: se conecta con premios del mundo real patrocinados por las marcas profesionales oficiales más famosas de la red LinkYourArt.";
      case "ja": return "キッズがKidiWorldで創り上げる作品は、ただのゲームではありません。LinkYourArtの強力な提携のもと、実在する世界的超一流企業、映画監督、建築家、メゾンが審査し、本物の学問体験やプロアトリエ、VIPスタジオアトリエへの公式研修権などの「超本気」のご褒美を獲得する本物のプロジェクトです。";
      default: return "Chaque défi artistique que tu tentes sur KidiWorld n'est pas un simple divertissement : il est relié à des Grands Prix d'excellence parrainés par de prestigieuses institutions et de grands créateurs professionnels du réseau d'art LinkYourArt.";
    }
  };

  const getHeaderTitle = () => {
    switch (language) {
      case "en": return "🏆 Exclusive Grand Prix & Prestigous Career Awards";
      case "es": return "🏆 Grandes Premios Exclusivos y Recompensas Reales";
      case "ja": return "🏆 【親御様・スポンサー様へ】公式パートナー企業＆超一級のご褒美一覧";
      default: return "🏆 Les Grands Prix Prestige & Partenaires Officiels de KidiWorld";
    }
  };

  const activePrix = selectedCategory === "all" 
    ? grandPrix 
    : grandPrix.filter(gp => gp.id === selectedCategory);

  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/95 p-6 md:p-8 rounded-[2.5rem] border border-slate-900 text-left space-y-6 relative overflow-hidden shadow-2xl">
      {/* Visual glowing aura inside content to raise and enhance perceived value */}
      <div className="absolute top-0 right-1/4 w-80 h-32 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-64 h-24 bg-indigo-505/5 blur-3xl pointer-events-none rounded-full" />

      {/* Structured and Clear Heading */}
      <div className="space-y-2 relative z-10">
        <span className="text-[10px] bg-gradient-to-r from-amber-500 via-orange-400 to-pink-500 text-slate-950 font-black px-4 py-1.5 rounded-full uppercase tracking-wider font-mono inline-block shadow-md">
          🪐 LE TREMPLIN DES FUTURS PRODIGES (MINI-NETFLIX DE L'ART)
        </span>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
          {getHeaderTitle()}
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-4.5xl">
          {getSubText()}
        </p>
      </div>

      {/* Interactive Category filter pills */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-900/80 relative z-10">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const label = language === "en" ? cat.labelEn : language === "es" ? cat.labelEs : language === "ja" ? cat.labelJa : cat.labelFr;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                isSelected 
                  ? "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-slate-950 shadow-md transform scale-102"
                  : "bg-slate-950/70 border border-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Grid displaying the high flying corporate rewards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-3 relative z-10">
        {activePrix.map((gp) => {
          const title = language === "en" ? gp.titleEn : language === "es" ? gp.titleEs : language === "ja" ? gp.titleJa : gp.titleFr;
          const prizeName = language === "en" ? gp.prizeEn : language === "es" ? gp.prizeEs : language === "ja" ? gp.prizeJa : gp.prizeFr;
          const rewards = language === "en" ? gp.rewardsEn : language === "es" ? gp.rewardsEs : language === "ja" ? gp.rewardsJa : gp.rewardsFr;

          return (
            <div
              key={gp.id}
              className={`bg-slate-950/95 p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-5 shadow-inner hover:-translate-y-1 hover:bg-slate-950/40 bg-gradient-to-b ${gp.accent}`}
            >
              {/* Category & Sponsor block */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-start gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    {gp.icon}
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md border font-sans tracking-wide ${gp.badgeColor}`}>
                    {gp.id.toUpperCase()} PRO
                  </span>
                </div>

                <div className="space-y-1">
                  <strong className="text-xs font-black text-amber-500 block font-mono">
                    {title}
                  </strong>
                  <h3 className="text-sm font-black text-white hover:text-indigo-400 transition cursor-pointer leading-tight">
                    {prizeName}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                    <span>Sponsor Officiel :</span> 
                    <strong className="text-slate-200 font-bold">{gp.sponsor}</strong>
                  </p>
                </div>

                {/* List of high-flying real professional opportunities */}
                <div className="space-y-2 pt-3 border-t border-slate-900">
                  <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest font-mono block">
                    💫 {language === "en" ? "SPECTACULAR REWARDS" : language === "es" ? "PREMIOS DE HAUTE VOLÉE" : language === "ja" ? "受賞で獲得する本物体験のご褒美" : "LES RÉCOMPENSES EXPÉRIENTIELLES"} :
                  </span>
                  
                  <ul className="space-y-2.5">
                    {rewards.map((rew, i) => (
                      <li key={i} className="flex items-start gap-2 text-[10.5px] text-slate-300 leading-normal">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="font-semibold">{rew}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom tag validating LinkYourArt's professional agreement */}
              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono leading-none border-t border-slate-900/30">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Validé LinkYourArt</span>
                </span>
                <span className="text-slate-600">4-18 ans OK</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Grand Prix Diploma Studio */}
      <div id="diploma-studio" className="bg-slate-950 border border-slate-900 rounded-[2rem] p-6 space-y-6 relative overflow-hidden my-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 blur-3xl pointer-events-none rounded-full" />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-900">
          <div>
            <span className="text-[10px] font-mono font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full uppercase">
              📜 Atelier de Rédaction Officiel
            </span>
            <h3 className="text-base font-black text-white mt-1">
              Génère Ton Diplôme d'Honneur LinkYourArt
            </h3>
            <p className="text-xs text-slate-400">
              Personnalise, signe et exporte instantanément ton diplôme d'excellence au format PDF officiel.
            </p>
          </div>
          <button
            onClick={() => {
              setCertIsGenerating(true);
              setTimeout(() => {
                try {
                  const doc = new jsPDF({
                    orientation: "landscape",
                    unit: "mm",
                    format: "a4"
                  });

                  const w = 297;
                  const h = 210;

                  // Dark Slate Base Background
                  doc.setFillColor(15, 23, 42); 
                  doc.rect(0, 0, w, h, "F");

                  // Indigo Border
                  doc.setDrawColor(99, 102, 241); 
                  doc.setLineWidth(1.5);
                  doc.rect(6, 6, w - 12, h - 12);

                  // Gold Border Double Lines
                  doc.setDrawColor(218, 165, 32); 
                  doc.setLineWidth(0.8);
                  doc.rect(10, 10, w - 20, h - 20);
                  doc.rect(11.5, 11.5, w - 23, h - 23);

                  // Header branding labels
                  doc.setTextColor(234, 179, 8); 
                  doc.setFont("Helvetica", "bold");
                  doc.setFontSize(11);
                  doc.text("KIDIWORLD CREATIVE ACADEMY & LINKYOURART", w / 2, 26, { align: "center" });

                  doc.setDrawColor(234, 179, 8);
                  doc.setLineWidth(0.4);
                  doc.line(50, 31, w - 50, 31);

                  // Diploma Title
                  doc.setTextColor(255, 255, 255);
                  doc.setFont("Times", "italic");
                  doc.setFontSize(26);
                  doc.text("Diplome d'Honneur", w / 2, 45, { align: "center" });
                  
                  doc.setFont("Helvetica", "bold");
                  doc.setFontSize(15);
                  doc.setTextColor(218, 165, 32); 
                  doc.text("GRAND PRIX DU JEUNE CREATEUR DE DEMAIN", w / 2, 55, { align: "center" });

                  // Body Subtext
                  doc.setTextColor(203, 213, 225); 
                  doc.setFont("Helvetica", "normal");
                  doc.setFontSize(10.5);
                  doc.text("Le present titre d'excellence artistique est decerne solennellement a :", w / 2, 73, { align: "center" });

                  // Super large creator name centered
                  doc.setTextColor(255, 255, 255);
                  doc.setFont("Times", "bold");
                  doc.setFontSize(26);
                  doc.text(certName.toUpperCase(), w / 2, 89, { align: "center" });

                  doc.setDrawColor(218, 165, 32);
                  doc.setLineWidth(0.8);
                  doc.line(70, 95, w - 70, 95);

                  // Category details
                  doc.setTextColor(203, 213, 225); 
                  doc.setFont("Helvetica", "normal");
                  doc.setFontSize(10.5);
                  doc.text("En reconnaissance de sa creativite exceptionnelle et de la validation de ses defis :", w / 2, 108, { align: "center" });

                  doc.setTextColor(168, 85, 247); 
                  doc.setFont("Helvetica", "bold");
                  doc.setFontSize(17);
                  doc.text(certMajor, w / 2, 122, { align: "center" });

                  // Achievement Distinction
                  doc.setTextColor(253, 186, 116); 
                  doc.setFont("Times", "bolditalic");
                  doc.setFontSize(12.5);
                  doc.text(`Avec la distinction speciale : ${certDistinction}`, w / 2, 137, { align: "center" });

                  // Seal partition
                  doc.setDrawColor(71, 85, 105);
                  doc.setLineWidth(0.3);
                  doc.line(20, 150, w - 20, 150);

                  // President signature block
                  doc.setTextColor(148, 163, 184); 
                  doc.setFont("Helvetica", "normal");
                  doc.setFontSize(8.5);
                  doc.text("Le President de LinkYourArt", 50, 160);
                  
                  doc.setTextColor(255, 255, 255);
                  doc.setFont("Times", "italic");
                  doc.setFontSize(12);
                  doc.text("Jean-Baptiste Lequime", 50, 169);

                  // Middle golden stamp representation
                  doc.setDrawColor(218, 165, 32);
                  doc.setLineWidth(0.5);
                  doc.circle(w / 2, 166, 11);
                  doc.setTextColor(218, 165, 32);
                  doc.setFont("Helvetica", "bold");
                  doc.setFontSize(6.5);
                  doc.text("SEAL OF", w / 2, 163, { align: "center" });
                  doc.text("EXCELLENCE", w / 2, 167, { align: "center" });
                  doc.text("2026", w / 2, 171, { align: "center" });

                  // Mentor advisor signature block
                  doc.setTextColor(148, 163, 184); 
                  doc.setFont("Helvetica", "normal");
                  doc.setFontSize(8.5);
                  doc.text("Official Advisor & Mentor", w - 95, 160);

                  doc.setTextColor(255, 255, 255);
                  doc.setFont("Times", "italic");
                  doc.setFontSize(12);
                  doc.text(certMentorName, w - 95, 169);

                  // Bottom encryption stamp to prevent counterfeits
                  doc.setTextColor(71, 85, 105);
                  doc.setFont("Courier", "normal");
                  doc.setFontSize(7);
                  doc.text("SECURE VERIFICATION SHIELD: KIDI-2026-CHALLENGE-VERIFIED-PRO", w / 2, 193, { align: "center" });

                  doc.save(`Diplome_Honneur_${certName.replace(/\s+/g, '_')}.pdf`);
                  setCertSuccess(true);
                  setTimeout(() => setCertSuccess(false), 4500);
                } catch (err) {
                  console.error("PDF generation failure:", err);
                } finally {
                  setCertIsGenerating(false);
                }
              }, 800);
            }}
            disabled={certIsGenerating}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:opacity-95 text-slate-150 font-black px-5 py-2.5 rounded-2xl text-[11px] uppercase shadow-lg shadow-orange-500/10 active:scale-95 transition pointer-events-auto cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span className="text-slate-950">{certIsGenerating ? "Sceau en cours..." : "Télécharger mon Diplôme (PDF)"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Certificate Editor Controls */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-500" /> Nom du Créateur / de la Créatrice
              </label>
              <input
                type="text"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder="Ex: Bastien"
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:outline-none font-semibold transition"
              />
            </div>

            {/* Specialty Path */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-violet-400" /> Spécialité / Discipline validée
              </label>
              <select
                value={certMajor}
                onChange={(e) => setCertMajor(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 focus:border-violet-500 focus:outline-none font-semibold transition appearance-none"
              >
                <option value="Scenariste d'Animation Spatial">🎬 Scénariste d'Animation Spatial</option>
                <option value="Producteur de Musique Bioluminescente">🎼 Producteur de Musique Bioluminescente</option>
                <option value="Concepteur de Code de Jeu Vidéo IA">👾 Concepteur de Code de Jeu Vidéo IA</option>
                <option value="Styliste de Combinaisons Galactiques">👗 Styliste de Combinaisons Galactiques</option>
                <option value="Astrophotographe Grand-Format">📷 Astrophotographe Grand-Format</option>
                <option value="Architecte des Cités Suspendues 3D">🏛️ Architecte des Cités Suspendues 3D</option>
              </select>
            </div>

            {/* Distinction Mention */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-pink-500" /> Mention Honorifique du Comité
              </label>
              <select
                value={certDistinction}
                onChange={(e) => setCertDistinction(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 focus:border-pink-500 focus:outline-none font-semibold transition appearance-none"
              >
                <option value="Feliculations Unanimes du Jury d'Elite">✨ Félicitations Unanimes du Jury d'Élite</option>
                <option value="Mention Tres Honorable & Prodige d'Or">💫 Mention Très Honorable & Prodige d'Or</option>
                <option value="Grand Prix du Createur d'Avenir">🏆 Grand Prix du Créateur d'Avenir</option>
                <option value="Etoile Montante LinkYourArt Academic">⭐ Étoile Montante LinkYourArt Academic</option>
              </select>
            </div>

            {/* Mentor Signature */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <PenTool className="w-3.5 h-3.5 text-emerald-400" /> Parrain d'Honneur (Signature)
              </label>
              <select
                value={certMentorName}
                onChange={(e) => setCertMentorName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none font-semibold transition appearance-none"
              >
                <option value="Jerome Salle (Canal+ & Mikros)">Jérôme Salle (Canal+ & Mikros Direct.)</option>
                <option value="Hans Zimmer (Studio Orchestral)">Hans Zimmer (Compositeur de Cinéma)</option>
                <option value="Yann Arthus-Bertrand (NatGeo)">Yann Arthus-Bertrand (Reporter d'Honneur)</option>
                <option value="Jean Nouvel (Ateliers Architecte)">Jean Nouvel (Architecte Pritzker)</option>
                <option value="Virginie Viard (Haute Couture)">Virginie Viard (Responsable Design Chanel/Maison)</option>
              </select>
            </div>

            {certSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-emerald-400 animate-pulse text-[11px] font-bold flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Ton Diplôme d'Or officiel a été généré et téléchargé avec succès !</span>
              </div>
            )}
          </div>

          {/* Certificate Live Preview Screen */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col justify-center items-center relative overflow-hidden text-center min-h-[220px]">
            <div className="absolute top-2 left-2 text-[10px] text-slate-600 font-mono select-none">Aperçu en temps réel :</div>
            
            <div className="aspect-[4/3] w-full max-w-[360px] bg-slate-950 p-4 rounded-lg border-2 border-amber-500/30 relative flex flex-col justify-between text-left select-none space-y-2">
              <div className="border border-dashed border-amber-500/15 p-2 flex flex-col justify-between h-full">
                <div className="text-center space-y-0.5">
                  <span className="text-[6px] text-amber-500 block tracking-widest font-mono">LINKYOURART ACADEMY</span>
                  <span className="text-[11px] font-serif italic text-slate-300 block">Diplôme d'Honneur</span>
                  <span className="text-[7px] text-amber-600 font-bold block">GRAND PRIX DU CRÉATEUR DE DEMAIN</span>
                </div>

                <div className="text-center space-y-1 my-1">
                  <span className="text-[5.5px] text-slate-500 block">Décerné solennellement à l'élève :</span>
                  <strong className="text-xs uppercase text-slate-100 block tracking-wider font-semibold underline decoration-amber-500/40">
                    {certName || "Bastien"}
                  </strong>
                  <span className="text-[5.5px] text-slate-500 block">Pour sa contribution d'industrie :</span>
                  <span className="text-[8px] text-purple-400 font-bold block">
                    {certMajor}
                  </span>
                </div>

                <div className="text-center">
                  <span className="text-[6.5px] font-semibold text-orange-300 bg-orange-500/10 px-1.5 py-0.5 rounded italic block w-max mx-auto border border-orange-500/15">
                    🌟 {certDistinction}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[5.5px] text-slate-500 border-t border-slate-900 pt-1 font-mono">
                  <span>Signé: J.B Lequime</span>
                  <span className="text-amber-500 font-bold">● SEAL ●</span>
                  <span className="truncate max-w-[80px]">Parrain: {certMentorName.split(" ")[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory notice to parent and potential sponsors */}
      <div className="bg-indigo-950/10 border border-indigo-950/40 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-left">
          <strong className="text-indigo-300 font-black font-sans leading-none block">
            {language === "en" ? "💡 Parental and Partner Safety Guarantee" : language === "es" ? "💡 Garantía de Seguridad Parental y Socios" : language === "ja" ? "💡 ご両親および提携パートナー企業様へ：100%安全保証" : "💡 Charte de Confiance Parentale & Partenaires"}
          </strong>
          <p className="text-[11px] text-slate-300 leading-normal">
            {language === "en" 
              ? "All active challenge interactions take place in a fully moderated parental dashboard space. No metadata is shared, and personal data complies strictly with Child Protection policies. For partnerships inquiries, contact sponsorship@linkyourart.pro." 
              : language === "es" 
              ? "Interacciones moderadas y protegidas para niños. Para consultas de marcas o patrocinios de LinkYourArt, escriba a sponsorship@linkyourart.pro."
              : language === "ja"
              ? "キッズアトリエ内のテキストや作品へのフィードバックはすべて、親御様のダッシュボードおよびLinkYourArtスタッフが100%人力・AIにて全数監視。有害物質や他者との直接通信を遮断しています。企業様提携・Biennial取材はこちら：sponsorship@linkyourart.pro."
              : "Toutes les œuvres soumises passent par un tableau d'incubation vérifié, interdisant toute interaction directe malveillante ou exposition hors du cadre sécurisé contrôlé par les parents. Pour toute adhésion de votre marque au prestigieux programme de mécénat LinkYourArt, contactez-nous à l'adresse sponsorship@linkyourart.pro."}
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { 
  Sparkles, 
  BookOpen, 
  Award, 
  Compass, 
  Users, 
  Globe, 
  Heart,
  Palette, 
  Gamepad2, 
  Cpu
} from "lucide-react";

interface AboutUsSectionProps {
  language: "fr" | "en";
}

const CONST_TRANSLATIONS = {
  fr: {
    badge: "📖 Chronique Temporelle & Origines",
    title: "L'Épopée Fantastique de KIDI WORLD",
    intro: "Bienvenue dans l'archipel céleste où la créativité et la magie universelle s'unissent pour révéler ton génie intérieur !",
    constellationTitle: "Active les Constellations Magiques de KIDI WORLD",
    constellationSubtitle: "Survole les étoiles pour explorer les secrets de notre académie galactique.",
    starArt: "L'Art Traditionnel",
    starArtDesc: "Chaque coup de pinceau est un portail de rêve. Dessine et peins pour exprimer ta vision.",
    starTech: "Technologies Modernes",
    starTechDesc: "Façonne les mondes virtuels avec la programmation interactive, le cinématique et les sons.",
    starPlay: "Le Jeu Éducatif",
    starPlayDesc: "Apprendre par l'action créative en gagnant des etoiles et des KidiCoins à chaque étape.",
    starJury: "Comités de pros",
    starJuryDesc: "De de vrais comités professionnels de LinkYourArt examinent tes œuvres pour t'offrir de vraies bourses !",
    allianceTitle: "L'Alliance Précieuse de LinkYourArt",
    allianceDesc: "En partenariat exclusif et sous la bienveillance bienveillante de sa maison-mère LINKYOURART, KIDI WORLD est un sanctuaire à but d'éveil. Ton diplôme et ton portfolio créatif sont des passeports certifiés par des jurys d'art internationaux !",
  },
  en: {
    badge: "📖 Temporal Chronicle & Origins",
    title: "The Fantastic Odyssey of KIDI WORLD",
    intro: "Welcome to the celestial archipelago where creative arts and universal play unite to reveal your inner spark!",
    constellationTitle: "Activate the Magic Constellations of KIDI WORLD",
    constellationSubtitle: "Hover over the stars to explore the secrets of our galactic academy.",
    starArt: "Traditional Arts",
    starArtDesc: "Every brushstroke opens up dream portals. Draw and sketch to express your galactic vision.",
    starTech: "Modern Technology",
    starTechDesc: "Shape virtual worlds through interactive coding, dynamic screenplays, and sound waves.",
    starPlay: "Educational Playing",
    starPlayDesc: "Learning through dynamic action while winning golden stars and KidiCoins at every step.",
    starJury: "Mentoral Jurys",
    starJuryDesc: "Real professional expert committees from LinkYourArt review your pieces to unlock grand opportunities!",
    allianceTitle: "The Loving Shield of LinkYourArt",
    allianceDesc: "In exclusive partnership and under the protective wings of its parent house LINKYOURART, KIDI WORLD acts as an artistic incubator workspace. Your badges, awards, and portfolios are validated by true global juries!",
  },
  es: {
    badge: "📖 Crónica Celestial y Orígenes",
    title: "La Odisea Fantástica de KIDI WORLD",
    intro: "¡Bienvenido al archipiélago mágico donde el juego y las artes se fusionan para dar brillo a tus ideas!",
    constellationTitle: "Activa las Constelaciones Estelares de KIDI WORLD",
    constellationSubtitle: "Pasa sobre las estrellas para descubrir los secretos de nuestra academia galáctica.",
    starArt: "Artes Tradicionales",
    starArtDesc: "Cada trazo abre portales de fantasía. Dibuja e ilustra con la libertad de los cometas.",
    starTech: "Tecnología de Punta",
    starTechDesc: "Modela mundos virtuales mediante guiones dinámicos, música chiptune y simulación interactiva.",
    starPlay: "El Juego Educativo",
    starPlayDesc: "Aprende jugando con desafíos mágicos diseñados por pedagogos y creadores de juegos.",
    starJury: "Comités Expertos",
    starJuryDesc: "Verdaderos comités profesionales de LinkYourArt que evalúan tus portafolios y otorgan premios.",
    allianceTitle: "La Alianza Sagrada con LinkYourArt",
    allianceDesc: "Bajo la valiosa tutela y propiedad exclusiva de LINKYOURART, KIDI WORLD protege el talento infantil de 4 a 18 años, validando de forma rigurosa cada logro con credenciales reconocidas internacionalmente.",
  },
  ja: {
    badge: "📖 宇宙クロニクル歴史書",
    title: "KIDI WORLD（キディ・ワールド）の創世記",
    intro: "キミの内なるクリエイティブな輝きを解き放つ、デジタル芸術とスペースシップ冒険の特別協定区へようこそ！",
    constellationTitle: "KIDI WORLDの魔法星座を作動させよう",
    constellationSubtitle: "お星さまに触れて、私たちの銀河系アートアカデミーに散りばめられた秘密を解き明かそう。",
    starArt: "伝統アートのぬくもり",
    starArtDesc: "一本の線の引き方から夢が芽生えます。のびのびとスケッチして自身のビジョンをキャンバスに表現しよう。",
    starTech: "最先端デジタル魔法",
    starTechDesc: "スクリーンの裏側で、映画 of ストーリーや音、ビームのような波形をプログラムコントロールしよう。",
    starPlay: "まなびの宇宙クエスト",
    starPlayDesc: "ゲーム感覚で、宇宙飛行訓練（物理シミュレーション）をクリアしながら、楽しくスターやKidiコインを貯めよう。",
    starJury: "一流のマスター審査員員",
    starJuryDesc: "本物のLinkYourArt評価委員会（スタジオで働く凄腕クリエイターたち）がキミの成長をいつでも優しく見守っています。",
    allianceTitle: "LinkYourArt ギルドとの永遠の誓い",
    allianceDesc: "LinkYourArt（完全所有ギルド）の全面的なバックアップによって、KIDI WORLDの全カリキュラムは安全に保護され、4歳から18歳までの若者が国際的なアートコンペに自信を持って作品を発表できるパスポートをお約束します。",
  }
};

const CHAPTERS = {
  fr: [
    {
      num: "Chapitre I",
      title: "L'Éveil de la Constellation",
      text: "Il était une fois, aux confins du cyber-espace, un univers d'évasion et de pure lumière nommé KIDI WORLD. Cette île magique flottant dans le sillage de comètes est une plateforme d'incubation et d'éveil créatif, spécialement forgée pour les enfants et adolescents de 4 à 18 ans."
    },
    {
      num: "Chapitre II",
      title: "L'Alliance Stellor exclusive",
      text: "Né sous la plus bienveillante des étoiles, KIDI WORLD a grandi main dans la main avec son gardien LINKYOURART, dont il est la propriété exclusive. Ensemble, ils ont créé un pont scintillant qui fusionne l'art traditionnel de nos anciens, les technologies interactives de demain et le plaisir pur du jeu éducatif."
    },
    {
      num: "Chapitre III",
      title: "L'Envol des Jeunes Phénix",
      text: "Ici, les jeunes voyageurs de l'espace peuvent concevoir de véritables œuvres d'art : structurer un scénario magique en trois actes, composer des mélodies intergalactiques et dessiner des masques spatiaux étincelants. Chaque projet soumis s'envole vers le Conseil des Sages : de prestigieux comités d'évaluation professionnels prêts à guider nos apprentis créateurs vers l'élite artistique mondiale !"
    }
  ],
  en: [
    {
      num: "Chapter I",
      title: "The Constellation Awakens",
      text: "Once upon a time, at the deepest edges of the digital cosmos, emerged a dreamscape of pure illumination called KIDI WORLD. This floating island in the comet trails is a secure virtual incubator and creative awakening platform, uniquely designed for children and youngsters aged 4 to 18."
    },
    {
      num: "Chapter II",
      title: "The Stellor Exclusive Alliance",
      text: "Born under a guiding celestial star, KIDI WORLD grew hand in hand with its loving custodian LINKYOURART (which is its sole proud owner). Together, they unified the gentle textures of traditional hand arts, the glowing spark of interactive computers, and the pure joy of simulated playing."
    },
    {
      num: "Chapter III",
      title: "Flight of the Young Phoenix",
      text: "On this launchpad, kids design real screenplays, compose side-room symphonies, and paint custom spaceship visors. Every single project submitted is presented to the High Council of Sages: real-world professional evaluation committees dedicated to elevating young talent into global art and design academies!"
    }
  ],
  es: [
    {
      num: "Capítulo I",
      title: "El Despertar de la Nebulosa",
      text: "Érase una vez, en los confines virtuales del ciberespacio, un santuario de luz pura y juego llamado KIDI WORLD. Este archipiélago espacial es una plataforma de incubación y de despertar creativo hecha a medida para niños y jóvenes de 4 a 18 años."
    },
    {
      num: "Capítulo II",
      title: "La Alianza Estelar Única",
      text: "Surgido bajo la mejor de las estrellas, KIDI WORLD se ha desarrollado en asociación exclusiva y propiedad de LINKYOURART. Juntos han creado un camino brillante que unifica las bellas artes tradicionales, la interactividad moderna y la potencia pedagógica del juego."
    },
    {
      num: "Capítulo III",
      title: "El Vuelo de los Nuevos Talentos",
      text: "Aquí, los jóvenes creadores diseñan historias en 3 actos, crean ritmos espaciales y proyectan cascos de cuarzo estelares. Lo más fabuloso es que cada obra se presenta al Consejo de LinkYourArt, comités expertos profesionales reales que abren puertas en los estudios de animación y moda de Madrid y París."
    }
  ],
  ja: [
    {
      num: "第一章",
      title: "無限への星のはじまり",
      text: "むかしむかし、デジタル宇宙の美しき深淵に、純粋な創造色の光線に満ちた星間島『KIDI WORLD』がありました。ここは4歳から18歳までの若き探険家たちが、自身の芸術的心を育むための安全なクリエイティブ学習フロンティアです。"
    },
    {
      num: "第二章",
      title: "王家の画廊との「独占盟約」",
      text: "もっとも心温まるお星さまの後援を受けて、こどもの世界は親元ギルド『LINKYOURART』（完全所有者）との確固たる信頼の約束によって結ばれました。絵の具などの伝統的なアナログ芸術のぬくもり、コンピュータがつくる最先端のデジタル技術、そして夢中になれるエデュケーショナルな仕掛けをみごとに融合させています。"
    },
    {
      num: "第三章",
      title: "若きインキュベーションの翼",
      text: "ここでは、脚本をつづり、宇宙のシンセサイザーの波形を作曲し、美しいヘルメット衣装をデジタルペイントできます。最も強力な魔法は、制作したアートボードがLinkYourArtのリアルの「賢者の審議会」（CGアニメスタジオや映画音楽のプロ審査委員会）にそのまま届き、世界の芸術業界へと羽ばたく未来チケットを授与してくれるのです！"
    }
  ]
};

export default function AboutUsSection({ language }: AboutUsSectionProps) {
  const [activeConstellation, setActiveConstellation] = useState<number | null>(null);
  const strings = CONST_TRANSLATIONS[language] || CONST_TRANSLATIONS["fr"];
  const storyChapters = CHAPTERS[language] || CHAPTERS["fr"];

  const constellationHubs = [
    { id: 1, title: strings.starArt, desc: strings.starArtDesc, icon: Palette, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", glow: "shadow-rose-500/10", top: "15%", left: "15%" },
    { id: 2, title: strings.starTech, desc: strings.starTechDesc, icon: Cpu, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/30", glow: "shadow-indigo-500/10", top: "45%", left: "75%" },
    { id: 3, title: strings.starPlay, desc: strings.starPlayDesc, icon: Gamepad2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", glow: "shadow-emerald-500/10", top: "75%", left: "20%" },
    { id: 4, title: strings.starJury, desc: strings.starJuryDesc, icon: Award, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", glow: "shadow-amber-500/10", top: "30%", left: "45%" }
  ];

  return (
    <div className="space-y-12 animate-fadeIn text-left">
      
      {/* 🔮 EPIC CHRONICLE HERO HEADER */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-900 shadow-2xl bg-slate-950 p-6 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 min-h-[300px]">
        
        {/* Poetics cosmic bg image */}
        <div className="absolute inset-0 z-0 opacity-20 hover:opacity-30 transition-opacity duration-1000 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200"
            alt="Cosmic Space Dust Theme"
            className="w-full h-full object-cover scale-110 rotate-1 animate-pulse"
            style={{ animationDuration: "12s" }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-amber-950/25" />
        </div>

        <div className="relative z-10 space-y-4 max-w-2xl text-left">
          <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            {strings.badge}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight font-sans">
            {strings.title}
          </h1>
          <p className="text-sm md:text-md text-slate-300 font-medium leading-relaxed">
            {strings.intro}
          </p>
        </div>

        <div className="relative z-10 shrink-0 bg-slate-900/95 backdrop-blur-md p-6 rounded-2xl border border-slate-800 text-left max-w-sm space-y-3.5 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/15 text-amber-400 rounded-lg border border-amber-500/20">
              <Users className="w-4 h-4" />
            </span>
            <strong className="text-sm text-white font-sans block">4 - 18 Ans / Éveil Universel</strong>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Créé pour structurer l'imaginaire des plus jeunes, les éduquer aux technologies créatives sans pression et les mettre en relation directe avec l'écosystème international d'évaluation de <strong className="text-amber-300 text-xs">LinkYourArt</strong>.
          </p>
        </div>
      </div>

      {/* 📚 THE POETIC CHRONICLES MAP - SIDE BY SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Storytelling Chronicle Chapters */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {storyChapters.map((ch, idx) => (
              <div 
                key={idx} 
                className="group relative bg-slate-900/40 hover:bg-slate-900/70 p-6 md:p-8 rounded-2xl border border-slate-800/80 hover:border-amber-500/30 transition-all duration-300 shadow-lg"
              >
                {/* Visual chapter glow indicator */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-amber-500/0 via-amber-500/45 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl" />
                
                <div className="flex justify-between items-start gap-3 mb-2.5">
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold font-mono">
                    {ch.num}
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500/30 group-hover:text-amber-400 group-hover:scale-110 transition-all" />
                </div>
                
                <h3 className="text-md md:text-lg font-bold text-slate-100 mb-2 font-sans">
                  {ch.title}
                </h3>
                
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed text-left whitespace-pre-line font-medium font-sans">
                  {ch.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 🌌 INTERACTIVE STAR CONSTELLATION MAP PANEL */}
        <div className="lg:col-span-5 bg-slate-950 p-6 rounded-3xl border border-slate-900 flex flex-col justify-between space-y-6 shadow-2xl overflow-hidden relative min-h-[460px]">
          
          {/* Subtle cosmic grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
          
          <div className="relative z-10 text-left">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans mb-1 block">
              {strings.constellationTitle}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              {strings.constellationSubtitle}
            </p>
          </div>

          {/* Actual Constellation canvas */}
          <div className="relative flex-1 w-full min-h-[250px] bg-slate-900/20 rounded-2xl border border-slate-900/40 overflow-hidden">
            
            {/* SVG Interactive Lines representing connectivity */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <line x1="15%" y1="15%" x2="45%" y2="30%" stroke="#d97706" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="45%" y1="30%" x2="75%" y2="45%" stroke="#6366f1" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="75%" y1="45%" x2="20%" y2="75%" stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="20%" y1="75%" x2="15%" y2="15%" stroke="#ec4899" strokeWidth="1" strokeDasharray="3,3" />
            </svg>

            {constellationHubs.map((hub) => {
              const IconComp = hub.icon;
              const isSelected = activeConstellation === hub.id;
              return (
                <div
                  key={hub.id}
                  className="absolute transition-all duration-300"
                  style={{ top: hub.top, left: hub.left }}
                >
                  <button
                    onMouseEnter={() => setActiveConstellation(hub.id)}
                    onMouseLeave={() => setActiveConstellation(null)}
                    className={`p-3 rounded-full border transition-all duration-300 relative select-none cursor-help ${
                      isSelected 
                        ? `${hub.bg} ${hub.border} scale-125 ring-4 ring-amber-500/10` 
                        : "bg-slate-950 border-slate-800 hover:scale-110"
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${hub.color}`} />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-extrabold text-slate-400 uppercase tracking-widest font-mono pointer-events-none">
                      {hub.title.split(" ")[0]}
                    </span>

                    {/* Glowing pulse rings for active state */}
                    <span className="absolute -inset-0.5 rounded-full bg-amber-400/5 animate-ping opacity-60 pointer-events-none" style={{ animationDuration: "10s" }} />
                  </button>
                </div>
              );
            })}

            {/* Default prompt or active metadata drawer */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/95 backdrop-blur-sm p-4 rounded-xl border border-slate-800 text-left min-h-[90px] flex items-center shadow-lg transition-all duration-300">
              {activeConstellation ? (
                <div className="space-y-1 animate-fadeIn">
                  <span className={`text-[9px] font-black uppercase tracking-wider block font-mono ${constellationHubs.find(h => h.id === activeConstellation)?.color}`}>
                    ★ {constellationHubs.find(h => h.id === activeConstellation)?.title}
                  </span>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    {constellationHubs.find(h => h.id === activeConstellation)?.desc}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-slate-500 animate-fadeIn">
                  <Compass className="w-5 h-5 text-slate-400/40 rotate-45" />
                  <span className="text-[10px] italic leading-normal font-sans">
                    N'hésite pas à passer ta souris (ou cliquer) sur l'une des 4 constellations célestes ci-dessus pour éclairer ton destin...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Secure brand footer with LinkYourArt alliance certificate */}
          <div className="bg-gradient-to-br from-amber-500/5 to-transparent p-4.5 rounded-2xl border border-amber-500/15 text-left space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-wider font-mono">
                {strings.allianceTitle}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed font-sans font-medium">
              {strings.allianceDesc}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { 
  Building, 
  Award, 
  Users, 
  MessageSquare, 
  Sparkles, 
  Lock, 
  ShieldAlert, 
  Check, 
  ChevronRight, 
  Search, 
  ArrowRight,
  Send,
  HelpCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import TranslatedText from './TranslatedText';

// Local translation dictionary for standard ui buttons and text in Partners Section
const PARTNERS_I18N: Record<string, Record<string, string>> = {
  "title": {
    fr: "Nos Partenaires & Mentors Réels 🤝",
    en: "Our Real-World Partners & Mentors 🤝",
    es: "Nuestros Socios y Mentores Reales 🤝",
    ja: "公式パートナー ＆ プロメンター 🤝"
  },
  "subtitle": {
    fr: "Découvre les prestigieuses entreprises et institutions artistiques qui parrainent les défis KidiWorld en partenariat avec LinkYourArt. Rêve en grand : de véritables rencontres, des bourses d'études et des stages t'attendent !",
    en: "Discover the prestigious art companies and institutions sponsoring KidiWorld challenges in partnership with LinkYourArt. Dream big: real meetings, scholarships, and professional internships are waiting for you!",
    es: "Descubre las prestigiosas marcas e instituciones que patrocinan los desafíos de KidiWorld en colaboración con LinkYourArt. ¡Grandes premios, becas de arte y prácticas exclusivas en París te esperan!",
    ja: "LinkYourArtプロとの提携により、KidiWorldの公認チャレンジを主催する超一流企業や教育機関をご紹介します。憧れのプロ現場訪問ツアー、制作奨学金、インターnシップなど夢のような特典が満載です！"
  },
  "filter.all": {
    fr: "🌍 Tous les milieux",
    en: "🌍 All Industries",
    es: "🌍 Todos los sectores",
    ja: "🌍 すべての業界"
  },
  "filter.cinema": {
    fr: "🎬 Cinéma & Écriture",
    en: "🎬 Cinema & Screenplay",
    es: "🎬 Cine y Guion",
    ja: "🎬 映画・シナリオ"
  },
  "filter.music": {
    fr: "🎵 Musique & Son",
    en: "🎵 Music & Sound",
    es: "🎵 Música y Sonido",
    ja: "🎵 音楽・サウンド"
  },
  "filter.gaming": {
    fr: "🎮 Jeu Vidéo & 3D",
    en: "🎮 Gaming & 3D Anim",
    es: "🎮 Videojuegos y 3D",
    ja: "🎮 ゲーム・3D"
  },
  "filter.fashion": {
    fr: "🎨 Stylisme & Design",
    en: "🎨 Fashion & Design",
    es: "🎨 Moda y Diseño",
    ja: "🎨 ファッション・デザイン"
  },
  "filter.photo": {
    fr: "📸 Photo & Archi",
    en: "📸 Photo & Archi",
    es: "📸 Foto y Arq",
    ja: "📸 写真・建築"
  },
  "sponsorBy": {
    fr: "Représentant officiel :",
    en: "Official Representative:",
    es: "Representante oficial:",
    ja: "公式メンター："
  },
  "industry": {
    fr: "Industrie :",
    en: "Industry:",
    es: "Sector:",
    ja: "所属業界："
  },
  "role": {
    fr: "Rôle dans les défis :",
    en: "Role in challenges:",
    es: "Rol en desafíos:",
    ja: "主な役割とメンター内容："
  },
  "rewards": {
    fr: "Récompenses majeures offertes :",
    en: "Major rewards offered:",
    es: "Premios principales que otorgan:",
    ja: "最優秀者への超豪華特典："
  },
  "applyBtn": {
    fr: "Postuler pour un stage de découverte 💼",
    en: "Apply for Discovery Internship 💼",
    es: "Postular a prácticas de verano 💼",
    ja: "お試しインターンプログラムに応募する 💼"
  },
  "testimonialTitle": {
    fr: "✨ Expérience vécue d'un jeune lauréat",
    en: "✨ Real Experience from a Young Laureate",
    es: "✨ Increíble testimonio de un ganador",
    ja: "✨ 先輩クリエイター（受賞者）の体験談"
  },
  "testimonialQuote": {
    fr: "« Grâce à ma victoire sur le Secret du Cachalot Stellaire, j'ai passé 5 jours entiers en immersion chez Canal+ et Mikros Image. J'ai assisté à une session de doublage réel et travaillé en tête-à-tête avec un grand réalisateur de renom. C'était le plus beau moment de ma vie et cela m'a donné envie d'écrire des films d'animation pour toujours ! »",
    en: "« Thanks to my victory on the Secret of the Cosmic Whale, I spent 5 entire days inside Canal+ and Mikros Image animation studios. I watched live sound dubbing and co-edited with a major director. It was the absolute highlight of my journey, and now I want to write animated movies forever! »",
    es: "« Gracias a mi victoria en el Secreto del Cachalote Estelar, pasé 5 días completos en Canal+ y en Mikros Image. Vi el doblaje en vivo y trabajé junto al director. ¡Fue extraordinario y me impulsó a escribir guiones de animación para siempre! »",
    ja: "« 『白鯨の秘密』チャレンジで最優秀賞に選ばれ、Canal+と大手アニメ制作スタジオMikros Imageで5日間の特別研修を受けました！BGMアフレコ作業に立ち会い、憧れの映画監督から直接シナリオのアドバイスをもらいました。映画の仕事に就くという夢が100倍リアルになりました！ »"
  },
  "parentForm": {
    fr: "Validation parentale : Code de Sécurité Adulte requis",
    en: "Parental Guard: Adult Security Authorization Required",
    es: "Verificación del Tutor: Código de Seguridad del Adulto",
    ja: "保護者確認：大人用認証コードの入力が必要です"
  },
  "parentFormSub": {
    fr: "Toutes les demandes de stage de KidiWorld font l'objet d'un accord systématique supervisé par LinkYourArt et les parents. Veuillez confirmer votre accord.",
    en: "All KidiWorld internship drafts undergo a rigorous review supervised by LinkYourArt and parents. Please authorize access.",
    es: "Todas las postulaciones de KidiWorld son evaluadas bajo la estricta supervisión de LinkYourArt y los padres directores.",
    ja: "KidiWorldのインターンへの仮エントリーは、LinkYourArt事務局と保護者の監督のもと安全かつ確実に行われます。"
  },
  "parentEmail": {
    fr: "Adresse e-mail du parent tuteur",
    en: "Parent Guardian Email Address",
    es: "Correo electrónico del tutor",
    ja: "保護者（保護責任者）のメールアドレス"
  },
  "parentCode": {
    fr: "Saisir le Code Adulte (Ex: 2026)",
    en: "Enter Adult Code (E.g. 2026)",
    es: "Código de Verificación (Ej: 2026)",
    ja: "大人用確認コード (例: 2026)"
  },
  "confirmCodeBtn": {
    fr: "Valider l'envoi sécurisé",
    en: "Submit Secure Form",
    es: "Validar y Enviar Solicitud",
    ja: "親の同意のもと送信する"
  },
  "applySuccess": {
    fr: "🎉 Demande de stage initiée avec succès ! Un dossier complet a été envoyé par e-mail à votre parent tuteur pour relecture et signature définitive.",
    en: "🎉 Internship request successfully initiated! A detailed syllabus was sent to your parent's email address for review and final signature.",
    es: "🎉 ¡Solicitud iniciada! Se ha enviado un correo con las directrices a la dirección de tu tutor para su aprobación.",
    ja: "🎉 インターンシップへの仮登録が完了しました！詳しい募集プログラム案をご登録の保護者メールへお届けしました。内容をご確認の上、ご承認ください。"
  }
};

interface Partner {
  id: string;
  name: string;
  category: "cinema" | "music" | "design" | "animation" | "photography" | "architecture";
  logoGradient: string;
  logoLetter: string;
  industry: Record<string, string>;
  roleInChallenges: Record<string, string>;
  majorRewards: Record<string, string[]>;
  sponsorName: string;
  sponsorTitle: Record<string, string>;
  sponsorQuote: Record<string, string>;
  sponsorAvatar: string;
}

const PARTNERS_DATA: Partner[] = [
  {
    id: "partner-canal",
    name: "Canal+ Création & Mikros Image",
    category: "cinema",
    logoGradient: "from-slate-900 to-black",
    logoLetter: "C+",
    industry: {
      fr: "Cinéma & Production Audiovisuelle",
      en: "Cinema & Audiovisual Production",
      es: "Cine y Producción Audiovisual",
      ja: "映画制作・マルチメディア配信"
    },
    roleInChallenges: {
      fr: "Parraine le Grand Prix du Meilleur Scénario, offre des bourses d'écriture exclusives et ouvre les portes des plus grands studios de production français.",
      en: "Sponsors the Best Screenplay Grand Prix, provides exclusive writing grants, and opens doors to top-tier animation studios in Europe.",
      es: "Patrocina el Gran Premio al Mejor Guion, distribuye becas de escritura creativa y otorga recorridos privados por famosos estudios cinematográficos.",
      ja: "脚本グランプリ（GRAND PRIX DU MEILLEUR SCÉNARIO）を後援。未来のシナリオライターへのプロ仕様執筆コーチングや機材・ツールを提供します。"
    },
    majorRewards: {
      fr: [
        "Stage d'observation de 5 jours en studio d'animation",
        "Rencontre privée et mentorat d'écriture à Paris",
        "Publication du script dans le magazine LinkYourArt"
      ],
      en: [
        "5-day immersive internship at Mikros Image studios",
        "1-on-1 private mentoring with a professional film director",
        "Feature publication of the winning screenplay in LinkYourArt Magazine"
      ],
      es: [
        "Prácticas de 5 días en salas de realización de animación",
        "Sesiones cara a cara con guionistas emblemáticos de Canal+",
        "Publicación completa de la obra en la antología digital de LinkYourArt"
      ],
      ja: [
        "大手アニメーション制作スタジオでの5日間お仕事潜入ツアー",
        "超一流映画監督によるマンツーマンシナリオ個人レッスン",
        "フランス全国誌『LinkYourArt』へのオリジナル脚本掲載"
      ]
    },
    sponsorName: "Jérôme Salle",
    sponsorTitle: {
      fr: "Réalisateur renommé & Membre d'Élite Canal+",
      en: "Famous Film Director & Elite Canal+ Board Member",
      es: "Director de cine de renombre y Jurado Mayor de Canal+",
      ja: "フランス著名映画監督 ＆ LinkYourArt上席諮問委員"
    },
    sponsorQuote: {
      fr: "« Les jeunes de 12 à 18 ans possèdent une liberté d'imagination incroyable, affranchie des conventions scolaires. KidiWorld est l'étincelle dont ils ont besoin. »",
      en: "« Teenagers have a level of imaginative freedom completely unburdened by conventions. KidiWorld offers the precise spark they need to thrive. »",
      es: "« Los jóvenes artistas de 12 a 18 años despliegan una imaginación libre de compromisos clásicos. Kidiworld es la plataforma catalizadora. »",
      ja: "« 10代のクリエイターが描く新鮮で大胆な発想は、プロをも唸らせるパワーがあります。このプラットフォームは最高の原石磨きの場です。 »"
    },
    sponsorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150"
  },
  {
    id: "partner-ubisoft",
    name: "Ubisoft Play & Pixar Labs",
    category: "animation",
    logoGradient: "from-indigo-600 via-indigo-700 to-indigo-950",
    logoLetter: "🌀",
    industry: {
      fr: "Jeu Vidéo, 3D Interactif & Animation Giga-Tech",
      en: "Videogames, 3D Interaction & Giga-Tech Animation",
      es: "Videojuegos, Modelado 3D y Entretenimiento Digital",
      ja: "グローバルゲーム開発・先端3Dテクノロジー"
    },
    roleInChallenges: {
      fr: "Soutient activement le laboratoire de jeu Kidi Gaming, fournit un moteur physique simple de simulation orbitale pour guider les codeurs en herbe.",
      en: "Supports Kidi Gaming labs, provides educational physics simulation tools, and parodies professional mobile game design workflows.",
      es: "Aporta software de física de gravedad adaptado y dirige el área Kidi Gaming para la creación de mecánicas de juego espaciales.",
      ja: "Kidi Gamingゲームシミュレーターにて重力や軌道パラメータの計算ロジック等を技術監修。ゲーム開発体験を全面的にバックアップします。"
    },
    majorRewards: {
      fr: [
        "Stage d'écriture d'une journée en co-design chez Ubisoft",
        "Stage junior aux Gobelins Ecole de l'Image",
        "Kit de programmation et tablette à stylet professionnelle"
      ],
      en: [
        "1-day game-design workshop with elite producers at Ubisoft",
        "Junior masterclass ticket at Les Gobelins Animation School",
        "High-end graphic design tablet & coding toolkit bundle"
      ],
      es: [
        "Un día privado de co-diseño con el jefe de producción de Ubisoft",
        "Seminario de iniciación de técnicas 3D en Les Gobelins",
        "Kit oficial de programación avanzado para tablet de dibujo premium"
      ],
      ja: [
        "Ubisoftデベロッパーチームとの1日体験共同合宿へのご招待",
        "名門美術学校『Les Gobelins』主催のジュニアアニメ講座招待券",
        "本格プロ仕様液晶ペンタブレット＆プログラミング教材キット"
      ]
    },
    sponsorName: "Yohann",
    sponsorTitle: {
      fr: "Lead Producer & Designer de Mondes Interactifs chez Ubisoft",
      en: "Lead Producer & Interactive World Builder at Ubisoft",
      es: "Productor de videojuegos y Diseñador Senior de Ubisoft Play",
      ja: "Ubisoft開発マネージャー ＆ ゲーム世界観設計チーフ"
    },
    sponsorQuote: {
      fr: "« Les règles physiques que nous programmons sont faites pour être repensées. J'adore voir comment les ados dérèglent ma physique avec inventivité ! »",
      en: "« The physical boundaries we establish in engines are meant to be rewritten. I love seeing kids tweak variables in such chaotic, elegant ways! »",
      es: "« Las constantes gravitacionales que codificamos están para ser manipuladas. ¡Me cautiva ver lo que crean los chicos cuando rompen los parámetros clásicos! »",
      ja: "« 私たちが作る物理ルールは、壊されるためにあります！子供たちが常識はずれな重力設定で作るオリジナルステージの面白さには、いつも圧倒されます。 »"
    },
    sponsorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150"
  },
  {
    id: "partner-radio-france",
    name: "Orchestre de Radio France & Hans Zimmer",
    category: "music",
    logoGradient: "from-blue-900 to-indigo-900",
    logoLetter: "RF",
    industry: {
      fr: "Musique Classique, Symphonique & Création de Bandes-sons",
      en: "Symphonic Orchestra & Sci-Fi Soundtrack Composers",
      es: "Música Clásica, Sinfonías y Composición Acústica",
      ja: "国立管弦楽団・映画オリジナルBGM制作"
    },
    roleInChallenges: {
      fr: "Assure la numérisation des partitions de Kidi Music, offre un mixage acoustique et met des musiciens de l'orchestre au service des harmonistes juniors.",
      en: "Translates primitive grid sequences into rich arrangements, evaluates music sheets, and provides expert acoustics guidance.",
      es: "Se encarga del tratamiento acústico de las notas de Kidi Music y pone su panel de instrumentistas al servicio de los jóvenes directores de sonido.",
      ja: "Kidi Music作曲スタジオにて制作されたメロディデータをオーケストラアレンジし、プロが本気でサウンド補正してマスター音源を書き出します。"
    },
    majorRewards: {
      fr: [
        "Enregistrement studio réel par de vrais musiciens d'orchestre",
        "Visite insolite d'une journée de la Maison de la Radio",
        "Morceau diffusé en première partie de leur concert"
      ],
      en: [
        "Live orchestra recording and acoustic mastering of your theme",
        "Exclusive backstage day pass at Maison de la Radio Paris",
        "Introductory broadcast of your song prior to professional concerns"
      ],
      es: [
        "Grabación sinfónica oficial por violinistas y cellistas profesionales",
        "Visita guiada por los icónicos pasillos de la Maison de la Radio",
        "Estreno de tu composición antes de una función real abierta"
      ],
      ja: [
        "フランス最高峰楽団の演奏者たちによる楽曲生吹込み＆録音",
        "パリ中央放送局『Maison de la Radio』バックステージご招待",
        "楽団が主催する公式リアル特別コンサートでのオープニング抜擢"
      ]
    },
    sponsorName: "Hans Zimmer & l'Orchestre",
    sponsorTitle: {
      fr: "Compositeurs de légende & Chefs de Choeur pro",
      en: "Legendary Composers & Symphonic Orchestra Directors",
      es: "Directores de sinfónica y Compositores de Hollywood",
      ja: "巨匠作曲チーム ＆ ラジオフランス管弦楽団"
    },
    sponsorQuote: {
      fr: "« Tout grand film commence par un simple thème de trois notes sur un piano. Kidi Music donne aux enfants cette précieuse liberté de pianotage. »",
      en: "« Every legendary space opera begins with a basic 3-note theme. Kidi Music grants children the workspace and immediate feedback to find it. »",
      es: "« Todo hito cinematográfico descansa sobre una progresión de tres notas de piano. Esta lutherie IA acerca esa magia al alcance de un clic. »",
      ja: "« すべての大ヒット映画は、ピアノで爪弾いた3音だけのメロディから生まれます。ここから未来のスター作曲家が羽ばたくと確信しています。 »"
    },
    sponsorAvatar: "https://images.unsplash.com/photo-1547037579-f0fc020ac3be?q=80&w=150"
  },
  {
    id: "partner-chanel",
    name: "Chanel Creative House",
    category: "design",
    logoGradient: "from-slate-800 via-zinc-900 to-black",
    logoLetter: "CH",
    industry: {
      fr: "Haute Couture, Stylisme de Costumes & Design d'Objet",
      en: "Haute Couture, Costume Styling & Creative Design",
      es: "Alta Costura, Sastrería de Época y Moda Estelar",
      ja: "パリ・オートクチュール（最高級衣装仕立て）・デザイン"
    },
    roleInChallenges: {
      fr: "Sponsorise les projets d'habillage d'équipage basés sur nos tampons de costume et aide les jeunes designers à modéliser leurs étoffes galactiques.",
      en: "Backs our clothing design challenges, evaluates color patterns and provides a virtual canvas for cosmic costume design.",
      es: "Presta ayuda didáctica mediante plantillas de diseño y paradrino de ideas de confecciones de trajes estelares en el área Drawing Board.",
      ja: "『宇宙飛行士用スーツ』などの衣服・テキスタイル公認チャレンジを支援。デザイナーを目指す子供たちにプロ用の裁断から製図、色彩講習をサポート。"
    },
    majorRewards: {
      fr: [
        "Immersion VIP de 3 jours dans de réels ateliers parisiens",
        "Aiguille d'Or de l'Académie Mode et patron imprimé en soie",
        "Participation à l’atelier de co-création de costumes d'animation"
      ],
      en: [
        "3-day elite VIP access to Parisian sewing workshops",
        "Gold needle certificate with your model sewn into rare silk",
        "Direct collaboration workshop with animation costume designers"
      ],
      es: [
        "Acceso VIP de 3 días en los talleres de costureras Chanel París",
        "Certificación Honorífica 'Aguja de Oro' y modelo en material real",
        "Colaboración con directores creativos textiles para cine animado"
      ],
      ja: [
        "パリの歴史ある最高級アトリエへの特別密着3日間VIPツアー",
        "『金の針（Aiguille d'Or）』公式認定証 ＆ 絹の仕立て模型",
        "新作3D映画のキャラクター用衣装設定ミーティングへの参加権"
      ]
    },
    sponsorName: "Virginie Viard",
    sponsorTitle: {
      fr: "Directrice Artistique Senior de Haute Couture",
      en: "Senior Creative Director of French Haute Couture",
      es: "Directora Artística del Departamento Textil y Alta Costura",
      ja: "オートクチュール部門責任者 ＆ リードスタイリスト"
    },
    sponsorQuote: {
      fr: "« Les combinaisons spatiales de KidiWorld combinent poésie rétro et textiles futuristes. C'est du grand art de stylisme. »",
      en: "« KidiWorld's cosmic outfits combine classic retro elegance with amazing futuristic bio-textiles. It is true design playground. »",
      es: "« Los trajes estelares diseñados por estos niños son una joya que abraza la poesía del mañana. Recompensemos su audacia. »",
      ja: "« KidiWorldの参加者が描く宇宙戦闘服は、型にハマらない配色使い、斬新な幾何学模様があり毎回アトリエ全員で感嘆しています。 »"
    },
    sponsorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150"
  },
  {
    id: "partner-arthus",
    name: "Yann Arthus-Bertrand Foundation",
    category: "photography",
    logoGradient: "from-emerald-950 via-slate-900 to-indigo-950",
    logoLetter: "YB",
    industry: {
      fr: "Astrophotographie, Grand Reportage & Défense de l'Environnement",
      en: "Astrophotography, Land Conservation & Photojournalism",
      es: "Astrofotografía de Exposición, Conservación y Reportería",
      ja: "宇宙環境写真・大自然フォトジャーナリズム"
    },
    roleInChallenges: {
      fr: "Soutient les épreuves de photographie créative et d'exposition de paysages stellaires, et anime de petits ateliers éducatifs sur la lumière.",
      en: "Guides our nature & astrophotography trials, teaching junior reporters how to capture lightning, lenses, and perspective dynamics.",
      es: "Dirige el desafío KIDI PHOTOGRAPHY con tutorías rápidas sobre exposición de luz, encuadres dinámicos y fotografía planetaria.",
      ja: "『KIDI PHOTOGRAPHY』写真チャレンジを全面支援。宇宙の神秘、光と影のコントラストの捉え方、色彩構図などをプロ講師陣が講評。"
    },
    majorRewards: {
      fr: [
        "Exposition physique grand format à la Biennale de LinkYourArt",
        "Après-midi de mentorat exclusif avec un reporter de National Geographic",
        "Boîtier photo hybride professionnel livré chez vous"
      ],
      en: [
        "Large-scale physical exposition at the LinkYourArt Biennale",
        "Private mentoring afternoon with a National Geographic photographer",
        "Elite mirrorless hybrid camera set delivered to your door"
      ],
      es: [
        "Exposiciones a gran escala en la Bienal Internacional de París",
        "Charla técnica de 3 horas con el equipo de National Geographic",
        "Cámara fotográfica premium híbrida con equipo de lentes avanzado"
      ],
      ja: [
        "国際美術祭『LinkYourArtビエンナーレ』での特大パネル実物展示",
        "ナショナル ジオグラフィック公式写真家とのオンライン授業",
        "一眼レフ（ハイスペック・ハイブリッド）カメラセット一式贈呈"
      ]
    },
    sponsorName: "Yann Arthus-Bertrand",
    sponsorTitle: {
      fr: "Photographe de renom & Éco-Réalisateur pro",
      en: "World-Renowned Photographer & Environmental Film Director",
      es: "Fotógrafo de renombre internacional y Ambientalista",
      ja: "世界的に有名なエコロジー映像監督・巨匠写真家"
    },
    sponsorQuote: {
      fr: "« Photographier le ciel ou un sillage cosmique, c'est apprendre à regarder notre propre Terre avec humilité. C'est ce que KidiWorld prépare si bien. »",
      en: "« Photographing a galaxy or stellar dust teaches how to respect our own planet. KidiWorld builds that artistic awareness. »",
      es: "« Capturar los destellos de una estrella fugaz educa nuestra mirada sobre la fragilidad terrestre. Bravo por incentivar esta destreza. »",
      ja: "« 大空を切り取り、輝く宇宙を写真に残す。それは私たちが住む地球という星を、いかに大切に守るかを考える第一歩です。 »"
    },
    sponsorAvatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=150"
  },
  {
    id: "partner-nouvel",
    name: "Architectes Associés de la Nébuleuse & Jean Nouvel",
    category: "architecture",
    logoGradient: "from-amber-600 via-stone-850 to-stone-950",
    logoLetter: "JN",
    industry: {
      fr: "Architecture Éco-Futuriste, Impression 3D des Cités & Urbanisme",
      en: "Eco-Futuristic Architecture & Large-scale Urban Masterplanning",
      es: "Arquitectura Sostenible, Impresión 3D y Urbanismo Estelar",
      ja: "持続可能な未来都市設計・3Dプリンタ建築工学"
    },
    roleInChallenges: {
      fr: "Parraine les plans d'architecture de dômes éco-suffisants dans l'espace, initie les ados au dessin de coupes transversales de structures d'acier.",
      en: "Sponsors our space-dwelling masterplanning challenges, teaching kids structure balancing and ecological biospheres.",
      es: "Mentor especializado de croquis de megasestructuras suspendidas e impresión de maquetas termo-activas mediante dômes.",
      ja: "『宇宙に浮かぶ空中都市』などの環境共生都市モデルの募集・設計指導。3Dモデリングソフトや模型の組み立て技術をサポート。"
    },
    majorRewards: {
      fr: [
        "Modélisation et impression 3D grandiose de votre croquis de cité",
        "Revue constructive privée de 2 heures par Jean Nouvel et ses associés",
        "Bourse d'étude Art & Sciences de l'Académie"
      ],
      en: [
        "Giant 3D printing and modeling of your architectural sketches",
        "Private 2-hour architectural review session with Jean Nouvel",
        "Official Art & Science Young Architect Scholarship stipend"
      ],
      es: [
        "Modelado integral e impresión 3D a gran escala de tu plano",
        "Crítica constructiva privada de 2 horas con Jean Nouvel",
        "Beca de impulso de estudios 'Arte, Ciencia e Infraestructura'"
      ],
      ja: [
        "応募されたスケッチをプロの手で特大3D精密模型化＆贈呈",
        "ジャン・ヌーヴェル本人が教える120分間の個別設計講評会",
        "青少年アーキテクト育成『芸術と科学』公式教育奨学金"
      ]
    },
    sponsorName: "Jean Nouvel",
    sponsorTitle: {
      fr: "Grand Architecte Lauréat du Prix Pritzker",
      en: "World-Renowned Architect & Pritzker Prize Laureate",
      es: "Arquitecto de Prestigio y Ganador del Premio Pritzker",
      ja: "世界最高峰建築家（プリツカー賞受賞者）"
    },
    sponsorQuote: {
      fr: "« Imaginer des habitations au milieu d'une nébuleuse, c'est concevoir le dôme de protection de demain. C'est de l'ingénierie poétique pure. »",
      en: "« Designing megastructures on asteroid belts forces us to reconsider future protective biospheres. Pure poetic engineering. »",
      es: "« Diseñar hábitats suspendidos en el vacío nos empuja a concebir refugios bioclimáticos vitales. Adoro este enfoque lúdico y profundo. »",
      ja: "« 暗黒の宇宙空間や星雲の近くに人間の住環境を置く。究極のサステナブル建築を考える発想力には目を見張るものがあります。 »"
    },
    sponsorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150"
  }
];

interface PartnersSectionProps {
  language: "fr" | "en";
}

export default function PartnersSection({ language }: PartnersSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  
  // Interactive internship application simulation state
  const [isApplying, setIsApplying] = useState<Partner | null>(null);
  const [parentEmail, setParentEmail] = useState("parents@kidiworld.org");
  const [adultCode, setAdultCode] = useState("");
  const [applySuccessMessage, setApplySuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const translate = (key: string) => {
    const table = PARTNERS_I18N[key];
    if (!table) return key;
    return table[language] || table["fr"] || key;
  };

  const getFilteredPartners = () => {
    if (activeCategory === "all") return PARTNERS_DATA;
    return PARTNERS_DATA.filter(p => p.category === activeCategory);
  };

  const handleApplyInternship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentEmail.trim() || !parentEmail.includes("@")) {
      setErrorMessage(
        language === "fr" ? "S'il vous plaît, entrez une adresse e-mail parentale valide !" :
        language === "en" ? "Please provide a valid parent email address!" :
        language === "es" ? "Por favor ingresa un correo de tutor válido." : "有効なメールアドレスを入力してください。"
      );
      return;
    }

    if (adultCode.trim() !== "2026") {
      setErrorMessage(
        language === "fr" ? "⚠️ Code Adulte erroné. Demandez l'aide de votre parent (Réponse: 2026) !" :
        language === "en" ? "⚠️ Incorrect Adult Code. Please ask your parent for confirmation (E.g. 2026)!" :
        language === "es" ? "⚠️ Código erróneo. Solicita ayuda de tu tutor (Código: 2026)" : "⚠️ 大人用コードが違います。保護者の方にお聞きください (答え: 2026)"
      );
      return;
    }

    setErrorMessage("");
    setApplySuccessMessage(true);
    setTimeout(() => {
      setApplySuccessMessage(false);
      setIsApplying(null);
      setAdultCode("");
    }, 5000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-left pt-2">
      
      {/* HEADER BANNER ZONE */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-6 md:p-10 rounded-[2.5rem] border border-slate-900 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-10 w-96 h-48 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-96 h-48 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] bg-amber-500/10 text-amber-400 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest font-mono border border-amber-500/10 animate-pulse">
              🏆 LinkYourArt & KidiWorld Alliance
            </span>
            <h2 className="text-2xl md:text-3.5xl font-black text-white tracking-tight font-sans">
              {translate("title")}
            </h2>
            <p className="text-xs text-slate-400 font-medium max-w-3xl leading-relaxed">
              {translate("subtitle")}
            </p>
          </div>

          <div className="p-4 bg-slate-950/90 border border-slate-900/90 rounded-2xl flex items-center gap-3 shrink-0 font-mono">
            <div className="p-2 sm:p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-bold block">PARTENARIATS PRO</span>
              <span className="text-xs font-black text-white block">7 Leaders Mondiaux</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS ROW */}
      <div className="bg-slate-900/50 p-1.5 rounded-2xl border border-slate-900/80 flex flex-wrap gap-1.5 shadow-md">
        <button
          onClick={() => { setActiveCategory("all"); setSelectedPartner(null); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeCategory === "all" ? "bg-slate-950 text-white border border-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {translate("filter.all")}
        </button>
        <button
          onClick={() => { setActiveCategory("cinema"); setSelectedPartner(null); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeCategory === "cinema" ? "bg-slate-950 text-amber-400 border border-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {translate("filter.cinema")}
        </button>
        <button
          onClick={() => { setActiveCategory("music"); setSelectedPartner(null); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeCategory === "music" ? "bg-slate-950 text-violet-400 border border-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {translate("filter.music")}
        </button>
        <button
          onClick={() => { setActiveCategory("animation"); setSelectedPartner(null); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeCategory === "animation" ? "bg-slate-950 text-emerald-450 border border-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {translate("filter.gaming")}
        </button>
        <button
          onClick={() => { setActiveCategory("design"); setSelectedPartner(null); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeCategory === "design" ? "bg-slate-950 text-pink-400 border border-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {translate("filter.fashion")}
        </button>
        <button
          onClick={() => { setActiveCategory("photography"); setSelectedPartner(null); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeCategory === "photography" || activeCategory === "architecture" ? "bg-slate-950 text-cyan-400 border border-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {translate("filter.photo")}
        </button>
      </div>

      {/* CORE PARTNERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredPartners().map((partner) => {
          const isSelected = selectedPartner?.id === partner.id;
          return (
            <div
              key={partner.id}
              className={`bg-slate-950/90 border rounded-3xl overflow-hidden transition-all duration-300 relative select-none flex flex-col justify-between ${
                isSelected 
                  ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20" 
                  : "border-slate-900 hover:border-slate-800 hover:-translate-y-1 shadow-xl"
              }`}
            >
              <div>
                {/* Visual Icon Header Representation of Logo */}
                <div className="p-5 border-b border-slate-900 bg-slate-900/30 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${partner.logoGradient} flex items-center justify-center font-sans shadow-md border border-slate-800 shrink-0`}>
                    <span className="text-sm font-black text-white tracking-widest uppercase">{partner.logoLetter}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-white hover:text-amber-400 block tracking-tight truncate">
                      {partner.name}
                    </h3>
                    <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest font-mono block">
                      {partner.category.toUpperCase()} SPONSOR
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-4">
                  
                  {/* Industry Label */}
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono block">
                      {translate("industry")}
                    </span>
                    <p className="text-xs text-slate-200 font-bold">
                      {partner.industry[language] || partner.industry["fr"]}
                    </p>
                  </div>

                  {/* Core Role Description */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono block">
                      {translate("role")}
                    </span>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      {partner.roleInChallenges[language] || partner.roleInChallenges["fr"]}
                    </p>
                  </div>

                  {/* Rewards Bullet List */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono block">
                      {translate("rewards")}
                    </span>
                    <ul className="space-y-1.5">
                      {(partner.majorRewards[language] || partner.majorRewards["fr"]).map((rewardText, index) => (
                        <li key={index} className="flex gap-2 items-start text-xs font-semibold text-slate-300">
                          <Check className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
                          <span>{rewardText}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>

              {/* Bottom Actions Drawer */}
              <div className="p-5 border-t border-slate-900 bg-slate-900/20 flex flex-col gap-3">
                {/* Expand profile and testimonials */}
                <button
                  type="button"
                  onClick={() => setSelectedPartner(isSelected ? null : partner)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  {isSelected ? (
                    language === "fr" ? "Masquer les détails 📑" :
                    language === "en" ? "Hide details 📑" :
                    language === "es" ? "Ocultar detalles 📑" : "詳細を閉じる 📑"
                  ) : (
                    language === "fr" ? "Voir le message du Mentor 💬" :
                    language === "en" ? "View Representative Speech 💬" :
                    language === "es" ? "Ver mensaje del jurado 💬" : "プロ審査員からの応援メッセージ 💬"
                  )}
                </button>

                {/* Apply with Family Consent button */}
                <button
                  type="button"
                  onClick={() => setIsApplying(partner)}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer transition flex items-center justify-center gap-1.5 transform active:scale-95"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  {translate("applyBtn")}
                </button>
              </div>

              {/* Expanded Testimonial Area Drawer */}
              {isSelected && (
                <div className="p-5 border-t border-dashed border-slate-800 bg-slate-950 text-xs font-sans space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <img
                      src={partner.sponsorAvatar}
                      alt={partner.sponsorName}
                      className="w-10 h-10 rounded-full object-cover border border-indigo-500/20"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <strong className="text-white block font-bold leading-tight">
                        {partner.sponsorName}
                      </strong>
                      <span className="text-[10px] text-indigo-400 block font-bold font-mono">
                        {partner.sponsorTitle[language] || partner.sponsorTitle["fr"]}
                      </span>
                    </div>
                  </div>

                  <div className="relative p-3.5 bg-indigo-950/20 border border-indigo-900/40 rounded-2xl italic text-slate-300 leading-relaxed font-medium">
                    <div className="absolute top-2 right-3 text-2xl text-indigo-850 leading-none select-none">”</div>
                    {partner.sponsorQuote[language] || partner.sponsorQuote["fr"]}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* SECURE POPUP INTERNSHIP APPLICATION MODAL */}
      {isApplying && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl flex justify-center items-center z-[99999] p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-950 border border-amber-500/35 rounded-[2.5rem] shadow-[0_0_80px_rgba(245,158,11,0.2)] p-6 md:p-8 text-left space-y-6">
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-indigo-500 rounded-t-[2.5rem]" />

            <div className="space-y-1">
              <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full font-mono font-bold uppercase inline-block">
                🔐 KidiSafe Guarded Portal
              </span>
              <h3 className="text-lg md:text-xl font-black text-white leading-tight">
                {translate("parentForm")}
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                {translate("parentFormSub")}
              </p>
            </div>

            {/* Targeted internship summary description */}
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-start gap-4">
              <div className={`w-10 h-10 bg-gradient-to-tr ${isApplying.logoGradient} rounded-xl shrink-0 border border-slate-800 flex items-center justify-center text-xs font-black text-white`}>
                {isApplying.logoLetter}
              </div>
              <div className="text-xs">
                <span className="text-[10px] block font-bold uppercase text-slate-500">PROGRAMME DISPENSÉ PAR :</span>
                <strong className="text-white block">{isApplying.name}</strong>
                <span className="text-[10.5px] text-amber-400 font-bold block mt-1">
                  🎯 Stage "Art & Technologie d'Avenir" admissible 4-18 ans
                </span>
              </div>
            </div>

            <form onSubmit={handleApplyInternship} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block">
                  {translate("parentEmail")}
                </label>
                <input
                  type="email"
                  required
                  placeholder="parents@kidiworld.org"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none transition font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block">
                  {translate("parentCode")}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••"
                  value={adultCode}
                  onChange={(e) => setAdultCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none transition font-mono tracking-widest text-center"
                />
              </div>

              {errorMessage && (
                <div className="text-[11px] text-rose-455 font-bold leading-normal">
                  {errorMessage}
                </div>
              )}

              {applySuccessMessage && (
                <div className="p-4 bg-emerald-500/10 text-emerald-400 text-xs font-semibold leading-relaxed border border-emerald-500/20 rounded-2xl animate-pulse">
                  {translate("applySuccess")}
                </div>
              )}

              <div className="pt-4 flex gap-3 h-11 shrink-0">
                <button
                  type="button"
                  onClick={() => { setIsApplying(null); setErrorMessage(""); setAdultCode(""); }}
                  className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer text-center"
                >
                  Fermer [×]
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  {translate("confirmCodeBtn")}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* LAUREATE REAL-TESTIMONIAL STORIES CAROUSEL CARD */}
      <div className="bg-gradient-to-br from-indigo-950/25 via-slate-900/95 to-pink-950/15 p-6 md:p-8 rounded-[2.5rem] border border-slate-900 flex flex-col md:flex-row gap-6 items-center text-left relative overflow-hidden">
        <div className="absolute top-0 right-10 w-48 h-20 bg-pink-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-48 h-20 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="p-3.5 bg-gradient-to-tr from-indigo-650 via-purple-650 to-pink-650 rounded-2xl shrink-0 border border-slate-800">
          <MessageSquare className="w-10 h-10 text-white animate-bounce" style={{ animationDuration: '4s' }} />
        </div>

        <div className="space-y-2 relative z-10">
          <span className="text-[10px] text-pink-400 font-extrabold uppercase tracking-widest font-mono">
            {translate("testimonialTitle")}
          </span>
          <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
            {translate("testimonialQuote")}
          </p>
          <span className="text-[11px] block text-slate-400 font-bold">
            💡 — <strong className="text-slate-200">Bastien, 14 ans</strong>, Lauréat d'Élite du Grand Prix de Scénarisation de l'Académie
          </span>
        </div>
      </div>

    </div>
  );
}

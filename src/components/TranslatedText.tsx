import React, { useState, useEffect } from "react";
import { Languages } from "lucide-react";

interface TranslatedTextProps {
  text: string;
  targetLang: "fr" | "en";
  className?: string;
  isParagraph?: boolean;
}

// MILLIMETER ACCURATE STATIC BILINGUAL DICTIONARY FOR ALL STRUCTURAL CONTENT
const STATIC_DICTIONARY: Record<string, Record<string, string>> = {
  // --- Challenges Titles ---
  "grand prix du meilleur scénario : le secret du cachalot stellaire": {
    en: "🏆 GRAND PRIX FOR BEST SCREENPLAY: The Stellar Sperm Whale's Secret",
    es: "🏆 Gran Premio al Mejor Guión: El Secreto del Cachalote Cósmico",
    ja: "🏆 最優秀脚本賞：スペース・マッコウクジラの秘密"
  },
  "grand prix kidi design & mode : les scaphandres de la haute coque": {
    en: "👗 KIDI DESIGN & FASHION GRAND PRIX: Spacesuits of the Haute Coque",
    es: "👗 Gran Premio Kidi Diseño y Moda: Trajes galácticos de Alta Costura",
    ja: "👗 Kidi ファッション＆宇宙服デザイン大賞のコンクール"
  },
  "kidi photography : les gardiens de l'ombre et de la lumière": {
    en: "📷 KIDI PHOTOGRAPHY: Guardians of Shadow and Light",
    es: "📷 Kidi Fotografía: Los Guardianes de la Luz y de la Sombra",
    ja: "📷 Kidi 写真コンテスト：光と影のガーディアン"
  },
  "kidi 3d & jeux : l'arène des astéroïdes en gravité zéro": {
    en: "👾 KIDI 3D & GAMES: The Zero-Gravity Asteroid Arena",
    es: "👾 Kidi 3D y Juegos: La Arena de Asteroide en Gravedad Cero",
    ja: "👾 Kidi 3D＆ゲーム：無重力小惑星アリーナの開発"
  },
  "prix linkyourart soundscapes : l'hymne cosmique du cachalot": {
    en: "🎼 LINKYOURART SOUNDSCAPES AWARD: Cosmic Whale Hymn",
    es: "🎼 Premio LinkYourArt Soundscapes: El Himno Cósmico del Cachalote",
    ja: "🎼 最優秀サウンドスケープ賞：クジラの宇宙賛歌"
  },
  "kidi architecture : la cité d'or suspendue dans la nébuleuse": {
    en: "🏛️ KIDI ARCHITECTURE: Golden Sky City in the Nebula",
    es: "🏛️ Kidi Arquitectura: La Ciudad de Oro flotante en la Nebulosa",
    ja: "🏛️ Kidi 建築デザイン：星雲に浮かぶ未来の黄金都市設計"
  },
  "le voyage cosmique des petits pas - prix junior": {
    en: "🌟 The Cosmic Journey of Small Steps - JUNIOR PRIZE",
    es: "🌟 El Viaje Cósmico de los Primeros Pasos - PREMIO JUNIOR",
    ja: "🌟 ちいさな一歩の宇宙旅行 - ジュニア特別賞"
  },

  // --- Challenges Subtitles ---
  "défi scénaristique d'élite parrainé par jérôme salle & canal+": {
    en: "Elite screenwriting challenge sponsored by Jérôme Salle & Canal+",
    es: "Desafío de guión de élite patrocinado por Jérôme Salle y Canal+",
    ja: "ジェローム・サール＆Canal+公認の脚本家登竜門チャレンジ"
  },
  "concours national de photographie parrainé par yann arthus-bertrand": {
    en: "National photography contest sponsored by Yann Arthus-Bertrand",
    es: "Concurso nacional de fotografía patrocinado por Yann Arthus-Bertrand",
    ja: "ヤン・アルテュス・ベルトラン後援：全国デジタル写真大賞"
  },
  "défi de stylisme et de design d'uniformes d'équipage avec chanel": {
    en: "Space suit stylism and design challenge in partnership with Chanel",
    es: "Desafío de diseño de uniformes espaciales con chanel",
    ja: "シャネル協力：宇宙飛行士の近未来衣装デザイン・スケッチ"
  },
  "concours d'innovation interactive & game design d'animation avec ubisoft & pixar": {
    en: "Interactive innovation of animation game design with Ubisoft & Pixar",
    es: "Concurso de diseño de videojuegos interactivos con Ubisoft y Pixar",
    ja: "Ubisoft＆Pixar協力：ゲームデザイン、物理演算アリーナ"
  },
  "un chef-d'œuvre symphonique d'initiation avec l'orchestre de radio france": {
    en: "Symphonic masterpiece program with Radio France Symphony Orchestra",
    es: "Obra de arte sinfónica con la Orquesta Filarmónica de Radio France",
    ja: "フランス国立放送管弦楽団による交響楽アレンジ権の獲得"
  },
  "concours d'éco-architecture & design néo-futuriste avec jean nouvel": {
    en: "Neo-futuristic eco-architecture and construction with Jean Nouvel",
    es: "Concurso de arquitectura solar eco-sostenible con Jean Nouvel",
    ja: "世界的建築家ジャン・ヌーヴェル後援：エコ太陽都市設計コンクール"
  },
  "challenge démo de dessin et d'initiation colorée pour les plus jeunes": {
    en: "Demo challenge of drawing and colorful initiation for young minds",
    es: "Desafío de demostración de dibujo e iniciación al color para los niños más pequeños",
    ja: "デモ・ドローイング、色付け、お絵描きの入門用プチ講習"
  },

  // --- Descriptions of Challenges ---
  "plongez au cœur d'un univers où les cachalots de lumière guident les explorateurs cosmiques. composez un court-métrage captivant d'animation d'une poésie rare. le projet lauréat recevra le prestigieux prix du meilleur scénario chez linkyourart, comprenant une rencontre en tête-à-tête privilégiée avec un grand réalisateur de renom, ainsi qu'un stage immersif d'observation de 5 jours dans un des meilleurs studios d'animation partenaires (comme mikros image ou les gobelins) et la visite vip guidée de leurs studios d'écriture à paris !": {
    en: "Dive into a universe where light whales guide cosmic explorers. Compose a captivating animated short film of rare poetry. The winning project will receive the prestigious BEST SCREENPLAY AWARD at LinkYourArt, including a privileged one-on-one meeting with a world-renowned director, as well as an immersive 5-day observation internship in one of our partner animation studios (like Mikros Image or Gobelins) and a VIP guided tour of their writing studios in Paris!",
    es: "Plérgete en el corazón de un universo donde cachalotes de luz guían a los exploradores cósmicos. El proyecto ganador recibirá el Premio LinkYourArt al Mejor Guión con prácticas profesionales en París.",
    ja: "光り輝くマッコウクジラが宇宙の探検家を導く神秘的な世界へようこそ。心温まる短編映画の脚本案を作成しましょう。最優秀作品には、有名監督との対面指導、有名アニメ制作会社での5日間の専門見学ワークショップが贈られます。"
  },
  "capter l'invisible, raconter une histoire forte par le jeu de l'exposition, de la perspective astrale et du cadrage ! le grand vainqueur de ce challenge kidi photography remportera une session de mentorat personnalisé d'une demi-journée en direct avec un photographe globe-trotteur de national geographic, ainsi que l'exposition physique grand format de son tirage final lors de la prochaine biennale internationale d'art contemporain de linkyourart !": {
    en: "Capture the invisible, tell a powerful story through exposure, astral perspective, and framing! The grand winner of this KIDI PHOTOGRAPHY challenge will win a half-day live personalized mentoring session with a globe-trotting National Geographic photographer, as well as the large-format physical exhibition of their final print during the next LinkYourArt International Biennial of Contemporary Art!",
    es: "¡Captura lo invisible y cuenta una gran historia! Gana sesiones de mentoría con un fotógrafo de National Geographic y exposición real en la Galería de París.",
    ja: "見えない光をとらえ、露出・透視図法・構図の魔法によって物語を表現しよう！受賞者には、ナショナル・ジオグラフィック所属写真家による半日マンツーマン指導のほか、LinkYourArt国際ビルエナールでの現物展示権が贈られます。"
  },
  "dessiner l'élégance de nos futurs explorateurs célestes ! ce défi kidi design & mode vous invite à imaginer la tenue de vol officielle de la mission kidiworld en intégrant des éclats de quartz cosmique et des fibres intelligentes à mémoire de forme. le lauréat certifié remportera le trophée du jeune créateur de l'année, ainsi qu'un stage exceptionnel de 3 jours au cœur des ateliers de haute couture à paris !": {
    en: "Designing elegance for our future celestial explorers! This KIDI DESIGN & FASHION challenge invites you to imagine the official KidiWorld mission flight suit by integrating cosmic quartz shards and smart shape-memory fibers. The certified winner will receive the Young Creator of the Year Trophy, as well as an exceptional 3-day internship at the heart of the Haute Couture workshops in Paris!",
    es: "¡Diseña uniformes espaciales elegantes para exploradores galácticos! Prácticas exclusivas de 3 días en talleres de costura de moda en París.",
    ja: "未来の宇宙飛行士たちの優雅な装いをデザインしよう！形状記憶繊維やクォーツ結晶を取り入れた制服のアイデアを募集します。受賞者には、パリの一流オートクチュール工房での憧れの3日間インターンシップ体験が贈られます。"
  },
  "préparez la physique du cosmos, sculptez un parcours d'esquive millimétré et pilotez vos rêves de créateur de mondes ! pour ce défi kidi 3d & jeux, concevez le prototype d'un mini-jeu mobile idéal en modifiant les forces de gravité et la vitesse des projectiles. le gagnant du trophée d'excellence 'junior game changer' remportera une invitation vip de rêve pour une visite privée exclusive des ateliers de développement d'ubisoft, accompagnée d'un après-midi complet de co-design avec un lead producer !": {
    en: "Prepare the physics of the cosmos, sculpt a millimeter-precise dodge course, and navigate your dreams of world building! For this KIDI 3D & GAMES challenge, design the prototype of an ideal mobile mini-game by modifying gravity forces and projectile speed. The winner of the 'Junior Game Changer' Excellence Trophy will win a dream VIP invitation for an exclusive private visit to Ubisoft's development workshops, accompanied by a full afternoon of co-design with a Lead Producer!",
    es: "¡Confecciona la física ideales en gravedad cero y gana visitas vips de ensueño en los estudios de Ubisoft!",
    ja: "宇宙での物理数値をプログラムし、精密な障害物避けゲームをプロトタイピングしましょう。最優秀賞の「ジュニア・ゲームチェンジャー」には、Ubisoftの開発スタジオへのVIP招待とリードプロデューサーとの共同ゲームデザイン体験が贈られます。"
  },
  "traduire le son de la bioluminescence stellaire en mélodies intergalactiques ! pour ce défi kidi music, composez une symphonie spatiale envoûtante et lumineuse en jouant sur l'oscillateur analogique et le synthétiseur de vagues. le lauréat se verra récompensé par l'enregistrement professionnel de son oeuvre interprétée en direct par les musiciens de l'orchestre philharmonique de radio france, immortalisé sur un vinyle collector personnalisé !": {
    en: "Translate the sound of stellar bioluminescence into intergalactic master melodies! For this KIDI MUSIC challenge, compose a haunting and luminous space symphony by playing with the analog oscillator and wave synthesizer. The winner will be rewarded with a professional recording of their piece performed live by the musicians of the Radio France Philharmonic Orchestra, immortalized on custom collector vinyl!",
    es: "¡Traduce el sonido del cosmos en música! Tu composición será tocada y grabada por la Orquesta Filarmónica de Radio France.",
    ja: "宇宙生命体の光からメロディーを紡ぎ、シンセサイザーの波形を作ろう。最優秀作品には、フランス国立放送管弦楽団によるプロ生レコーディングと、名前刻印入りの記念コレクターレコードが贈呈されます。"
  },
  "concevoir des habitats suspendus de l'ère néo-futuriste ! pour ce défi kidi architecture, dessinez le plan d'une station spatiale d'avant-garde dotée de verrières solaires captatrices d'hélium. le grand gagnant recevra une bourse d'études artistiques kidiworld de 2 500 € ainsi qu'un mentorat d'écriture et de projet trimestriel en tête-à-tête direct avec un architecte d'élite chef de projet chez les ateliers jean nouvel !": {
    en: "Design suspended neo-futuristic habitats! For this KIDI ARCHITECTURE challenge, draw the blueprint of a cutting-edge space station equipped with helium-capturing solar greenhouses. The grand prize winner will receive a €2,500 KidiWorld art scholarship as well as a quarterly one-on-one writing and project mentoring program directly with an elite project manager architect at Ateliers Jean Nouvel!",
    es: "¡Diseña estaciones de energía solar renovable y gana becas de estudio y mentorías de arquitectura con Ateliers Jean Nouvel!",
    ja: "未来のエコ・スペースステーションの設計図を描きましょう。受賞者にはアート学習資金として2,500ユーロの奨学金と、世界的な建築事務所ジャン・ヌーヴェル・アトリエのトップ建築家による3ヶ月間のプロ指導が贈られます。"
  },
  "un défi tout doux et coloré pour s'amuser à dessiner de superbes animaux de l'espace en ajoutant des bulles magiques et des étoiles protectrices. pas de pression : gagne tes premiers kidicoins pour déverrouiller des musiques et personnalise ton premier vaisseau spatial !": {
    en: "A sweet and colorful challenge to have fun drawing superb space animals by adding magical bubbles and protective stars. No pressure: win your first KidiCoins to unlock music and customize your first spaceship!",
    es: "¡Un desafío súper tierno para dibujar animales del espacio! Gana tus primeros KidiCoins de forma fácil y sin presiones.",
    ja: "宇宙のかわいい生きものたちを描く、初心者用の優しいチャレンジです。シャボン玉や輝くお星さまを描いて、初めてのKidiコインをゲットし、大好きな宇宙の音楽をアンロックしてみましょう！"
  },

  // --- Clues (Indices) Titles and Descriptions ---
  "harpon cosmique": {
    en: "Harpon cosmique 🌟",
    es: "Arpón Cósmico 🌟",
    ja: "宇宙のハープーン 🌟"
  },
  "l'outil énergétique d'amarrage pour harponner la poussière d'étoiles dorées.": {
    en: "The energetic docking tool to harpoon golden stardust.",
    es: "La herramienta energética para capturar el polvo de estrellas doradas.",
    ja: "金色に輝くスターダストを引き寄せるための特殊エナジー捕獲フック。"
  },
  "chants des abysses": {
    en: "Chants des abysses (Abyssal Songs) 🎵",
    es: "Cantos del Abismo 🎵",
    ja: "深海の宇宙聖歌 🎵"
  },
  "la fréquence sonore mystérieuse qui guide les équipages à travers le vide.": {
    en: "The mysterious sound frequency that guides space crews through the empty void.",
    es: "La misteriosa frecuencia de audio que guía a las naves espaciales.",
    ja: "漆黒の宇宙空間を進むクルーたちの進路を守り導く、古のハミング・ビート。"
  },
  "voiles à gravité": {
    en: "Voiles à gravité (Gravity Sails) ⛵",
    es: "Velas de Gravedad ⛵",
    ja: "重力セイル（帆） ⛵"
  },
  "les grandes voiles solaires conçues pour surfer l'onde d'attraction stellaire.": {
    en: "The large solar sails designed to surf the magnetic attraction waves.",
    es: "Las velas solares gigantes para deslizarse por las ondas gravitacionales.",
    ja: "星の引力波を効果的にとらえて宇宙を滑走するために開発された、大容量の超薄型パネル帆。"
  },
  "poussière de singularité": {
    en: "Singularity Dust ✨",
    es: "Polvo de Singularidad ✨",
    ja: "特異点のフォトン・ダスト ✨"
  },
  "le carburant ultra-rare sécrété par le grand cachalot sidéral.": {
    en: "The ultra-rare fuel secreted by the divine cosmic whale.",
    es: "El combustible ultra raro que libera la ballena astral gigante.",
    ja: "スペース・マッコウクジラが悠々と泳ぎながら放つ、超希有な流星エネルギー触媒燃料。"
  },
  "androïde buggé": {
    en: "Buggy Android 🤖",
    es: "Androide con Errores 🤖",
    ja: "お喋りアンドロイド（バグあり） 🤖"
  },
  "un robot de bord qui bégaye et se souvient des poèmes oubliés du passé.": {
    en: "The board spaceship robot that stutters and recites forgotten organic poetry.",
    es: "El robot de la nave que tartamudea y recuerda hermosos poemas antiguos.",
    ja: "たまに言葉がつっかえるけれど、人類の美しい古典詩をたくさん記憶しているお助けロボット。"
  },
  "chronosphère": {
    en: "Chronosphere 🧭",
    es: "Cronosfera 🧭",
    ja: "クロノスフィア（時の羅針盤） 🧭"
  },
  "une mystérieuse boussole temporelle trouvée sous un astéroïde.": {
    en: "A mysterious time compass found underneath a buried space asteroid.",
    es: "Un misterioso compás del tiempo encontrado debajo de un asteroide.",
    ja: "古代の小惑星遺跡を調査していた際に見つかった、過去や未来を指し示す奇妙な精密コンパス。"
  },
  "sillage de bioluminescence": {
    en: "Bioluminescence Trail 💫",
    es: "Estela Bioluminiscente 💫",
    ja: "発光バイオ・トレイル 💫"
  },
  "la traînée lumineuse que la créature laisse derrière elle.": {
    en: "The shimmering light track that the creature leaves floating behind in space.",
    es: "El camino de luz que la criatura oceánica espacial deja tras de sí.",
    ja: "スペース・マッコウクジラが泳ぐときに、背後の暗闇にそっと灯るエメラルド色の美しい光の航跡。"
  },
  "sérénade sidérale": {
    en: "Sidereal Serenade 🎶",
    es: "Serenata Sideral 🎶",
    ja: "星々のセレナーデ 🎶"
  },
  "la complainte harmonique pour apaiser la colère de la tempête.": {
    en: "The harmonic acoustic lullaby to calm the fury of space magnetic storms.",
    es: "La hermosa melodía armónica para calmar la tempestad de asteroides.",
    ja: "荒れ狂う流星群やプラズマ雲の怒りをそっと静め、調和をもたらすための天空のアンビエント子守唄。"
  },
  "casque en quartz stellaire": {
    en: "Stellar Quartz Helmet ☄️",
    es: "Casco de Cuarzo Estelar ☄️",
    ja: "星英クォーツヘルメット ☄️"
  },
  "le scaphandre étincelant des stylistes de l'espace.": {
    en: "The glowing spacesuit helmet designed by interplanetary haute couture stylists.",
    es: "El casco brillante y seguro diseñado por estilistas de moda espacial.",
    ja: "宇宙のハイエンド・デザイナーたちが共同で設計した、キラキラ輝くクォーツ結晶の超強度ヘルメット。"
  },
  "l'alliance du cachalot": {
    en: "The Whale Alliance 🐋",
    es: "La Alianza del Cachalote 🐋",
    ja: "スペース・クジラとの同盟 🐋"
  },
  "le message final envoyé par le jury : composez de toutes vos forces !": {
    en: "The final message from the jury: compose, design, and create with all your heart!",
    es: "El mensaje final del prestigioso jurado: ¡crea con todo tu talento!",
    ja: "審査専門委員会からのラストメッセージ：「キミの持てるすべての創造力、情熱、技術、感性を解き放とう！」"
  },
  "designers de demain, redéfinissez les codes vestimentaires galactiques ! imaginez et dessinez la combinaison spatiale d'exploration pour l'équipage du polaris. alliez coupes fluides, textiles bioluminescents et fibres de quartz. à la clé : le prestigieux prix du design junior impliquant une immersion exceptionnelle de 3 jours au sein des ateliers de couture de nos créateurs partenaires chanel, et la modélisation 3d professionnelle de votre modèle par un infographiste de mode sur grand écran !": {
    en: "Designers of tomorrow, redefine galactic dress codes! Imagine and draw the space exploration suit for the Polaris crew. Combine flowing cuts, bioluminescent textiles, and quartz fibers. The prize: the prestigious JUNIOR DESIGN AWARD involving an exceptional 3-day immersion within the couture workshops of partner Chanel, and professional 3D modeling of your design by a fashion graphic designer on a big screen!",
    es: "¡Diseñadores del mañana, rediseñen los códigos de vestimenta galácticos! Diseñen el traje de exploración espacial del Polaris combinando textiles bioluminiscentes y fibras de cuarzo. El premio: una inmersión de 3 días en los talleres de costura de Chanel y modelado profesional en 3D.",
    ja: "未来のデザイナーたちへ、宇宙のドレスコードを再定義しましょう！Polaris号のクルーが着用する、流線型の美しさと発光素材、クォーツ繊維を組み合わせた宇宙飛行服をデザインしてください。受賞者にはChanelのクチュール工房での特別な3日間実地体験と、専門家による3Dデジタルモデル化が贈られます。"
  },
  "mariez des harmonies célestes et des rythmes chiptunes entraînants pour écrire et composer le thème sonore officiel d'entrée du grand cachalot stellaire dans le port galactique ! le vainqueur de ce concours de haute volée remportera le grand prix soundscapes de la création musicale : son morceau sera mis en musique, arrangé et enregistré en direct par de réels musiciens professionnels de l'orchestre de radio france, suivie d'une initiation magique d'un jour au sein de leurs studios mythiques !": {
    en: "Blend celestial harmonies and catchy chiptune beats to write and compose the official entrance theme of the great Stellar Sperm Whale into the galactic port! The winner of this high-profile contest will win the SOUNDSCAPES GRAND PRIZE FOR MUSIC CREATION: their piece will be scored, arranged, and recorded live by real professional musicians from the Radio France Philharmonic Orchestra, followed by a magical one-day initiation inside their mythical studios!",
    es: "¡Fusione armonías celestiales y ritmos chiptune alegres para componer el himno oficial de entrada de la ballena espacial! El ganador obtendrá la grabación en vivo de su obra por la prestigiosa Orquesta Sinfónica de Radio France.",
    ja: "天上のハーモニーと楽しい電子ビートを融合させ、宇宙マッコウクジラが銀河港に現れたときの公式ファンファーレ＆テーマ曲を作曲してください！最優秀賞には、フランス国立放送管弦楽団のプロの楽団員が生アレンジ・生演奏レコーディングを行い、神聖なスタジオ見学ツアーに招待されます。"
  },
  "futurs visionnaires de la construction, bâtissez le futur ! dessinez ou décrivez les plans de la première cité d'habitation écologique auto-suffisante flottant en au pesant... flottant en apesanteur. mariez mégastructures d'acier recyclé, dômes de biosphère végétale et captation solaire active. le grand gagnant verra ses croquis modélisés et imprimés en 3d à grande échelle pour être exposés, doublés d'une session de critique constructive de 2 heures par le grand architecte jean nouvel et ses associés !": {
    en: "Future visionaries of construction, build the future! Draw or describe the blueprints of the first self-sufficient ecological housing city floating in weightlessness. Combine recycled steel megastructures, plant biosphere domes, and active solar capture systems. The grand winner will have their sketches modeled and printed in 3D on a large scale for exhibition, along with a 2-hour constructive review session with the great architect Jean Nouvel and his associates!",
    es: "¡Arquitectos del futuro, construyan el mañana! Diseñen la primera ciudad ecológica flotante en gravedad cero. El ganador obtendrá un modelado e impresión física en 3D del diseño para exposición y una sesión de mentoría de 2 horas con Jean Nouvel.",
    ja: "未来の建築家たちへ、新しい時代の都市をデザインしてください！宇宙空間に浮かぶ、自己循環型のエコ住居都市の設計図を描きましょう。リサイクル鋼材の主骨格、豊かな植物が茂るバイオドーム、高効率太陽電池を配置します。最優秀賞のスケールモデルは大型3Dプリンターで造形・展示され、巨匠ジャン・ヌーヴェルによる2時間の設計指導セッションが贈られます。"
  },
  "futurs visionnaires de la construction, bâtissez le futur ! dessinez ou décrivez les plans de la première cité d'habitation écologique auto-suffisante flottant en apesanteur. mariez mégastructures d'acier recyclé, dômes de biosphère végétale et captation solaire active. le grand gagnant verra ses croquis modélisés et imprimés en 3d à grande échelle pour être exposés, doublés d'une session de critique constructive de 2 heures par le grand architecte jean nouvel et ses associés !": {
    en: "Future visionaries of construction, build the future! Draw or describe the blueprints of the first self-sufficient ecological housing city floating in weightlessness. Combine recycled steel megastructures, plant biosphere domes, and active solar capture systems. The grand winner will have their sketches modeled and printed in 3D on a large scale for exhibition, along with a 2-hour constructive review session with the great architect Jean Nouvel and his associates!",
    es: "¡Arquitectos del futuro, construyan el mañana! Diseñen la primera ciudad ecológica flotante en gravedad cero. El ganador obtendrá un modelado e impresión física en 3D del diseño para exposición y una sesión de mentoría de 2 horas con Jean Nouvel.",
    ja: "未来の建築家たちへ、新しい時代の都市をデザインしてください！宇宙空間に浮かぶ、自己循環型のエコ住居都市の設計図を描きましょう。リサイクル鋼材の主骨格、豊かな植物が茂るバイオドーム、高効率太陽電池を配置します。最優秀賞のスケールモデルは大型3Dプリンターで造形・展示され、巨匠ジャン・ヌーヴェルによる2時間の設計指導セッションが贈られます。"
  },
  "bienvenue aux plus jeunes explorateurs de l'univers ! pour ce challenge créatif amusant, imagine un petit animal tout doux ou une méduse souriante qui vole à bord du polaris. utilise notre tableau de dessin avec des couleurs pastel et des étoiles lumineuses pour exprimer ton génie. relève le défi et obtiens ton diplôme officiel de jeune explorateur de l'art !": {
    en: "Welcome to the youngest explorers of the universe! For this fun creative challenge, imagine a sweet little animal or a smiling jellyfish flying aboard the Polaris. Use our drawing board with pastel colors and glowing stars to express your genius. Take up the challenge and get your Official Young Art Explorer Diploma!",
    es: "¡Bienvenidos a los exploradores más jóvenes del universo! Imagina una criatura tierna o una medusa feliz volando a bordo del Polaris. Dibuja usando tonos pastel y estrellas brillantes y llévate tu Diploma Oficial de Explorador del Arte.",
    ja: "ちいさな宇宙の探険家たち、ようこそ！このお絵描きチャレンジでは、Polaris号に乗って宇宙旅行する、ふわふわした動物やにっこり笑ったクラゲの絵をクリエイトしてみましょう。パステルカラーや星のペンを使いましょう。クリアすると「お絵描き宇宙探検証書」が授与されます！"
  },

  // --- Nests (Sub-Challenges Tasks) ---
  "thème audio du cachalot": {
    en: "Whale Audio Theme 🎵",
    es: "Tema de Audio del Cachalote 🎵",
    ja: "宇宙クジラの発光テーマBGM 🎵"
  },
  "le scénario a besoin de vibrations ! compose un hymne bioluminescent exclusif.": {
    en: "The screenplay needs deep acoustic vibrations! Compose an exclusive bioluminescent theme hymn.",
    es: "¡Tu campaña necesita vibraciones de sonido! Compón una canción de cuna única.",
    ja: "シナリオに美しい背景音、音響振動が必要です。神秘的な生物の発光をテーマにしたオリジナルBGMを制作しましょう。"
  },
  "garde-robe cosmique (costumes)": {
    en: "Cosmic Wardrobe (Crew Outfits) 👗",
    es: "Garde-Robe Cósmica (Trajes) 👗",
    ja: "宇宙のワードローブ（飛行服） 👗"
  },
  "dessine la combinaison de vol spatiale portée par bastien pour flotter dans le sillage de lumière.": {
    en: "Draw the physical spaceflight suit worn by Bastien to float in the glowing track of bioluminescence.",
    es: "Dibuja el traje de exploración que usa Bastien para flotar en el sendero de luz.",
    ja: "主人公のバティアンが光の尾の中を安全にフワフワ浮かびながら作業するための、特殊カラーの宇宙服をスケッチしましょう。"
  },
  "prisme stellor": {
    en: "Stellor Prism 💎",
    es: "Prisma Stellor 💎",
    ja: "ステラー・プリズムのカット 💎"
  },
  "cadre la lueur bleutée d'un fragment de comète.": {
    en: "Perfectly frame the glowing bluish flare of an active comet shard.",
    es: "¡Encuadra el bello destello azulado de un pedazo de cometa!",
    ja: "高速で飛んできたコメットの破片が青白くきらめく、決定的な瞬間を美しくファインダーの中心に収めましょう。"
  },
  "finition quartz": {
    en: "Quartz Finishes ✨",
    es: "Acabado de Cuarzo ✨",
    ja: "クォーツ製パーツの仕上げ ✨"
  },
  "mets en valeur la visière en quartz stellaire magique.": {
    en: "Emphasize and showcase the magical properties of the stellar quartz visor.",
    es: "Resalta el brillo protector del casco de cuarzo mágico.",
    ja: "ヘルメットの顔部分にあたる、星英クォーツで作られた魔法の防護バイザーの透明感や反射、色合いを魅力的に表現しましょう。"
  },
  "gravité zéro": {
    en: "Zero Gravity Physics ☄️",
    es: "Física de Gravedad Cero ☄️",
    ja: "無重力下の弾道シミュレーション ☄️"
  },
  "expérimente les trajectoires paraboliques de ton module mobile.": {
    en: "Experiment and calculate parabolic trajectories for your landing module.",
    es: "Prueba la trayectoria y rebotes de tu nave en gravedad cero.",
    ja: "操縦するモバイル宇宙カプセルが障害物の隙間をすり抜けながら描く、無重力状態ならではの美しいパラボラ物体の放物線をプログラミングしましょう。"
  },
  "harmonie d'orfèvre": {
    en: "Goldsmith Sound Harmony 🎻",
    es: "Armonía Sutil y Dorada 🎻",
    ja: "匠のサウンドハーモニー 🎻"
  },
  "utilise un tempo rapide à 140 bpm et des accords en arpeggio.": {
    en: "Use a fast, dynamic tempo of 140 BPM and beautiful flowing arpeggio keys.",
    es: "Usa un tempo rápido a 140 bpm y progresión de acordes en arpegio.",
    ja: "テンポよく進む140BPMに設定し、シンセサイザーの鍵盤がきれいに動き回るアルペジオ和音を用いて曲を作りましょう。"
  },
  "verrière solaire": {
    en: "Helium Solar Greenhouses 🏛️",
    es: "Invernadero Solar de Helio 🏛️",
    ja: "太陽電池シールド温室 🏛️"
  },
  "dessine le plan de captation des poussières de gaz d'hélium.": {
    en: "Draw the architectural blueprints for collection of helium interstellar gas.",
    es: "Dibuja el plano de paneles solares que capturan los gases de helio.",
    ja: "背景の美しい星雲から高出力のヘリウム宇宙ガスを吸収して街の動力に変えるための、巨大な太陽電池ドームの配置図面を描きましょう。"
  },
  "couleur spatiale": {
    en: "Space Illuminations 🎨",
    es: "Color Espacial Vibrante 🎨",
    ja: "スペース・ライトペイント 🎨"
  },
  "fais des touches de bleu néon pour éclairer tes arrières-plans !": {
    en: "Add vivid hints of radiant neon blue to illuminate your background atmospheres!",
    es: "¡Prueba tonos de azul neón para realzar el contraste y los fondos!",
    ja: "自分の手掛けたイラストの背景、宇宙船の中などに、未来的なネオンブルーの輝かしい光の装飾（照明）を加えてみましょう！"
  }
};

export default function TranslatedText({ text, targetLang, className = "", isParagraph = false }: TranslatedTextProps) {
  const [translated, setTranslated] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  // Normalization and simple offline lookup helper
  const lookupStaticTranslation = (originalText: string, lang: string): string | null => {
    if (lang === "fr") return originalText;
    const cleanKey = originalText.trim().toLowerCase();
    
    // Check our meticulous static dictionary
    if (STATIC_DICTIONARY[cleanKey] && STATIC_DICTIONARY[cleanKey][lang]) {
      return STATIC_DICTIONARY[cleanKey][lang];
    }
    
    // Check standard translations
    const fallbackMap: Record<string, string> = {
      "cet indice sera dévoilé prochainement par le jury de linkyourart.": lang === "en" 
        ? "This clue will be revealed soon by the LinkYourArt jury." 
        : lang === "es" ? "Esta pista será revelada pronto por LinKYourArt." : "このヒントは後日LinkYourArt審査会より順次解禁されます。",
    };
    return fallbackMap[cleanKey] || null;
  };

  const handleTranslate = async () => {
    if (!text || !text.trim()) return;
    
    // 1. Check offline perfect matching first
    const staticMatch = lookupStaticTranslation(text, targetLang);
    if (staticMatch) {
      setTranslated(staticMatch);
      setLoading(false);
      return;
    }

    // 2. Check local browser cache to preserve precious quota
    const cacheKey = `kidi_trans_v3_${targetLang}_${text.trim()}`;
    const cachedItem = localStorage.getItem(cacheKey);
    if (cachedItem) {
      setTranslated(cachedItem);
      setLoading(false);
      return;
    }

    // 3. Fallback to server proxy Translation using Gemini SDK safely
    setLoading(true);
    try {
      const response = await fetch("/api/gemini/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang }),
      });

      if (!response.ok) throw new Error("Translation failed status");
      const data = await response.json();
      if (data.translatedText) {
        setTranslated(data.translatedText);
        // Save to cache forever to save user quotas for future visits
        localStorage.setItem(cacheKey, data.translatedText);
      } else {
        setTranslated(text);
      }
    } catch (err) {
      console.warn("Translation API request rate-limited/failed. Falling back to source text gracefully...", err);
      // Fallback gracefully to original text to keep UI perfectly clean and functional
      setTranslated(text);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetLang === "fr") {
      setTranslated(text);
    } else {
      handleTranslate();
    }
  }, [text, targetLang]);

  const forceRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleTranslate();
  };

  const displayText = showOriginal ? text : (translated || text);

  if (isParagraph) {
    return (
      <div className={`group/trans relative ${className}`}>
        <div className="whitespace-pre-line leading-relaxed transition-all duration-300">
          {loading ? (
            <span className="inline-flex gap-1 items-center text-slate-500 italic">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              Traduction...
            </span>
          ) : (
            displayText
          )}
        </div>

        {/* Tiny translate helper controls available on hover or inline to empower users */}
        <div className="absolute -top-6 right-0 opacity-0 group-hover/trans:opacity-100 transition-opacity bg-slate-950/90 text-[10px] text-slate-300 px-2 py-0.5 rounded-md border border-slate-800 flex items-center gap-1.5 z-10 pointer-events-auto select-none">
          <Languages className="w-3 h-3 text-amber-500" />
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="hover:text-amber-400 font-bold cursor-pointer"
            title="Afficher l'original / la version traduite"
          >
            {showOriginal ? "Voir Traduit" : "Voir Original"}
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={forceRetry}
            className="hover:text-amber-400 cursor-pointer font-bold"
            title="Forcer la traduction par l'IA"
          >
            Trad. {targetLang.toUpperCase()}
          </button>
        </div>
      </div>
    );
  }

  return (
    <span className={`group/trans relative inline-block ${className}`}>
      <span className="transition-all duration-300">
        {loading ? "..." : displayText}
      </span>

      {/* Helper controls styled strictly as span/inline-flex so no nested div inside span/p */}
      <span className="absolute -top-7 right-0 opacity-0 group-hover/trans:opacity-100 transition-opacity bg-slate-950/90 text-[9px] text-slate-300 px-1.5 py-0.5 rounded border border-slate-800 inline-flex items-center gap-1 z-10 pointer-events-auto select-none font-mono">
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="hover:text-amber-400 font-bold cursor-pointer text-[8px]"
          title="Toggle FR / EN"
        >
          {showOriginal ? "TR" : "FR"}
        </button>
      </span>
    </span>
  );
}

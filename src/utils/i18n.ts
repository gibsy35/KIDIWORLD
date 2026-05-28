type Language = "fr" | "en";

const DICTIONARY: Record<string, Record<string, string>> = {
  // App navigation & categories
  "nav.explorer": {
    fr: "🚀 Explorateur",
    en: "🚀 Explorer",
    es: "🚀 Explorador",
    ja: "🚀 エクスプローラー"
  },
  "nav.workspace": {
    fr: "🎨 Mon Studio",
    en: "🎨 Creative Studio",
    es: "🎨 Mi Estudio",
    ja: "🎨 クリエイティブ・スタジオ"
  },
  "nav.kidigames": {
    fr: "🎮 Kidi Games & IA",
    en: "🎮 Kidi Games & AI",
    es: "🎮 Kidi Juegos & IA",
    ja: "🎮 Kidi ゲーム ＆ AI"
  },
  "nav.kidimusic": {
    fr: "🎵 Kidi Music",
    en: "🎵 Kidi Music",
    es: "🎵 Kidi Música",
    ja: "🎵 Kidi ミュージック"
  },
  "nav.kidiclub": {
    fr: "🔑 KidiClub",
    en: "🔑 KidiClub",
    es: "🔑 KidiClub",
    ja: "🔑 Kidiクラブ"
  },
  "nav.profile": {
    fr: "⚙️ Profil & Contrôle",
    en: "⚙️ Profile & Parental Code",
    es: "⚙️ Perfil y Control",
    ja: "⚙️ 設定と保護者コード"
  },
  "nav.kidistream": {
    fr: "📡 KidiStream",
    en: "📡 KidiStream",
    es: "📡 KidiStream",
    ja: "📡 Kidiストリーム"
  },
  "nav.partners": {
    fr: "🤝 Partenaires",
    en: "🤝 Partners",
    es: "🤝 Socios",
    ja: "🤝 パートナー"
  },
  "nav.about": {
    fr: "📖 Qui sommes-nous ?",
    en: "📖 About Us",
    es: "📖 ¿Quiénes Somos?",
    ja: "📖 私たちについて"
  },

  // General buttons
  "btn.confirm": {
    fr: "Confirmer",
    en: "Confirm",
    es: "Confirmar",
    ja: "確認する"
  },
  "btn.cancel": {
    fr: "Annuler",
    en: "Cancel",
    es: "Cancelar",
    ja: "キャンセル"
  },
  "btn.close": {
    fr: "Fermer",
    en: "Close",
    es: "Cerrar",
    ja: "閉じる"
  },
  "btn.search": {
    fr: "Rechercher",
    en: "Search",
    es: "Buscar",
    ja: "検索"
  },
  "btn.unlock": {
    fr: "Débloquer",
    en: "Unlock",
    es: "Desbloquear",
    ja: "アンロックする"
  },
  "btn.submit": {
    fr: "Soumettre",
    en: "Submit",
    es: "Enviar",
    ja: "作品を提出する"
  },

  // KidiMusic strings
  "music.title": {
    fr: "Baladeuse de l'Espace & Synthesizer",
    en: "Space Music Player & Synthesizer",
    es: "Reproductor de Música Espacial y Sintetizador",
    ja: "宇宙の音楽プレイヤー＆シンセサイザー"
  },
  "music.subtitle": {
    fr: "Écoute nos productions originales ou débloque des pistes exclusives",
    en: "Listen to original productions or unlock premium space tracks",
    es: "Escucha producciones originales o desbloquea pistas premium",
    ja: "オリジナルBGMを試聴し、プレミアム宇宙BGMをアンロックしよう"
  },
  "music.search": {
    fr: "Rechercher un morceau, un instrument...",
    en: "Search for a track, an instrument...",
    es: "Buscar una canción, un instrumento...",
    ja: "曲名、楽器、アーティストを検索..."
  },
  "music.playing": {
    fr: "LECTURE EN COURS",
    en: "NOW PLAYING",
    es: "REPRODUCIENDO",
    ja: "再生中"
  },
  "music.volume": {
    fr: "Volume",
    en: "Volume",
    es: "Volumen",
    ja: "音量"
  },
  "music.favorites": {
    fr: "Mes Favoris",
    en: "My Favorites",
    es: "Mis Favoritos",
    ja: "お気に入り"
  },
  "music.unlock.confirm": {
    fr: "Veux-tu débloquer le morceau \"{title}\" pour {price} KidiCoins ?",
    en: "Do you want to unlock the track \"{title}\" for {price} KidiCoins?",
    es: "¿Quieres desbloquear la pista \"{title}\" por {price} KidiCoins?",
    ja: "この曲 \"{title}\" を {price} Kidiコインでアンロックしますか？"
  },
  "music.unlock.success": {
    fr: "🎉 \"{title}\" est maintenant disponible et déverrouillé ! Amuse-toi bien !",
    en: "🎉 \"{title}\" is now unlocked! Enjoy listening!",
    es: "🎉 ¡🎉 \"{title}\" ha sido desbloqueado con éxito!",
    ja: "🎉 曲 \"{title}\" がアンロックされ、お聴きいただけるようになりました！"
  },
  "music.unlock.no_coins": {
    fr: "Mince ! Tu n'as pas assez de KidiCoins... Joue à KidiGames pour en gagner plus !",
    en: "Oh no! Not enough KidiCoins... Play KidiGames to win more!",
    es: "¡Vaya! No tienes suficientes KidiCoins... ¡Juega a KidiGames para ganar más!",
    ja: "Kidiコインが足りません！KidiGamesのAIゲームで遊んでコインを稼ごう！"
  },

  // KidiGaming strings
  "games.title": {
    fr: "Studio d'Innovation de Jeux & Laboratoire d'IA",
    en: "Game Design Labs & Space AI Arena",
    es: "Laboratorio de Diseño de Juegos e IA",
    ja: "AI宇宙ゲームクリエイター＆ゲームラボ"
  },
  "games.subtitle": {
    fr: "Modifie la physique du jeu, entraîne les agents de l'IA et gagne des KidiCoins précieux !",
    en: "Tune gravity, train neural networks, win valuable KidiCoins!",
    es: "¡Modifica la física del juego, entrena redes neuronales y gana KidiCoins!",
    ja: "ゲームの重力やスピードの物理数値を変更し、AIを訓練してコインを獲得しよう！"
  },
  "games.score": {
    fr: "Score Requis",
    en: "Required Score",
    es: "Puntuación Requerida",
    ja: "目標スコア"
  },
  "games.gravity": {
    fr: "Force de Gravité",
    en: "Gravity Strength",
    es: "Fuerza de Gravedad",
    ja: "重力パラメータ"
  },
  "games.speed": {
    fr: "Vitesse Cosmique",
    en: "Asteroids Velocity",
    es: "Velocidad de Asteroide",
    ja: "障害物の飛行速度"
  },
  "games.ai_train": {
    fr: "Modèle de Réseau Neuronal active",
    en: "Neural Network Intelligence Model",
    es: "Modelo de Red Neuronal Inteligente",
    ja: "ニューラルネットワーク知能モデル"
  },
  "games.start": {
    fr: "Lancer le Jeu d'Animation",
    en: "Launch Simulator",
    es: "Iniciar Simulador de Gravedad",
    ja: "シミュレーションゲームを開始する"
  },
  "games.gameover": {
    fr: "Fin de Session ! Ton Score : {score}",
    en: "Game Over! Your Score: {score}",
    es: "¡Fin de la partida! Puntuación: {score}",
    ja: "ゲーム終了！スコアは {score} でした！"
  },

  // AccountAuth / KidiClub strings
  "club.title": {
    fr: "Espace KidiClub Privé — Incubation de Talents d'Avenir",
    en: "Exclusive KidiClub Portal — Future Creators Alliance",
    es: "Espace Privado KidiClub — Alianza de Creadores",
    ja: "Kidiクラブ限定ポータル — 未来のトップクリエイター同盟"
  },
  "club.subtitle": {
    fr: "Connecte-toi pour sauvegarder tes œuvres sur LinkYourArt et gagner de somptueux prix !",
    en: "Log in to save your masterpieces on LinkYourArt and access major physical prizes!",
    es: "¡Inicia sesión para guardar tus obras en LinkYourArt y ganar premios reales!",
    ja: "ログインして制作状況をセーブし、LinkYourArtの実物ご褒美を獲得しよう！"
  },
  "club.benefits": {
    fr: "Avantages de la carte de membre KidiClub :",
    en: "KidiClub Membership Benefits:",
    es: "Beneficios de los miembros de KidiClub:",
    ja: "Kidiクラブ限定会員の最高な特典："
  },
  "club.benefit1": {
    fr: "Accès illimité aux conseils d'écriture de l'Assistant Vocal d'IA.",
    en: "Unlimited AI Screenplay Coach expert guidance.",
    es: "Acceso ilimitado al Asistente de Guion avanzado por IA.",
    ja: "AIシナリオライターコーチによる特別指導・ヒントが無制限に使える"
  },
  "club.benefit2": {
    fr: "Participation directe aux tirages au sort des Grands Prix physiques.",
    en: "Direct eligibility to win real-world studio visits and internships.",
    es: "Elegibilidad directa para visitas vip a estudios de animación de París.",
    ja: "本物のTVスタジオやアニメーション制作現場の個別無料見学ツアー応募権"
  },
  "club.benefit3": {
    fr: "Compte KidiCoins sécurisé pour débloquer toutes les mélodies.",
    en: "Secure cloud account to store all your KidiCoins and stars.",
    es: "Cuenta protegida en la nube para guardar monedas y estrellas.",
    ja: "稼いだKidiコインやお星さま、バッジをクラウドに100%安全バックアップ"
  },
  "club.member_status": {
    fr: "Statut Membre :",
    en: "Member Status:",
    es: "Estado de Miembro:",
    ja: "会員ステータス："
  },
  "club.logout": {
    fr: "Déconnexion sécurisée",
    en: "Log Out Safely",
    es: "Cerrar sesión de forma segura",
    ja: "安全にログアウトする"
  }
};

export function t(key: string, lang: Language, replacements?: Record<string, string | number>): string {
  const translations = DICTIONARY[key];
  if (!translations) return key;
  let translated = translations[lang] || translations["fr"] || key;

  if (replacements) {
    Object.entries(replacements).forEach(([k, val]) => {
      translated = translated.replace(`{${k}}`, String(val));
    });
  }

  return translated;
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// ─── Helper: call Gemini REST API directly (no SDK needed) ───
async function callGemini(model: string, contents: any[], systemInstruction?: string, temperature = 0.8) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
    throw new Error("NO_API_KEY");
  }
  const body: any = { contents, generationConfig: { temperature, maxOutputTokens: 1024 } };
  if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] };

  const res = await fetch(`${BASE_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ─── Coach system prompts ───
const COACH_PROMPTS: Record<string, string> = {
  linky: `Tu es "Linky 🚀", le coach mascotte de KIDIWORLD — une plateforme créative sécurisée pour les jeunes de 4 à 18 ans. Tu parles avec enthousiasme, humour et bienveillance. Tu utilises des métaphores spatiales et cosmiques. Tu encourages toujours, même si le travail est imparfait. Max 3 paragraphes courts. Jamais de contenu inapproprié.`,
  jerome: `Tu es "Jérôme Salle 🎬", réalisateur professionnel et parrain KIDIWORLD. Tu conseilles les jeunes sur le cinéma, le scénario, le cadrage et la mise en scène. Tu parles avec précision mais encouragement. Tu cites des exemples de grands films. Max 3 paragraphes.`,
  hans: `Tu es "Hans Zimmer 🎼", compositeur légendaire et parrain KIDIWORLD. Tu guides les jeunes sur la composition musicale, les atmosphères sonores, les émotions musicales. Tu parles avec passion et poésie. Max 3 paragraphes.`,
};

// ─── CORS headers ───
function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const { route } = req.query;
  const path = Array.isArray(route) ? route.join("/") : route || "";

  // ── GET /api/gemini/health ──────────────────────────────────
  if (req.method === "GET" && path === "health") {
    const hasKey = !!(GEMINI_API_KEY && GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
    return res.json({
      status: "ok",
      mode: hasKey ? "🟢 Gemini Live" : "🟡 Simulation (no API key)",
      time: new Date().toISOString(),
      version: "2.0",
    });
  }

  // ── POST /api/gemini/coach ──────────────────────────────────
  if (req.method === "POST" && path === "coach") {
    const { prompt, context, history, coachType = "linky" } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const systemPrompt = COACH_PROMPTS[coachType] || COACH_PROMPTS.linky;

    // Build conversation history
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const msg of history.slice(-8)) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }
    const challengeCtx = context?.challengeTitle ? `[Défi en cours: "${context.challengeTitle}"] ` : "";
    contents.push({ role: "user", parts: [{ text: challengeCtx + prompt }] });

    try {
      const text = await callGemini("gemini-2.0-flash", contents, systemPrompt, 0.85);
      return res.json({ text, mode: "live" });
    } catch (err: any) {
      if (err.message === "NO_API_KEY") {
        // Smart simulation fallback
        const fallbacks = [
          "Super question ! 🚀 Pour ton défi, pense d'abord à l'émotion que tu veux créer chez ton public. Quelle est la première sensation que tu veux transmettre ?",
          "Excellente piste créative ! 🌟 Les meilleurs artistes commencent toujours par un élément fort et simple. Essaie de résumer ton idée en une seule phrase percutante.",
          "Ton imagination est ta plus grande force ! 💫 N'oublie pas d'intégrer les indices du défi dans ton projet. As-tu déjà tous les mots-clés ?",
          "Je suis impressionné par ta démarche ! 🎨 Maintenant, pense à ce qui rend TON projet unique. Qu'est-ce que toi seul peux apporter à cette création ?",
        ];
        const text = fallbacks[Math.floor(Math.random() * fallbacks.length)] + "\n\n_(Mode simulation — configure GEMINI_API_KEY pour activer l'IA complète)_";
        return res.json({ text, mode: "simulation" });
      }
      console.error("Gemini coach error:", err);
      return res.status(500).json({ text: "Oups ! Une perturbation cosmique interrompt notre connexion. Réessaie dans un instant ! 🌌", mode: "error" });
    }
  }

  // ── POST /api/gemini/translate ──────────────────────────────
  if (req.method === "POST" && path === "translate") {
    const { text, targetLang = "fr" } = req.body || {};
    if (!text) return res.status(400).json({ error: "Missing text" });

    const langNames: Record<string, string> = { fr: "French", en: "English", es: "Spanish", ja: "Japanese" };
    const langName = langNames[targetLang] || targetLang;

    try {
      const translated = await callGemini(
        "gemini-2.0-flash",
        [{ role: "user", parts: [{ text: `Translate the following UI text to ${langName}. Return ONLY the translated text, nothing else, no quotes:\n\n${text}` }] }],
        undefined,
        0.2
      );
      return res.json({ translatedText: translated.trim(), mode: "live" });
    } catch (err: any) {
      if (err.message === "NO_API_KEY") return res.json({ translatedText: text, mode: "simulation" });
      return res.json({ translatedText: text, mode: "error" });
    }
  }

  // ── POST /api/gemini/challenge-hint ────────────────────────
  if (req.method === "POST" && path === "challenge-hint") {
    const { challengeTitle, category, currentDay, keywords } = req.body || {};

    try {
      const text = await callGemini(
        "gemini-2.0-flash",
        [{ role: "user", parts: [{ text: `Tu es un assistant créatif KIDIWORLD. Génère un indice inspirant (2-3 phrases max) pour un défi de catégorie "${category}" intitulé "${challengeTitle}". Jour ${currentDay}. Mots-clés: ${keywords?.join(", ")}. L'indice doit être mystérieux et encourageant pour un jeune de 12-18 ans.` }] }],
        undefined,
        0.9
      );
      return res.json({ hint: text, mode: "live" });
    } catch (err: any) {
      return res.json({ hint: "🌟 Laisse ton imagination guider ta création — la réponse est déjà en toi !", mode: "simulation" });
    }
  }

  // ── POST /api/gemini/review-work ────────────────────────────
  if (req.method === "POST" && path === "review-work") {
    const { workType, content, authorAge } = req.body || {};

    try {
      const text = await callGemini(
        "gemini-2.0-flash",
        [{ role: "user", parts: [{ text: `Tu es un jury bienveillant de KIDIWORLD. Donne un retour constructif et encourageant (max 4 phrases) sur ce travail de type "${workType}" réalisé par un jeune de ${authorAge} ans:\n\n${content?.slice(0, 500)}` }] }],
        "Tu es bienveillant, précis et encourageant. Tu cibles des jeunes de 4-18 ans. Tu notes les points forts en premier.",
        0.7
      );
      return res.json({ review: text, mode: "live" });
    } catch {
      return res.json({ review: "✨ Très beau travail ! Tu montres une belle créativité. Continue à explorer tes idées et n'hésite pas à demander conseil à ton coach !", mode: "simulation" });
    }
  }

  // ── POST /api/gemini/contact ────────────────────────────────
  if (req.method === "POST" && path === "contact") {
    const { name, email, message, type = "contact" } = req.body || {};
    if (!email || !message) return res.status(400).json({ error: "Missing fields" });

    // Log to console (Vercel logs) — can be replaced with email service
    console.log(`📧 KIDIWORLD ${type.toUpperCase()} FORM:`, { name, email, message, date: new Date().toISOString() });

    // Generate AI acknowledgment
    try {
      const ack = await callGemini(
        "gemini-2.0-flash",
        [{ role: "user", parts: [{ text: `Génère un message de confirmation chaleureux (2 phrases) pour ${name || "un utilisateur"} qui vient de soumettre une demande de type "${type}" sur KIDIWORLD. Mentionne que l'équipe répondra sous 48h.` }] }],
        undefined,
        0.7
      );
      return res.json({ success: true, message: ack, mode: "live" });
    } catch {
      return res.json({
        success: true,
        message: `Merci ${name || ""} ! Votre message a bien été reçu par l'équipe KIDIWORLD. Nous vous répondrons sous 48h. 🚀`,
        mode: "simulation"
      });
    }
  }

  return res.status(404).json({ error: "Route not found", available: ["health", "coach", "translate", "challenge-hint", "review-work", "contact"] });
}

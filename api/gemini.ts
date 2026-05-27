import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (API_KEY && API_KEY !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { route } = req.query;
  const path = Array.isArray(route) ? route.join('/') : route;

  if (req.method === 'GET' && path === 'health') {
    return res.json({ status: "ok", mode: ai ? "online" : "simulation", time: new Date().toISOString() });
  }

  if (req.method === 'POST' && path === 'translate') {
    const { text, targetLang } = req.body;
    if (!text) return res.status(400).json({ error: "Missing text to translate." });

    if (!ai) return res.json({ translatedText: text });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Translate to ${targetLang || 'fr'}, return only the translated text: "${text}"`,
      });
      return res.json({ translatedText: response.text?.trim() || text });
    } catch {
      return res.json({ translatedText: text });
    }
  }

  if (req.method === 'POST' && path === 'coach') {
    const { prompt, context, history } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt." });

    if (!ai) {
      return res.json({ text: "Le Coach fonctionne en mode simulation. Configure ta clé GEMINI_API_KEY dans Vercel pour l'activer." });
    }

    try {
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({ role: msg.role === "user" ? "user" : "model", parts: [{ text: msg.text }] });
        }
      }
      contents.push({ role: "user", parts: [{ text: `[Défi: ${context?.challengeTitle || "Kidiworld"}]\n${prompt}` }] });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents,
        config: {
          systemInstruction: "Tu es 'Linky', un coach créatif pour KIDIWORLD, plateforme pour jeunes de 12-18 ans. Sois bienveillant, inspirant, concis (max 3 paragraphes).",
          temperature: 0.8,
        }
      });
      return res.json({ text: response.text });
    } catch (e) {
      return res.status(500).json({ text: "Erreur API Gemini." });
    }
  }

  return res.status(404).json({ error: "Route not found" });
}

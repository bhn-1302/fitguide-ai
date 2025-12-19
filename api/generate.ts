import type { VercelRequest, VercelResponse } from "@vercel/node";

const API_KEY = process.env.GEMINI_API_KEY;

const API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: "API Key não configurada" });
  }

  try {
    const { profile } = req.body;

    if (!profile) {
      return res.status(400).json({ error: "Profile não enviado" });
    }

    const prompt = `
Você é um educador físico virtual.
Não forneça diagnósticos médicos.
Não recomende atividades extremas.

Com base nos dados abaixo, gere uma recomendação de atividades físicas.

Dados do usuário:
- Idade: ${profile.age}
- Altura: ${profile.height} cm
- Peso: ${profile.weight} kg
- Objetivo: ${profile.goal}
- Tempo disponível por dia: ${profile.timePerDay} minutos
- Dias por semana: ${profile.daysPerWeek}

Responda SOMENTE no seguinte formato JSON válido:

{
  "summary": "resumo curto e motivador",
  "frequency": "quantas vezes por semana",
  "duration": "duração média por sessão",
  "activities": [
    "atividade 1",
    "atividade 2",
    "atividade 3"
  ],
  "notes": "observações importantes e aviso de segurança"
}
`;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Erro ao consultar o Gemini" });
    }

    const data = await response.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: "Resposta inválida do Gemini" });
    }

    // 🛡️ Limpeza defensiva do JSON
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return res.status(200).json(JSON.parse(cleaned));
  } catch {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}

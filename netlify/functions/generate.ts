import type { Handler } from "@netlify/functions";

const API_KEY = process.env.GEMINI_API_KEY;

const API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API Key não configurada" }),
    };
  }

  try {
    const { profile } = JSON.parse(event.body || "{}");

    if (!profile) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Profile não enviado" }),
      };
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

⚠️ IMPORTANTE:
Responda SOMENTE com um JSON válido.
NÃO escreva explicações.
NÃO use markdown.
NÃO use texto fora do JSON.

O formato DEVE ser exatamente este:

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Resposta do Gemini não veio em JSON válido",
          raw: cleaned,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(parsed),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno" }),
    };
  }
};

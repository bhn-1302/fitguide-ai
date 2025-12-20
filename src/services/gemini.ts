import type { UserProfile } from "../types/user";

export async function generateRecommendation(profile: UserProfile) {
  const response = await fetch("/.netlify/functions/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile }),
  });

  if (!response.ok) {
    throw new Error("Erro ao gerar recomendação");
  }

  return response.json();
}


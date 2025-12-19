import type { UserProfile } from "../types/user";
import type { TrainingRecommendation } from "../types/recommendation";

export async function generateRecommendation(
  profile: UserProfile
): Promise<TrainingRecommendation> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profile }),
  });

  if (!response.ok) {
    throw new Error("Erro ao gerar recomendação");
  }

  return response.json();
}

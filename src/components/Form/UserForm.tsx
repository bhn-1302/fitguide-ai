import { useState } from "react";
import { FormField } from "./FormField";
import type { UserProfile, UserGoal } from "../../types/user";
import { saveUserProfile, getUserProfile } from "../../utils/storage";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { generateRecommendation } from "../../services/gemini";
import type { TrainingRecommendation } from "../../types/recommendation";
import { RecommendationCard } from "../Recommendation/RecommendationCard";

const initialState: UserProfile = {
  age: 0,
  height: 0,
  weight: 0,
  goal: "qualidade_vida",
  timePerDay: 30,
  daysPerWeek: 3,
};

export function UserForm() {
  const [formData, setFormData] = useState<UserProfile>(() => {
    const storedProfile = getUserProfile();
    return storedProfile ?? initialState;
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrainingRecommendation | null>(null);

  function handleChange<K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function validate(data: UserProfile): string | null {
    if (data.age < 12) return "A idade mínima é 12 anos.";
    if (data.height <= 0) return "Informe uma altura válida.";
    if (data.weight <= 0) return "Informe um peso válido.";
    if (data.timePerDay < 10)
      return "O tempo mínimo recomendado é 10 minutos por dia.";
    if (data.daysPerWeek < 1 || data.daysPerWeek > 7)
      return "Escolha entre 1 e 7 dias por semana.";

    return null;
  }

  async function requestRecommendation() {
    if(isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      saveUserProfile(formData);

      const recommendation = await generateRecommendation(formData);
      setResult(recommendation);
    } catch {
      setError("O assistente está temporariamente indisponível. Aguarde alguns segundos e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationError = validate(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    await requestRecommendation();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField
        label="Idade"
        type="number"
        inputMode="numeric"
        min={12}
        value={formData.age}
        onChange={(e) => handleChange("age", Number(e.target.value))}
      />

      <FormField
        label="Altura (cm)"
        type="number"
        inputMode="numeric"
        value={formData.height}
        onChange={(e) => handleChange("height", Number(e.target.value))}
      />

      <FormField
        label="Peso (kg)"
        type="number"
        inputMode="numeric"
        value={formData.weight}
        onChange={(e) => handleChange("weight", Number(e.target.value))}
      />

      {/* Objetivo */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Objetivo</label>
        <select
          value={formData.goal}
          onChange={(e) => handleChange("goal", e.target.value as UserGoal)}
          className="h-11 rounded-(--radius-md) border border-black/10 px-3 text-sm"
        >
          <option value="emagrecimento">Emagrecimento</option>
          <option value="ganho_massa">Ganho de massa</option>
          <option value="qualidade_vida">Qualidade de vida</option>
          <option value="iniciante">Sou iniciante</option>
        </select>
      </div>

      <FormField
        label="Tempo disponível por dia (minutos)"
        type="number"
        value={formData.timePerDay}
        onChange={(e) => handleChange("timePerDay", Number(e.target.value))}
      />

      <FormField
        label="Dias por semana"
        type="number"
        min={1}
        max={7}
        value={formData.daysPerWeek}
        onChange={(e) => handleChange("daysPerWeek", Number(e.target.value))}
      />

      {error && (
        <div className="rounded-(--radius-md) bg-red-100 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 flex h-11 items-center justify-center gap-2 rounded-(--radius-lg) bg-primary text-white font-semibold disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Gerando...
          </>
        ) : (
          "Gerar recomendações"
        )}
      </button>

      {result && <RecommendationCard data={result} />}

      {result && (
        <button
          type="button"
          onClick={requestRecommendation}
          disabled={isLoading}
          className="mt-3 h-10 rounded-(--radius-md) border border-primary text-sm font-medium text-primary disabled:opacity-60"
        >
          Gerar novamente
        </button>
      )}
    </form>
  );
}

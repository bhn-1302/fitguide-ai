import type { TrainingRecommendation } from "../../types/recommendation";

interface RecommendationCardProps {
  data: TrainingRecommendation;
}

export const RecommendationCard = ({ data }: RecommendationCardProps) => {
  return (
    <div className="mt-6 flex flex-col gap-4 rounded-(--radius-lg) bg-surface p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-primary">
        Sua recomendação 💚
      </h2>

      <p className="text-sm">{data.summary}</p>

      <div className="text-sm">
        <p>
          <strong>Frequência:</strong> {data.frequency}
        </p>
        <p>
          <strong>Duração:</strong> {data.duration}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-1">Atividades sugeridas:</p>
        <ul className="list-disc pl-5 text-sm">
          {Array.isArray(data.activities) &&
            data.activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
        </ul>
      </div>

      <div className="rounded-(--radius-md) bg-yellow-100 px-3 py-2 text-xs text-yellow-800">
        {data.notes}
      </div>
    </div>
  );
};

export type UserGoal = "emagrecimento" | "ganho_massa" | "qualidade_vida" | "iniciante";

export interface UserProfile {
    age: number;
    height: number;
    weight: number;
    goal: UserGoal;
    timePerDay: number; // minutos
    daysPerWeek: number;
}
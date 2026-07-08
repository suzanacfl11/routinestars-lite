export type RoutineType = "morning" | "bedtime" | "chores";

export interface Task {
  id: number;
  e: string;
  n: string;
  m: number;
  iconSet?: string[];
}

export interface Routine {
  start: string;
  end: string;
  tasks: Task[];
}

export interface Reward {
  id: number;
  e: string;
  n: string;
  cost: number;
}

export interface Profile {
  id: number;
  name: string;
  avatar: string;
  age: number;
  routines: Record<RoutineType, Routine>;
  stars: number;
  rewards: Reward[];
  goalId: number | null;
  streak: number;
  bestStreak: number;
  missedDays: number;
  lastCompletedDate: string | null;
  completedToday: RoutineType[];
}

export interface HouseholdData {
  profiles: Profile[];
  activeId: number | null;
}

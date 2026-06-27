export type RoutineType = "morning" | "bedtime" | "chores";

export interface Task {
  id: number;
  e: string; // currently selected emoji
  n: string; // task name
  m: number; // minutes
  iconSet?: string[]; // alternate emoji options to cycle through
}

export interface Routine {
  start: string; // "HH:MM"
  end: string; // "HH:MM"
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
  lastCompletedDate: string | null; // YYYY-MM-DD, local calendar date
  completedToday: RoutineType[];
}

export interface HouseholdData {
  profiles: Profile[];
  activeId: number | null;
}

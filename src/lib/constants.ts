import type { RoutineType } from "./types";

export const ACCENT = "#1FA98C";
export const ACCENT2 = "#F2994A";
export const BG = "#FBF7EF";
export const CARD = "#E7F2EC";
export const TEXT = "#2E2B25";
export const SUB = "#8C8775";

export const MAX_PROFILES = 3;
export const STREAK_CAP = 30;

interface LibraryTask {
  id: number;
  e: string[];
  n: string;
  m: number;
}

export const MORNING_TASKS: LibraryTask[] = [
  { id: 1, e: ["🌅", "☀️", "🐓"], n: "Wake up & stretch", m: 5 },
  { id: 2, e: ["🛏️", "🧸"], n: "Make the bed", m: 5 },
  { id: 3, e: ["🪥", "😬"], n: "Brush teeth", m: 3 },
  { id: 4, e: ["🚿", "🛁"], n: "Shower / bath", m: 15 },
  { id: 5, e: ["👕", "🧦"], n: "Get dressed", m: 10 },
  { id: 6, e: ["💇", "✨"], n: "Comb hair", m: 5 },
  { id: 7, e: ["🥣", "🍳"], n: "Eat breakfast", m: 15 },
  { id: 8, e: ["💊", "🍊"], n: "Take vitamins", m: 2 },
  { id: 9, e: ["✅", "👍"], n: "Check the schedule", m: 3 },
  { id: 10, e: ["👟", "🥾"], n: "Put on shoes", m: 3 },
];

export const BEDTIME_TASKS: LibraryTask[] = [
  { id: 101, e: ["🛁", "🧼"], n: "Bath / shower", m: 15 },
  { id: 102, e: ["🧴", "🫧"], n: "Wash hair", m: 10 },
  { id: 103, e: ["🩳", "🧸"], n: "Put on pyjamas", m: 5 },
  { id: 104, e: ["🦷", "🪥"], n: "Brush teeth", m: 3 },
  { id: 105, e: ["🧵", "✨"], n: "Floss teeth", m: 2 },
  { id: 106, e: ["📕", "🌙"], n: "Bedtime story", m: 15 },
  { id: 107, e: ["🧘", "🌬️"], n: "Breathing / calm time", m: 5 },
  { id: 108, e: ["🙏", "💭"], n: "Gratitude moment", m: 3 },
  { id: 109, e: ["🤗", "💛"], n: "Family hug time", m: 5 },
  { id: 110, e: ["😴", "🌟"], n: "Lights out", m: 1 },
];

export const CHORE_TASKS: LibraryTask[] = [
  { id: 201, e: ["🐾", "🦴"], n: "Feed the pet", m: 5 },
  { id: 202, e: ["🎒", "📚"], n: "Pack school bag", m: 10 },
  { id: 203, e: ["🧺", "👚"], n: "Put dirty clothes in hamper", m: 3 },
  { id: 204, e: ["🧸", "🧹"], n: "Tidy up toys", m: 10 },
  { id: 205, e: ["🍽️", "🧽"], n: "Clear your plate", m: 3 },
  { id: 206, e: ["🪴", "💧"], n: "Water a plant", m: 3 },
  { id: 207, e: ["🗑️", "♻️"], n: "Take out recycling", m: 5 },
  { id: 208, e: ["📦", "🧦"], n: "Put away laundry", m: 8 },
];

export const LIBRARIES: Record<RoutineType, LibraryTask[]> = {
  morning: MORNING_TASKS,
  bedtime: BEDTIME_TASKS,
  chores: CHORE_TASKS,
};

export const ROUTINE_META: Record<
  RoutineType,
  { label: string; emoji: string; startLabel: string; endLabel: string; readyLabel: string }
> = {
  morning: { label: "Morning", emoji: "🌅", startLabel: "Wake-up", endLabel: "Leave-by", readyLabel: "Ready by" },
  bedtime: { label: "Bedtime", emoji: "😴", startLabel: "Start wind-down", endLabel: "Lights out by", readyLabel: "Lights out at" },
  chores: { label: "Chores", emoji: "🧹", startLabel: "Start time", endLabel: "Done by", readyLabel: "Finished by" },
};

export const ROUTINE_ORDER: RoutineType[] = ["morning", "bedtime", "chores"];

export const DEFAULT_REWARDS = [
  { id: 1, e: "🎮", n: "Extra screen time", cost: 15 },
  { id: 2, e: "🍦", n: "Ice cream treat", cost: 20 },
  { id: 3, e: "🎬", n: "Movie night pick", cost: 30 },
  { id: 4, e: "🛝", n: "Playground trip", cost: 40 },
];

export const EMOJI_PICKS = ["🍦", "🎬", "🛝", "🎮", "🍕", "📖", "🧸", "🎨", "🍪", "⭐", "🏆", "🎵"];
export const AVATAR_PICKS = ["🦄", "🐯", "🐸", "🦊", "🐼", "🐵", "🦁", "🐰", "🐨", "🦖", "🐱", "🐶"];

export const CELEBRATIONS: { emoji: string; phrase: (n: string) => string }[] = [
  { emoji: "🎉", phrase: (n) => `All done, ${n}!` },
  { emoji: "🚀", phrase: (n) => `Blast off, ${n}! You did it!` },
  { emoji: "🏆", phrase: (n) => `Champion move, ${n}!` },
  { emoji: "🌈", phrase: (n) => `You're on fire, ${n}!` },
  { emoji: "🥳", phrase: (n) => `Way to go, ${n}!` },
  { emoji: "💪", phrase: (n) => `Crushed it, ${n}!` },
  { emoji: "🎊", phrase: (n) => `Superstar alert, ${n}!` },
  { emoji: "🦸", phrase: (n) => `${n} saves the day again!` },
];

export const pickCelebration = () => CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)];

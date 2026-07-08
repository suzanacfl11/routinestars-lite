import { track } from "@vercel/analytics";
import type { RoutineType } from "./types";

export function trackRoutineCompleted(routineType: RoutineType, tasksDone: number) {
  track("routine_completed", { routineType, tasksDone });
}
export function trackRewardRedeemed(cost: number) {
  track("reward_redeemed", { cost });
}
export function trackStreakMilestone(days: number) {
  track("streak_milestone", { days });
}
export function trackProfileAdded(totalProfiles: number) {
  track("profile_added", { totalProfiles });
}

import { track } from "@vercel/analytics";
import type { RoutineType } from "./types";

// Vercel Analytics auto-tracks page views via the <Analytics /> component in
// layout.tsx. These are the custom events worth knowing for THIS app —
// kept to a small, deliberate set rather than tracking everything, since
// the goal is "are routines getting completed and rewards redeemed",
// not a full behavioral-analytics pipeline.
//
// No personally identifying info is sent — child names/ages never leave
// the device via analytics. Only the routine TYPE and counts are tracked.

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

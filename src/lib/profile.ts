import { DEFAULT_REWARDS } from "./constants";
import { daysBetween, todayStr, yesterdayStr } from "./dates";
import type { Profile } from "./types";

export function defaultProfile(name = "Emma", avatar = "🦄"): Profile {
  return {
    id: Date.now() + Math.random(),
    name,
    avatar,
    age: 7,
    routines: {
      morning: { start: "07:00", end: "08:00", tasks: [] },
      bedtime: { start: "19:30", end: "20:00", tasks: [] },
      chores: { start: "16:00", end: "17:00", tasks: [] },
    },
    stars: 0,
    rewards: DEFAULT_REWARDS.map((r) => ({ ...r })),
    goalId: DEFAULT_REWARDS[2].id,
    streak: 0,
    bestStreak: 0,
    missedDays: 0,
    lastCompletedDate: null,
    completedToday: [],
  };
}

/**
 * Backfills fields for profiles saved before streak-cap/missed-days existed,
 * and counts any days that elapsed silently (app not opened, nothing
 * completed) up through yesterday. Today itself is never counted as missed
 * here — it only becomes missed once a future day's completion looks back
 * at it.
 *
 * If a gap is found, lastCompletedDate is advanced to "yesterday" so that
 * the next completion sees a clean 1-day gap and doesn't re-count the same
 * missed days a second time (see handleEarnStars in useHousehold.ts).
 */
export function reconcileProfileOnLoad(p: Partial<Profile> & { id: number; name: string }): Profile {
  const base = defaultProfile(p.name, p.avatar);
  const withDefaults: Profile = {
    ...base,
    ...p,
    bestStreak: p.bestStreak ?? p.streak ?? 0,
    missedDays: p.missedDays ?? 0,
  };
  const today = todayStr();
  if (withDefaults.lastCompletedDate && withDefaults.lastCompletedDate !== today) {
    const gap = daysBetween(withDefaults.lastCompletedDate, today);
    if (gap > 1) {
      return {
        ...withDefaults,
        missedDays: withDefaults.missedDays + (gap - 1),
        streak: 0,
        lastCompletedDate: yesterdayStr(),
      };
    }
  }
  return withDefaults;
}

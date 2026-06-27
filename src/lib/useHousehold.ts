"use client";

import { useEffect, useRef, useState } from "react";
import { loadHousehold, saveHousehold } from "./storage";
import { defaultProfile, reconcileProfileOnLoad } from "./profile";
import { daysBetween, todayStr } from "./dates";
import { STREAK_CAP, MAX_PROFILES } from "./constants";
import { trackProfileAdded, trackRewardRedeemed, trackRoutineCompleted, trackStreakMilestone } from "./analytics";
import type { Profile, Reward, RoutineType } from "./types";

export function useHousehold() {
  const [loaded, setLoaded] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const householdIdRef = useRef<string>("");

  const [redeemSplash, setRedeemSplash] = useState<Reward | null>(null);
  const [streakMilestone, setStreakMilestone] = useState<number | null>(null);

  useEffect(() => {
    loadHousehold().then(({ data, householdId }) => {
      householdIdRef.current = householdId;
      if (data && Array.isArray(data.profiles) && data.profiles.length) {
        const reconciled = data.profiles.map(reconcileProfileOnLoad);
        setProfiles(reconciled);
        setActiveId(data.activeId ?? reconciled[0].id);
      } else {
        const p = defaultProfile();
        setProfiles([p]);
        setActiveId(p.id);
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded || !householdIdRef.current) return;
    saveHousehold(householdIdRef.current, { profiles, activeId });
  }, [profiles, activeId, loaded]);

  const updateProfile = (updater: (p: Profile) => Profile) => {
    setProfiles((ps) => ps.map((p) => (p.id === activeId ? updater(p) : p)));
  };

  const addProfile = (name: string, avatar: string) => {
    if (profiles.length >= MAX_PROFILES) return;
    const np = defaultProfile(name, avatar);
    setProfiles((ps) => {
      const next = [...ps, np];
      trackProfileAdded(next.length);
      return next;
    });
    setActiveId(np.id);
  };

  const deleteProfile = (id: number) => {
    if (profiles.length <= 1) return;
    const remaining = profiles.filter((p) => p.id !== id);
    setProfiles(remaining);
    if (activeId === id) setActiveId(remaining[0].id);
  };

  const handleEarnStars = (count: number, routineType: RoutineType) => {
    const today = todayStr();
    let milestone: number | null = null;
    updateProfile((p) => {
      const completedToday = p.lastCompletedDate === today ? [...new Set([...p.completedToday, routineType])] : [routineType];
      let streak = p.streak;
      let missedDays = p.missedDays;
      let bestStreak = p.bestStreak || 0;
      if (p.lastCompletedDate !== today) {
        const gap = p.lastCompletedDate ? daysBetween(p.lastCompletedDate, today) : null;
        if (gap === 1) {
          streak = p.streak + 1;
        } else if (gap !== null && gap > 1) {
          missedDays += gap - 1; // every day strictly between last completion and today was missed
          streak = 1;
        } else {
          streak = 1; // first-ever completion
        }
        bestStreak = Math.max(bestStreak, streak);
        if (streak >= STREAK_CAP) {
          milestone = streak;
          streak = 0; // roll over after hitting the cap
        }
      }
      return { ...p, stars: p.stars + count, lastCompletedDate: today, completedToday, streak, bestStreak, missedDays };
    });
    trackRoutineCompleted(routineType, count);
    if (milestone) {
      trackStreakMilestone(milestone);
      setStreakMilestone(milestone);
    }
  };

  const handleRedeem = (reward: Reward) => {
    updateProfile((p) => {
      if (p.stars < reward.cost) return p; // guards against double-tap firing before re-render
      return { ...p, stars: Math.max(0, p.stars - reward.cost) };
    });
    trackRewardRedeemed(reward.cost);
    setRedeemSplash(reward);
  };

  const activeProfile = profiles.find((p) => p.id === activeId) || null;

  return {
    loaded,
    profiles,
    activeId,
    activeProfile,
    setActiveId,
    updateProfile,
    addProfile,
    deleteProfile,
    handleEarnStars,
    handleRedeem,
    redeemSplash,
    setRedeemSplash,
    streakMilestone,
    setStreakMilestone,
  };
}

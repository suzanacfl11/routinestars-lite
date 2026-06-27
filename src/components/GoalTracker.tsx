"use client";

import { ACCENT, ACCENT2, CARD, TEXT } from "@/lib/constants";
import type { Profile } from "@/lib/types";

export function GoalTracker({
  profile,
  updateProfile,
}: {
  profile: Profile;
  updateProfile: (updater: (p: Profile) => Profile) => void;
}) {
  const { stars, rewards, goalId } = profile;
  const goal = rewards.find((r) => r.id === goalId) || null;
  const pct = goal ? Math.min(100, Math.round((stars / goal.cost) * 100)) : 0;
  const setGoalId = (id: number) => updateProfile((p) => ({ ...p, goalId: id }));

  return (
    <div style={{ padding: "4px 16px 30px" }}>
      <div style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, borderRadius: 22, padding: "24px 20px", color: "#fff", textAlign: "center", marginBottom: 18, boxShadow: `0 10px 30px ${ACCENT}44` }}>
        <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.85, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>🎯 {profile.name}&apos;s goal</div>
        {goal ? (
          <>
            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 14 }}>
              {goal.e} {goal.n}
            </div>
            <div style={{ background: "rgba(255,255,255,0.3)", borderRadius: 10, height: 12, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ height: 12, borderRadius: 10, background: "#fff", width: `${pct}%`, transition: "width 0.4s ease" }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>
              {stars} / {goal.cost} ⭐
            </div>
          </>
        ) : (
          <div style={{ fontSize: 14, opacity: 0.9, padding: "10px 0" }}>No goal set yet — pick one below</div>
        )}
      </div>

      <div style={{ fontSize: 11, fontWeight: 800, color: TEXT, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Set a goal from rewards</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rewards.map((r) => (
          <div
            key={r.id}
            onClick={() => setGoalId(r.id)}
            style={{ display: "flex", alignItems: "center", gap: 10, background: goalId === r.id ? CARD : "#fff", border: `2px solid ${goalId === r.id ? ACCENT : "transparent"}`, borderRadius: 14, padding: "10px 12px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          >
            <div style={{ fontSize: 22 }}>{r.e}</div>
            <div style={{ flex: 1, fontWeight: 700, fontSize: 13, color: TEXT }}>{r.n}</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT }}>⭐ {r.cost}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

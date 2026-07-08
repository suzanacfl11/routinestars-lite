"use client";

import { useState } from "react";
import { Confetti } from "./Shared";
import { ACCENT, ACCENT2, GOLD, CARD, ROUTINE_META, ROUTINE_ORDER, SUB, TEXT, pickCelebration } from "@/lib/constants";
import type { Profile, RoutineType, Task } from "@/lib/types";

type SessionTask = Task & { status: "pending" | "done" | "skipped" };

export function BigMode({ profile, updateProfile, onEarnStars }: {
  profile: Profile;
  updateProfile: (updater: (p: Profile) => Profile) => void;
  onEarnStars: (count: number, routineType: RoutineType) => void;
}) {
  const [runType,     setRunType]     = useState<RoutineType | null>(null);
  const [session,     setSession]     = useState<SessionTask[]>([]);
  const [idx,         setIdx]         = useState(0);
  const [finished,    setFinished]    = useState(false);
  const [celebration, setCelebration] = useState(pickCelebration());

  const available = ROUTINE_ORDER.filter((rt) => profile.routines[rt].tasks.length > 0);

  const start = (type: RoutineType) => {
    setRunType(type);
    setSession(profile.routines[type].tasks.map((t) => ({ ...t, status: "pending" as const })));
    setIdx(0); setFinished(false);
  };

  const finishRun = (updatedSession: SessionTask[]) => {
    const doneCount = updatedSession.filter((t) => t.status === "done").length;
    setSession(updatedSession); setCelebration(pickCelebration()); setFinished(true);
    if (doneCount > 0 && runType) onEarnStars(doneCount, runType);
  };

  const handleAction = (status: "done" | "skipped") => {
    const updated = session.map((t, i) => (i === idx ? { ...t, status } : t));
    if (idx >= updated.length - 1) finishRun(updated);
    else { setSession(updated); setIdx((i) => i + 1); }
  };

  const stopEarly = () => {
    const updated = session.map((t) => (t.status === "pending" ? { ...t, status: "skipped" as const } : t));
    finishRun(updated);
  };

  if (!available.length) return (
    <div style={{ padding: "60px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🧩</div>
      <p style={{ color: SUB, fontSize: 14, lineHeight: 1.6 }}>Build a routine in the <strong>Build</strong> tab first.</p>
    </div>
  );

  if (!runType) return (
    <div style={{ padding: "40px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, marginBottom: 20 }}>Which one, {profile.name}?</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {available.map((rt, i) => (
          <button key={rt} onClick={() => start(rt)} style={{
            padding: "36px 20px", borderRadius: 28, border: "none",
            background: i % 2 === 0
              ? `linear-gradient(135deg,${ACCENT},${ACCENT2})`
              : `linear-gradient(135deg,${ACCENT2},${ACCENT})`,
            color: "#fff", fontSize: 28, fontWeight: 900, cursor: "pointer",
            boxShadow: `0 10px 28px ${ACCENT}44`,
          }}>
            {ROUTINE_META[rt].emoji}<br/>{ROUTINE_META[rt].label}
          </button>
        ))}
      </div>
    </div>
  );

  if (finished) {
    const doneCount    = session.filter((t) => t.status === "done").length;
    const skippedCount = session.filter((t) => t.status === "skipped").length;
    return (
      <div style={{ minHeight: "calc(100vh - 130px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Confetti/>
        <div style={{ fontSize: 90, marginBottom: 8, animation: "bounce 0.8s ease infinite", position: "relative", zIndex: 1 }}>{celebration.emoji}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: TEXT, marginBottom: 6, position: "relative", zIndex: 1 }}>{celebration.phrase(profile.name || "star")}</div>
        {/* Stars earned in gold */}
        <div style={{ fontSize: 20, fontWeight: 800, color: GOLD, marginBottom: 6, position: "relative", zIndex: 1, background: ACCENT, borderRadius: 50, padding: "6px 20px", display: "inline-block" }}>
          +{doneCount} ⭐ earned
        </div>
        {skippedCount > 0 && <div style={{ fontSize: 13, color: SUB, marginBottom: 22, position: "relative", zIndex: 1 }}>{skippedCount} skipped today — that&apos;s okay</div>}
        {skippedCount === 0 && <div style={{ marginBottom: 22 }}/>}
        <button onClick={() => { setSession((s) => s.map((t) => ({ ...t, status: "pending" as const }))); setIdx(0); setFinished(false); }}
          style={{ width: "100%", maxWidth: 320, padding: "22px", borderRadius: 24, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, color: "#fff", fontSize: 20, fontWeight: 900, cursor: "pointer", marginBottom: 12, boxShadow: `0 8px 24px ${ACCENT}44`, position: "relative", zIndex: 1 }}>
          Do it again 🔁
        </button>
        <button onClick={() => { setRunType(null); setFinished(false); setIdx(0); }}
          style={{ width: "100%", maxWidth: 320, padding: "16px", borderRadius: 24, border: "none", background: "#fff", color: SUB, fontSize: 15, fontWeight: 800, cursor: "pointer", position: "relative", zIndex: 1 }}>
          ← Pick another routine
        </button>
      </div>
    );
  }

  const task = session[idx];
  const next = session[idx + 1];

  return (
    <div style={{ minHeight: "calc(100vh - 130px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 28px", position: "relative" }}>
      <button onClick={stopEarly} style={{ position: "absolute", top: 8, left: 8, width: 36, height: 36, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.05)", color: SUB, fontSize: 16, cursor: "pointer", zIndex: 2 }}>‹</button>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", maxWidth: "100%", padding: "34px 4px 4px", justifyContent: session.length <= 7 ? "center" : "flex-start" }}>
        {session.map((t, i) => {
          const isCurrent = i === idx;
          const size = isCurrent ? 38 : 28;
          let bg: string = CARD; let opacity = 0.6;
          if (t.status === "done")    { bg = ACCENT2; opacity = 1; }  // plum for done
          if (t.status === "skipped") { bg = "#E2DED4"; opacity = 0.5; }
          if (isCurrent)              opacity = 1;
          return (
            <div key={t.id} style={{
              width: size, height: size, borderRadius: "50%",
              background: isCurrent ? "#fff" : bg,
              border: isCurrent ? `3px solid ${ACCENT}` : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: isCurrent ? 18 : 14, flexShrink: 0, opacity,
              boxShadow: isCurrent ? `0 3px 10px ${ACCENT}55` : "none",
              transition: "all 0.2s",
            }}>
              {t.status === "done" ? "✓" : t.e}
            </div>
          );
        })}
      </div>

      {/* Task card */}
      <div key={idx} style={{ animation: "pop 0.25s ease", background: "#fff", borderRadius: 36, padding: "40px 28px", width: "100%", maxWidth: 380, textAlign: "center", boxShadow: "0 12px 36px rgba(0,0,0,0.10)" }}>
        <div style={{ fontSize: 124, lineHeight: 1, marginBottom: 16 }}>{task.e}</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: TEXT, lineHeight: 1.15 }}>{task.n}</div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: SUB, minHeight: 20 }}>
        {next ? <>Up next: {next.e} {next.n}</> : "🏁 Last one!"}
      </div>

      {/* DONE button — navy to plum gradient */}
      <div style={{ width: "100%", maxWidth: 380 }}>
        <button onClick={() => handleAction("done")} style={{
          width: "100%", padding: "32px", borderRadius: 32, border: "none",
          background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`,
          color: "#fff", fontSize: 28, fontWeight: 900, cursor: "pointer",
          boxShadow: `0 12px 30px ${ACCENT}55`, letterSpacing: 1,
        }}>
          ✅ DONE!
        </button>
        <button onClick={() => handleAction("skipped")} style={{ width: "100%", padding: "10px", border: "none", background: "transparent", color: SUB, fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { EmojiCycle } from "./Shared";
import { ACCENT, ACCENT2, BG, CARD, EMOJI_PICKS, LIBRARIES, ROUTINE_META, ROUTINE_ORDER, SUB, TEXT } from "@/lib/constants";
import { toLabel, toMinutes } from "@/lib/dates";
import type { Profile, RoutineType, Task } from "@/lib/types";

export function Builder({
  profile,
  updateProfile,
}: {
  profile: Profile;
  updateProfile: (updater: (p: Profile) => Profile) => void;
}) {
  const [routineType, setRoutineType] = useState<RoutineType>("morning");
  const library = LIBRARIES[routineType];
  const meta = ROUTINE_META[routineType];
  const r = profile.routines[routineType];
  const tasks = r.tasks;

  const setRoutine = (patch: Partial<typeof r>) =>
    updateProfile((p) => ({
      ...p,
      routines: { ...p.routines, [routineType]: { ...p.routines[routineType], ...patch } },
    }));

  const setTasks = (updater: Task[] | ((ts: Task[]) => Task[])) =>
    setRoutine({ tasks: typeof updater === "function" ? updater(tasks) : updater });

  const isAdded = (id: number) => tasks.some((t) => t.id === id);

  const addTask = (task: (typeof library)[number]) => {
    if (isAdded(task.id)) {
      setTasks((ts) => ts.filter((t) => t.id !== task.id));
      return;
    }
    setTasks((ts) => [...ts, { id: task.id, e: task.e[0], n: task.n, m: task.m, iconSet: task.e }]);
  };
  const removeTask = (id: number) => setTasks((ts) => ts.filter((t) => t.id !== id));
  const updateTask = (id: number, patch: Partial<Task>) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [customEmoji, setCustomEmoji] = useState(EMOJI_PICKS[0]);
  const [customName, setCustomName] = useState("");
  const [customMinutes, setCustomMinutes] = useState(5);

  const addCustomTask = () => {
    if (!customName.trim()) return;
    setTasks((ts) => [...ts, { id: Date.now(), e: customEmoji, n: customName.trim(), m: Number(customMinutes) || 5, iconSet: [customEmoji] }]);
    setCustomName("");
    setCustomMinutes(5);
  };

  const scheduled = useMemo(() => {
    return tasks.reduce<{ list: (Task & { start: number })[]; cursor: number }>(
      (acc, t) => {
        const start = acc.cursor;
        return { list: [...acc.list, { ...t, start }], cursor: acc.cursor + t.m };
      },
      { list: [], cursor: toMinutes(r.start) }
    ).list;
  }, [tasks, r.start]);

  const readyAt = scheduled.length ? scheduled[scheduled.length - 1].start + scheduled[scheduled.length - 1].m : toMinutes(r.start);
  const endMin = toMinutes(r.end);
  const buffer = endMin - readyAt;
  const isOver = buffer < 0;

  return (
    <div style={{ padding: "4px 16px 30px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1, background: "#fff", borderRadius: 14, padding: "10px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: ACCENT }}>🔥 {profile.streak}</div>
          <div style={{ fontSize: 9, fontWeight: 800, color: SUB, textTransform: "uppercase", letterSpacing: 0.4 }}>Current streak</div>
        </div>
        <div style={{ flex: 1, background: "#fff", borderRadius: 14, padding: "10px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: ACCENT2 }}>🏅 {profile.bestStreak || 0}</div>
          <div style={{ fontSize: 9, fontWeight: 800, color: SUB, textTransform: "uppercase", letterSpacing: 0.4 }}>Best streak</div>
        </div>
        <div style={{ flex: 1, background: "#fff", borderRadius: 14, padding: "10px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: SUB }}>📅 {profile.missedDays || 0}</div>
          <div style={{ fontSize: 9, fontWeight: 800, color: SUB, textTransform: "uppercase", letterSpacing: 0.4 }}>Missed days</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {ROUTINE_ORDER.map((rt) => (
          <button
            key={rt}
            onClick={() => setRoutineType(rt)}
            style={{
              flex: 1,
              padding: "12px 6px",
              borderRadius: 14,
              border: `2px solid ${routineType === rt ? ACCENT : CARD}`,
              background: routineType === rt ? ACCENT : "#fff",
              color: routineType === rt ? "#fff" : TEXT,
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {ROUTINE_META[rt].emoji} {ROUTINE_META[rt].label}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 20, padding: 18, marginBottom: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 10, fontWeight: 800, color: SUB, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>{meta.startLabel}</label>
            <input
              type="time"
              value={r.start}
              onChange={(e) => setRoutine({ start: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${CARD}`, fontSize: 14, fontWeight: 700, outline: "none", background: BG, color: TEXT }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 10, fontWeight: 800, color: SUB, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>{meta.endLabel}</label>
            <input
              type="time"
              value={r.end}
              onChange={(e) => setRoutine({ end: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${CARD}`, fontSize: 14, fontWeight: 700, outline: "none", background: BG, color: TEXT }}
            />
          </div>
        </div>
      </div>

      {tasks.length > 0 && (
        <div style={{ background: isOver ? "#FFF3EC" : CARD, border: `1.5px solid ${isOver ? "#F4C9A8" : "#CFEAE0"}`, borderRadius: 16, padding: "12px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: SUB, textTransform: "uppercase", letterSpacing: 0.5 }}>{meta.readyLabel}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: isOver ? "#C9762E" : ACCENT }}>{toLabel(readyAt)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: SUB, textTransform: "uppercase", letterSpacing: 0.5 }}>{isOver ? "Over by" : "Buffer"}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: isOver ? "#C9762E" : ACCENT }}>{Math.abs(buffer)} min</div>
          </div>
        </div>
      )}

      {tasks.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: TEXT, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
            {profile.name}&apos;s {meta.label} · {tasks.length} tasks
          </div>
          {scheduled.map((t) => {
            const isEditing = editingTaskId === t.id;
            return (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 14, padding: "10px 12px", marginBottom: 7, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ width: 54, fontSize: 11, fontWeight: 800, color: ACCENT, flexShrink: 0 }}>{toLabel(t.start)}</div>
                <div style={{ width: 1, height: 24, background: CARD, flexShrink: 0 }} />
                {isEditing ? (
                  <>
                    <input
                      value={t.n}
                      onChange={(e) => updateTask(t.id, { n: e.target.value })}
                      style={{ flex: 1, padding: "6px 8px", borderRadius: 8, border: `1.5px solid ${CARD}`, fontSize: 13, fontWeight: 700, outline: "none", color: TEXT, minWidth: 0 }}
                    />
                    <input
                      type="number"
                      value={t.m}
                      onChange={(e) => updateTask(t.id, { m: Number(e.target.value) || 1 })}
                      style={{ width: 46, padding: "6px 4px", borderRadius: 8, border: `1.5px solid ${CARD}`, fontSize: 12, textAlign: "center", outline: "none", flexShrink: 0 }}
                    />
                    <button onClick={() => setEditingTaskId(null)} style={{ width: 26, height: 26, borderRadius: "50%", border: "none", background: ACCENT, color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 13, flexShrink: 0 }}>
                      ✓
                    </button>
                  </>
                ) : (
                  <>
                    <EmojiCycle options={t.iconSet || [t.e]} value={t.e} onChange={(em) => updateTask(t.id, { e: em })} />
                    <div style={{ flex: 1, fontWeight: 700, fontSize: 13, color: TEXT, minWidth: 0 }}>{t.n}</div>
                    <div style={{ fontSize: 11, color: SUB, flexShrink: 0 }}>{t.m}m</div>
                    <button onClick={() => setEditingTaskId(t.id)} style={{ width: 24, height: 24, borderRadius: "50%", border: "none", background: CARD, color: ACCENT, fontWeight: 800, cursor: "pointer", fontSize: 12, flexShrink: 0 }}>
                      ✎
                    </button>
                  </>
                )}
                <button onClick={() => removeTask(t.id)} style={{ width: 24, height: 24, borderRadius: "50%", border: "none", background: "#FFE9E9", color: "#D9534F", fontWeight: 800, cursor: "pointer", fontSize: 13, flexShrink: 0 }}>
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 16, padding: 14, marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: TEXT, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>➕ Add a custom task</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {EMOJI_PICKS.map((em) => (
            <button
              key={em}
              onClick={() => setCustomEmoji(em)}
              style={{ width: 30, height: 30, borderRadius: 8, border: `1.5px solid ${customEmoji === em ? ACCENT : CARD}`, background: customEmoji === em ? CARD : "#fff", fontSize: 15, cursor: "pointer" }}
            >
              {em}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomTask()}
            placeholder="e.g. Take medication"
            style={{ flex: 1, padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${CARD}`, fontSize: 13, outline: "none", background: BG, color: TEXT }}
          />
          <input
            type="number"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(Number(e.target.value))}
            style={{ width: 54, padding: "10px 6px", borderRadius: 12, border: `1.5px solid ${CARD}`, fontSize: 13, outline: "none", background: BG, color: TEXT, textAlign: "center" }}
          />
        </div>
        <button
          onClick={addCustomTask}
          disabled={!customName.trim()}
          style={{ width: "100%", marginTop: 10, padding: "11px", borderRadius: 12, border: "none", background: customName.trim() ? `linear-gradient(135deg,${ACCENT},${ACCENT2})` : "#ddd", color: "#fff", fontWeight: 800, fontSize: 13, cursor: customName.trim() ? "pointer" : "default" }}
        >
          Add Task
        </button>
      </div>

      <div style={{ fontSize: 11, fontWeight: 800, color: TEXT, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>📋 Task Library — tap to add</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {library.map((task) => {
          const added = isAdded(task.id);
          return (
            <div
              key={task.id}
              onClick={() => addTask(task)}
              style={{ display: "flex", alignItems: "center", gap: 10, background: added ? CARD : "#fff", border: `2px solid ${added ? ACCENT : "transparent"}`, borderRadius: 14, padding: "10px 12px", cursor: "pointer", boxShadow: added ? "none" : "0 2px 8px rgba(0,0,0,0.05)", transition: "all 0.12s" }}
            >
              <div style={{ fontSize: 20, flexShrink: 0 }}>{added ? "✓" : task.e[0]}</div>
              <div style={{ flex: 1, fontWeight: 700, fontSize: 13, color: TEXT }}>{task.n}</div>
              <div style={{ fontSize: 11, color: SUB, fontWeight: 700 }}>{task.m} min</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

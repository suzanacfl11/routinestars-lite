"use client";

import { useState } from "react";
import { AVATAR_PICKS, CARD, MAX_PROFILES, TEXT, SUB } from "@/lib/constants";
import type { Profile } from "@/lib/types";

export function ProfileBar({
  profiles,
  activeId,
  onSwitch,
  onAdd,
  onDelete,
}: {
  profiles: Profile[];
  activeId: number;
  onSwitch: (id: number) => void;
  onAdd: (name: string, avatar: string) => void;
  onDelete: (id: number) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATAR_PICKS[0]);

  const submit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), avatar);
    setName("");
    setAvatar(AVATAR_PICKS[0]);
    setAdding(false);
  };

  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
      {profiles.map((p) => (
        <button
          key={p.id}
          onClick={() => onSwitch(p.id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "7px 14px 7px 7px",
            borderRadius: 50,
            border: "none",
            background: p.id === activeId ? "#fff" : "rgba(255,255,255,0.18)",
            color: p.id === activeId ? TEXT : "#fff",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: p.id === activeId ? CARD : "rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
            }}
          >
            {p.avatar}
          </div>
          {p.name}
        </button>
      ))}

      {!adding && profiles.length < MAX_PROFILES && (
        <button
          onClick={() => setAdding(true)}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "2px dashed rgba(255,255,255,0.6)",
            background: "transparent",
            color: "#fff",
            fontSize: 18,
            fontWeight: 800,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          +
        </button>
      )}
      {!adding && profiles.length >= MAX_PROFILES && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.75)",
            flexShrink: 0,
            padding: "0 6px",
          }}
        >
          Max {MAX_PROFILES} kids
        </div>
      )}
      {adding && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", borderRadius: 50, padding: "5px 8px", flexShrink: 0 }}>
          <select value={avatar} onChange={(e) => setAvatar(e.target.value)} style={{ border: "none", background: "transparent", fontSize: 16, outline: "none" }}>
            {AVATAR_PICKS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Name"
            style={{ width: 80, border: "none", outline: "none", fontSize: 13, fontWeight: 700, color: TEXT }}
          />
          <button onClick={submit} style={{ width: 26, height: 26, borderRadius: "50%", border: "none", background: "#1FA98C", color: "#fff", fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>
            ✓
          </button>
          <button onClick={() => setAdding(false)} style={{ width: 26, height: 26, borderRadius: "50%", border: "none", background: CARD, color: SUB, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>
            ✕
          </button>
        </div>
      )}
      {profiles.length > 1 && (
        <button
          onClick={() => onDelete(activeId)}
          title="Remove this profile"
          style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.18)", color: "#fff", fontSize: 14, cursor: "pointer", flexShrink: 0 }}
        >
          🗑️
        </button>
      )}
    </div>
  );
}

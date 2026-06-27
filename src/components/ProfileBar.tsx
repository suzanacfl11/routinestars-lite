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
  onRename,
}: {
  profiles: Profile[];
  activeId: number;
  onSwitch: (id: number) => void;
  onAdd: (name: string, avatar: string) => void;
  onDelete: (id: number) => void;
  onRename: (id: number, newName: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATAR_PICKS[0]);

  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), avatar);
    setName("");
    setAvatar(AVATAR_PICKS[0]);
    setAdding(false);
  };

  const startRename = (p: Profile) => {
    setRenamingId(p.id);
    setRenameValue(p.name);
  };
  const submitRename = () => {
    if (renamingId !== null) onRename(renamingId, renameValue);
    setRenamingId(null);
  };

  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
      {profiles.map((p) => {
        const isRenaming = renamingId === p.id;

        if (isRenaming) {
          return (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", borderRadius: 50, padding: "5px 8px", flexShrink: 0 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: CARD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
                {p.avatar}
              </div>
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitRename()}
                onFocus={(e) => e.target.select()}
                style={{ width: 80, border: "none", outline: "none", fontSize: 13, fontWeight: 700, color: TEXT }}
              />
              <button onClick={submitRename} style={{ width: 26, height: 26, borderRadius: "50%", border: "none", background: "#1FA98C", color: "#fff", fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>
                ✓
              </button>
              <button onClick={() => setRenamingId(null)} style={{ width: 26, height: 26, borderRadius: "50%", border: "none", background: CARD, color: SUB, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>
                ✕
              </button>
            </div>
          );
        }

        return (
          <div
            key={p.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 50,
              background: p.id === activeId ? "#fff" : "rgba(255,255,255,0.18)",
              flexShrink: 0,
              paddingRight: p.id === activeId ? 4 : 0,
            }}
          >
            <button
              onClick={() => onSwitch(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 10px 7px 7px",
                borderRadius: 50,
                border: "none",
                background: "transparent",
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
            {p.id === activeId && (
              <button
                onClick={() => startRename(p)}
                title="Rename"
                style={{ width: 22, height: 22, borderRadius: "50%", border: "none", background: "transparent", color: SUB, fontSize: 12, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                ✎
              </button>
            )}
          </div>
        );
      })}

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

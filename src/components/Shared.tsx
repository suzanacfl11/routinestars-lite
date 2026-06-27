"use client";

import { useState } from "react";
import { ACCENT, ACCENT2 } from "@/lib/constants";

export function StarLogo({ size = 44 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 4px 14px ${ACCENT}55`,
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 30% 25%,rgba(255,255,255,0.3),transparent 60%)",
        }}
      />
      <span style={{ fontSize: size * 0.52, lineHeight: 1, position: "relative", zIndex: 1 }}>🌟</span>
    </div>
  );
}

export function Pill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 16px",
        borderRadius: 50,
        border: "none",
        background: active ? `linear-gradient(135deg,${ACCENT},${ACCENT2})` : "#fff",
        color: active ? "#fff" : "#8C8775",
        fontWeight: 800,
        fontSize: 13,
        cursor: "pointer",
        boxShadow: active ? `0 4px 14px ${ACCENT}44` : "0 1px 4px rgba(0,0,0,0.06)",
        whiteSpace: "nowrap",
        flexShrink: 0,
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

export function StreakBadge({ streak }: { streak: number }) {
  if (streak < 2) return null;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: "rgba(255,255,255,0.22)",
        borderRadius: 50,
        padding: "5px 12px",
        fontSize: 12,
        fontWeight: 800,
        color: "#fff",
      }}
    >
      <span style={{ display: "inline-block", animation: "flameFlicker 1.4s ease-in-out infinite" }}>🔥</span>
      {streak}-day streak
    </div>
  );
}

export function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      dur: 1.6 + Math.random() * 0.8,
      color: [ACCENT, ACCENT2, "#F25C5C", "#4A90D9", "#F2C94C"][i % 5],
      size: 6 + Math.random() * 6,
    }))
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.id % 2 ? "50%" : "3px",
            animation: `confettiFall ${p.dur}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

export function EmojiCycle({
  options,
  value,
  onChange,
  size = 20,
}: {
  options: string[];
  value: string;
  onChange: (emoji: string) => void;
  size?: number;
}) {
  const idx = Math.max(0, options.indexOf(value));
  const next = () => onChange(options[(idx + 1) % options.length]);
  if (options.length <= 1) return <div style={{ fontSize: size, flexShrink: 0 }}>{value}</div>;
  return (
    <button
      onClick={next}
      title="Tap to change icon"
      style={{ fontSize: size, background: "transparent", border: "none", cursor: "pointer", flexShrink: 0, lineHeight: 1 }}
    >
      {value}
    </button>
  );
}

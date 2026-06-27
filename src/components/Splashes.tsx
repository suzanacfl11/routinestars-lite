"use client";

import { Confetti } from "./Shared";
import { ACCENT, ACCENT2, SUB, TEXT } from "@/lib/constants";
import type { Reward } from "@/lib/types";

export function RedeemSplash({ reward, onClose }: { reward: Reward; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div
        style={{ background: "#fff", borderRadius: 28, padding: "36px 26px", maxWidth: 340, width: "100%", textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.25)", animation: "pop 0.3s ease", position: "relative", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Confetti />
        <div style={{ fontSize: 80, marginBottom: 10, position: "relative", zIndex: 1 }}>{reward.e}</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: TEXT, marginBottom: 6, position: "relative", zIndex: 1 }}>Reward unlocked!</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT, marginBottom: 18, position: "relative", zIndex: 1 }}>{reward.n}</div>
        <p style={{ fontSize: 12, color: SUB, marginBottom: 18, position: "relative", zIndex: 1 }}>Time to start earning your next goal! ⭐</p>
        <button onClick={onClose} style={{ width: "100%", padding: "14px", borderRadius: 50, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", position: "relative", zIndex: 1 }}>
          Yay!
        </button>
      </div>
    </div>
  );
}

export function StreakMilestoneSplash({ days, name, onClose }: { days: number; name: string; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
      <div
        style={{ background: "#fff", borderRadius: 28, padding: "36px 26px", maxWidth: 340, width: "100%", textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.25)", animation: "pop 0.3s ease", position: "relative", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Confetti />
        <div style={{ fontSize: 80, marginBottom: 10, position: "relative", zIndex: 1 }}>🏅</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: TEXT, marginBottom: 6, position: "relative", zIndex: 1 }}>
          {days}-day streak, {name}!
        </div>
        <p style={{ fontSize: 13, color: SUB, marginBottom: 18, position: "relative", zIndex: 1, lineHeight: 1.5 }}>That&apos;s an amazing milestone. Your streak starts fresh tomorrow — let&apos;s go for another one!</p>
        <button onClick={onClose} style={{ width: "100%", padding: "14px", borderRadius: 50, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", position: "relative", zIndex: 1 }}>
          Let&apos;s go!
        </button>
      </div>
    </div>
  );
}

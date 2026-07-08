"use client";

import { useState } from "react";
import { ACCENT, ACCENT2, GOLD, CARD, EMOJI_PICKS, SUB, TEXT } from "@/lib/constants";
import type { Profile, Reward } from "@/lib/types";

function ConfirmRedeemDialog({ reward, onConfirm, onCancel }: { reward: Reward; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onCancel}>
      <div style={{ background: "#fff", borderRadius: 28, padding: "32px 24px", maxWidth: 320, width: "100%", textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 56, marginBottom: 10 }}>{reward.e}</div>
        <div style={{ fontSize: 17, fontWeight: 800, color: TEXT, marginBottom: 6, lineHeight: 1.4 }}>
          Use <span style={{ color: GOLD, background: ACCENT, borderRadius: 20, padding: "2px 10px" }}>⭐ {reward.cost}</span> on {reward.n}?
        </div>
        <p style={{ fontSize: 12, color: SUB, marginBottom: 20 }}>This can&apos;t be undone once confirmed — make sure that&apos;s the right one!</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "13px", borderRadius: 50, border: "none", background: CARD, color: SUB, fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Not yet</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "13px", borderRadius: 50, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Yes, redeem!</button>
        </div>
      </div>
    </div>
  );
}

export function RewardsShop({ profile, updateProfile, onRedeem }: {
  profile: Profile;
  updateProfile: (updater: (p: Profile) => Profile) => void;
  onRedeem: (reward: Reward) => void;
}) {
  const { stars, rewards } = profile;
  const [editingId,      setEditingId]     = useState<number | null>(null);
  const [name,           setName]          = useState("");
  const [cost,           setCost]          = useState(10);
  const [emoji,          setEmoji]         = useState("⭐");
  const [confirmTarget,  setConfirmTarget] = useState<Reward | null>(null);

  const setRewards = (updater: Reward[] | ((rs: Reward[]) => Reward[])) =>
    updateProfile((p) => ({ ...p, rewards: typeof updater === "function" ? updater(p.rewards) : updater }));

  const addReward    = () => { if (!name.trim()) return; setRewards((rs) => [...rs, { id: Date.now(), e: emoji || "⭐", n: name.trim(), cost: Number(cost) || 10 }]); setName(""); setCost(10); setEmoji("⭐"); };
  const updateReward = (id: number, patch: Partial<Reward>) => setRewards((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const deleteReward = (id: number) => setRewards((rs) => rs.filter((r) => r.id !== id));

  return (
    <div style={{ padding: "4px 16px 30px" }}>
      {/* Star total — gold on navy */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: SUB, textTransform: "uppercase", letterSpacing: 0.5 }}>{profile.name}&apos;s stars</div>
        <div style={{ fontSize: 44, fontWeight: 900, color: GOLD, background: ACCENT, borderRadius: 20, display: "inline-block", padding: "4px 24px", marginTop: 6 }}>⭐ {stars}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        {rewards.map((r) => {
          const unlocked = stars >= r.cost;
          const isEditing = editingId === r.id;
          return (
            <div key={r.id} style={{ background: "#fff", borderRadius: 16, padding: 14, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", border: `2px solid ${unlocked ? ACCENT2 : "transparent"}` }}>
              {isEditing ? (
                <>
                  <input autoFocus value={r.e} onChange={(e) => updateReward(r.id, { e: e.target.value })}
                    style={{ fontSize: 24, width: 42, padding: "4px", border: `1.5px solid ${CARD}`, borderRadius: 10, marginBottom: 6, outline: "none", textAlign: "center" }}/>
                  <input value={r.n} onChange={(e) => updateReward(r.id, { n: e.target.value })}
                    style={{ width: "100%", padding: "6px 8px", border: `1.5px solid ${CARD}`, borderRadius: 8, marginBottom: 6, outline: "none", fontSize: 13, fontWeight: 700, color: TEXT }}/>
                  <input type="number" value={r.cost} onChange={(e) => updateReward(r.id, { cost: Number(e.target.value) || 1 })}
                    style={{ width: "100%", padding: "6px 8px", border: `1.5px solid ${CARD}`, borderRadius: 8, marginBottom: 8, outline: "none", fontSize: 13, fontWeight: 700, color: ACCENT2, textAlign: "center" }}/>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: "6px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>✓ Save</button>
                    <button onClick={() => deleteReward(r.id)} style={{ width: 32, borderRadius: 8, border: "none", background: "#FFE9E9", color: "#D9534F", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>✕</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{r.e}</div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: TEXT, marginBottom: 6, lineHeight: 1.3 }}>{r.n}</div>
                  {/* Cost in gold */}
                  <div style={{ fontSize: 12, fontWeight: 800, color: GOLD, background: ACCENT, borderRadius: 20, display: "inline-block", padding: "2px 10px", marginBottom: 8 }}>⭐ {r.cost}</div>
                  <div style={{ display: "block", marginBottom: 8 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 800, background: unlocked ? `${ACCENT2}22` : CARD, color: unlocked ? ACCENT2 : SUB }}>
                      {unlocked ? "✓ Unlocked" : "🔒 Locked"}
                    </span>
                  </div>
                  {unlocked && (
                    <button onClick={() => setConfirmTarget(r)} style={{ width: "100%", padding: "8px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${ACCENT2},${ACCENT})`, color: "#fff", fontWeight: 800, fontSize: 12, cursor: "pointer", marginBottom: 6 }}>
                      🎁 Redeem
                    </button>
                  )}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setEditingId(r.id)} style={{ flex: 1, padding: "5px", borderRadius: 8, border: "none", background: CARD, color: ACCENT2, fontWeight: 800, fontSize: 11, cursor: "pointer" }}>✎ Edit</button>
                    <button onClick={() => deleteReward(r.id)} style={{ width: 28, borderRadius: 8, border: "none", background: "#FFE9E9", color: "#D9534F", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>✕</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Add reward */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: TEXT, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>+ Add a custom reward</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {EMOJI_PICKS.map((em) => (
            <button key={em} onClick={() => setEmoji(em)} style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${emoji === em ? ACCENT2 : CARD}`, background: emoji === em ? CARD : "#fff", fontSize: 16, cursor: "pointer" }}>{em}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pick dinner"
            style={{ flex: 1, padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${CARD}`, fontSize: 13, outline: "none", background: "#F5F3FF", color: TEXT }}/>
          <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))}
            style={{ width: 54, padding: "10px 6px", borderRadius: 12, border: `1.5px solid ${CARD}`, fontSize: 13, outline: "none", background: "#F5F3FF", color: TEXT, textAlign: "center" }}/>
        </div>
        <button onClick={addReward} style={{ width: "100%", marginTop: 10, padding: "11px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Add Reward</button>
      </div>

      {confirmTarget && (
        <ConfirmRedeemDialog reward={confirmTarget} onCancel={() => setConfirmTarget(null)}
          onConfirm={() => { onRedeem(confirmTarget); setConfirmTarget(null); }}/>
      )}
    </div>
  );
}

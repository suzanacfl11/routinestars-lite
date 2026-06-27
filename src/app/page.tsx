"use client";

import { Builder } from "@/components/Builder";
import { BigMode } from "@/components/BigMode";
import { RewardsShop } from "@/components/RewardsShop";
import { GoalTracker } from "@/components/GoalTracker";
import { ProfileBar } from "@/components/ProfileBar";
import { RedeemSplash, StreakMilestoneSplash } from "@/components/Splashes";
import { Pill, StarLogo, StreakBadge } from "@/components/Shared";
import { useHousehold } from "@/lib/useHousehold";
import { ACCENT, ACCENT2, BG } from "@/lib/constants";
import { useState } from "react";

type Tab = "build" | "big" | "rewards" | "goal";

const TABS: { id: Tab; label: string }[] = [
  { id: "build", label: "🛠️ Build" },
  { id: "big", label: "⭐ Big Mode" },
  { id: "rewards", label: "🎁 Rewards" },
  { id: "goal", label: "🎯 Goal" },
];

export default function Home() {
  const {
    loaded,
    profiles,
    activeId,
    activeProfile,
    setActiveId,
    updateProfile,
    addProfile,
    deleteProfile,
    renameProfile,
    handleEarnStars,
    handleRedeem,
    redeemSplash,
    setRedeemSplash,
    streakMilestone,
    setStreakMilestone,
  } = useHousehold();

  const [tab, setTab] = useState<Tab>("build");

  if (!loaded || !activeId || !activeProfile) {
    return <div style={{ minHeight: "100vh", background: BG }} />;
  }

  const profile = activeProfile;

  return (
    <div style={{ minHeight: "100vh", background: BG }}>
      <div style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, padding: "16px 16px 14px" }}>
        <div style={{ marginBottom: 12 }}>
          <ProfileBar profiles={profiles} activeId={activeId} onSwitch={setActiveId} onAdd={addProfile} onDelete={deleteProfile} onRename={renameProfile} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <StarLogo size={38} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: 18, color: "#fff", letterSpacing: -0.3 }}>RoutineStars Lite</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)" }}>Building for {profile.name}</div>
          </div>
          <StreakBadge streak={profile.streak} />
        </div>
        <div style={{ display: "flex", gap: 7, overflowX: "auto" }}>
          {TABS.map((t) => (
            <Pill key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
            </Pill>
          ))}
        </div>
      </div>

      <div style={{ paddingTop: 14 }}>
        {tab === "build" && <Builder key={profile.id} profile={profile} updateProfile={updateProfile} />}
        {tab === "big" && <BigMode key={profile.id} profile={profile} updateProfile={updateProfile} onEarnStars={handleEarnStars} />}
        {tab === "rewards" && <RewardsShop key={profile.id} profile={profile} updateProfile={updateProfile} onRedeem={handleRedeem} />}
        {tab === "goal" && <GoalTracker key={profile.id} profile={profile} updateProfile={updateProfile} />}
      </div>

      {redeemSplash && <RedeemSplash reward={redeemSplash} onClose={() => setRedeemSplash(null)} />}
      {streakMilestone && <StreakMilestoneSplash days={streakMilestone} name={profile.name} onClose={() => setStreakMilestone(null)} />}
    </div>
  );
}

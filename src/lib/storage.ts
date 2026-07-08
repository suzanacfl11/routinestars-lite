import { supabase, isSupabaseConfigured } from "./supabase";
import type { HouseholdData } from "./types";

const HOUSEHOLD_ID_KEY  = "routinestars_household_id";
const LOCAL_CACHE_KEY   = "routinestars_household_data";

function getOrCreateHouseholdId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(HOUSEHOLD_ID_KEY);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(HOUSEHOLD_ID_KEY, id); }
  return id;
}

function readLocalCache(): HouseholdData | null {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    return raw ? (JSON.parse(raw) as HouseholdData) : null;
  } catch { return null; }
}

function writeLocalCache(data: HouseholdData) {
  try { localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data)); } catch {}
}

export async function loadHousehold(): Promise<{ data: HouseholdData | null; householdId: string }> {
  const householdId = getOrCreateHouseholdId();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: row, error } = await supabase
        .from("households").select("data").eq("id", householdId).maybeSingle();
      if (!error && row?.data) {
        const data = row.data as HouseholdData;
        writeLocalCache(data);
        return { data, householdId };
      }
    } catch {}
  }
  return { data: readLocalCache(), householdId };
}

export async function saveHousehold(householdId: string, data: HouseholdData): Promise<void> {
  writeLocalCache(data);
  if (isSupabaseConfigured && supabase) {
    try { await supabase.from("households").upsert({ id: householdId, data }); } catch {}
  }
}

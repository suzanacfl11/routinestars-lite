import { supabase, isSupabaseConfigured } from "./supabase";
import type { HouseholdData } from "./types";

const HOUSEHOLD_ID_KEY = "routinestars_household_id";
const LOCAL_CACHE_KEY = "routinestars_household_data";

// The household ID is a random UUID generated once per browser/device and
// stored in localStorage. It's the row key in Supabase. There's no login —
// whoever has this ID (i.e. whoever is using this browser) can read/write
// this family's data. See supabase/schema.sql for the security rationale.
function getOrCreateHouseholdId(): string {
  if (typeof window === "undefined") return ""; // SSR guard
  let id = localStorage.getItem(HOUSEHOLD_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(HOUSEHOLD_ID_KEY, id);
  }
  return id;
}

function readLocalCache(): HouseholdData | null {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    return raw ? (JSON.parse(raw) as HouseholdData) : null;
  } catch {
    return null;
  }
}

function writeLocalCache(data: HouseholdData) {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
  } catch {
    // localStorage can throw in private-browsing/quota-exceeded cases —
    // non-fatal, the in-memory React state is still correct for this session.
  }
}

/**
 * Loads household data. Tries Supabase first (source of truth across
 * devices/browser-clears); falls back to the localStorage cache if Supabase
 * isn't configured or the request fails, so the app still works offline or
 * if the database has a transient issue.
 */
export async function loadHousehold(): Promise<{
  data: HouseholdData | null;
  householdId: string;
}> {
  const householdId = getOrCreateHouseholdId();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: row, error } = await supabase
        .from("households")
        .select("data")
        .eq("id", householdId)
        .maybeSingle();

      if (!error && row?.data) {
        const data = row.data as HouseholdData;
        writeLocalCache(data); // keep cache warm for next offline load
        return { data, householdId };
      }
      // No row yet for this household (first-ever run) — that's expected,
      // not an error. Fall through to local cache / null.
    } catch {
      // Network error, RLS misconfig, etc. — fall back silently.
    }
  }

  return { data: readLocalCache(), householdId };
}

/**
 * Saves household data. Writes to Supabase (upsert) when configured, and
 * always writes the localStorage cache too, so a save still "sticks" for
 * this device even if the network request fails.
 */
export async function saveHousehold(
  householdId: string,
  data: HouseholdData
): Promise<void> {
  writeLocalCache(data); // always succeeds locally first

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("households").upsert({ id: householdId, data });
    } catch {
      // Will retry naturally on the next save (every state change writes again).
      // The localStorage cache above means nothing is lost for this device.
    }
  }
}

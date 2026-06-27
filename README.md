# RoutineStars Lite

A sticker-chart-style morning/bedtime/chores routine tracker for kids, with
a rewards shop, streaks, and up to 3 child profiles per device. Built with
Next.js, persisted via Supabase (with a localStorage fallback), and tracked
with Vercel Analytics.

## 1. Set up Supabase (one-time)

1. Create a free project at [supabase.com](https://supabase.com) if you don't have one.
2. In your project, go to **SQL Editor → New query**, paste in the contents
   of `supabase/schema.sql` from this repo, and click **Run**. This creates
   the one table the app needs (`households`) and sets up its security
   rules. You only need to do this once per Supabase project.
3. Go to **Project Settings → API Keys**. Copy:
   - **Project URL**
   - **Publishable key** (starts with `sb_publishable_...`) — if you don't
     see this yet, use the **anon / anon public** key from the Legacy tab
     instead; it works the same way here.

## 2. Configure environment variables

Copy the example file and fill in the two values from step 1:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

If you skip this step, the app still works — it just stores everything in
the browser's localStorage only, on that one device, with no cross-device
sync.

## 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 4. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: RoutineStars Lite"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

(Create the empty repo on GitHub first — github.com → New repository — then
use the URL it gives you in the `git remote add` command above.)

## 5. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo
   you just pushed.
2. Vercel auto-detects Next.js — no build settings to change.
3. Before deploying, add the same two environment variables from step 2
   under **Environment Variables** in the import screen (or later under
   **Project Settings → Environment Variables**).
4. Click **Deploy**.
5. Once live, go to your project's **Analytics** tab in the Vercel dashboard
   and click **Enable** — the `<Analytics />` component is already wired
   into the app, so data starts flowing in within about an hour of real
   traffic.

Every push to `main` after this will auto-deploy.

## What's tracked in Analytics

A small, deliberate set of custom events — no child names or other personal
details are ever sent:

- `routine_completed` — which routine type, how many tasks were done
- `reward_redeemed` — the star cost of the reward
- `streak_milestone` — when a streak hits the 30-day cap
- `profile_added` — when a new child profile is created

Page views are tracked automatically by `@vercel/analytics`.

## Project structure

```
src/
  app/
    layout.tsx       Root layout — fonts, <Analytics />
    page.tsx          Main app, wires everything together
    globals.css       Keyframes + minimal global styles
  components/
    Builder.tsx        Parent-facing routine/task setup
    BigMode.tsx         Kid-facing routine runner
    RewardsShop.tsx     Rewards + redeem confirmation dialog
    GoalTracker.tsx     Goal progress bar
    ProfileBar.tsx      Profile switcher (up to 3 kids)
    Splashes.tsx        Redeem + streak milestone celebration modals
    Shared.tsx          Logo, pills, confetti, streak badge
  lib/
    types.ts            Shared TypeScript types
    constants.ts         Brand colors, task libraries, rewards, avatars
    dates.ts              Local-date helpers (NOT UTC — see comments)
    profile.ts             Default profile + load-time data reconciliation
    storage.ts               Supabase read/write + localStorage fallback
    supabase.ts                Supabase client setup
    analytics.ts                Vercel Analytics event wrapper
    useHousehold.ts              Central state hook (profiles, streaks, redeem)
supabase/
  schema.sql            Run once in the Supabase SQL Editor
```

## Notes on the data model

- Each family/device gets one row in the `households` Supabase table,
  identified by a random ID generated on first run and stored in
  localStorage. There's no login — this is intentional for a no-account,
  single-family kids' app. See the comments in `supabase/schema.sql` for the
  security tradeoff this implies.
- All dates use the browser's **local** calendar day, not UTC — see
  `src/lib/dates.ts` for why this matters for streak accuracy.
- Streaks cap at 30 days, trigger a milestone celebration, then roll over to
  0 to start fresh. Best streak is tracked separately and never resets.

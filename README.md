# Vince and Dave's Pool

A clean, simple site with two NFL pools:

- **Pick'em** — confidence-points format: each week a player picks a
  winner for every game and assigns each pick a unique point value (e.g.
  6 points down to 1 point for a 6-game week). Get it right, you win those
  points; get it wrong, you win nothing for that pick. Leaderboard tracks
  points per week and cumulative season points, with dropdowns to see any
  player's picks for any specific week.
- **Eliminator** — double elimination: pick one team a week to win, can't
  reuse a team, and it takes **two** losses to be out. One loss puts a
  player "on notice" (shown in yellow); a second loss eliminates them.
  Leaderboard shows who's still alive / on notice / eliminated, and a
  dropdown shows any player's team grid — every NFL team in color, greyed
  out once that player has used it.

There's also a **Weekly Print Sheets** page: pick a week, get a clean
printable (or fill-in-on-screen) sheet of that week's Pick'em matchups,
grouped by day, with checkboxes for your picks and a spot for your
confidence points. Submissions go straight to **Netlify Forms** —
right there on the page, no separate Google Form to visit — and (once
you wire up the optional automation below) they land in the
PickemPicks tab automatically.

The home page is "Welcome to Vince and Dave's Pool" with three cards
linking to Pick'em, Eliminator, and the Weekly Print Sheets.

It's a static site (HTML/CSS/JS) that deploys on Netlify with no backend.
All live data — schedules, results, and everyone's picks — comes from a
Google Sheet you control, so running it week to week is just editing a
spreadsheet, not touching code.

## How it works

- **Pick'em picks** are submitted right on the `week.html` print sheet via
  **Netlify Forms** — no separate form to visit. **Eliminator picks** still
  go through a Google Form for now (see `eliminatorFormUrl` in
  `config.js`) — this could move to Netlify Forms too later if you want.
- **One Google Sheet, four tabs** — `Schedule`, `PickemPicks`,
  `EliminatorPicks`, `Content` — each published as a CSV link.
- **The website** fetches those CSV links live in the browser and renders
  both leaderboards (and the rules text). No database, no server, no
  rebuild needed to post new results or edit copy — just edit the sheet.
- **Optional automation** (see below): a free Google Apps Script can pull
  Netlify Form submissions and ESPN's final scores into the Sheet
  automatically, so the whole thing runs itself week to week.

Until you connect a real sheet, the site shows built-in sample data so you
can see exactly how it will look and feel.

## Setup, step by step

### 1. Build the Google Sheet

Create one Sheet with three tabs and these exact headers in row 1:

**Tab: `Schedule`** (shared by both pools)

| week | gameId | away | home | kickoff    | winner |
|------|--------|------|------|------------|--------|
| 1    | 1-1    | KC   | BAL  | Thu 8:20pm | BAL    |

- Team codes are the 2–3 letter codes in `teams.js` (`KC`, `BAL`, `SF`, `NYJ`, etc.), case-insensitive.
- `gameId` just needs to be unique per game.
- Leave `winner` blank until final, then fill in the winning team's code —
  both leaderboards update automatically next page load.

**Tab: `PickemPicks`** — ideally *is* your Pick'em Google Form's response
tab (rename/reshape columns to match):

| player | week | gameId | pick | points |
|--------|------|--------|------|--------|
| Jon    | 1    | 1-1    | BAL  | 6      |

- `points` is the confidence value that player assigned to that pick for
  that week (highest = most confident). Points always come off the top of
  a fixed 1-16 scale, not 1-up-to-however-many-games-are-that-week: a full
  16-game week uses every value 1-16, but a 14-game week uses 3-16 (skipping
  1 and 2 entirely), so "16" always means the same thing — your single most
  confident pick — no matter the week's game count. The print sheet's point
  dropdown enforces both this range and no-repeats automatically; if you're
  ever entering picks by hand instead, it's worth a quick eyeball check
  each week (or a `COUNTIFS` validation formula in the sheet).
- A pick only earns its `points` value if `pick` matches that game's
  `winner` in the `Schedule` tab; otherwise it earns 0 for the week and
  season totals, though the assigned value still displays so players can
  see what they risked.

**Tab: `EliminatorPicks`** — same idea, for the Eliminator form:

| player | week | team |
|--------|------|------|
| Jon    | 1    | BAL  |

One row per player per week — just the team they're picking to win that
week. No `gameId` needed; the site matches the team to that week's game
in `Schedule` automatically to check the result.

If a player has no eligible team left to pick in a given week, add a row
for them with `team` set to the special value `MISS` — the site treats
that as an automatic loss for that week, per the "no teams available =
loss" rule.

**Tab: `Content`** — this is what makes the rules text and homepage
blurbs editable without touching code:

| key | text |
|-----|------|
| home_pickem_summary | This pool is for all playoff games... |
| home_eliminator_summary | $25 buy-in. Double elimination... |
| pickem_rules | This pool is for all playoff games... |
| eliminator_rules | $25 buyin, prize determined on entries... |

- `home_pickem_summary` / `home_eliminator_summary` are the short blurbs
  on the two homepage cards.
- `pickem_rules` / `eliminator_rules` are the full rules text shown on
  each pool's own page.
- Any row you leave out of the sheet just falls back to the built-in
  default text, so you only need to add rows for what you want to change.
- **Formatting a cell**: a blank line starts a new paragraph. A line
  starting with `- ` becomes a bullet. A line starting with two spaces
  then `- ` becomes a sub-bullet (nested under the bullet above it). In
  Google Sheets, press **Alt+Enter** (Windows) or **Option+Return** (Mac)
  inside a cell to add a line break without leaving the cell — that's how
  you get multiple paragraphs/bullets into one `text` cell.

### 2. Publish each tab as CSV

For **each** of the four tabs: File → Share → Publish to web → choose
that specific sheet/tab → format **CSV** → Publish → copy the link.

### 3. Wire up `config.js`

```js
scheduleCsvUrl: "...",
pickemPicksCsvUrl: "...",
eliminatorPicksCsvUrl: "...",
contentCsvUrl: "...",
pickemFormUrl: "your Pick'em Google Form link",
eliminatorFormUrl: "your Eliminator Google Form link",
```

Also set `siteName`, `season`, and `currentWeek`.

### 4. Deploy to Netlify

Drag this whole folder onto [app.netlify.com/drop](https://app.netlify.com/drop), or connect it as a Git repo in Netlify (no build command needed, publish directory is `.`).

### 5. Weekly routine

1. After games finish, fill in `winner` in the `Schedule` tab.
2. That's it — both leaderboards, the Pick'em player detail view, and the
   Eliminator team-availability grid all recompute automatically.

(Steps 1–2 above happen automatically once you set up the optional
automation below — see "Automating submissions & scores.")

## Automating submissions & scores (optional)

Everything above works with zero automation — you just type into the
Sheet. But two parts of that weekly routine can run themselves for free,
using a small script that lives inside the Google Sheet itself (Google
Apps Script — no separate hosting, no cost, no credit card):

1. **Pick'em submissions → PickemPicks tab, automatically.** Right now,
   when someone submits picks on `week.html`, Netlify stores that
   submission in its own dashboard. This automation has Netlify notify
   your Sheet the instant a submission comes in, and the Sheet adds the
   row itself.
2. **Final scores → Schedule tab's `winner` column, automatically.** A
   timer inside the Sheet checks ESPN's public scoreboard once an hour
   and fills in `winner` for any finished game it can match up. (There's
   no official free NFL scores API — this uses the same public,
   unofficial endpoint a lot of hobby scoreboards use. If it ever breaks,
   you just fall back to typing winners in by hand like before.)

I've included `apps-script.gs` alongside this project — open it, copy
everything in it, and follow these one-time steps:

**A. Paste the script into your Sheet**

1. Open your Google Sheet → **Extensions → Apps Script**.
2. Delete anything in the default `Code.gs` file, paste in the full
   contents of `apps-script.gs`, and save (Ctrl/Cmd+S).

**B. Turn on automatic score syncing**

1. In the Apps Script editor, pick `setUpScoreSyncTrigger` from the
   function dropdown at the top, then click **Run**.
2. The first time, Google will ask you to authorize the script (it needs
   permission to edit your own Sheet and to fetch a URL) — click through
   the prompts and allow it.
3. That's it — it now checks ESPN every hour and fills in winners on its
   own. No need to run anything again.

**C. Turn on automatic Pick'em submission syncing**

1. In the Apps Script editor: **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Set **Execute as: Me**, **Who has access: Anyone**, then **Deploy**.
4. Authorize it if asked, then copy the **Web app URL** it gives you.
5. Go to your Netlify site → **Site settings → Forms → Notifications →
   Add notification → Outgoing webhook**.
6. Set **Event to listen for: Form submission**, **Form: picks**, and
   paste the Web app URL from step 4 as the **URL to notify**. Save.

From then on, submitting the print sheet on `week.html` adds a row to
PickemPicks within a few seconds — resubmitting (if someone changes
their mind before the deadline) replaces their previous picks for that
week instead of duplicating them.

**Notes / limits:**

- Netlify's free plan includes 100 form submissions per month across the
  whole site — plenty for a friends-and-family pool, but worth knowing.
- The ESPN endpoint is unofficial. It's reliable in practice but not
  guaranteed by ESPN, so treat it as a convenience, not a dependency —
  you can always fill in `winner` by hand if a game doesn't sync.
- Neither piece touches the `EliminatorPicks` tab — Eliminator picks
  still come in through the Google Form as before.

## Eliminator logic notes

- **Double elimination**: a player is only fully **eliminated** after
  their *second* losing pick. After the first loss they're marked
  **"On Notice"** (yellow chip) — still alive, one mistake from being out.
  Their leaderboard row shows "Eliminated — Week X" once the second loss
  lands.
- **"Used" teams** (greyed out in the team grid) are every team that
  player has ever picked, win or lose — since the rule is you can't pick
  the same team twice regardless of outcome.
- A `MISS` row in `EliminatorPicks` (see above) auto-counts as a loss for
  that week, per the "no teams available = loss" rule.
- If multiple players go out in the same week with the same loss count,
  they're tied for last — per your rules that's a split of the jackpot.
  That's a judgment call for you as commissioner; the leaderboard groups
  eliminated players by the week they went out so it's easy to see who to
  split with.

## Files

- `index.html` — home page ("Welcome to Vince and Dave's Pool" + three cards)
- `pickem.html` — Pick'em leaderboard + player picks dropdown
- `eliminator.html` — Eliminator leaderboard + player team-grid dropdown
- `schedule.html` — list of weeks, links into the print sheets
- `week.html` — one week's printable/fillable Pick'em matchup sheet + form link
- `config.js` — **the file you edit**: sheet links, form links, season info
- `teams.js` — NFL team names/colors
- `shared.js` / `style.css` — site logic and styling, no edits needed

## Notes

- This covers the **Pick'em and Eliminator** pools as described. If you
  also want the **Playoff Pool** (confidence points 1–13, Super Bowl
  tiebreaker) or the **Playoff Team Pool** (random-draw team ownership)
  built out as additional pages once the regular season wraps, just say
  the word — both fit the same Google Sheet + Netlify pattern.
- **Submit buttons**: the leaderboard pages (Pick'em / Eliminator) stay
  view-only, no submit button, per your original request. Pick'em picks
  are submitted right on the **Weekly Print Sheets** page (`week.html`)
  via an embedded Netlify Form — check your teams, fill in points and
  your name, hit "Submit My Picks." Share the Eliminator Google Form
  (`eliminatorFormUrl` in `config.js`) with the group however you'd like
  for now.
- **Home page hero** is the stadium photo you sent over
  (`assets/hero-stadium.jpg`) — swap that file (same filename) any time
  you want a different banner image; no code changes needed.
- **Pool card art** on the home page (`assets/pickem-icon.png` and
  `assets/eliminator-icon.png`) are transparent PNGs, so they drop cleanly
  onto the white background — swap those files (same filenames) any time.
- **Favicon**: a football icon (`favicon.svg` + PNG/ICO fallbacks) is
  wired into all three pages' browser tabs.
- **Theme**: the home page always runs on a clean white background. Pick'em
  and Eliminator default to an immersive look with the stadium photo behind
  glass cards (green accents on Pick'em, fire/orange on Eliminator) — there's
  a button next to the nav links ("Vince's View" / "Dave's View") that
  switches them to the same plain white theme as the home page and back.
  The choice is remembered per-browser (saved to `localStorage`).
- **Rules text and homepage blurbs are now editable** — see the `Content`
  tab above. Until you wire one up, everything shows the same text as
  before.

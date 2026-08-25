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
printable (or fill-in-on-screen) sheet of that week's Pick'em matchups
with blank spots for your team pick and points, plus a link straight to
the Google Form to submit them.

The home page is "Welcome to Vince and Dave's Pool" with three cards
linking to Pick'em, Eliminator, and the Weekly Print Sheets.

It's a static site (HTML/CSS/JS) that deploys on Netlify with no backend.
All live data — schedules, results, and everyone's picks — comes from a
Google Sheet you control, so running it week to week is just editing a
spreadsheet, not touching code.

## How it works

- **Two Google Forms** — one for Pick'em picks, one for Eliminator picks.
  Responses land automatically in Google Sheets.
- **One Google Sheet, four tabs** — `Schedule`, `PickemPicks`,
  `EliminatorPicks`, `Content` — each published as a CSV link.
- **The website** fetches those CSV links live in the browser and renders
  both leaderboards (and the rules text). No database, no server, no
  rebuild needed to post new results or edit copy — just edit the sheet.

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
  that week (highest = most confident). Each player should use every
  value from 1 up to the number of games that week exactly once — the
  site doesn't currently enforce uniqueness, so it's worth a quick eyeball
  check on the sheet each week (or build a `COUNTIFS` validation formula
  in the sheet if you want it caught automatically).
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
  view-only, no submit button, per your original request. The one place
  a form link *does* appear is the new **Weekly Print Sheets** page
  (`week.html`) — "Submit Your Picks" there opens `pickemFormUrl`. Share
  the Eliminator form (`eliminatorFormUrl`) with the group however you'd
  like; it's still in `config.js` if you want to wire it up somewhere.
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

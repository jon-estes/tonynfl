# Vince's Pool

A clean, simple site with two NFL pools:

- **Pick'em** — confidence-points format: each week a player picks a
  winner for every game and assigns each pick a unique point value (e.g.
  6 points down to 1 point for a 6-game week). Get it right, you win those
  points; get it wrong, you win nothing for that pick. Leaderboard tracks
  points per week and cumulative season points, with dropdowns to see any
  player's picks for any specific week.
- **Eliminator** — pick one team a week to win; lose once and you're out;
  can't reuse a team. Leaderboard shows who's alive/eliminated, and a
  dropdown shows any player's team grid — every NFL team in color, greyed
  out once that player has used it.

The home page is just "Welcome to Vince's Pool" with two cards linking to
each pool.

It's a static site (HTML/CSS/JS) that deploys on Netlify with no backend.
All live data — schedules, results, and everyone's picks — comes from a
Google Sheet you control, so running it week to week is just editing a
spreadsheet, not touching code.

## How it works

- **Two Google Forms** — one for Pick'em picks, one for Eliminator picks.
  Responses land automatically in Google Sheets.
- **One Google Sheet, three tabs** — `Schedule`, `PickemPicks`,
  `EliminatorPicks` — each published as a CSV link.
- **The website** fetches those three CSV links live in the browser and
  renders both leaderboards. No database, no server, no rebuild needed
  to post new results — just edit the sheet.

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

### 2. Publish each tab as CSV

For **each** of the three tabs: File → Share → Publish to web → choose
that specific sheet/tab → format **CSV** → Publish → copy the link.

### 3. Wire up `config.js`

```js
scheduleCsvUrl: "...",
pickemPicksCsvUrl: "...",
eliminatorPicksCsvUrl: "...",
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

- A player is **eliminated** the first week their picked team loses. Their
  leaderboard row shows "Eliminated — Week X".
- **"Used" teams** (greyed out in the team grid) are every team that
  player has ever picked, win or lose — since the rule is you can't pick
  the same team twice regardless of outcome.
- If everyone is eliminated the same week, they're tied — the sheet-based
  version doesn't auto-split a jackpot dollar amount; that's a judgment
  call for you as commissioner per your rules ("last survivors go out the
  same week" = split). The leaderboard sort ranks tied-out players by
  weeks survived so it's easy to see who to split with.
- Missing a pick for a week currently just shows nothing for that week
  rather than auto-counting as a loss (per your rule "no teams available
  = loss") — let me know if you want a "Bye/Missed" pick to auto-count as
  eliminated and I'll wire that in.

## Files

- `index.html` — home page ("Welcome to Vince's Pool" + two pool cards)
- `pickem.html` — Pick'em leaderboard + player picks dropdown
- `eliminator.html` — Eliminator leaderboard + player team-grid dropdown
- `config.js` — **the file you edit**: sheet links, form links, season info
- `teams.js` — NFL team names/colors
- `shared.js` / `style.css` — site logic and styling, no edits needed

## Notes

- This covers the **Pick'em and Eliminator** pools as described. If you
  also want the **Playoff Pool** (confidence points 1–13, Super Bowl
  tiebreaker) or the **Playoff Team Pool** (random-draw team ownership)
  built out as additional pages once the regular season wraps, just say
  the word — both fit the same Google Sheet + Netlify pattern.
- **Submit buttons were removed** per your request — the site is now
  strictly a view-only scoreboard/leaderboard. Share your Google Forms
  with the group however you'd like (text, email, group chat); the
  `pickemFormUrl` / `eliminatorFormUrl` fields are still in `config.js`
  in case you want to add a link back somewhere later, they're just not
  wired to a button anywhere right now.
- **Home page hero** is the stadium photo you sent over
  (`assets/hero-stadium.jpg`) — swap that file (same filename) any time
  you want a different banner image; no code changes needed.
- **Favicon**: a football icon (`favicon.svg` + PNG/ICO fallbacks) is
  wired into all three pages' browser tabs.

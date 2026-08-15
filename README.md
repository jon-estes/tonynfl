# NFL Pick'em League Site

A straight-up NFL pick'em league site: every week, players pick who they
think will win each game (no drafting players). The site shows the weekly
matchups, everyone's picks, and a season-long leaderboard.

It's a static site (plain HTML/CSS/JS) built to deploy on Netlify with
zero backend. Live data comes from a Google Sheet you control, so updating
the site week to week is just editing a spreadsheet — no code changes,
no redeploys.

## How it works

- **Google Form** — players submit their picks each week through a form
  you create. Form responses land automatically in a Google Sheet.
- **Google Sheet** — two tabs: one lists the season's games (`Schedule`),
  the other is your Form's response tab (`Picks`). You publish both as
  CSV links.
- **The website** — fetches those two CSV links live in the browser and
  renders matchups, a picks grid, and standings. No database, no server.

Until you connect a real sheet, the site shows built-in sample data so you
can see exactly how it will look.

## Setup, step by step

### 1. Create the Google Sheet

Make a new Google Sheet with two tabs, with these exact column headers in
row 1:

**Tab 1: `Schedule`**

| week | gameId | away | home | kickoff       | winner |
|------|--------|------|------|---------------|--------|
| 1    | 1-1    | KC   | BAL  | Thu 8:20pm    |        |
| 1    | 1-2    | PHI  | DAL  | Sun 1:00pm    |        |

- `away` / `home` / `winner` use the 2-3 letter team codes in `teams.js`
  (e.g. `KC`, `BAL`, `PHI`, `SF`, `NYJ`...). Codes are case-insensitive.
- `gameId` just needs to be unique per game (e.g. `week-gamenumber`).
- Leave `winner` blank until the game is final, then fill in the winning
  team's code. The site updates automatically the next time it's loaded.
- Fill in all games for the whole season up front if you like — future
  weeks just show as upcoming with no winner yet.

**Tab 2: `Picks`**

This can literally *be* your Google Form's response tab — just rename the
form's question columns to match (or add a few formula columns that
reshape the responses into this layout):

| player | week | gameId | pick |
|--------|------|--------|------|
| Jon    | 1    | 1-1    | BAL  |
| Tony   | 1    | 1-1    | KC   |

The simplest form design: one question "Your name", then one
multiple-choice question per game asking "Who wins: KC @ BAL?" with the
two team names as options. If your form output isn't already in the
`player, week, gameId, pick` shape above, add a second tab with formulas
(`QUERY`/`ARRAYFORMULA`) that reshapes it — happy to help you build that
formula if you send over your form's actual questions.

### 2. Publish both tabs as CSV

For **each** tab:

1. File → Share → Publish to web
2. Under "Link", choose the specific sheet/tab (not "Entire document")
3. Choose format **Comma-separated values (.csv)**
4. Click Publish, copy the link

You'll end up with two links, one per tab.

### 3. Point the site at your sheet

Open `config.js` and fill in:

```js
scheduleCsvUrl: "paste your Schedule tab CSV link here",
picksCsvUrl: "paste your Picks tab CSV link here",
formUrl: "paste your Google Form link here",
```

Also update `leagueName`, `season`, and `currentWeek` (bump `currentWeek`
by 1 each week so the homepage defaults to the right week).

### 4. Deploy to Netlify

- Drag-and-drop this whole folder onto [app.netlify.com/drop](https://app.netlify.com/drop), **or**
- Push this folder to a GitHub repo and connect it in Netlify (Add new site → Import from Git). No build command needed — publish directory is `.` (already set in `netlify.toml`).

That's it — the site is static, so Netlify just serves the files.

### 5. Weekly routine during the season

1. Games get played.
2. Open your `Schedule` tab, fill in the `winner` column for each final game.
3. Bump `currentWeek` in `config.js` if you want (optional — just changes
   which week loads by default) and redeploy, **or** skip that and let
   players use the week dropdown.
4. Standings and the picks grid update automatically next page load —
   nothing else to touch.

## Files

- `index.html` — homepage: this week's games + picks grid + top standings
- `standings.html` — full season leaderboard + weekly breakdown
- `schedule.html` — the whole season's games, week by week
- `config.js` — **the only file you should need to edit** (league name, CSV links, form link, current week)
- `teams.js` — NFL team names/colors for the badges
- `script.js` / `style.css` — site logic and styling, no edits needed

## Notes

- Straight-up picks only (whoever wins the game), no spreads, no
  confidence points — kept intentionally simple. Ask if you'd like ATS
  or confidence-point scoring added later, both are straightforward
  extensions to `script.js`.
- If a player misses a pick for a game, it just shows as `—` and doesn't
  count for or against them.
- Ties (rare in the NFL) — leave `winner` blank or put `TIE`; ties currently
  count as neither correct nor wrong for everyone. Let me know if you'd
  rather they count as a push/point for both.

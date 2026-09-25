/* Shared logic for Vince and Dave's Pool: loading data from Google Sheets
   (CSV) or sample data, and computing Pick'em / Eliminator results. */

/* ---------- Data loading ---------- */

async function fetchCsv(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load " + url);
  const text = await res.text();
  return Papa.parse(text, { header: true, skipEmptyLines: true }).data;
}

function normalizeSchedule(rows) {
  return rows.map(r => ({
    week: parseInt(r.week, 10),
    gameId: String(r.gameId).trim(),
    away: String(r.away).trim().toUpperCase(),
    home: String(r.home).trim().toUpperCase(),
    date: r.date || "",
    kickoff: r.kickoff || "",
    winner: (r.winner || "").trim().toUpperCase()
  }));
}

/* A game's "day" label for the print sheet's day-grouped layout.
   Prefers an explicit `date` column (e.g. "Sun Sep 13"); falls back to
   splitting an old-style combined kickoff string like "Sun 1:00pm". */
function dayLabelForGame(g) {
  if (g.date) return g.date;
  if (g.kickoff) {
    const parts = String(g.kickoff).trim().split(/\s+/);
    if (parts.length > 1) return parts[0];
  }
  return "";
}

/* The time-only portion of a game's kickoff, for use alongside
   dayLabelForGame() above. */
function timeOnlyForGame(g) {
  if (g.date) return g.kickoff || "";
  if (g.kickoff) {
    const parts = String(g.kickoff).trim().split(/\s+/);
    if (parts.length > 1) return parts.slice(1).join(" ");
  }
  return g.kickoff || "";
}

function normalizePickemPicks(rows) {
  return rows.map(r => ({
    player: String(r.player).trim(),
    week: parseInt(r.week, 10),
    gameId: String(r.gameId).trim(),
    pick: String(r.pick).trim().toUpperCase(),
    points: parseInt(r.points, 10) || 0
  }));
}

function normalizeEliminatorPicks(rows) {
  return rows.map(r => ({
    player: String(r.player).trim(),
    week: parseInt(r.week, 10),
    team: String(r.team).trim().toUpperCase()
  }));
}

/* Content tab: two columns, "key" and "text". Any key missing from the
   sheet (or if there's no sheet connected yet) falls back to
   SAMPLE_CONTENT so the site always has something sensible to show. */
function normalizeContent(rows) {
  const content = Object.assign({}, SAMPLE_CONTENT);
  rows.forEach(r => {
    const key = String(r.key || "").trim();
    if (!key) return;
    content[key] = String(r.text || "");
  });
  return content;
}

async function loadContent() {
  if (!POOL_CONFIG.contentCsvUrl) return Object.assign({}, SAMPLE_CONTENT);
  try {
    const rows = await fetchCsv(POOL_CONFIG.contentCsvUrl);
    return normalizeContent(rows);
  } catch (err) {
    console.error("Falling back to sample content:", err);
    return Object.assign({}, SAMPLE_CONTENT);
  }
}

async function loadPoolData() {
  const usingSample = !POOL_CONFIG.scheduleCsvUrl || !POOL_CONFIG.pickemPicksCsvUrl || !POOL_CONFIG.eliminatorPicksCsvUrl;
  const content = await loadContent();
  if (usingSample) {
    return {
      schedule: SAMPLE_SCHEDULE,
      pickemPicks: SAMPLE_PICKEM_PICKS,
      eliminatorPicks: SAMPLE_ELIMINATOR_PICKS,
      content,
      sample: true
    };
  }
  try {
    const [scheduleRows, pickemRows, eliminatorRows] = await Promise.all([
      fetchCsv(POOL_CONFIG.scheduleCsvUrl),
      fetchCsv(POOL_CONFIG.pickemPicksCsvUrl),
      fetchCsv(POOL_CONFIG.eliminatorPicksCsvUrl)
    ]);
    return {
      schedule: normalizeSchedule(scheduleRows),
      pickemPicks: normalizePickemPicks(pickemRows),
      eliminatorPicks: normalizeEliminatorPicks(eliminatorRows),
      content,
      sample: false
    };
  } catch (err) {
    console.error("Falling back to sample data:", err);
    return {
      schedule: SAMPLE_SCHEDULE,
      pickemPicks: SAMPLE_PICKEM_PICKS,
      eliminatorPicks: SAMPLE_ELIMINATOR_PICKS,
      content,
      sample: true,
      error: true
    };
  }
}

/* ---------- Shared helpers ---------- */

function getWeeks(schedule) {
  return [...new Set(schedule.map(g => g.week))].sort((a, b) => a - b);
}

/* Figures out "the current week" straight from the schedule instead of
   relying on someone remembering to bump POOL_CONFIG.currentWeek every
   Tuesday: it's the earliest week that still has a game without a winner
   filled in. Once every game in a week has a winner, that week is done
   and we move on to the next one. If the whole season is complete, this
   settles on the final week (so pages still have something sensible to
   show); if the schedule's empty it returns null and callers should fall
   back to POOL_CONFIG.currentWeek. */
function computeCurrentWeek(schedule) {
  if (!schedule || !schedule.length) return null;
  const weeks = getWeeks(schedule);
  for (const w of weeks) {
    const games = schedule.filter(g => g.week === w);
    if (games.some(g => !g.winner)) return w;
  }
  return weeks[weeks.length - 1];
}

function getPlayers(picks) {
  return [...new Set(picks.map(p => p.player))].sort((a, b) => a.localeCompare(b));
}

function gameResultForPick(game, pick) {
  if (!game || !game.winner) return "pending";
  return game.winner === pick ? "correct" : "wrong";
}

/* ---------- Pick'em (confidence points) ----------
   Each week, a player assigns a unique point value to every pick
   (e.g. 6 down to 1 for a 6-game week). A pick scores those points
   only if the picked team wins; a wrong or not-yet-final pick scores 0
   toward "earned" points (but the assigned value still shows on the
   picks screen so players can see what they risked). */

function pointsEarnedForPick(game, pick) {
  const result = gameResultForPick(game, pick.pick);
  if (result === "correct") return { result, earned: pick.points };
  return { result, earned: 0 };
}

/* Cumulative season leaderboard: total points earned across all weeks. */
function computePickemSeasonLeaderboard(schedule, picks) {
  const gamesById = Object.fromEntries(schedule.map(g => [g.gameId, g]));
  const players = getPlayers(picks);

  const board = players.map(player => {
    const playerPicks = picks.filter(p => p.player === player);
    let total = 0, correct = 0, wrong = 0, pending = 0, possible = 0;
    playerPicks.forEach(p => {
      const { result, earned } = pointsEarnedForPick(gamesById[p.gameId], p);
      total += earned;
      possible += p.points;
      if (result === "correct") correct++;
      else if (result === "wrong") wrong++;
      else pending++;
    });
    return { player, total, possible, correct, wrong, pending, played: correct + wrong };
  });

  board.sort((a, b) => b.total - a.total);
  return board;
}

/* Points earned by each player for a single week. */
function computePickemWeekLeaderboard(schedule, picks, week) {
  const gamesById = Object.fromEntries(schedule.map(g => [g.gameId, g]));
  const players = getPlayers(picks);

  const board = players.map(player => {
    const weekPicks = picks.filter(p => p.player === player && p.week === week);
    let total = 0, correct = 0, wrong = 0, pending = 0;
    weekPicks.forEach(p => {
      const { result, earned } = pointsEarnedForPick(gamesById[p.gameId], p);
      total += earned;
      if (result === "correct") correct++;
      else if (result === "wrong") wrong++;
      else pending++;
    });
    return { player, total, correct, wrong, pending, picksMade: weekPicks.length };
  });

  board.sort((a, b) => b.total - a.total);
  return board;
}

/* Each player's single best-scoring week (highest confidence points
   earned in any ONE week, and which week that was) — used on the
   Standings page's "High Week" column. A player with no picks made in
   any week yet gets bestWeek: null, bestTotal: 0. */
function computeHighWeeks(schedule, picks) {
  const players = getPlayers(picks);
  const weeks = getWeeks(schedule);

  return players.map(player => {
    let best = { week: null, total: 0 };
    weeks.forEach(week => {
      const weekBoard = computePickemWeekLeaderboard(schedule, picks, week);
      const me = weekBoard.find(s => s.player === player);
      if (me && me.picksMade && me.total > best.total) {
        best = { week, total: me.total };
      }
    });
    return { player, bestWeek: best.week, bestTotal: best.total };
  });
}

/* ---------- Eliminator ---------- */

function findGameForTeamWeek(schedule, week, team) {
  return schedule.find(g => g.week === week && (g.away === team || g.home === team));
}

/* A pick's team can be a real NFL code, or the special marker "MISS" —
   used when a player had no eligible teams left to pick that week,
   which the rules count as an automatic loss. */
function eliminatorPickResult(schedule, pick) {
  if (String(pick.team).toUpperCase() === "MISS") return "wrong";
  const game = findGameForTeamWeek(schedule, pick.week, pick.team);
  if (!game || !game.winner) return "pending";
  return game.winner === pick.team ? "correct" : "wrong";
}

/* Double-elimination: a player is only OUT after their 2nd loss.
   After their 1st loss they're "on notice" — still alive, one
   mistake from elimination. */
function computeEliminatorBoard(schedule, picks) {
  const players = getPlayers(picks);

  const board = players.map(player => {
    const playerPicks = picks
      .filter(p => p.player === player)
      .sort((a, b) => a.week - b.week);

    let losses = 0;
    let firstLossWeek = null;
    let eliminatedWeek = null;
    let weeksSurvived = 0;
    const detail = [];

    playerPicks.forEach(p => {
      const result = eliminatorPickResult(schedule, p);
      if (result === "correct") weeksSurvived++;
      if (result === "wrong") {
        losses++;
        if (losses === 1) firstLossWeek = p.week;
        if (losses === 2 && eliminatedWeek === null) eliminatedWeek = p.week;
      }
      detail.push({ week: p.week, team: p.team, result });
    });

    const status = losses >= 2 ? "eliminated" : (losses === 1 ? "onNotice" : "alive");

    return {
      player,
      picks: playerPicks,
      detail,
      losses,
      firstLossWeek,
      eliminatedWeek,
      status,
      alive: status !== "eliminated",
      weeksSurvived
    };
  });

  const statusRank = { alive: 0, onNotice: 1, eliminated: 2 };
  board.sort((a, b) => {
    if (a.status !== b.status) return statusRank[a.status] - statusRank[b.status];
    if (a.status === "eliminated") return b.eliminatedWeek - a.eliminatedWeek;
    return b.weeksSurvived - a.weeksSurvived;
  });

  return board;
}

/* A team only truly counts as "already used" once picking it again would
   be pointless anyway. Every row in `picks` is a real, already-submitted
   pick (this data comes straight from the Google Sheet, never a live
   in-progress selection) — so there's no privacy reason to hide any
   week's team from THIS SAME PLAYER's own "already used" check, EXCEPT
   the one week whose form is actually being shown right now
   (`viewingWeek`): that week's own pick, if it exists and hasn't locked
   yet, stays hidden from the used-set, so an onlooker can't select this
   player's name on that page and read their still-secret pick for it
   off of which team is greyed out. `viewingWeek` defaults to the
   season's current week (computeCurrentWeek) for callers — like
   eliminator.html's season-wide overview — that aren't tied to one
   specific week's form.

   This used to exclude EVERY not-yet-locked week, not just the one
   being viewed — which quietly allowed a real bug: week.html lets you
   browse ahead and submit picks for a future week before it's
   "officially" open, and since both that future week's own form AND the
   still-open current week were excluded from this set on every page,
   the same team could be picked for both and neither dropdown would
   grey it out. Scoping the exclusion to only the ONE week each page is
   actually showing closes that hole: a pick already submitted for any
   OTHER week — past OR future, current or not — always counts as used,
   no matter its lock status. */
function usedTeamsForPlayer(picks, player, schedule, viewingWeek) {
  const excludeWeek = viewingWeek != null ? viewingWeek : (schedule ? computeCurrentWeek(schedule) : null);
  return new Set(
    picks
      .filter(p => p.player === player)
      .filter(p => !schedule || p.week !== excludeWeek || isWeekLocked(schedule, p.week))
      .map(p => p.team)
  );
}

/* ---------- Eliminator double entries ----------
   A handful of players may run TWO independent Eliminator entries at
   once (POOL_CONFIG.eliminatorDoubleEntryPlayers lists their exact
   names). Their 2nd entry is treated everywhere as its own player,
   named "${player} (Entry 2)" — its own row of picks, its own used-teams
   set, its own alive/on-notice/eliminated status — so no changes are
   needed to eliminator.html or standings.html; they already iterate
   over whatever distinct player names show up in the data. */

function isDoubleEntryPlayer(player) {
  const list = (POOL_CONFIG && POOL_CONFIG.eliminatorDoubleEntryPlayers) || [];
  return list.includes(player);
}

function secondEntryName(player) {
  return `${player} (Entry 2)`;
}

/* Some players only play Pick'em and skip Eliminator entirely
   (POOL_CONFIG.pickemOnlyPlayers lists their exact names). week.html
   hides the whole Eliminator Pick section for them. */
function isPickemOnlyPlayer(player) {
  const list = (POOL_CONFIG && POOL_CONFIG.pickemOnlyPlayers) || [];
  return list.includes(player);
}

/* The mirror image: some players only play Eliminator and skip Pick'em
   entirely (POOL_CONFIG.eliminatorOnlyPlayers lists their exact names).
   week.html hides the whole Pick'em matchups section for them. */
function isEliminatorOnlyPlayer(player) {
  const list = (POOL_CONFIG && POOL_CONFIG.eliminatorOnlyPlayers) || [];
  return list.includes(player);
}

/* ---------- Rich text (Content tab rendering) ----------
   Turns a plain-text block into HTML paragraphs/bullets:
     - a blank line starts a new paragraph
     - a line starting with "- " becomes a bullet
     - a line starting with "  - " (indented) becomes a sub-bullet */

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseBulletLines(lines) {
  const items = [];
  let current = null;
  lines.forEach(line => {
    const subMatch = line.match(/^\s{2,}-\s+(.*)$/);
    const topMatch = !subMatch && line.match(/^-\s+(.*)$/);
    if (topMatch) {
      current = { text: topMatch[1].trim(), children: [] };
      items.push(current);
    } else if (subMatch && current) {
      current.children.push(subMatch[1].trim());
    }
  });
  return items;
}

function renderRichText(rawText) {
  if (!rawText) return "";
  const blocks = String(rawText).replace(/\r\n/g, "\n").trim().split(/\n\s*\n/);
  return blocks.map(block => {
    const lines = block.split("\n").filter(l => l.trim().length);
    if (!lines.length) return "";
    const isList = lines.every(l => /^\s*-\s+/.test(l));
    if (isList) {
      const items = parseBulletLines(lines);
      return `<ul class="rich-list">${items.map(it => `<li>${escapeHtml(it.text)}${
        it.children.length
          ? `<ul class="rich-sublist">${it.children.map(c => `<li>${escapeHtml(c)}</li>`).join("")}</ul>`
          : ""
      }</li>`).join("")}</ul>`;
    }
    return `<p>${lines.map(escapeHtml).join(" ")}</p>`;
  }).join("");
}

/* Fills every element with a data-content="key" attribute using the
   loaded Content tab (or SAMPLE_CONTENT). Call after loadPoolData(). */
function renderContent(content) {
  document.querySelectorAll("[data-content]").forEach(el => {
    const key = el.getAttribute("data-content");
    el.innerHTML = renderRichText(content[key] || "");
  });
}

/* ---------- Rendering helpers ---------- */

function teamBadge(abbr) {
  const t = NFL_TEAMS[abbr] || { name: abbr, color: "#444", text: "#fff" };
  const span = document.createElement("span");
  span.className = "team-badge";
  span.style.background = t.color;
  span.style.color = t.text;
  span.textContent = abbr;
  span.title = t.name;
  return span;
}

function teamName(abbr) {
  return (NFL_TEAMS[abbr] && NFL_TEAMS[abbr].name) || abbr;
}

/* "$750", "$1,425" — whole-dollar payouts, no cents. Used anywhere
   POOL_CONFIG.payouts numbers get shown on screen. */
function formatUSD(amount) {
  return "$" + Number(amount).toLocaleString("en-US");
}

/* ---------- Wide "everyone's picks" grid printing/export ----------
   A few tables on this site have one column per GAME (up to 16, Pick'em)
   or one column per WEEK (up to 18, Eliminator) — plenty wide enough
   that a plain portrait printout just clips everything past the page's
   right edge instead of wrapping it, which looks like the data past
   column 6 or so "got lost". These two helpers fix that for BOTH the
   Print button and the Download Excel button on any such grid. */

/* Prints ONE specific table, landscape, at a small enough font that a
   full-width grid actually fits instead of clipping. Temporarily injects
   print-only CSS (removed again once the print dialog closes) rather
   than editing style.css per page, so this works the same way no matter
   which page's grid calls it. `table` must have an id. `modeClass` is
   just a unique string (doesn't need to exist in any stylesheet already
   — this function defines everything it needs). */
function printWideTable(table, modeClass) {
  if (!table || !table.id) return;
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    @page { size: landscape; margin: 0.35in; }
    @media print {
      body.${modeClass} * { visibility: hidden; }
      body.${modeClass} #${table.id}, body.${modeClass} #${table.id} * { visibility: visible; }
      body.${modeClass} #${table.id} {
        position: absolute; left: 0; top: 0; width: 100%;
        font-size: 8px;
      }
      body.${modeClass} #${table.id} th,
      body.${modeClass} #${table.id} td {
        padding: 2px 4px !important;
        white-space: nowrap;
      }
    }
  `;
  document.head.appendChild(styleTag);
  document.body.classList.add(modeClass);
  function cleanup() {
    document.body.classList.remove(modeClass);
    styleTag.remove();
    window.removeEventListener("afterprint", cleanup);
  }
  window.addEventListener("afterprint", cleanup);
  window.print();
}

/* Gives a freshly built worksheet (from XLSX.utils.table_to_sheet) a
   narrow, uniform column width based on the source table's own column
   count, so a many-column grid doesn't open in Excel requiring a long
   horizontal scroll (or looking "cut off") before every column is
   visible. The first column (always the player name here) gets a little
   more room than the rest. */
function setNarrowColumnWidths(ws, table) {
  const headerRow = table.querySelector("tr");
  const colCount = headerRow ? headerRow.children.length : 0;
  if (!colCount) return;
  ws["!cols"] = Array.from({ length: colCount }, (_, i) => ({ wch: i === 0 ? 14 : 8 }));
}

/* ---------- High Week bonus winner ----------
   Everyone's own single best week already shows in the Pick'em
   leaderboard's "High Week" column (see computeHighWeeks). The $75
   High Week BONUS, though, goes to whoever had the single best week in
   the whole pool, not each player's own best — this finds that. Ties
   (same top score, possibly in different weeks) all get listed, since
   real money is on the line and there's no fair way to pick just one.
   Returns { total, winners: [{player, week}, ...] }, or null if nobody's
   picked anything yet. */
function computeHighWeekBonusWinner(highWeeks) {
  const withScores = highWeeks.filter(h => h.bestWeek != null);
  if (!withScores.length) return null;
  const total = Math.max(...withScores.map(h => h.bestTotal));
  if (total <= 0) return null;
  const winners = withScores
    .filter(h => h.bestTotal === total)
    .map(h => ({ player: h.player, week: h.bestWeek }));
  return { total, winners };
}

/* "1st", "2nd", "3rd", "4th"... "11th", "21st"... — used for "Nth Year"
   in the header and anywhere else an ordinal is handy, so it keeps
   reading correctly forever without anyone having to remember the
   English exception for 11/12/13. */
function ordinalSuffix(n) {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

/* How many years the pool has been running, counting this season as one
   of them (2026 - 1989 + 1 = 38th year). Falls back gracefully if
   foundedYear isn't set. */
function poolYearNumber() {
  const founded = POOL_CONFIG && POOL_CONFIG.foundedYear;
  if (!founded) return null;
  return POOL_CONFIG.season - founded + 1;
}

function renderHeader(activePage) {
  const mount = document.getElementById("site-header");
  if (!mount) return;
  const yearNum = poolYearNumber();
  const subText = yearNum
    ? `${POOL_CONFIG.season} Season &middot; ${ordinalSuffix(yearNum)} Year`
    : `${POOL_CONFIG.season} Season`;
  mount.innerHTML = `
    <div class="header-inner">
      <a href="index.html" class="brand" style="text-decoration:none;">
        <div class="logo">🏈</div>
        <div>
          <h1>${POOL_CONFIG.siteName}</h1>
          <p class="sub">${subText}</p>
        </div>
      </a>
      <nav class="tabs">
        <a href="index.html" class="${activePage === "home" ? "active" : ""}">Home</a>
        <a href="pickem.html" class="${activePage === "pickem" ? "active" : ""}">Pick'em</a>
        <a href="eliminator.html" class="${activePage === "eliminator" ? "active" : ""}">Eliminator</a>
        <a href="standings.html" class="${activePage === "standings" ? "active" : ""}">Standings</a>
        <a href="schedule.html" class="${activePage === "schedule" ? "active" : ""}">Weekly Submissions</a>
        <a href="history.html" class="${activePage === "history" ? "active" : ""}">History</a>
        <a href="print-week.html">Print</a>
      </nav>
    </div>
  `;
}

function renderSampleBanner(state) {
  const mount = document.getElementById("sample-banner");
  if (!mount) return;
  if (state.sample) {
    mount.innerHTML = `<div class="banner">
      ${state.error ? "⚠️ Couldn't load your Google Sheets, showing sample data instead. " : ""}
      This page is showing <strong>sample data</strong>. Connect your Google Sheets in
      <code>config.js</code> to go live — see README.md.
    </div>`;
  } else {
    mount.innerHTML = "";
  }
}

/* ---------- Pick lock deadline ----------
   Picks for a week lock on Pacific Time on that week's Thursday — a
   fixed rule set by Commissioner Vince. Used by week.html to disable
   submissions once the deadline passes, and by isWeekLocked() below to
   decide when to reveal everyone's picks/Eliminator status. The Apps
   Script enforces the same rule server-side — see getWeekDeadline(week)
   in apps-script.gs, which must be kept in sync with the logic here if
   this ever changes.

   THE LOCK TIME ITSELF changes starting Week 4: 12:00 AM Thursday for
   Weeks 1-3, 1:00 PM Thursday from Week 4 on. This is keyed by week
   number (not by today's date) because Weeks 1-3 already locked under
   the old rule before this change was made — that's what actually
   happened, and switching by date instead could retroactively change
   an already-passed week's deadline. If the cutoff time changes again,
   update thursdayLockHour() below (and its twin, thursdayLockHourGs(),
   in apps-script.gs). */
const THURSDAY_LOCK_HOUR_CHANGE_WEEK = 4;
function thursdayLockHour(week) {
  return week >= THURSDAY_LOCK_HOUR_CHANGE_WEEK ? 13 : 0; // 1:00 PM vs 12:00 AM
}

/* Parses a schedule "date" string like "Thu Dec 10" into a real Date,
   inferring the year from POOL_CONFIG.season (Aug-Dec = season year,
   Jan-Feb = season year + 1, since the NFL season spans the new year). */
function parseScheduleDate(dateStr) {
  const parts = String(dateStr).trim().split(/\s+/); // ["Thu", "Dec", "10"]
  if (parts.length < 3) return null;
  const month = parts[1], day = parseInt(parts[2], 10);
  const monthIndex = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(month);
  if (monthIndex === -1 || isNaN(day)) return null;
  const seasonYear = (POOL_CONFIG && POOL_CONFIG.season) || new Date().getFullYear();
  const year = monthIndex <= 1 ? seasonYear + 1 : seasonYear; // Jan/Feb -> next calendar year
  return new Date(year, monthIndex, day);
}

/* Returns the UTC-offset (in minutes) of America/Los_Angeles at the given
   instant, correctly handling PST/PDT, using the standard Intl round-trip
   trick (no external timezone library needed). */
function pacificOffsetMinutes(date) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles", hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });
  const parts = dtf.formatToParts(date).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {});
  const hour = parts.hour === "24" ? "00" : parts.hour;
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, hour, parts.minute, parts.second);
  return (asUtc - date.getTime()) / 60000;
}

/* Builds a real Date instant for a given Y/M/D at a given hour/minute,
   Pacific Time (24-hour hour, e.g. 17 for 5pm). */
function pacificDateTime(year, monthIndex, day, hour, minute) {
  // First guess using a fixed offset, then refine once against the real
  // PST/PDT offset for that date (two passes is enough since the offset
  // only ever takes one of two values).
  let guess = new Date(Date.UTC(year, monthIndex, day, hour + 8, minute, 0)); // UTC-8 guess
  const offset = pacificOffsetMinutes(guess);
  return new Date(Date.UTC(year, monthIndex, day, hour, minute, 0) - offset * 60000);
}

/* Builds a real Date instant for a given Y/M/D at 12:00 AM Pacific Time. */
function pacificMidnight(year, monthIndex, day) {
  return pacificDateTime(year, monthIndex, day, 0, 0);
}

/* Returns the Date instant (UTC-correct) at which picks for `week` lock:
   that week's Thursday, Pacific Time, at whatever hour thursdayLockHour()
   says for this week (see the comment on it above) — set by Commissioner
   Vince. (An earlier version of this tried to lock 1 hour before each
   week's first kickoff instead, but that depended on parsing the
   schedule's kickoff-time column correctly, which turned out to be
   fragile — see the postmortem in README.md — so this went back to the
   simple, predictable fixed-Thursday rule.)
   Returns null if the week's games can't be found/parsed at all. */
function getWeekDeadline(schedule, week) {
  const games = schedule.filter(g => g.week === week && g.date);
  if (!games.length) return null;

  const dates = games.map(g => parseScheduleDate(g.date)).filter(Boolean);
  if (!dates.length) return null;

  // For each game, walk back to "its" Thursday. Almost every game agrees
  // on the same Thursday; the one exception is an outlier game earlier in
  // the week than Thursday (e.g. a Wednesday season-opener) — walking back
  // from that one alone would land on the PREVIOUS week's Thursday. Taking
  // the latest (max) candidate across all of the week's games is immune to
  // that: an erroneous backward wrap is always earlier, never later, than
  // the real answer the majority of games agree on.
  const thursdayCandidates = dates.map(d => {
    const daysBack = (d.getDay() - 4 + 7) % 7; // 0=Sun ... 4=Thu ... 6=Sat
    const t = new Date(d);
    t.setDate(t.getDate() - daysBack);
    return t;
  });
  const thursday = thursdayCandidates.reduce((a, b) => (a > b ? a : b));
  return pacificDateTime(thursday.getFullYear(), thursday.getMonth(), thursday.getDate(), thursdayLockHour(week), 0);
}

/* Whether a week's picks are past their lock deadline yet — the single
   source of truth for "is it safe to show this week's picks publicly."
   A week with no computable deadline (schedule not loaded, bad dates)
   is treated as NOT locked, so picks stay hidden rather than risk
   showing them too early. */
function isWeekLocked(schedule, week) {
  const deadline = getWeekDeadline(schedule, week);
  return !!deadline && new Date() >= deadline;
}

/* Formats a deadline Date for display, e.g. "Thursday, Sep 17 at 12:00 AM
   PDT" — always in Pacific Time regardless of the visitor's own clock,
   with the correct PST/PDT label since the deadline can land on either
   side of the November DST change over the course of a season. */
function formatDeadline(deadline) {
  if (!deadline) return null;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
    timeZoneName: "short"
  }).formatToParts(deadline).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {});
  return `${parts.weekday}, ${parts.month} ${parts.day} at ${parts.hour}:${parts.minute} ${parts.dayPeriod} ${parts.timeZoneName}`;
}

function fmtRecord(s) {
  return `${s.correct}-${s.wrong}${s.pending ? ` (${s.pending} pending)` : ""}`;
}

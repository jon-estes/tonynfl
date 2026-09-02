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

function usedTeamsForPlayer(picks, player) {
  return new Set(
    picks.filter(p => p.player === player).map(p => p.team)
  );
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

function renderHeader(activePage) {
  const mount = document.getElementById("site-header");
  if (!mount) return;
  mount.innerHTML = `
    <div class="header-inner">
      <a href="index.html" class="brand" style="text-decoration:none;">
        <div class="logo">🏈</div>
        <div>
          <h1>${POOL_CONFIG.siteName}</h1>
          <p class="sub">${POOL_CONFIG.season} Season</p>
        </div>
      </a>
      <nav class="tabs">
        <a href="index.html" class="${activePage === "home" ? "active" : ""}">Home</a>
        <a href="pickem.html" class="${activePage === "pickem" ? "active" : ""}">Pick'em</a>
        <a href="eliminator.html" class="${activePage === "eliminator" ? "active" : ""}">Eliminator</a>
        <a href="standings.html" class="${activePage === "standings" ? "active" : ""}">Standings</a>
        <a href="schedule.html" class="${activePage === "schedule" ? "active" : ""}">Weekly Submissions</a>
        <a href="howto.html" class="${activePage === "howto" ? "active" : ""}">How To</a>
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
   Picks for a week lock at 12:00 AM Pacific Time on that week's Thursday
   (the same fixed day/time every week — not tied to the exact minute of
   the first kickoff). Used by week.html to disable submissions once the
   deadline passes. The Apps Script enforces the same rule server-side —
   see computeWeekDeadlineUtcMs() in apps-script.gs, which must be kept
   in sync with the logic here if this ever changes. */

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

/* Builds a real Date instant for a given Y/M/D at 12:00 AM Pacific Time. */
function pacificMidnight(year, monthIndex, day) {
  // First guess using a fixed offset, then refine once against the real
  // PST/PDT offset for that date (two passes is enough since the offset
  // only ever takes one of two values).
  let guess = new Date(Date.UTC(year, monthIndex, day, 8, 0, 0)); // UTC-8 guess
  const offset = pacificOffsetMinutes(guess);
  return new Date(Date.UTC(year, monthIndex, day, 0, 0, 0) - offset * 60000);
}

/* Returns the Date instant (UTC-correct) at which picks for `week` lock:
   12:00 AM Pacific on that week's Thursday. Falls back to null if the
   week's games can't be found/parsed (deadline enforcement is skipped
   in that case rather than incorrectly locking everything). */
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
  return pacificMidnight(thursday.getFullYear(), thursday.getMonth(), thursday.getDate());
}

function fmtRecord(s) {
  return `${s.correct}-${s.wrong}${s.pending ? ` (${s.pending} pending)` : ""}`;
}

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
    kickoff: r.kickoff || "",
    winner: (r.winner || "").trim().toUpperCase()
  }));
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

async function loadPoolData() {
  const usingSample = !POOL_CONFIG.scheduleCsvUrl || !POOL_CONFIG.pickemPicksCsvUrl || !POOL_CONFIG.eliminatorPicksCsvUrl;
  if (usingSample) {
    return {
      schedule: SAMPLE_SCHEDULE,
      pickemPicks: SAMPLE_PICKEM_PICKS,
      eliminatorPicks: SAMPLE_ELIMINATOR_PICKS,
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
      sample: false
    };
  } catch (err) {
    console.error("Falling back to sample data:", err);
    return {
      schedule: SAMPLE_SCHEDULE,
      pickemPicks: SAMPLE_PICKEM_PICKS,
      eliminatorPicks: SAMPLE_ELIMINATOR_PICKS,
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
  const showToggle = document.body.classList.contains("pk-page") || document.body.classList.contains("el-page");
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
      </nav>
      ${showToggle ? `<button type="button" class="theme-toggle" id="theme-toggle"></button>` : ""}
    </div>
  `;
  if (showToggle) initThemeToggle();
}

/* ---------- Light/photo theme toggle (Pick'em + Eliminator only) ---------- */

const THEME_KEY = "vdpool-theme"; // "photo" (default) or "white"

function applyTheme(theme) {
  document.body.classList.toggle("theme-light", theme === "white");
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.textContent = theme === "white" ? "🌇 Photo Mode" : "☀️ White Mode";
  }
}

function initThemeToggle() {
  let theme = "photo";
  try { theme = localStorage.getItem(THEME_KEY) || "photo"; } catch (e) {}
  applyTheme(theme);
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const next = document.body.classList.contains("theme-light") ? "photo" : "white";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  });
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

function fmtRecord(s) {
  return `${s.correct}-${s.wrong}${s.pending ? ` (${s.pending} pending)` : ""}`;
}

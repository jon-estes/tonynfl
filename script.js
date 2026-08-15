/* Shared logic for the pick'em site: loading data (from Google
   Sheets CSV, or sample data as a fallback), computing results,
   and rendering the shared bits of UI (header nav, team badges). */

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

function normalizePicks(rows) {
  return rows.map(r => ({
    player: String(r.player).trim(),
    week: parseInt(r.week, 10),
    gameId: String(r.gameId).trim(),
    pick: String(r.pick).trim().toUpperCase()
  }));
}

async function loadLeagueData() {
  const usingSample = !LEAGUE_CONFIG.scheduleCsvUrl || !LEAGUE_CONFIG.picksCsvUrl;
  if (usingSample) {
    return { schedule: SAMPLE_SCHEDULE, picks: SAMPLE_PICKS, sample: true };
  }
  try {
    const [scheduleRows, pickRows] = await Promise.all([
      fetchCsv(LEAGUE_CONFIG.scheduleCsvUrl),
      fetchCsv(LEAGUE_CONFIG.picksCsvUrl)
    ]);
    return {
      schedule: normalizeSchedule(scheduleRows),
      picks: normalizePicks(pickRows),
      sample: false
    };
  } catch (err) {
    console.error("Falling back to sample data:", err);
    return { schedule: SAMPLE_SCHEDULE, picks: SAMPLE_PICKS, sample: true, error: true };
  }
}

/* ---------- Computation ---------- */

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

function computeStandings(schedule, picks) {
  const gamesById = Object.fromEntries(schedule.map(g => [g.gameId, g]));
  const players = getPlayers(picks);

  const standings = players.map(player => {
    const playerPicks = picks.filter(p => p.player === player);
    let correct = 0, wrong = 0, pending = 0;
    playerPicks.forEach(p => {
      const result = gameResultForPick(gamesById[p.gameId], p.pick);
      if (result === "correct") correct++;
      else if (result === "wrong") wrong++;
      else pending++;
    });
    return {
      player,
      correct,
      wrong,
      pending,
      points: correct * LEAGUE_CONFIG.pointsPerWin,
      played: correct + wrong
    };
  });

  standings.sort((a, b) => b.points - a.points || (b.correct / Math.max(b.played, 1)) - (a.correct / Math.max(a.played, 1)));
  return standings;
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
      <div class="brand">
        <div class="logo">🏈</div>
        <div>
          <h1>${LEAGUE_CONFIG.leagueName}</h1>
          <p class="sub">${LEAGUE_CONFIG.season} Season · Straight-Up Pick'em</p>
        </div>
      </div>
      <nav class="tabs">
        <a href="index.html" class="${activePage === "home" ? "active" : ""}">This Week</a>
        <a href="standings.html" class="${activePage === "standings" ? "active" : ""}">Standings</a>
        <a href="schedule.html" class="${activePage === "schedule" ? "active" : ""}">Full Schedule</a>
        <a href="${LEAGUE_CONFIG.formUrl}" target="_blank" rel="noopener">Submit Picks ↗</a>
      </nav>
    </div>
  `;
}

function renderSampleBanner(state) {
  const mount = document.getElementById("sample-banner");
  if (!mount) return;
  if (state.sample) {
    mount.innerHTML = `<div class="banner">
      ${state.error ? "⚠️ Couldn't load your Google Sheet, showing sample data instead. " : ""}
      This page is showing <strong>sample data</strong>. Connect your Google Sheet in
      <code>config.js</code> (scheduleCsvUrl / picksCsvUrl) to go live — see README.md.
    </div>`;
  } else {
    mount.innerHTML = "";
  }
}

function fmtRecord(s) {
  return `${s.correct}-${s.wrong}${s.pending ? ` (${s.pending} pending)` : ""}`;
}

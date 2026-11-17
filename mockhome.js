/* ============================================================
   MOCK HOME — "Press Box" engine
   ============================================================
   Turns the same Google Sheet data every other page uses into
   headlines, trash talk, and stats for mockhome.html. Nothing here is
   typed in by hand: every line is recomputed on page load from the
   Schedule / PickemPicks / EliminatorPicks tabs, so it updates itself
   the moment winners are filled in.

   Witty lines are picked from small template lists. The choice is
   seeded by week + player, so the same headline doesn't reshuffle
   every time someone refreshes — it only changes when the data does.
   ============================================================ */

/* ---------- small helpers ---------- */
function pbHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}
/* Seeded choice that avoids repeating a line already used on this page load. */
const PB_USED = new Set();
function pbPick(list, seed) {
  const start = pbHash(seed) % list.length;
  for (let i = 0; i < list.length; i++) {
    const line = list[(start + i) % list.length];
    if (!PB_USED.has(line)) { PB_USED.add(line); return line; }
  }
  return list[start];
}
function pbFill(tpl, vars) { return tpl.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : "")); }
function pbJoin(names) {
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}
function pbPlural(n, word) { return `${n} ${n === 1 ? word : word.replace(/y$/, "ie") + "s"}`; }

/* ---------- the joke book ---------- */
const PB_LINES = {
  rocket: [
    "{p} just jumped {n} spots. Somebody check the Wi-Fi in the press box.",
    "{p} rockets up {n} spots. The group chat is going to hear about this. Repeatedly.",
    "Up {n} spots for {p}. Turns out reading the injury report pays off.",
    "{p} climbed {n} spots this week. Elevator music not included."
  ],
  climber: [
    "{p} moves up {n} spots. Quietly. Suspiciously.",
    "{p} is up {n} spots and pretending it was all part of the plan.",
    "Up {n} for {p}. Slow and steady, like a 4-yard Cover-2 checkdown."
  ],
  faller: [
    "{p} slides {n} spots. Thoughts and prayers.",
    "{p} drops {n} spots. Somewhere a confidence point is crying.",
    "Down {n} for {p}. The trade deadline has passed, unfortunately.",
    "{p} fell {n} spots. Gravity: undefeated."
  ],
  champ: [
    "{p} owns Week {w} with {n} points. Frame it.",
    "Week {w} belongs to {p}: {n} points and zero humility.",
    "{n} points for {p} in Week {w}. Please clap.",
    "{p} put up {n} in Week {w}. Commissioner is checking for collusion."
  ],
  basement: [
    "{p} brings up the rear in Week {w} with {n}. There's always next week. Probably.",
    "{n} points for {p} in Week {w}. Bold strategy.",
    "Week {w} low score: {p}, {n}. Did a toddler fill this out? (No offense to toddlers.)"
  ],
  newLeader: [
    "New sheriff in town: {p} takes over 1st place.",
    "{p} grabs the top spot. Crown fitting scheduled for Tuesday.",
    "Changing of the guard: {p} is your new leader."
  ],
  holdLead: [
    "{p} stays on top, {n} points clear.",
    "{p} still leads by {n}. Everyone else is playing for 2nd... for now.",
    "{p} holds 1st by {n}. Comfortable? Never."
  ],
  upset: [
    "Only {k} of {t} saw {team} coming. The rest of you owe {team} an apology.",
    "{team} win and {t2} of {t} picks go straight in the shredder.",
    "Upset alert: {team}. {k} of {t} called it."
  ],
  upsetNobody: [
    "Not one of {t} picks had {team}. Zero. Nada. The whole pool got got.",
    "{team} win, and the pool went 0 for {t} on it. Collective embarrassment.",
    "Nobody. Not a single person took {team}. Group chat is suspiciously quiet."
  ],
  lastStanding: [
    "{n} left standing in Eliminator: {p}. Sweaty palms season.",
    "Down to {n}: {p}. Every Sunday is a playoff game now."
  ],
  soleSurvivor: [
    "{p} is the last one without a loss in Eliminator. Everyone else is on borrowed time or gone.",
    "{p}: unbeaten in Eliminator. The rest of the pool is rooting against them. Out loud."
  ],
  loneWolf: [
    "Lone wolf: {p} was the ONLY one to take {team}. Bark at the moon.",
    "{p} alone had {team}. Either genius or forgot to switch the pick.",
    "Nobody else believed in {team}. {p} did."
  ],
  blunder: [
    "{p} put {n} confidence points on {team}. {team} did not return the favor.",
    "Ouch: {n} points on {team} from {p}. That's a lot of confidence for a lot of nothing.",
    "{p} went all-in ({n} pts) on {team}. The house always wins."
  ],
  hot: [
    "{p} has been top 5 in {n} straight weeks. Somebody hide the spreadsheet.",
    "{p}: top 5 for {n} weeks running. Heater status: on."
  ],
  cold: [
    "{p} has been bottom 5 for {n} straight weeks. Rock bottom has a basement.",
    "{n} straight bottom-5 weeks for {p}. Have you tried flipping a coin?"
  ],
  elimOut: [
    "{p} is out of Eliminator after {team} lost. Pour one out.",
    "{team} sends {p} packing in Eliminator. Thanks for playing."
  ],
  elimNotice: [
    "{p} takes a first loss in Eliminator ({team}). On notice. One more and it's lights out.",
    "{team} puts {p} on notice in Eliminator. Choose wisely next week."
  ]
};

/* ---------- core numbers ---------- */
function pbWeekScores(schedule, picks, players, weeks) {
  const gamesById = Object.fromEntries(schedule.map(g => [g.gameId, g]));
  const scores = {};   // scores[week][player] = points earned that week
  const made = {};     // made[week][player] = true if they submitted that week
  weeks.forEach(w => { scores[w] = {}; made[w] = {}; players.forEach(p => { scores[w][p] = 0; }); });
  picks.forEach(pk => {
    if (!scores[pk.week] || !(pk.player in scores[pk.week])) return;
    made[pk.week][pk.player] = true;
    const g = gamesById[pk.gameId];
    if (gameResultForPick(g, pk.pick) === "correct") scores[pk.week][pk.player] += pk.points;
  });
  return { scores, made, gamesById };
}

/* Competition ranking (1, 2, 2, 4) on a { player: total } map. */
function pbRanks(totals) {
  const vals = Object.values(totals);
  const out = {};
  Object.keys(totals).forEach(p => { out[p] = 1 + vals.filter(v => v > totals[p]).length; });
  return out;
}

function pbIsDone(schedule, w) {
  const games = schedule.filter(g => g.week === w);
  return games.length > 0 && games.every(g => g.winner);
}

/* ---------- the main builder ---------- */
function buildPressBox(state) {
  const { schedule, pickemPicks, eliminatorPicks } = state;
  const players = getPlayers(pickemPicks).filter(p => !isEliminatorOnlyPlayer(p));
  const pickedWeeks = new Set(pickemPicks.map(p => p.week));
  const weeks = getWeeks(schedule);
  const doneWeeks = weeks.filter(w => pickedWeeks.has(w) && pbIsDone(schedule, w));
  const latest = doneWeeks[doneWeeks.length - 1] ?? null;
  const prev = doneWeeks.length > 1 ? doneWeeks[doneWeeks.length - 2] : null;

  const { scores, made, gamesById } = pbWeekScores(schedule, pickemPicks, players, weeks);

  // Cumulative totals and ranks after each completed week.
  const cumByWeek = {}, rankByWeek = {};
  const running = Object.fromEntries(players.map(p => [p, 0]));
  doneWeeks.forEach(w => {
    players.forEach(p => { running[p] += scores[w][p]; });
    cumByWeek[w] = { ...running };
    rankByWeek[w] = pbRanks(cumByWeek[w]);
  });

  const out = {
    latestWeek: latest,
    headlines: [],
    board: [],
    chase: null,
    superlatives: [],
    eliminator: null,
    openWeek: null,
    stats: []
  };
  if (latest == null) return withOpenWeek(out, state);

  const cum = cumByWeek[latest];
  const rank = rankByWeek[latest];
  const prevRank = prev != null ? rankByWeek[prev] : null;
  const seed = `w${latest}`;
  const add = (h) => out.headlines.push(h);

  /* -- Leader / lead change -- */
  const sorted = players.slice().sort((a, b) => cum[b] - cum[a] || a.localeCompare(b));
  const leader = sorted[0];
  const margin = cum[leader] - (cum[sorted[1]] ?? 0);
  const prevLeaders = prevRank ? players.filter(p => prevRank[p] === 1) : [];
  if (prevRank && !prevLeaders.includes(leader)) {
    add({ icon: "👑", tag: "New Leader", title: `${leader} takes 1st`, line: pbFill(pbPick(PB_LINES.newLeader, seed + leader), { p: leader }), weight: 95 });
  } else {
    add({ icon: "👑", tag: "Top Dog", title: `${leader} leads by ${margin}`, line: pbFill(pbPick(PB_LINES.holdLead, seed + leader), { p: leader, n: margin }), weight: 89 });
  }

  /* -- Movers -- */
  if (prevRank) {
    const moves = players.map(p => ({ p, n: prevRank[p] - rank[p] }));
    const up = moves.filter(m => m.n >= 2).sort((a, b) => b.n - a.n);
    const down = moves.filter(m => m.n <= -2).sort((a, b) => a.n - b.n);
    up.slice(0, 2).forEach((m, i) => add({
      icon: m.n >= 5 ? "🚀" : "📈", tag: m.n >= 5 ? "Rocket" : "Climber",
      title: `${m.p} ▲ ${m.n} spots`,
      line: pbFill(pbPick(m.n >= 5 ? PB_LINES.rocket : PB_LINES.climber, seed + m.p), { p: m.p, n: m.n }),
      weight: (m.n >= 5 ? 96 : m.n >= 3 ? 84 : 58) - i
    }));
    if (down[0]) add({
      icon: "📉", tag: "Free Fall", title: `${down[0].p} ▼ ${-down[0].n} spots`,
      line: pbFill(pbPick(PB_LINES.faller, seed + down[0].p), { p: down[0].p, n: -down[0].n }), weight: down[0].n <= -5 ? 86 : 62
    });
  }

  /* -- Week champ & basement -- */
  const submitted = players.filter(p => made[latest][p]);
  if (submitted.length) {
    const top = Math.max(...submitted.map(p => scores[latest][p]));
    const champs = submitted.filter(p => scores[latest][p] === top);
    const seasonBest = Math.max(...doneWeeks.flatMap(w => players.filter(p => made[w][p]).map(p => scores[w][p])));
    add({
      icon: "🏅", tag: top === seasonBest ? "Season-High Week" : "Week Winner",
      title: `${pbJoin(champs)}: ${top} pts in Week ${latest}`,
      line: (top === seasonBest ? `That ties or sets the season's best single week. High Week money is watching. ` : "") +
        pbFill(pbPick(PB_LINES.champ, seed + champs[0]), { p: pbJoin(champs), n: top, w: latest }),
      weight: top === seasonBest ? 94 : 91
    });
    const low = Math.min(...submitted.map(p => scores[latest][p]));
    const lows = submitted.filter(p => scores[latest][p] === low);
    if (lows.length <= 2 && low < top) add({
      icon: "🪦", tag: "Basement", title: `${pbJoin(lows)}: ${low} pts`,
      line: pbFill(pbPick(PB_LINES.basement, seed + lows[0]), { p: pbJoin(lows), n: low, w: latest }), weight: 40
    });
  }

  /* -- Game-level stories for the latest week -- */
  const weekGames = schedule.filter(g => g.week === latest && g.winner && g.winner !== "TIE");
  const weekPicks = pickemPicks.filter(p => p.week === latest && players.includes(p.player));
  let upset = null;
  const loneWolves = [];
  let blunder = null;
  weekGames.forEach(g => {
    const onGame = weekPicks.filter(p => p.gameId === g.gameId);
    if (!onGame.length) return;
    const right = onGame.filter(p => p.pick === g.winner);
    const share = right.length / onGame.length;
    if (!upset || share < upset.share) upset = { g, share, k: right.length, t: onGame.length };
    if (right.length === 1 && onGame.length > 3) loneWolves.push({ p: right[0].player, team: g.winner });
    onGame.filter(p => p.pick !== g.winner).forEach(p => {
      if (!blunder || p.points > blunder.points) blunder = { p: p.player, team: p.pick, points: p.points };
    });
  });
  if (upset && upset.share <= 0.35) add({
    icon: "💥", tag: "Upset of the Week", title: `${teamName(upset.g.winner)} stun the pool`,
    line: pbFill(pbPick(upset.k === 0 ? PB_LINES.upsetNobody : PB_LINES.upset, seed + upset.g.gameId), { k: upset.k, t: upset.t, t2: upset.t - upset.k, team: teamName(upset.g.winner) }),
    weight: upset.k === 0 ? 93 : 80
  });
  loneWolves.slice(0, 2).forEach((lw, i) => add({
    icon: "🐺", tag: "Lone Wolf", title: `${lw.p} alone on ${teamName(lw.team)}`,
    line: pbFill(pbPick(PB_LINES.loneWolf, seed + lw.p + lw.team), { p: lw.p, team: teamName(lw.team) }), weight: 78 - i
  }));
  if (blunder && blunder.points >= 13) add({
    icon: "🤦", tag: "Bad Beat", title: `${blunder.p}: ${blunder.points} pts on ${teamName(blunder.team)}`,
    line: pbFill(pbPick(PB_LINES.blunder, seed + blunder.p), { p: blunder.p, n: blunder.points, team: teamName(blunder.team) }), weight: 65
  });

  /* -- Streaks (weekly finish top 5 / bottom 5, ending at latest) -- */
  const weekRank = {};
  doneWeeks.forEach(w => {
    const sub = players.filter(p => made[w][p]);
    const m = {}; sub.forEach(p => { m[p] = scores[w][p]; });
    weekRank[w] = { ranks: pbRanks(m), n: sub.length };
  });
  const streak = (p, test) => {
    let n = 0;
    for (let i = doneWeeks.length - 1; i >= 0; i--) {
      const w = doneWeeks[i], r = weekRank[w].ranks[p];
      if (r == null || !test(r, weekRank[w].n)) break;
      n++;
    }
    return n;
  };
  const hot = players.map(p => ({ p, n: streak(p, r => r <= 5) })).filter(s => s.n >= 3).sort((a, b) => b.n - a.n);
  const cold = players.map(p => ({ p, n: streak(p, (r, n) => r > n - 5) })).filter(s => s.n >= 3).sort((a, b) => b.n - a.n);
  if (hot[0]) add({ icon: "🔥", tag: "Heater", title: `${hot[0].p}: ${hot[0].n} straight top-5 weeks`, line: pbFill(pbPick(PB_LINES.hot, seed + hot[0].p), hot[0]), weight: 72 });
  if (cold[0]) add({ icon: "🧊", tag: "Ice Cold", title: `${cold[0].p}: ${cold[0].n} straight bottom-5 weeks`, line: pbFill(pbPick(PB_LINES.cold, seed + cold[0].p), cold[0]), weight: 45 });

  /* -- Eliminator story for the latest week -- */
  out.eliminator = buildEliminatorPress(schedule, eliminatorPicks, latest, seed, add);

  out.headlines.sort((a, b) => b.weight - a.weight);

  /* -- Mini leaderboard with movement + streak flags -- */
  const hotSet = new Set(hot.map(h => h.p)), coldSet = new Set(cold.map(c => c.p));
  out.board = sorted.map(p => ({
    player: p, total: cum[p], rank: rank[p],
    move: prevRank ? prevRank[p] - rank[p] : 0,
    weekPts: scores[latest][p],
    hot: hotSet.has(p), cold: coldSet.has(p),
    behind: cum[leader] - cum[p]
  }));

  /* -- The chase: points behind 1st, week by week, for the current top 5 -- */
  const top5 = sorted.slice(0, 5);
  out.chase = {
    weeks: doneWeeks,
    series: top5.map(p => ({
      player: p,
      values: doneWeeks.map(w => {
        const lead = Math.max(...Object.values(cumByWeek[w]));
        return { week: w, behind: lead - cumByWeek[w][p], total: cumByWeek[w][p], rank: rankByWeek[w][p] };
      })
    }))
  };

  /* -- Season superlatives -- */
  out.superlatives = buildSuperlatives(schedule, pickemPicks, players, doneWeeks, scores, made, gamesById);

  /* -- Quick stats strip -- */
  const allSeasonWeekScores = doneWeeks.flatMap(w => players.filter(p => made[w][p]).map(p => scores[w][p]));
  const avg = allSeasonWeekScores.reduce((a, b) => a + b, 0) / (allSeasonWeekScores.length || 1);
  const totalGames = schedule.filter(g => doneWeeks.includes(g.week)).length;
  const chalkGames = schedule.filter(g => doneWeeks.includes(g.week) && g.winner && g.winner !== "TIE").map(g => {
    const on = pickemPicks.filter(p => p.gameId === g.gameId);
    const homeShare = on.filter(p => p.pick === g.home).length;
    const fav = homeShare * 2 >= on.length ? g.home : g.away;
    return fav === g.winner;
  });
  out.stats = [
    { label: "Weeks in the books", value: doneWeeks.length },
    { label: "Games graded", value: totalGames },
    { label: "Avg weekly score", value: avg.toFixed(1) },
    { label: "Pool favorite won", value: `${Math.round(100 * chalkGames.filter(Boolean).length / (chalkGames.length || 1))}%` },
    { label: "1st to last gap", value: `${cum[sorted[0]] - cum[sorted[sorted.length - 1]]} pts` }
  ];

  return withOpenWeek(out, state);
}

function buildEliminatorPress(schedule, picks, week, seed, add) {
  if (!picks || !picks.length) return null;
  const board = computeEliminatorBoard(schedule, picks);
  const alive = board.filter(b => b.status === "alive");
  const notice = board.filter(b => b.status === "onNotice");
  const out = board.filter(b => b.status === "eliminated");

  const thisWeek = picks.filter(p => p.week === week);
  const fellThisWeek = board.filter(b => b.eliminatedWeek === week);
  const noticedThisWeek = board.filter(b => b.firstLossWeek === week && b.status === "onNotice");
  const teamOf = (b) => (b.detail.find(d => d.week === week) || {}).team;

  if (fellThisWeek.length) add({
    icon: "⚰️", tag: "Eliminated",
    title: fellThisWeek.length === 1 ? `${fellThisWeek[0].player} is out` : `${fellThisWeek.length} go down in Eliminator`,
    line: fellThisWeek.length === 1
      ? pbFill(pbPick(PB_LINES.elimOut, seed + fellThisWeek[0].player), { p: fellThisWeek[0].player, team: teamName(teamOf(fellThisWeek[0])) })
      : `${pbJoin(fellThisWeek.map(b => b.player))} all took their second loss in Week ${week}.`,
    weight: 85
  });
  if (noticedThisWeek.length === 1) add({
    icon: "⚠️", tag: "On Notice", title: `${noticedThisWeek[0].player} takes a first loss`,
    line: pbFill(pbPick(PB_LINES.elimNotice, seed + noticedThisWeek[0].player), { p: noticedThisWeek[0].player, team: teamName(teamOf(noticedThisWeek[0])) }),
    weight: 55
  });

  const standing = alive.concat(notice);
  if (alive.length === 1) add({
    icon: "🛡️", tag: "Unbeaten", title: `${alive[0].player} has zero Eliminator losses`,
    line: pbFill(pbPick(PB_LINES.soleSurvivor, seed + alive[0].player), { p: alive[0].player }), weight: 75
  });
  if (standing.length > 0 && standing.length <= 4) add({
    icon: "🏟️", tag: "Last Ones Standing", title: `${pbPlural(standing.length, "entry")} left in Eliminator`,
    line: pbFill(pbPick(PB_LINES.lastStanding, seed + "ls"), { n: standing.length, p: pbJoin(standing.map(b => b.player)) }), weight: 74
  });

  // Most popular Eliminator pick this week (week is complete, so it's public).
  const counts = {};
  thisWeek.forEach(p => { if (p.team && p.team !== "MISS") counts[p.team] = (counts[p.team] || 0) + 1; });
  const popular = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  let popularText = null;
  if (popular) {
    const res = eliminatorPickResult(schedule, { week, team: popular[0] });
    popularText = `${popular[1]} of ${thisWeek.length} rode ${teamName(popular[0])} in Week ${week}. ` +
      (res === "correct" ? "They survived." : res === "wrong" ? "It did not go well." : "Push.");
  }

  return {
    alive: alive.map(b => b.player), notice: notice.map(b => b.player), out: out.length,
    total: board.length, popularText
  };
}

function buildSuperlatives(schedule, picks, players, doneWeeks, scores, made, gamesById) {
  const done = new Set(doneWeeks);
  const graded = picks.filter(p => done.has(p.week) && players.includes(p.player) && gamesById[p.gameId] && gamesById[p.gameId].winner);
  const byGame = {};
  graded.forEach(p => { (byGame[p.gameId] = byGame[p.gameId] || []).push(p); });
  const majority = {};
  Object.entries(byGame).forEach(([gid, arr]) => {
    const c = {}; arr.forEach(p => { c[p.pick] = (c[p.pick] || 0) + 1; });
    majority[gid] = Object.entries(c).sort((a, b) => b[1] - a[1])[0][0];
  });

  const stat = Object.fromEntries(players.map(p => [p, { n: 0, right: 0, chalk: 0, lone: 0, burned: 0 }]));
  graded.forEach(p => {
    const s = stat[p.player], g = gamesById[p.gameId];
    s.n++;
    const ok = gameResultForPick(g, p.pick) === "correct";
    if (ok) s.right++; else if (p.points >= 13) s.burned += p.points;
    if (p.pick === majority[p.gameId]) s.chalk++;
    if (ok && byGame[p.gameId].length > 3 && byGame[p.gameId].filter(x => x.pick === p.pick).length === 1) s.lone++;
  });
  const elig = players.filter(p => stat[p].n >= 30);
  if (!elig.length) return [];
  const best = (fn, dir = 1) => elig.slice().sort((a, b) => dir * (fn(b) - fn(a)) || a.localeCompare(b))[0];

  const sharp = best(p => stat[p].right / stat[p].n);
  const chalk = best(p => stat[p].chalk / stat[p].n);
  const rebel = best(p => stat[p].chalk / stat[p].n, -1);
  const wolf = best(p => stat[p].lone);
  const gambler = best(p => stat[p].burned);
  const sd = p => {
    const v = doneWeeks.filter(w => made[w][p]).map(w => scores[w][p]);
    const m = v.reduce((a, b) => a + b, 0) / v.length;
    return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length);
  };
  const steady = best(sd, -1);

  const pct = (a, b) => `${Math.round((100 * a) / b)}%`;
  return [
    { icon: "🎯", title: "Sharpshooter", player: sharp, stat: `${pct(stat[sharp].right, stat[sharp].n)} of picks correct` },
    { icon: "🧾", title: "Chalk King", player: chalk, stat: `sided with the pool majority ${pct(stat[chalk].chalk, stat[chalk].n)} of the time` },
    { icon: "🎸", title: "The Rebel", player: rebel, stat: `went against the crowd ${pct(stat[rebel].n - stat[rebel].chalk, stat[rebel].n)} of the time` },
    { icon: "🐺", title: "Lone Wolf", player: wolf, stat: `${pbPlural(stat[wolf].lone, "solo correct call")} nobody else made` },
    { icon: "🎰", title: "High Roller", player: gambler, stat: `${stat[gambler].burned} points torched on 13+ confidence losers` },
    { icon: "🧘", title: "Mr. Consistent", player: steady, stat: `weekly scores vary by only ±${sd(steady).toFixed(1)} pts` }
  ];
}

/* The week that's open for picks right now (or being played). */
function withOpenWeek(out, state) {
  const { schedule, pickemPicks, eliminatorPicks } = state;
  const w = computeCurrentWeek(schedule);
  if (w == null || pbIsDone(schedule, w)) return out;
  const locked = isWeekLocked(schedule, w);
  const deadline = getWeekDeadline(schedule, w);
  const submittedSet = new Set([
    ...pickemPicks.filter(p => p.week === w).map(p => p.player),
    ...eliminatorPicks.filter(p => p.week === w).map(p => p.player.replace(/ \(Entry 2\)$/, ""))
  ]);
  const roster = (POOL_CONFIG.players || []);
  out.openWeek = {
    week: w, locked, deadline,
    submitted: roster.filter(p => submittedSet.has(p)),
    waiting: roster.filter(p => !submittedSet.has(p)),
    gamesDone: schedule.filter(g => g.week === w && g.winner).length,
    gamesTotal: schedule.filter(g => g.week === w).length
  };
  // Live leader of the in-progress week (only once picks are locked).
  if (locked && out.openWeek.gamesDone > 0) {
    const players = getPlayers(pickemPicks).filter(p => !isEliminatorOnlyPlayer(p));
    const { scores } = pbWeekScores(schedule, pickemPicks, players, [w]);
    const top = Math.max(...players.map(p => scores[w][p]));
    out.openWeek.liveLeaders = players.filter(p => scores[w][p] === top);
    out.openWeek.liveTop = top;
  }
  return out;
}

if (typeof module !== "undefined") module.exports = { buildPressBox };

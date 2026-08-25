/* ============================================================
   VINCE'S POOL — CONFIG
   Edit this file to set up the season. No coding needed week to
   week once your Google Sheets are connected — see README.md.
   ============================================================ */

const POOL_CONFIG = {
  siteName: "Vince and Dave's Pool",
  season: 2026,
  currentWeek: 1,

  /* ---- Google Sheet CSV links ----
     File > Share > Publish to web > choose the specific SHEET
     (tab) > format CSV > paste the link below.
     Leave null to preview with sample data. */
  scheduleCsvUrl: null,        // "Schedule" tab: the season's games + winners
  pickemPicksCsvUrl: null,     // "PickemPicks" tab: weekly straight-up picks
  eliminatorPicksCsvUrl: null, // "EliminatorPicks" tab: one team picked per week per player
  contentCsvUrl: null,         // "Content" tab: editable rules text + homepage blurbs — see README.md

  /* ---- Google Forms ----
     Pick'em picks are now submitted directly on week.html via an
     embedded Netlify Form (see README.md), so pickemFormUrl below is
     unused — kept only in case you ever want a fallback link somewhere.
     Eliminator picks still go through this combined Google Form. */
  pickemFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLScl_KDfR0YEsBr3jz4kbu_tR75xdFpyEAfg2hZZAqwiaceakg/viewform",
  eliminatorFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLScl_KDfR0YEsBr3jz4kbu_tR75xdFpyEAfg2hZZAqwiaceakg/viewform"
};

/* ============================================================
   SAMPLE DATA — shown automatically until the CSV links above
   are filled in, so the site looks right immediately.
   Week 1 below is the REAL 2026 Week 1 NFL schedule; results/points
   for games still to be played are fabricated demo data.
   ============================================================ */

const SAMPLE_SCHEDULE = [
  { week: 1, gameId: "1-1",  away: "NE",  home: "SEA", date: "Wed Sep 9",  kickoff: "5:20pm",  winner: "SEA" },
  { week: 1, gameId: "1-2",  away: "SF",  home: "LAR", date: "Thu Sep 10", kickoff: "5:00pm",  winner: "LAR" },
  { week: 1, gameId: "1-3",  away: "ATL", home: "PIT", date: "Sun Sep 13", kickoff: "10:00am", winner: "PIT" },
  { week: 1, gameId: "1-4",  away: "BAL", home: "IND", date: "Sun Sep 13", kickoff: "10:00am", winner: "BAL" },
  { week: 1, gameId: "1-5",  away: "BUF", home: "HOU", date: "Sun Sep 13", kickoff: "10:00am", winner: "BUF" },
  { week: 1, gameId: "1-6",  away: "CHI", home: "CAR", date: "Sun Sep 13", kickoff: "10:00am", winner: "" },
  { week: 1, gameId: "1-7",  away: "CLE", home: "JAX", date: "Sun Sep 13", kickoff: "10:00am", winner: "" },
  { week: 1, gameId: "1-8",  away: "TB",  home: "CIN", date: "Sun Sep 13", kickoff: "10:00am", winner: "" },
  { week: 1, gameId: "1-9",  away: "NO",  home: "DET", date: "Sun Sep 13", kickoff: "10:00am", winner: "" },
  { week: 1, gameId: "1-10", away: "NYJ", home: "TEN", date: "Sun Sep 13", kickoff: "10:00am", winner: "" },
  { week: 1, gameId: "1-11", away: "ARI", home: "LAC", date: "Sun Sep 13", kickoff: "1:25pm",  winner: "" },
  { week: 1, gameId: "1-12", away: "GB",  home: "MIN", date: "Sun Sep 13", kickoff: "1:25pm",  winner: "" },
  { week: 1, gameId: "1-13", away: "MIA", home: "LV",  date: "Sun Sep 13", kickoff: "1:25pm",  winner: "" },
  { week: 1, gameId: "1-14", away: "WAS", home: "PHI", date: "Sun Sep 13", kickoff: "1:25pm",  winner: "" },
  { week: 1, gameId: "1-15", away: "DAL", home: "NYG", date: "Sun Sep 13", kickoff: "5:20pm",  winner: "" },
  { week: 1, gameId: "1-16", away: "DEN", home: "KC",  date: "Mon Sep 14", kickoff: "5:15pm",  winner: "" },

  { week: 2, gameId: "2-1",  away: "DET", home: "BUF", date: "Thu Sep 17", kickoff: "5:15pm",  winner: "DET" },
  { week: 2, gameId: "2-2",  away: "CAR", home: "ATL", date: "Sun Sep 20", kickoff: "10:00am", winner: "" },
  { week: 2, gameId: "2-3",  away: "MIN", home: "CHI", date: "Sun Sep 20", kickoff: "10:00am", winner: "" },
  { week: 2, gameId: "2-4",  away: "PHI", home: "TEN", date: "Sun Sep 20", kickoff: "10:00am", winner: "" },
  { week: 2, gameId: "2-5",  away: "PIT", home: "NE",  date: "Sun Sep 20", kickoff: "10:00am", winner: "" },
  { week: 2, gameId: "2-6",  away: "GB",  home: "NYJ", date: "Sun Sep 20", kickoff: "10:00am", winner: "" },
  { week: 2, gameId: "2-7",  away: "CLE", home: "TB",  date: "Sun Sep 20", kickoff: "10:00am", winner: "" },
  { week: 2, gameId: "2-8",  away: "NO",  home: "BAL", date: "Sun Sep 20", kickoff: "10:00am", winner: "" },
  { week: 2, gameId: "2-9",  away: "CIN", home: "HOU", date: "Sun Sep 20", kickoff: "10:00am", winner: "" },
  { week: 2, gameId: "2-10", away: "JAX", home: "DEN", date: "Sun Sep 20", kickoff: "1:05pm",  winner: "" },
  { week: 2, gameId: "2-11", away: "LV",  home: "LAC", date: "Sun Sep 20", kickoff: "1:05pm",  winner: "" },
  { week: 2, gameId: "2-12", away: "WAS", home: "DAL", date: "Sun Sep 20", kickoff: "1:25pm",  winner: "" },
  { week: 2, gameId: "2-13", away: "SEA", home: "ARI", date: "Sun Sep 20", kickoff: "1:25pm",  winner: "" },
  { week: 2, gameId: "2-14", away: "MIA", home: "SF",  date: "Sun Sep 20", kickoff: "1:25pm",  winner: "SF" },
  { week: 2, gameId: "2-15", away: "IND", home: "KC",  date: "Sun Sep 20", kickoff: "5:20pm",  winner: "" },
  { week: 2, gameId: "2-16", away: "NYG", home: "LAR", date: "Mon Sep 21", kickoff: "5:15pm",  winner: "" }
];

/* Each player assigns a unique confidence point value to every pick,
   highest = most confident. A pick only scores those points if the
   picked team wins; otherwise it's worth 0. */
const SAMPLE_PICKEM_PICKS = [
  // Week 1 — all 16 real games, confidence points 1-16 (unique per player)
  { player: "Jon",  week: 1, gameId: "1-1",  pick: "SEA", points: 16 },
  { player: "Jon",  week: 1, gameId: "1-2",  pick: "LAR", points: 15 },
  { player: "Jon",  week: 1, gameId: "1-3",  pick: "ATL", points: 14 },
  { player: "Jon",  week: 1, gameId: "1-4",  pick: "BAL", points: 13 },
  { player: "Jon",  week: 1, gameId: "1-5",  pick: "BUF", points: 12 },
  { player: "Jon",  week: 1, gameId: "1-6",  pick: "CAR", points: 11 },
  { player: "Jon",  week: 1, gameId: "1-7",  pick: "JAX", points: 10 },
  { player: "Jon",  week: 1, gameId: "1-8",  pick: "CIN", points: 9 },
  { player: "Jon",  week: 1, gameId: "1-9",  pick: "DET", points: 8 },
  { player: "Jon",  week: 1, gameId: "1-10", pick: "TEN", points: 7 },
  { player: "Jon",  week: 1, gameId: "1-11", pick: "LAC", points: 6 },
  { player: "Jon",  week: 1, gameId: "1-12", pick: "MIN", points: 5 },
  { player: "Jon",  week: 1, gameId: "1-13", pick: "LV",  points: 4 },
  { player: "Jon",  week: 1, gameId: "1-14", pick: "PHI", points: 3 },
  { player: "Jon",  week: 1, gameId: "1-15", pick: "NYG", points: 2 },
  { player: "Jon",  week: 1, gameId: "1-16", pick: "KC",  points: 1 },

  { player: "Tony", week: 1, gameId: "1-1",  pick: "NE",  points: 3 },
  { player: "Tony", week: 1, gameId: "1-2",  pick: "SF",  points: 6 },
  { player: "Tony", week: 1, gameId: "1-3",  pick: "PIT", points: 1 },
  { player: "Tony", week: 1, gameId: "1-4",  pick: "IND", points: 4 },
  { player: "Tony", week: 1, gameId: "1-5",  pick: "HOU", points: 2 },
  { player: "Tony", week: 1, gameId: "1-6",  pick: "CHI", points: 16 },
  { player: "Tony", week: 1, gameId: "1-7",  pick: "CLE", points: 15 },
  { player: "Tony", week: 1, gameId: "1-8",  pick: "TB",  points: 14 },
  { player: "Tony", week: 1, gameId: "1-9",  pick: "NO",  points: 13 },
  { player: "Tony", week: 1, gameId: "1-10", pick: "NYJ", points: 12 },
  { player: "Tony", week: 1, gameId: "1-11", pick: "ARI", points: 11 },
  { player: "Tony", week: 1, gameId: "1-12", pick: "GB",  points: 10 },
  { player: "Tony", week: 1, gameId: "1-13", pick: "MIA", points: 9 },
  { player: "Tony", week: 1, gameId: "1-14", pick: "WAS", points: 8 },
  { player: "Tony", week: 1, gameId: "1-15", pick: "DAL", points: 7 },
  { player: "Tony", week: 1, gameId: "1-16", pick: "DEN", points: 5 },

  { player: "Sam",  week: 1, gameId: "1-1",  pick: "SEA", points: 9 },
  { player: "Sam",  week: 1, gameId: "1-2",  pick: "LAR", points: 14 },
  { player: "Sam",  week: 1, gameId: "1-3",  pick: "PIT", points: 12 },
  { player: "Sam",  week: 1, gameId: "1-4",  pick: "IND", points: 7 },
  { player: "Sam",  week: 1, gameId: "1-5",  pick: "HOU", points: 5 },
  { player: "Sam",  week: 1, gameId: "1-6",  pick: "CAR", points: 1 },
  { player: "Sam",  week: 1, gameId: "1-7",  pick: "JAX", points: 2 },
  { player: "Sam",  week: 1, gameId: "1-8",  pick: "CIN", points: 3 },
  { player: "Sam",  week: 1, gameId: "1-9",  pick: "DET", points: 4 },
  { player: "Sam",  week: 1, gameId: "1-10", pick: "TEN", points: 6 },
  { player: "Sam",  week: 1, gameId: "1-11", pick: "LAC", points: 8 },
  { player: "Sam",  week: 1, gameId: "1-12", pick: "MIN", points: 10 },
  { player: "Sam",  week: 1, gameId: "1-13", pick: "LV",  points: 11 },
  { player: "Sam",  week: 1, gameId: "1-14", pick: "PHI", points: 13 },
  { player: "Sam",  week: 1, gameId: "1-15", pick: "NYG", points: 15 },
  { player: "Sam",  week: 1, gameId: "1-16", pick: "KC",  points: 16 },

  // Week 2 — all 16 real games, confidence points 1-16 (unique per player)
  { player: "Jon",  week: 2, gameId: "2-1",  pick: "DET", points: 16 },
  { player: "Jon",  week: 2, gameId: "2-2",  pick: "CAR", points: 14 },
  { player: "Jon",  week: 2, gameId: "2-3",  pick: "MIN", points: 13 },
  { player: "Jon",  week: 2, gameId: "2-4",  pick: "PHI", points: 12 },
  { player: "Jon",  week: 2, gameId: "2-5",  pick: "PIT", points: 11 },
  { player: "Jon",  week: 2, gameId: "2-6",  pick: "GB",  points: 10 },
  { player: "Jon",  week: 2, gameId: "2-7",  pick: "CLE", points: 9 },
  { player: "Jon",  week: 2, gameId: "2-8",  pick: "NO",  points: 8 },
  { player: "Jon",  week: 2, gameId: "2-9",  pick: "CIN", points: 7 },
  { player: "Jon",  week: 2, gameId: "2-10", pick: "JAX", points: 6 },
  { player: "Jon",  week: 2, gameId: "2-11", pick: "LV",  points: 5 },
  { player: "Jon",  week: 2, gameId: "2-12", pick: "WAS", points: 4 },
  { player: "Jon",  week: 2, gameId: "2-13", pick: "SEA", points: 3 },
  { player: "Jon",  week: 2, gameId: "2-14", pick: "SF",  points: 15 },
  { player: "Jon",  week: 2, gameId: "2-15", pick: "IND", points: 2 },
  { player: "Jon",  week: 2, gameId: "2-16", pick: "NYG", points: 1 },

  { player: "Tony", week: 2, gameId: "2-1",  pick: "BUF", points: 1 },
  { player: "Tony", week: 2, gameId: "2-2",  pick: "ATL", points: 3 },
  { player: "Tony", week: 2, gameId: "2-3",  pick: "CHI", points: 4 },
  { player: "Tony", week: 2, gameId: "2-4",  pick: "TEN", points: 5 },
  { player: "Tony", week: 2, gameId: "2-5",  pick: "NE",  points: 6 },
  { player: "Tony", week: 2, gameId: "2-6",  pick: "NYJ", points: 7 },
  { player: "Tony", week: 2, gameId: "2-7",  pick: "TB",  points: 8 },
  { player: "Tony", week: 2, gameId: "2-8",  pick: "BAL", points: 9 },
  { player: "Tony", week: 2, gameId: "2-9",  pick: "HOU", points: 10 },
  { player: "Tony", week: 2, gameId: "2-10", pick: "DEN", points: 11 },
  { player: "Tony", week: 2, gameId: "2-11", pick: "LAC", points: 12 },
  { player: "Tony", week: 2, gameId: "2-12", pick: "DAL", points: 13 },
  { player: "Tony", week: 2, gameId: "2-13", pick: "ARI", points: 14 },
  { player: "Tony", week: 2, gameId: "2-14", pick: "MIA", points: 2 },
  { player: "Tony", week: 2, gameId: "2-15", pick: "KC",  points: 15 },
  { player: "Tony", week: 2, gameId: "2-16", pick: "LAR", points: 16 },

  { player: "Sam",  week: 2, gameId: "2-1",  pick: "DET", points: 9 },
  { player: "Sam",  week: 2, gameId: "2-2",  pick: "CAR", points: 1 },
  { player: "Sam",  week: 2, gameId: "2-3",  pick: "MIN", points: 2 },
  { player: "Sam",  week: 2, gameId: "2-4",  pick: "PHI", points: 3 },
  { player: "Sam",  week: 2, gameId: "2-5",  pick: "PIT", points: 4 },
  { player: "Sam",  week: 2, gameId: "2-6",  pick: "GB",  points: 5 },
  { player: "Sam",  week: 2, gameId: "2-7",  pick: "CLE", points: 6 },
  { player: "Sam",  week: 2, gameId: "2-8",  pick: "NO",  points: 7 },
  { player: "Sam",  week: 2, gameId: "2-9",  pick: "CIN", points: 8 },
  { player: "Sam",  week: 2, gameId: "2-10", pick: "JAX", points: 10 },
  { player: "Sam",  week: 2, gameId: "2-11", pick: "LV",  points: 11 },
  { player: "Sam",  week: 2, gameId: "2-12", pick: "WAS", points: 12 },
  { player: "Sam",  week: 2, gameId: "2-13", pick: "SEA", points: 13 },
  { player: "Sam",  week: 2, gameId: "2-14", pick: "SF",  points: 14 },
  { player: "Sam",  week: 2, gameId: "2-15", pick: "IND", points: 15 },
  { player: "Sam",  week: 2, gameId: "2-16", pick: "NYG", points: 16 }
];

/* ============================================================
   EDITABLE TEXT — rules and homepage blurbs. Drives the "Content"
   Google Sheet tab (see README.md). Formatting rules for any value:
     - a blank line starts a new paragraph
     - a line starting with "- " becomes a bullet
     - a line starting with "  - " (indented) becomes a sub-bullet
   ============================================================ */
const SAMPLE_CONTENT = {
  home_pickem_summary:
    "This pool is for all playoff games, including the Super Bowl. There are 13 playoff games including the Super Bowl. Each week pick the winners and assign a point between 1 and 13. You can only use the point once. Grand total if you pick them all right is 91 points. The tiebreaker is total points for the Super Bowl game. Whoever is closer, over or under. If still a tie, split the Jackpot. The payout will be determined after the first week.",

  home_eliminator_summary:
    "$25 buy-in. Double elimination — lose twice and you're out. Pick one team a week to win, can't reuse a team, all playoff teams available until you're eliminated. No pick available = a loss. Last one(s) standing with no losses win it — if the field goes out together, they split the jackpot.",

  pickem_rules:
    "This pool is for all playoff games, including the Super Bowl. There are 13 playoff games including the Super Bowl. Each week pick the winners and assign a point between 1 and 13. You can only use the point once. Grand total if you pick them all right is 91 points. The tiebreaker is total points for the Super Bowl game. Whoever is closer, over or under. If still a tie, split the Jackpot. The payout will be determined after the first week.",

  eliminator_rules:
    "$25 buyin, prize determined on entries. Double elimination – lose twice and you are eliminated.\n\n" +
    "- Pick one team each week that you think will win\n" +
    "- Can't pick that team again\n" +
    "- All playoff teams are available until eliminated\n" +
    "- If you have no teams available to pick any week it counts as a loss\n" +
    "- Winner(s) decided by:\n" +
    "  - First – No Loss\n" +
    "  - Second – Last survivors go out the same week\n" +
    "- The person or people left in the pool will win or split the jackpot."
};

const SAMPLE_ELIMINATOR_PICKS = [
  { player: "Jon",  week: 1, team: "BAL" },
  { player: "Tony", week: 1, team: "LAR" },
  { player: "Sam",  week: 1, team: "HOU" },

  { player: "Jon",  week: 2, team: "DET" },
  { player: "Tony", week: 2, team: "BUF" },
  { player: "Sam",  week: 2, team: "MIA" }
];

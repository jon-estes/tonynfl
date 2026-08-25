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

  { week: 2, gameId: "2-1", away: "BAL", home: "LV",  kickoff: "Sun 1:00pm", winner: "BAL" },
  { week: 2, gameId: "2-2", away: "DAL", home: "NO",  kickoff: "Sun 1:00pm", winner: "NO"  },
  { week: 2, gameId: "2-3", away: "DET", home: "TB",  kickoff: "Sun 1:00pm", winner: "DET" }
];

/* Each player assigns a unique confidence point value to every pick,
   highest = most confident. A pick only scores those points if the
   picked team wins; otherwise it's worth 0. */
const SAMPLE_PICKEM_PICKS = [
  { player: "Jon",  week: 1, gameId: "1-1", pick: "SEA", points: 6 },
  { player: "Jon",  week: 1, gameId: "1-2", pick: "LAR", points: 5 },
  { player: "Jon",  week: 1, gameId: "1-3", pick: "ATL", points: 4 },
  { player: "Jon",  week: 1, gameId: "1-4", pick: "BAL", points: 3 },
  { player: "Jon",  week: 1, gameId: "1-5", pick: "BUF", points: 2 },
  { player: "Jon",  week: 1, gameId: "1-6", pick: "CHI", points: 1 },

  { player: "Tony", week: 1, gameId: "1-1", pick: "NE",  points: 3 },
  { player: "Tony", week: 1, gameId: "1-2", pick: "SF",  points: 6 },
  { player: "Tony", week: 1, gameId: "1-3", pick: "PIT", points: 5 },
  { player: "Tony", week: 1, gameId: "1-4", pick: "IND", points: 4 },
  { player: "Tony", week: 1, gameId: "1-5", pick: "HOU", points: 2 },
  { player: "Tony", week: 1, gameId: "1-6", pick: "CAR", points: 1 },

  { player: "Sam",  week: 1, gameId: "1-1", pick: "SEA", points: 4 },
  { player: "Sam",  week: 1, gameId: "1-2", pick: "LAR", points: 6 },
  { player: "Sam",  week: 1, gameId: "1-3", pick: "PIT", points: 5 },
  { player: "Sam",  week: 1, gameId: "1-4", pick: "IND", points: 3 },
  { player: "Sam",  week: 1, gameId: "1-5", pick: "HOU", points: 2 },
  { player: "Sam",  week: 1, gameId: "1-6", pick: "CAR", points: 1 },

  { player: "Jon",  week: 2, gameId: "2-1", pick: "BAL", points: 3 },
  { player: "Jon",  week: 2, gameId: "2-2", pick: "NO",  points: 2 },
  { player: "Jon",  week: 2, gameId: "2-3", pick: "DET", points: 1 },

  { player: "Tony", week: 2, gameId: "2-1", pick: "LV",  points: 1 },
  { player: "Tony", week: 2, gameId: "2-2", pick: "DAL", points: 3 },
  { player: "Tony", week: 2, gameId: "2-3", pick: "TB",  points: 2 },

  { player: "Sam",  week: 2, gameId: "2-1", pick: "BAL", points: 2 },
  { player: "Sam",  week: 2, gameId: "2-2", pick: "DAL", points: 3 },
  { player: "Sam",  week: 2, gameId: "2-3", pick: "DET", points: 1 }
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
  { player: "Tony", week: 2, team: "DAL" },
  { player: "Sam",  week: 2, team: "LV"  }
];

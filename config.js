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

  /* ---- Google Forms (players submit picks here) ---- */
  pickemFormUrl: "https://forms.gle/REPLACE-WITH-PICKEM-FORM-LINK",
  eliminatorFormUrl: "https://forms.gle/REPLACE-WITH-ELIMINATOR-FORM-LINK"
};

/* ============================================================
   SAMPLE DATA — shown automatically until the CSV links above
   are filled in, so the site looks right immediately.
   ============================================================ */

const SAMPLE_SCHEDULE = [
  { week: 1, gameId: "1-1", away: "KC",  home: "BAL", kickoff: "Thu 8:20pm", winner: "BAL" },
  { week: 1, gameId: "1-2", away: "PHI", home: "DAL", kickoff: "Sun 1:00pm", winner: "PHI" },
  { week: 1, gameId: "1-3", away: "SF",  home: "SEA", kickoff: "Sun 1:00pm", winner: "" },
  { week: 1, gameId: "1-4", away: "BUF", home: "NYJ", kickoff: "Sun 4:25pm", winner: "" },
  { week: 1, gameId: "1-5", away: "GB",  home: "MIN", kickoff: "Sun 8:20pm", winner: "" },
  { week: 1, gameId: "1-6", away: "CIN", home: "CLE", kickoff: "Mon 8:15pm", winner: "" },

  { week: 2, gameId: "2-1", away: "BAL", home: "LV",  kickoff: "Sun 1:00pm", winner: "BAL" },
  { week: 2, gameId: "2-2", away: "DAL", home: "NO",  kickoff: "Sun 1:00pm", winner: "NO"  },
  { week: 2, gameId: "2-3", away: "DET", home: "TB",  kickoff: "Sun 1:00pm", winner: "DET" }
];

/* Each player assigns a unique confidence point value to every pick,
   highest = most confident. A pick only scores those points if the
   picked team wins; otherwise it's worth 0. */
const SAMPLE_PICKEM_PICKS = [
  { player: "Jon",  week: 1, gameId: "1-1", pick: "BAL", points: 6 },
  { player: "Jon",  week: 1, gameId: "1-2", pick: "DAL", points: 5 },
  { player: "Jon",  week: 1, gameId: "1-3", pick: "SF",  points: 4 },
  { player: "Jon",  week: 1, gameId: "1-4", pick: "BUF", points: 3 },
  { player: "Jon",  week: 1, gameId: "1-5", pick: "GB",  points: 2 },
  { player: "Jon",  week: 1, gameId: "1-6", pick: "CIN", points: 1 },

  { player: "Tony", week: 1, gameId: "1-1", pick: "KC",  points: 3 },
  { player: "Tony", week: 1, gameId: "1-2", pick: "PHI", points: 6 },
  { player: "Tony", week: 1, gameId: "1-3", pick: "SEA", points: 5 },
  { player: "Tony", week: 1, gameId: "1-4", pick: "BUF", points: 4 },
  { player: "Tony", week: 1, gameId: "1-5", pick: "MIN", points: 2 },
  { player: "Tony", week: 1, gameId: "1-6", pick: "CLE", points: 1 },

  { player: "Sam",  week: 1, gameId: "1-1", pick: "BAL", points: 4 },
  { player: "Sam",  week: 1, gameId: "1-2", pick: "DAL", points: 6 },
  { player: "Sam",  week: 1, gameId: "1-3", pick: "SEA", points: 5 },
  { player: "Sam",  week: 1, gameId: "1-4", pick: "NYJ", points: 3 },
  { player: "Sam",  week: 1, gameId: "1-5", pick: "GB",  points: 2 },
  { player: "Sam",  week: 1, gameId: "1-6", pick: "CIN", points: 1 },

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
  { player: "Tony", week: 1, team: "PHI" },
  { player: "Sam",  week: 1, team: "KC"  },

  { player: "Jon",  week: 2, team: "DET" },
  { player: "Tony", week: 2, team: "DAL" },
  { player: "Sam",  week: 2, team: "LV"  }
];

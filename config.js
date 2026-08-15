/* ============================================================
   LEAGUE CONFIG — edit this file to set up your league.
   No coding required for weekly updates once your Google Sheet
   is connected — see README.md for the full setup walkthrough.
   ============================================================ */

const LEAGUE_CONFIG = {
  leagueName: "NFL Pick'em League",
  season: 2026,
  currentWeek: 1,

  /* ---- STEP 1: Google Sheet CSV links ----
     In Google Sheets: File > Share > Publish to web > choose the
     specific SHEET (tab), format = CSV, then paste the link below.
     Leave as-is (null) to preview the site with sample data. */
  scheduleCsvUrl: null, // e.g. "https://docs.google.com/spreadsheets/d/e/XXXX/pub?gid=0&single=true&output=csv"
  picksCsvUrl: null,    // e.g. "https://docs.google.com/spreadsheets/d/e/XXXX/pub?gid=123&single=true&output=csv"

  /* ---- STEP 2: Google Form for players to submit picks ---- */
  formUrl: "https://forms.gle/REPLACE-WITH-YOUR-FORM-LINK",

  /* Points for a correct straight-up pick (kept simple by design) */
  pointsPerWin: 1
};

/* ============================================================
   SAMPLE DATA — used automatically whenever scheduleCsvUrl /
   picksCsvUrl above are null, so the site looks right immediately.
   Replace with your real Google Sheet once it's ready; this
   block is then ignored.
   ============================================================ */

const SAMPLE_SCHEDULE = [
  // week, gameId, away, home, kickoff (local display text), winner ("" = not played)
  { week: 1, gameId: "1-1", away: "KC",  home: "BAL", kickoff: "Thu 8:20pm", winner: "" },
  { week: 1, gameId: "1-2", away: "PHI", home: "DAL", kickoff: "Sun 1:00pm", winner: "" },
  { week: 1, gameId: "1-3", away: "SF",  home: "SEA", kickoff: "Sun 1:00pm", winner: "" },
  { week: 1, gameId: "1-4", away: "BUF", home: "NYJ", kickoff: "Sun 4:25pm", winner: "" },
  { week: 1, gameId: "1-5", away: "GB",  home: "MIN", kickoff: "Sun 8:20pm", winner: "" },
  { week: 1, gameId: "1-6", away: "CIN", home: "CLE", kickoff: "Mon 8:15pm", winner: "" }
];

const SAMPLE_PICKS = [
  // player, week, gameId, pick
  { player: "Jon",   week: 1, gameId: "1-1", pick: "BAL" },
  { player: "Jon",   week: 1, gameId: "1-2", pick: "DAL" },
  { player: "Jon",   week: 1, gameId: "1-3", pick: "SF"  },
  { player: "Jon",   week: 1, gameId: "1-4", pick: "BUF" },
  { player: "Jon",   week: 1, gameId: "1-5", pick: "GB"  },
  { player: "Jon",   week: 1, gameId: "1-6", pick: "CIN" },

  { player: "Tony",  week: 1, gameId: "1-1", pick: "KC"  },
  { player: "Tony",  week: 1, gameId: "1-2", pick: "PHI" },
  { player: "Tony",  week: 1, gameId: "1-3", pick: "SEA" },
  { player: "Tony",  week: 1, gameId: "1-4", pick: "BUF" },
  { player: "Tony",  week: 1, gameId: "1-5", pick: "MIN" },
  { player: "Tony",  week: 1, gameId: "1-6", pick: "CLE" },

  { player: "Sam",   week: 1, gameId: "1-1", pick: "BAL" },
  { player: "Sam",   week: 1, gameId: "1-2", pick: "DAL" },
  { player: "Sam",   week: 1, gameId: "1-3", pick: "SEA" },
  { player: "Sam",   week: 1, gameId: "1-4", pick: "NYJ" },
  { player: "Sam",   week: 1, gameId: "1-5", pick: "GB"  },
  { player: "Sam",   week: 1, gameId: "1-6", pick: "CIN" }
];

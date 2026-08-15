/* ============================================================
   VINCE'S POOL — CONFIG
   Edit this file to set up the season. No coding needed week to
   week once your Google Sheets are connected — see README.md.
   ============================================================ */

const POOL_CONFIG = {
  siteName: "Vince's Pool",
  season: 2024,
  currentWeek: 1,

  /* ---- Google Sheet CSV links ----
     File > Share > Publish to web > choose the specific SHEET
     (tab) > format CSV > paste the link below.
     Leave null to preview with sample data. */
  scheduleCsvUrl: null,        // "Schedule" tab: the season's games + winners
  pickemPicksCsvUrl: null,     // "PickemPicks" tab: weekly straight-up picks
  eliminatorPicksCsvUrl: null, // "EliminatorPicks" tab: one team picked per week per player

  /* ---- Google Forms (players submit picks here) ---- */
  pickemFormUrl: "https://forms.gle/REPLACE-WITH-PICKEM-FORM-LINK",
  eliminatorFormUrl: "https://forms.gle/REPLACE-WITH-ELIMINATOR-FORM-LINK",

  pointsPerWin: 1
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

  { week: 2, gameId: "2-1", away: "BAL", home: "LV",  kickoff: "Sun 1:00pm", winner: "" },
  { week: 2, gameId: "2-2", away: "DAL", home: "NO",  kickoff: "Sun 1:00pm", winner: "" },
  { week: 2, gameId: "2-3", away: "DET", home: "TB",  kickoff: "Sun 1:00pm", winner: "" }
];

const SAMPLE_PICKEM_PICKS = [
  { player: "Jon",  week: 1, gameId: "1-1", pick: "BAL" },
  { player: "Jon",  week: 1, gameId: "1-2", pick: "DAL" },
  { player: "Jon",  week: 1, gameId: "1-3", pick: "SF"  },
  { player: "Jon",  week: 1, gameId: "1-4", pick: "BUF" },
  { player: "Jon",  week: 1, gameId: "1-5", pick: "GB"  },
  { player: "Jon",  week: 1, gameId: "1-6", pick: "CIN" },

  { player: "Tony", week: 1, gameId: "1-1", pick: "KC"  },
  { player: "Tony", week: 1, gameId: "1-2", pick: "PHI" },
  { player: "Tony", week: 1, gameId: "1-3", pick: "SEA" },
  { player: "Tony", week: 1, gameId: "1-4", pick: "BUF" },
  { player: "Tony", week: 1, gameId: "1-5", pick: "MIN" },
  { player: "Tony", week: 1, gameId: "1-6", pick: "CLE" },

  { player: "Sam",  week: 1, gameId: "1-1", pick: "BAL" },
  { player: "Sam",  week: 1, gameId: "1-2", pick: "DAL" },
  { player: "Sam",  week: 1, gameId: "1-3", pick: "SEA" },
  { player: "Sam",  week: 1, gameId: "1-4", pick: "NYJ" },
  { player: "Sam",  week: 1, gameId: "1-5", pick: "GB"  },
  { player: "Sam",  week: 1, gameId: "1-6", pick: "CIN" }
];

const SAMPLE_ELIMINATOR_PICKS = [
  { player: "Jon",  week: 1, team: "BAL" },
  { player: "Tony", week: 1, team: "PHI" },
  { player: "Sam",  week: 1, team: "KC"  },

  { player: "Jon",  week: 2, team: "DET" },
  { player: "Tony", week: 2, team: "DAL" }
];

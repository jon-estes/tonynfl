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
  scheduleCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5tglhlMNbPJolj66aMhHXASBpoDg8XxmGjVsiyuLqFWj5fEpI1alAIL1lidbchx9Dbv_lzb9jlfhC/pub?gid=1198981568&single=true&output=csv",        // "Schedule" tab: the season's games + winners
  pickemPicksCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5tglhlMNbPJolj66aMhHXASBpoDg8XxmGjVsiyuLqFWj5fEpI1alAIL1lidbchx9Dbv_lzb9jlfhC/pub?gid=1100375573&single=true&output=csv",     // "PickemPicks" tab: weekly straight-up picks
  eliminatorPicksCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5tglhlMNbPJolj66aMhHXASBpoDg8XxmGjVsiyuLqFWj5fEpI1alAIL1lidbchx9Dbv_lzb9jlfhC/pub?gid=1333697856&single=true&output=csv", // "EliminatorPicks" tab: one team picked per week per player
  contentCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5tglhlMNbPJolj66aMhHXASBpoDg8XxmGjVsiyuLqFWj5fEpI1alAIL1lidbchx9Dbv_lzb9jlfhC/pub?gid=1079837670&single=true&output=csv",         // "Content" tab: editable rules text + homepage blurbs — see README.md

  /* ---- Google Forms (legacy, unused) ----
     Both Pick'em and Eliminator picks are now submitted together
     directly on week.html via an embedded Netlify Form (see README.md).
     These two fields are unused — kept only in case you ever want a
     fallback link somewhere. */
  pickemFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLScl_KDfR0YEsBr3jz4kbu_tR75xdFpyEAfg2hZZAqwiaceakg/viewform",
  eliminatorFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLScl_KDfR0YEsBr3jz4kbu_tR75xdFpyEAfg2hZZAqwiaceakg/viewform",

  /* ---- Player list ----
     The Name field on the print sheet (week.html) is a dropdown built
     from this list, so submissions always match a real player and we
     can reliably check "which teams has this player already used" for
     the Eliminator pick. Replace with the final roster whenever you're
     ready — just names, in whatever order you want them to appear. */
  players: ["Vince", "Dave", "Wig", "Vanessa", "Roy", "Pat", "Jason", "Tony", "Jon"],

  /* ---- How To page video ----
     Leave null until you have a video. Once you do, paste its YOUTUBE
     EMBED URL here (Share -> Embed on the video, or just
     "https://www.youtube.com/embed/VIDEO_ID") and it'll appear on
     howto.html automatically — no code changes needed. */
  howToVideoUrl: https://youtu.be/MngABK3w5SA,

  /* ---- Players with a 2nd Eliminator entry ----
     Anyone listed here gets TWO independent Eliminator picks each week
     on the print sheet (labeled "Entry 1" / "Entry 2") instead of one —
     each with its own "already used" team tracking, so the two entries
     can survive or get eliminated completely separately. Their 2nd
     entry shows up everywhere on the site (Eliminator, Standings) as
     its own player: "Name (Entry 2)". Just list the exact names from
     `players` above that have a 2nd entry — leave the array empty if
     nobody does. */
  eliminatorDoubleEntryPlayers: ["Pat", "Jason"]
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
  { week: 2, gameId: "2-16", away: "NYG", home: "LAR", date: "Mon Sep 21", kickoff: "5:15pm",  winner: "" },

  { week: 3, gameId: "3-1",  away: "ATL", home: "GB",  date: "Thu Sep 24", kickoff: "5:15pm",  winner: "" },
  { week: 3, gameId: "3-2",  away: "LAC", home: "BUF", date: "Sun Sep 27", kickoff: "10:00am", winner: "" },
  { week: 3, gameId: "3-3",  away: "CAR", home: "CLE", date: "Sun Sep 27", kickoff: "10:00am", winner: "" },
  { week: 3, gameId: "3-4",  away: "NYJ", home: "DET", date: "Sun Sep 27", kickoff: "10:00am", winner: "" },
  { week: 3, gameId: "3-5",  away: "HOU", home: "IND", date: "Sun Sep 27", kickoff: "10:00am", winner: "" },
  { week: 3, gameId: "3-6",  away: "KC",  home: "MIA", date: "Sun Sep 27", kickoff: "10:00am", winner: "" },
  { week: 3, gameId: "3-7",  away: "TEN", home: "NYG", date: "Sun Sep 27", kickoff: "10:00am", winner: "" },
  { week: 3, gameId: "3-8",  away: "CIN", home: "PIT", date: "Sun Sep 27", kickoff: "10:00am", winner: "" },
  { week: 3, gameId: "3-9",  away: "SEA", home: "WAS", date: "Sun Sep 27", kickoff: "10:00am", winner: "" },
  { week: 3, gameId: "3-10", away: "NE",  home: "JAX", date: "Sun Sep 27", kickoff: "10:00am", winner: "" },
  { week: 3, gameId: "3-11", away: "ARI", home: "SF",  date: "Sun Sep 27", kickoff: "1:05pm",  winner: "" },
  { week: 3, gameId: "3-12", away: "MIN", home: "TB",  date: "Sun Sep 27", kickoff: "1:05pm",  winner: "" },
  { week: 3, gameId: "3-13", away: "BAL", home: "DAL", date: "Sun Sep 27", kickoff: "1:25pm",  winner: "" },
  { week: 3, gameId: "3-14", away: "LV",  home: "NO",  date: "Sun Sep 27", kickoff: "1:25pm",  winner: "" },
  { week: 3, gameId: "3-15", away: "LAR", home: "DEN", date: "Sun Sep 27", kickoff: "5:20pm",  winner: "" },
  { week: 3, gameId: "3-16", away: "PHI", home: "CHI", date: "Mon Sep 28", kickoff: "5:15pm",  winner: "" },

  { week: 4, gameId: "4-1",  away: "PIT", home: "CLE", date: "Thu Oct 1",  kickoff: "5:15pm",  winner: "" },
  { week: 4, gameId: "4-2",  away: "IND", home: "WAS", date: "Sun Oct 4",  kickoff: "6:30am",  winner: "" },
  { week: 4, gameId: "4-3",  away: "NE",  home: "BUF", date: "Sun Oct 4",  kickoff: "10:00am", winner: "" },
  { week: 4, gameId: "4-4",  away: "NYJ", home: "CHI", date: "Sun Oct 4",  kickoff: "10:00am", winner: "" },
  { week: 4, gameId: "4-5",  away: "JAX", home: "CIN", date: "Sun Oct 4",  kickoff: "10:00am", winner: "" },
  { week: 4, gameId: "4-6",  away: "ARI", home: "NYG", date: "Sun Oct 4",  kickoff: "10:00am", winner: "" },
  { week: 4, gameId: "4-7",  away: "LAR", home: "PHI", date: "Sun Oct 4",  kickoff: "10:00am", winner: "" },
  { week: 4, gameId: "4-8",  away: "GB",  home: "TB",  date: "Sun Oct 4",  kickoff: "10:00am", winner: "" },
  { week: 4, gameId: "4-9",  away: "TEN", home: "BAL", date: "Sun Oct 4",  kickoff: "10:00am", winner: "" },
  { week: 4, gameId: "4-10", away: "DAL", home: "HOU", date: "Sun Oct 4",  kickoff: "10:00am", winner: "" },
  { week: 4, gameId: "4-11", away: "MIA", home: "MIN", date: "Sun Oct 4",  kickoff: "1:05pm",  winner: "" },
  { week: 4, gameId: "4-12", away: "KC",  home: "LV",  date: "Sun Oct 4",  kickoff: "1:25pm",  winner: "" },
  { week: 4, gameId: "4-13", away: "DEN", home: "SF",  date: "Sun Oct 4",  kickoff: "1:25pm",  winner: "" },
  { week: 4, gameId: "4-14", away: "LAC", home: "SEA", date: "Sun Oct 4",  kickoff: "1:25pm",  winner: "" },
  { week: 4, gameId: "4-15", away: "DET", home: "CAR", date: "Sun Oct 4",  kickoff: "5:20pm",  winner: "" },
  { week: 4, gameId: "4-16", away: "ATL", home: "NO",  date: "Mon Oct 5",  kickoff: "5:15pm",  winner: "" },

  { week: 5, gameId: "5-1",  away: "TB",  home: "DAL", date: "Thu Oct 8",  kickoff: "5:15pm",  winner: "" },
  { week: 5, gameId: "5-2",  away: "PHI", home: "JAX", date: "Sun Oct 11", kickoff: "6:30am",  winner: "" },
  { week: 5, gameId: "5-3",  away: "HOU", home: "TEN", date: "Sun Oct 11", kickoff: "10:00am", winner: "" },
  { week: 5, gameId: "5-4",  away: "CIN", home: "MIA", date: "Sun Oct 11", kickoff: "10:00am", winner: "" },
  { week: 5, gameId: "5-5",  away: "LV",  home: "NE",  date: "Sun Oct 11", kickoff: "10:00am", winner: "" },
  { week: 5, gameId: "5-6",  away: "MIN", home: "NO",  date: "Sun Oct 11", kickoff: "10:00am", winner: "" },
  { week: 5, gameId: "5-7",  away: "CLE", home: "NYJ", date: "Sun Oct 11", kickoff: "10:00am", winner: "" },
  { week: 5, gameId: "5-8",  away: "IND", home: "PIT", date: "Sun Oct 11", kickoff: "10:00am", winner: "" },
  { week: 5, gameId: "5-9",  away: "NYG", home: "WAS", date: "Sun Oct 11", kickoff: "10:00am", winner: "" },
  { week: 5, gameId: "5-10", away: "DEN", home: "LAC", date: "Sun Oct 11", kickoff: "1:05pm",  winner: "" },
  { week: 5, gameId: "5-11", away: "CHI", home: "GB",  date: "Sun Oct 11", kickoff: "1:25pm",  winner: "" },
  { week: 5, gameId: "5-12", away: "DET", home: "ARI", date: "Sun Oct 11", kickoff: "1:25pm",  winner: "" },
  { week: 5, gameId: "5-13", away: "SF",  home: "SEA", date: "Sun Oct 11", kickoff: "1:25pm",  winner: "" },
  { week: 5, gameId: "5-14", away: "BAL", home: "ATL", date: "Sun Oct 11", kickoff: "5:20pm",  winner: "" },
  { week: 5, gameId: "5-15", away: "BUF", home: "LAR", date: "Mon Oct 12", kickoff: "5:15pm",  winner: "" },

  { week: 6, gameId: "6-1",  away: "SEA", home: "DEN", date: "Thu Oct 15", kickoff: "5:15pm",  winner: "" },
  { week: 6, gameId: "6-2",  away: "HOU", home: "JAX", date: "Sun Oct 18", kickoff: "6:30am",  winner: "" },
  { week: 6, gameId: "6-3",  away: "CHI", home: "ATL", date: "Sun Oct 18", kickoff: "10:00am", winner: "" },
  { week: 6, gameId: "6-4",  away: "BAL", home: "CLE", date: "Sun Oct 18", kickoff: "10:00am", winner: "" },
  { week: 6, gameId: "6-5",  away: "TEN", home: "IND", date: "Sun Oct 18", kickoff: "10:00am", winner: "" },
  { week: 6, gameId: "6-6",  away: "NYJ", home: "NE",  date: "Sun Oct 18", kickoff: "10:00am", winner: "" },
  { week: 6, gameId: "6-7",  away: "NO",  home: "NYG", date: "Sun Oct 18", kickoff: "10:00am", winner: "" },
  { week: 6, gameId: "6-8",  away: "CAR", home: "PHI", date: "Sun Oct 18", kickoff: "10:00am", winner: "" },
  { week: 6, gameId: "6-9",  away: "PIT", home: "TB",  date: "Sun Oct 18", kickoff: "10:00am", winner: "" },
  { week: 6, gameId: "6-10", away: "ARI", home: "LAR", date: "Sun Oct 18", kickoff: "1:05pm",  winner: "" },
  { week: 6, gameId: "6-11", away: "LAC", home: "KC",  date: "Sun Oct 18", kickoff: "1:25pm",  winner: "" },
  { week: 6, gameId: "6-12", away: "BUF", home: "LV",  date: "Sun Oct 18", kickoff: "1:25pm",  winner: "" },
  { week: 6, gameId: "6-13", away: "DAL", home: "GB",  date: "Sun Oct 18", kickoff: "5:20pm",  winner: "" },
  { week: 6, gameId: "6-14", away: "WAS", home: "SF",  date: "Mon Oct 19", kickoff: "5:15pm",  winner: "" },

  { week: 7, gameId: "7-1",  away: "NE",  home: "CHI", date: "Thu Oct 22", kickoff: "5:15pm",  winner: "" },
  { week: 7, gameId: "7-2",  away: "PIT", home: "NO",  date: "Sun Oct 25", kickoff: "6:30am",  winner: "" },
  { week: 7, gameId: "7-3",  away: "SF",  home: "ATL", date: "Sun Oct 25", kickoff: "10:00am", winner: "" },
  { week: 7, gameId: "7-4",  away: "CLE", home: "TEN", date: "Sun Oct 25", kickoff: "10:00am", winner: "" },
  { week: 7, gameId: "7-5",  away: "IND", home: "MIN", date: "Sun Oct 25", kickoff: "10:00am", winner: "" },
  { week: 7, gameId: "7-6",  away: "MIA", home: "NYJ", date: "Sun Oct 25", kickoff: "10:00am", winner: "" },
  { week: 7, gameId: "7-7",  away: "TB",  home: "CAR", date: "Sun Oct 25", kickoff: "10:00am", winner: "" },
  { week: 7, gameId: "7-8",  away: "CIN", home: "BAL", date: "Sun Oct 25", kickoff: "10:00am", winner: "" },
  { week: 7, gameId: "7-9",  away: "NYG", home: "HOU", date: "Sun Oct 25", kickoff: "10:00am", winner: "" },
  { week: 7, gameId: "7-10", away: "DEN", home: "ARI", date: "Sun Oct 25", kickoff: "1:05pm",  winner: "" },
  { week: 7, gameId: "7-11", away: "GB",  home: "DET", date: "Sun Oct 25", kickoff: "1:25pm",  winner: "" },
  { week: 7, gameId: "7-12", away: "LAR", home: "LV",  date: "Sun Oct 25", kickoff: "1:25pm",  winner: "" },
  { week: 7, gameId: "7-13", away: "KC",  home: "SEA", date: "Sun Oct 25", kickoff: "5:20pm",  winner: "" },
  { week: 7, gameId: "7-14", away: "DAL", home: "PHI", date: "Mon Oct 26", kickoff: "5:15pm",  winner: "" },

  { week: 8, gameId: "8-1",  away: "CAR", home: "GB",  date: "Thu Oct 29", kickoff: "5:15pm",  winner: "" },
  { week: 8, gameId: "8-2",  away: "BAL", home: "BUF", date: "Sun Nov 1",  kickoff: "10:00am", winner: "" },
  { week: 8, gameId: "8-3",  away: "TEN", home: "CIN", date: "Sun Nov 1",  kickoff: "10:00am", winner: "" },
  { week: 8, gameId: "8-4",  away: "ARI", home: "DAL", date: "Sun Nov 1",  kickoff: "10:00am", winner: "" },
  { week: 8, gameId: "8-5",  away: "MIN", home: "DET", date: "Sun Nov 1",  kickoff: "10:00am", winner: "" },
  { week: 8, gameId: "8-6",  away: "LV",  home: "NYJ", date: "Sun Nov 1",  kickoff: "10:00am", winner: "" },
  { week: 8, gameId: "8-7",  away: "CLE", home: "PIT", date: "Sun Nov 1",  kickoff: "10:00am", winner: "" },
  { week: 8, gameId: "8-8",  away: "ATL", home: "TB",  date: "Sun Nov 1",  kickoff: "10:00am", winner: "" },
  { week: 8, gameId: "8-9",  away: "IND", home: "JAX", date: "Sun Nov 1",  kickoff: "10:00am", winner: "" },
  { week: 8, gameId: "8-10", away: "LAC", home: "LAR", date: "Sun Nov 1",  kickoff: "1:05pm",  winner: "" },
  { week: 8, gameId: "8-11", away: "KC",  home: "DEN", date: "Sun Nov 1",  kickoff: "1:25pm",  winner: "" },
  { week: 8, gameId: "8-12", away: "NE",  home: "MIA", date: "Sun Nov 1",  kickoff: "1:25pm",  winner: "" },
  { week: 8, gameId: "8-13", away: "PHI", home: "WAS", date: "Sun Nov 1",  kickoff: "5:20pm",  winner: "" },
  { week: 8, gameId: "8-14", away: "CHI", home: "SEA", date: "Mon Nov 2",  kickoff: "5:15pm",  winner: "" },

  { week: 9, gameId: "9-1",  away: "JAX", home: "BAL", date: "Thu Nov 5",  kickoff: "5:15pm",  winner: "" },
  { week: 9, gameId: "9-2",  away: "CIN", home: "ATL", date: "Sun Nov 8",  kickoff: "6:30am",  winner: "" },
  { week: 9, gameId: "9-3",  away: "DAL", home: "IND", date: "Sun Nov 8",  kickoff: "10:00am", winner: "" },
  { week: 9, gameId: "9-4",  away: "NYJ", home: "KC",  date: "Sun Nov 8",  kickoff: "10:00am", winner: "" },
  { week: 9, gameId: "9-5",  away: "DET", home: "MIA", date: "Sun Nov 8",  kickoff: "10:00am", winner: "" },
  { week: 9, gameId: "9-6",  away: "CLE", home: "NO",  date: "Sun Nov 8",  kickoff: "10:00am", winner: "" },
  { week: 9, gameId: "9-7",  away: "NYG", home: "PHI", date: "Sun Nov 8",  kickoff: "10:00am", winner: "" },
  { week: 9, gameId: "9-8",  away: "LAR", home: "WAS", date: "Sun Nov 8",  kickoff: "10:00am", winner: "" },
  { week: 9, gameId: "9-9",  away: "DEN", home: "CAR", date: "Sun Nov 8",  kickoff: "10:00am", winner: "" },
  { week: 9, gameId: "9-10", away: "HOU", home: "LAC", date: "Sun Nov 8",  kickoff: "1:05pm",  winner: "" },
  { week: 9, gameId: "9-11", away: "LV",  home: "SF",  date: "Sun Nov 8",  kickoff: "1:05pm",  winner: "" },
  { week: 9, gameId: "9-12", away: "GB",  home: "NE",  date: "Sun Nov 8",  kickoff: "1:25pm",  winner: "" },
  { week: 9, gameId: "9-13", away: "ARI", home: "SEA", date: "Sun Nov 8",  kickoff: "1:25pm",  winner: "" },
  { week: 9, gameId: "9-14", away: "TB",  home: "CHI", date: "Sun Nov 8",  kickoff: "5:20pm",  winner: "" },
  { week: 9, gameId: "9-15", away: "BUF", home: "MIN", date: "Mon Nov 9",  kickoff: "5:15pm",  winner: "" },

  { week: 10, gameId: "10-1",  away: "WAS", home: "NYG", date: "Thu Nov 12", kickoff: "5:15pm",  winner: "" },
  { week: 10, gameId: "10-2",  away: "NE",  home: "DET", date: "Sun Nov 15", kickoff: "6:30am",  winner: "" },
  { week: 10, gameId: "10-3",  away: "KC",  home: "ATL", date: "Sun Nov 15", kickoff: "10:00am", winner: "" },
  { week: 10, gameId: "10-4",  away: "HOU", home: "CLE", date: "Sun Nov 15", kickoff: "10:00am", winner: "" },
  { week: 10, gameId: "10-5",  away: "MIN", home: "GB",  date: "Sun Nov 15", kickoff: "10:00am", winner: "" },
  { week: 10, gameId: "10-6",  away: "JAX", home: "TEN", date: "Sun Nov 15", kickoff: "10:00am", winner: "" },
  { week: 10, gameId: "10-7",  away: "MIA", home: "IND", date: "Sun Nov 15", kickoff: "10:00am", winner: "" },
  { week: 10, gameId: "10-8",  away: "CAR", home: "NO",  date: "Sun Nov 15", kickoff: "10:00am", winner: "" },
  { week: 10, gameId: "10-9",  away: "BUF", home: "NYJ", date: "Sun Nov 15", kickoff: "10:00am", winner: "" },
  { week: 10, gameId: "10-10", away: "SEA", home: "LV",  date: "Sun Nov 15", kickoff: "1:05pm",  winner: "" },
  { week: 10, gameId: "10-11", away: "LAR", home: "ARI", date: "Sun Nov 15", kickoff: "1:05pm",  winner: "" },
  { week: 10, gameId: "10-12", away: "SF",  home: "DAL", date: "Sun Nov 15", kickoff: "1:25pm",  winner: "" },
  { week: 10, gameId: "10-13", away: "PIT", home: "CIN", date: "Sun Nov 15", kickoff: "5:20pm",  winner: "" },
  { week: 10, gameId: "10-14", away: "LAC", home: "BAL", date: "Mon Nov 16", kickoff: "5:15pm",  winner: "" },

  { week: 11, gameId: "11-1",  away: "IND", home: "HOU", date: "Thu Nov 19", kickoff: "5:15pm",  winner: "" },
  { week: 11, gameId: "11-2",  away: "MIA", home: "BUF", date: "Sun Nov 22", kickoff: "10:00am", winner: "" },
  { week: 11, gameId: "11-3",  away: "NO",  home: "CHI", date: "Sun Nov 22", kickoff: "10:00am", winner: "" },
  { week: 11, gameId: "11-4",  away: "TEN", home: "DAL", date: "Sun Nov 22", kickoff: "10:00am", winner: "" },
  { week: 11, gameId: "11-5",  away: "TB",  home: "DET", date: "Sun Nov 22", kickoff: "10:00am", winner: "" },
  { week: 11, gameId: "11-6",  away: "ARI", home: "KC",  date: "Sun Nov 22", kickoff: "10:00am", winner: "" },
  { week: 11, gameId: "11-7",  away: "JAX", home: "NYG", date: "Sun Nov 22", kickoff: "10:00am", winner: "" },
  { week: 11, gameId: "11-8",  away: "BAL", home: "CAR", date: "Sun Nov 22", kickoff: "10:00am", winner: "" },
  { week: 11, gameId: "11-9",  away: "NYJ", home: "LAC", date: "Sun Nov 22", kickoff: "1:05pm",  winner: "" },
  { week: 11, gameId: "11-10", away: "LV",  home: "DEN", date: "Sun Nov 22", kickoff: "1:25pm",  winner: "" },
  { week: 11, gameId: "11-11", away: "PIT", home: "PHI", date: "Sun Nov 22", kickoff: "1:25pm",  winner: "" },
  { week: 11, gameId: "11-12", away: "MIN", home: "SF",  date: "Sun Nov 22", kickoff: "5:20pm",  winner: "" },
  { week: 11, gameId: "11-13", away: "CIN", home: "WAS", date: "Mon Nov 23", kickoff: "5:15pm",  winner: "" },

  { week: 12, gameId: "12-1",  away: "GB",  home: "LAR", date: "Wed Nov 25", kickoff: "5:00pm",  winner: "" },
  { week: 12, gameId: "12-2",  away: "CHI", home: "DET", date: "Thu Nov 26", kickoff: "10:00am", winner: "" },
  { week: 12, gameId: "12-3",  away: "PHI", home: "DAL", date: "Thu Nov 26", kickoff: "1:30pm",  winner: "" },
  { week: 12, gameId: "12-4",  away: "KC",  home: "BUF", date: "Thu Nov 26", kickoff: "5:20pm",  winner: "" },
  { week: 12, gameId: "12-5",  away: "DEN", home: "PIT", date: "Fri Nov 27", kickoff: "12:00pm", winner: "" },
  { week: 12, gameId: "12-6",  away: "NO",  home: "CIN", date: "Sun Nov 29", kickoff: "10:00am", winner: "" },
  { week: 12, gameId: "12-7",  away: "LV",  home: "CLE", date: "Sun Nov 29", kickoff: "10:00am", winner: "" },
  { week: 12, gameId: "12-8",  away: "NYG", home: "IND", date: "Sun Nov 29", kickoff: "10:00am", winner: "" },
  { week: 12, gameId: "12-9",  away: "NYJ", home: "MIA", date: "Sun Nov 29", kickoff: "10:00am", winner: "" },
  { week: 12, gameId: "12-10", away: "ATL", home: "MIN", date: "Sun Nov 29", kickoff: "10:00am", winner: "" },
  { week: 12, gameId: "12-11", away: "BAL", home: "HOU", date: "Sun Nov 29", kickoff: "10:00am", winner: "" },
  { week: 12, gameId: "12-12", away: "TEN", home: "JAX", date: "Sun Nov 29", kickoff: "1:05pm",  winner: "" },
  { week: 12, gameId: "12-13", away: "WAS", home: "ARI", date: "Sun Nov 29", kickoff: "1:25pm",  winner: "" },
  { week: 12, gameId: "12-14", away: "SEA", home: "SF",  date: "Sun Nov 29", kickoff: "1:25pm",  winner: "" },
  { week: 12, gameId: "12-15", away: "NE",  home: "LAC", date: "Sun Nov 29", kickoff: "5:20pm",  winner: "" },
  { week: 12, gameId: "12-16", away: "CAR", home: "TB",  date: "Mon Nov 30", kickoff: "5:15pm",  winner: "" },

  { week: 13, gameId: "13-1",  away: "KC",  home: "LAR", date: "Thu Dec 3",  kickoff: "5:15pm",  winner: "" },
  { week: 13, gameId: "13-2",  away: "DET", home: "ATL", date: "Sun Dec 6",  kickoff: "10:00am", winner: "" },
  { week: 13, gameId: "13-3",  away: "JAX", home: "CHI", date: "Sun Dec 6",  kickoff: "10:00am", winner: "" },
  { week: 13, gameId: "13-4",  away: "CIN", home: "CLE", date: "Sun Dec 6",  kickoff: "10:00am", winner: "" },
  { week: 13, gameId: "13-5",  away: "WAS", home: "TEN", date: "Sun Dec 6",  kickoff: "10:00am", winner: "" },
  { week: 13, gameId: "13-6",  away: "GB",  home: "NO",  date: "Sun Dec 6",  kickoff: "10:00am", winner: "" },
  { week: 13, gameId: "13-7",  away: "SF",  home: "NYG", date: "Sun Dec 6",  kickoff: "10:00am", winner: "" },
  { week: 13, gameId: "13-8",  away: "LAC", home: "TB",  date: "Sun Dec 6",  kickoff: "10:00am", winner: "" },
  { week: 13, gameId: "13-9",  away: "MIA", home: "DEN", date: "Sun Dec 6",  kickoff: "1:05pm",  winner: "" },
  { week: 13, gameId: "13-10", away: "PHI", home: "ARI", date: "Sun Dec 6",  kickoff: "1:05pm",  winner: "" },
  { week: 13, gameId: "13-11", away: "CAR", home: "MIN", date: "Sun Dec 6",  kickoff: "1:25pm",  winner: "" },
  { week: 13, gameId: "13-12", away: "BUF", home: "NE",  date: "Sun Dec 6",  kickoff: "1:25pm",  winner: "" },
  { week: 13, gameId: "13-13", away: "HOU", home: "PIT", date: "Sun Dec 6",  kickoff: "5:20pm",  winner: "" },
  { week: 13, gameId: "13-14", away: "DAL", home: "SEA", date: "Mon Dec 7",  kickoff: "5:15pm",  winner: "" },

  /* Week 14 — confirmed via NFL.com's official 2026 schedule (the earlier
     print-sheet source for this week was mislabeled "2025" and was wrong;
     see the Week 13 block above for how that was caught). Byes: Arizona,
     Dallas — exactly the two teams the cross-check predicted. Kickoff
     times converted from NFL.com's ET listings to PT to match every other
     week's format. */
  { week: 14, gameId: "14-1",  away: "MIN", home: "NE",  date: "Thu Dec 10", kickoff: "5:15pm",  winner: "" },
  { week: 14, gameId: "14-2",  away: "TB",  home: "BAL", date: "Sun Dec 13", kickoff: "10:00am", winner: "" },
  { week: 14, gameId: "14-3",  away: "NO",  home: "CAR", date: "Sun Dec 13", kickoff: "10:00am", winner: "" },
  { week: 14, gameId: "14-4",  away: "ATL", home: "CLE", date: "Sun Dec 13", kickoff: "10:00am", winner: "" },
  { week: 14, gameId: "14-5",  away: "TEN", home: "DET", date: "Sun Dec 13", kickoff: "10:00am", winner: "" },
  { week: 14, gameId: "14-6",  away: "CHI", home: "MIA", date: "Sun Dec 13", kickoff: "10:00am", winner: "" },
  { week: 14, gameId: "14-7",  away: "DEN", home: "NYJ", date: "Sun Dec 13", kickoff: "10:00am", winner: "" },
  { week: 14, gameId: "14-8",  away: "IND", home: "PHI", date: "Sun Dec 13", kickoff: "10:00am", winner: "" },
  { week: 14, gameId: "14-9",  away: "HOU", home: "WAS", date: "Sun Dec 13", kickoff: "10:00am", winner: "" },
  { week: 14, gameId: "14-10", away: "LAC", home: "LV",  date: "Sun Dec 13", kickoff: "1:05pm",  winner: "" },
  { week: 14, gameId: "14-11", away: "KC",  home: "CIN", date: "Sun Dec 13", kickoff: "1:25pm",  winner: "" },
  { week: 14, gameId: "14-12", away: "NYG", home: "SEA", date: "Sun Dec 13", kickoff: "1:25pm",  winner: "" },
  { week: 14, gameId: "14-13", away: "LAR", home: "SF",  date: "Sun Dec 13", kickoff: "1:25pm",  winner: "" },
  { week: 14, gameId: "14-14", away: "BUF", home: "GB",  date: "Sun Dec 13", kickoff: "5:20pm",  winner: "" },
  { week: 14, gameId: "14-15", away: "PIT", home: "JAX", date: "Mon Dec 14", kickoff: "5:15pm",  winner: "" },

  { week: 15, gameId: "15-1",  away: "SF",  home: "LAC", date: "Thu Dec 17", kickoff: "5:15pm",  winner: "" },
  { week: 15, gameId: "15-2",  away: "SEA", home: "PHI", date: "Sat Dec 19", kickoff: "2:00pm",  winner: "" },
  { week: 15, gameId: "15-3",  away: "CHI", home: "BUF", date: "Sat Dec 19", kickoff: "5:20pm",  winner: "" },
  { week: 15, gameId: "15-4",  away: "MIA", home: "GB",  date: "Sun Dec 20", kickoff: "10:00am", winner: "" },
  { week: 15, gameId: "15-5",  away: "IND", home: "TEN", date: "Sun Dec 20", kickoff: "10:00am", winner: "" },
  { week: 15, gameId: "15-6",  away: "CLE", home: "NYG", date: "Sun Dec 20", kickoff: "10:00am", winner: "" },
  { week: 15, gameId: "15-7",  away: "BAL", home: "PIT", date: "Sun Dec 20", kickoff: "10:00am", winner: "" },
  { week: 15, gameId: "15-8",  away: "NO",  home: "TB",  date: "Sun Dec 20", kickoff: "10:00am", winner: "" },
  { week: 15, gameId: "15-9",  away: "ATL", home: "WAS", date: "Sun Dec 20", kickoff: "10:00am", winner: "" },
  { week: 15, gameId: "15-10", away: "CIN", home: "CAR", date: "Sun Dec 20", kickoff: "10:00am", winner: "" },
  { week: 15, gameId: "15-11", away: "JAX", home: "HOU", date: "Sun Dec 20", kickoff: "10:00am", winner: "" },
  { week: 15, gameId: "15-12", away: "NYJ", home: "ARI", date: "Sun Dec 20", kickoff: "1:05pm",  winner: "" },
  { week: 15, gameId: "15-13", away: "DEN", home: "LV",  date: "Sun Dec 20", kickoff: "1:25pm",  winner: "" },
  { week: 15, gameId: "15-14", away: "DAL", home: "LAR", date: "Sun Dec 20", kickoff: "1:25pm",  winner: "" },
  { week: 15, gameId: "15-15", away: "DET", home: "MIN", date: "Sun Dec 20", kickoff: "5:20pm",  winner: "" },
  { week: 15, gameId: "15-16", away: "NE",  home: "KC",  date: "Mon Dec 21", kickoff: "5:15pm",  winner: "" },

  { week: 16, gameId: "16-1",  away: "HOU", home: "PHI", date: "Thu Dec 24", kickoff: "5:15pm",  winner: "" },
  { week: 16, gameId: "16-2",  away: "GB",  home: "CHI", date: "Sat Dec 25", kickoff: "10:00am", winner: "" },
  { week: 16, gameId: "16-3",  away: "BUF", home: "DEN", date: "Sat Dec 25", kickoff: "1:30pm",  winner: "" },
  { week: 16, gameId: "16-4",  away: "LAR", home: "SEA", date: "Sat Dec 25", kickoff: "5:15pm",  winner: "" },
  { week: 16, gameId: "16-5",  away: "TB",  home: "ATL", date: "Sun Dec 27", kickoff: "TBD",     winner: "" },
  { week: 16, gameId: "16-6",  away: "CIN", home: "IND", date: "Sun Dec 27", kickoff: "TBD",     winner: "" },
  { week: 16, gameId: "16-7",  away: "WAS", home: "MIN", date: "Sun Dec 27", kickoff: "TBD",     winner: "" },
  { week: 16, gameId: "16-8",  away: "CAR", home: "PIT", date: "Sun Dec 27", kickoff: "TBD",     winner: "" },
  { week: 16, gameId: "16-9",  away: "LAC", home: "MIA", date: "Sun Dec 27", kickoff: "10:00am", winner: "" },
  { week: 16, gameId: "16-10", away: "ARI", home: "NO",  date: "Sun Dec 27", kickoff: "10:00am", winner: "" },
  { week: 16, gameId: "16-11", away: "NE",  home: "NYJ", date: "Sun Dec 27", kickoff: "10:00am", winner: "" },
  { week: 16, gameId: "16-12", away: "CLE", home: "BAL", date: "Sun Dec 27", kickoff: "1:05pm",  winner: "" },
  { week: 16, gameId: "16-13", away: "TEN", home: "LV",  date: "Sun Dec 27", kickoff: "1:05pm",  winner: "" },
  { week: 16, gameId: "16-14", away: "SF",  home: "KC",  date: "Sun Dec 27", kickoff: "1:25pm",  winner: "" },
  { week: 16, gameId: "16-15", away: "JAX", home: "DAL", date: "Sun Dec 27", kickoff: "5:20pm",  winner: "" },
  { week: 16, gameId: "16-16", away: "NYG", home: "DET", date: "Mon Dec 28", kickoff: "5:15pm",  winner: "" },

  { week: 17, gameId: "17-1",  away: "BAL", home: "CIN", date: "Thu Dec 31", kickoff: "5:15pm",  winner: "" },
  { week: 17, gameId: "17-2",  away: "DEN", home: "NE",  date: "Sun Jan 3",  kickoff: "TBD",     winner: "" },
  { week: 17, gameId: "17-3",  away: "KC",  home: "LAC", date: "Sun Jan 3",  kickoff: "TBD",     winner: "" },
  { week: 17, gameId: "17-4",  away: "LAR", home: "TB",  date: "Sun Jan 3",  kickoff: "TBD",     winner: "" },
  { week: 17, gameId: "17-5",  away: "WAS", home: "JAX", date: "Sun Jan 3",  kickoff: "TBD",     winner: "" },
  { week: 17, gameId: "17-6",  away: "NO",  home: "ATL", date: "Sun Jan 3",  kickoff: "10:00am", winner: "" },
  { week: 17, gameId: "17-7",  away: "IND", home: "CLE", date: "Sun Jan 3",  kickoff: "10:00am", winner: "" },
  { week: 17, gameId: "17-8",  away: "NYG", home: "DAL", date: "Sun Jan 3",  kickoff: "10:00am", winner: "" },
  { week: 17, gameId: "17-9",  away: "PIT", home: "TEN", date: "Sun Jan 3",  kickoff: "10:00am", winner: "" },
  { week: 17, gameId: "17-10", away: "BUF", home: "MIA", date: "Sun Jan 3",  kickoff: "10:00am", winner: "" },
  { week: 17, gameId: "17-11", away: "MIN", home: "NYJ", date: "Sun Jan 3",  kickoff: "10:00am", winner: "" },
  { week: 17, gameId: "17-12", away: "SEA", home: "CAR", date: "Sun Jan 3",  kickoff: "10:00am", winner: "" },
  { week: 17, gameId: "17-13", away: "LV",  home: "ARI", date: "Sun Jan 3",  kickoff: "1:05pm",  winner: "" },
  { week: 17, gameId: "17-14", away: "DET", home: "CHI", date: "Sun Jan 3",  kickoff: "1:25pm",  winner: "" },
  { week: 17, gameId: "17-15", away: "PHI", home: "SF",  date: "Sun Jan 3",  kickoff: "5:20pm",  winner: "" },
  { week: 17, gameId: "17-16", away: "HOU", home: "GB",  date: "Mon Jan 4",  kickoff: "5:15pm",  winner: "" },

  { week: 18, gameId: "18-1",  away: "NYJ", home: "BUF", date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-2",  away: "CLE", home: "CIN", date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-3",  away: "LAC", home: "DEN", date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-4",  away: "DET", home: "GB",  date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-5",  away: "JAX", home: "IND", date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-6",  away: "LV",  home: "KC",  date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-7",  away: "SEA", home: "LAR", date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-8",  away: "CHI", home: "MIN", date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-9",  away: "MIA", home: "NE",  date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-10", away: "TB",  home: "NO",  date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-11", away: "PHI", home: "NYG", date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-12", away: "SF",  home: "ARI", date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-13", away: "DAL", home: "WAS", date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-14", away: "ATL", home: "CAR", date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-15", away: "PIT", home: "BAL", date: "Sun Jan 10", kickoff: "TBD", winner: "" },
  { week: 18, gameId: "18-16", away: "TEN", home: "HOU", date: "Sun Jan 10", kickoff: "TBD", winner: "" }
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
    "- The person or people left in the pool will win or split the jackpot.",

  howto_text:
    "Full step-by-step tutorial coming soon — for now, here's the short version:\n\n" +
    "- Go to Weekly Submissions, pick your week, and fill out your Pick'em picks and Eliminator pick right on the page\n" +
    "- Pick your name from the dropdown at the top before you start\n" +
    "- Assign each Pick'em pick a confidence point 1-16 — your most confident pick gets the highest number, and each number can only be used once\n" +
    "- Hit Submit My Picks when you're done — no separate form to fill out\n" +
    "- Check Pick'em and Eliminator any time to see how you're doing, and Standings for the full leaderboard"
};

const SAMPLE_ELIMINATOR_PICKS = [
  { player: "Jon",  week: 1, team: "BAL" },
  { player: "Tony", week: 1, team: "LAR" },
  { player: "Sam",  week: 1, team: "HOU" },

  { player: "Jon",  week: 2, team: "DET" },
  { player: "Tony", week: 2, team: "BUF" },
  { player: "Sam",  week: 2, team: "MIA" }
];

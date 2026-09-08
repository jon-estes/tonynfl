/* ============================================================
   VINCE AND DAVE'S POOL — HISTORICAL RECORDS
   ============================================================
   Transcribed from "POOL RECORDS 2026.doc". This is the pool's real,
   permanent history — not sample/demo data — so unlike config.js's
   SAMPLE_* arrays, there's no live-data version of this to fall back
   from. It just lives here as plain data and history.html renders it.

   TO ADD A NEW YEAR AT SEASON'S END:
   1. Add one entry to HISTORY_CHAMPIONS below (most recent year last).
   2. Update any records in HISTORY_RECORDS that got broken, and move
      the old value down into HISTORY_OLD_RECORDS so it stays on the
      books as a retired record instead of disappearing.
   3. Bump counts in HISTORY_ALL_TIME_MONEY / HISTORY_ALL_TIME_HIGH_WEEK
      for anyone who placed or took High Week that year.
   That's it — history.html rebuilds everything from these arrays, no
   other file needs to change.
   ============================================================ */

/* The most recent completed season's payout, exactly as recorded — shown
   as its own callout near the top of the History page. */
const HISTORY_LATEST_PAYOUT = {
  label: "Regular Season Jackpot Payoff",
  year: 2025,
  first: { name: "Pat", amount: 600 },
  second: { name: "Ricky", amount: 300 },
  third: { name: "Wig", amount: 150 },
  highWeek: { name: "Brian", amount: 75 }
};

/* One row per completed season. `first`/`second`/`third` are the money
   finishers; `highWeek` is that season's single best week. (The original
   record book also tracked a "Fourth" place column, but it was NA for
   every single year on record, so it's left out here.) */
const HISTORY_CHAMPIONS = [
  { year: 1989, first: "Roy",      second: "John",     third: "Kurt",    highWeek: "" },
  { year: 1990, first: "Vince",    second: "Ryan",      third: "Miguel",  highWeek: "" },
  { year: 1991, first: "John",     second: "Vince",     third: "Sam",     highWeek: "Dave B. / Jeff" },
  { year: 1992, first: "Tom B.",   second: "John",      third: "Vince",   highWeek: "Tom B." },
  { year: 1993, first: "Tom B.",   second: "John",      third: "Pat",     highWeek: "Sam" },
  { year: 1994, first: "Vince",    second: "Kurt",      third: "Tom C.",  highWeek: "Tom B." },
  { year: 1995, first: "Kurt",     second: "John",      third: "Ryan",    highWeek: "" },
  { year: 1996, first: "John",     second: "Vince",     third: "Dick",    highWeek: "" },
  { year: 1997, first: "Miguel",   second: "Kenny",     third: "Ryan",    highWeek: "Miguel" },
  { year: 1998, first: "Roy",      second: "Manuel",    third: "Kurt",    highWeek: "Edy" },
  { year: 1999, first: "Dick",     second: "Lisa",      third: "Kenny",   highWeek: "David" },
  { year: 2000, first: "Roy",      second: "Lisa",      third: "Dick",    highWeek: "Dick" },
  { year: 2001, first: "Richard",  second: "Dick",      third: "David",   highWeek: "Pat" },
  { year: 2002, first: "Pat",      second: "Vince",     third: "Roy",     highWeek: "Dick" },
  { year: 2003, first: "Wig",      second: "Vince",     third: "Kenny",   highWeek: "Rob" },
  { year: 2004, first: "Richard",  second: "Vince",     third: "Joe",     highWeek: "Vince / David" },
  { year: 2005, first: "Ryan",     second: "Wig",       third: "Roy",     highWeek: "Wig" },
  { year: 2006, first: "Ricky",    second: "Skip",      third: "Ryan",    highWeek: "Dick, Ryan Jr, Ricky, Ryan" },
  { year: 2007, first: "Wig",      second: "Dick",      third: "Tom B.",  highWeek: "Kenny" },
  { year: 2008, first: "Dick",     second: "David",     third: "Wig",     highWeek: "Vince, Kenny, Ricky" },
  { year: 2009, first: "Roy",      second: "Dick",      third: "Brandon", highWeek: "Pat" },
  { year: 2010, first: "Richard",  second: "Roy",       third: "Wig",     highWeek: "Pat" },
  { year: 2011, first: "Ryan",     second: "Ricky",     third: "Wig",     highWeek: "Roy" },
  { year: 2012, first: "David",    second: "Dick",      third: "Ricky",   highWeek: "Roy, Ricky, Pat" },
  { year: 2013, first: "Nathan",   second: "Ryan Jr",   third: "Roy",     highWeek: "Vince" },
  { year: 2014, first: "Pat",      second: "Ron",       third: "Ricky",   highWeek: "Dre" },
  { year: 2015, first: "Dick",     second: "Vince",     third: "Roy",     highWeek: "Richard" },
  { year: 2016, first: "Dick",     second: "David",     third: "Roy",     highWeek: "Dick" },
  { year: 2017, first: "Richard",  second: "David",     third: "Vince",   highWeek: "Wig" },
  { year: 2018, first: "Vince",    second: "Pat",       third: "Richard", highWeek: "Vince" },
  { year: 2019, first: "Jeremiah", second: "Jaxon",     third: "Vince",   highWeek: "Ryan" },
  { year: 2020, first: "Ryan",     second: "Pat",       third: "Wig",     highWeek: "Mike" },
  { year: 2021, first: "Ryan",     second: "Pat",       third: "David",   highWeek: "Ricky" },
  { year: 2022, first: "Wig",      second: "Jaxon",     third: "Kurt",    highWeek: "Kurt" },
  { year: 2023, first: "Pat",      second: "Vince",     third: "Ricky",   highWeek: "Ricky" },
  { year: 2024, first: "David",    second: "Roy",       third: "Vince",   highWeek: "Vince" },
  { year: 2025, first: "Pat",      second: "Ricky",     third: "Wig",     highWeek: "Brian" }
];

/* Current, standing records (post-2002 era — the NFL expanded to a
   17-week schedule in 2021, which is why some records note game counts). */
const HISTORY_RECORDS = [
  {
    title: "Perfect Score",
    value: "136 pts",
    note: "Max possible in a 16-game week",
    holders: ["Mike — 2020 (Week 2, 16 games)", "Vince — 2024 (Week 13, 16 games)"]
  },
  {
    title: "Perfect Week — 15-Game Week",
    value: "135 pts",
    holders: ["Ryan — 2019 (Week 8, 15 games)"]
  },
  {
    title: "Perfect Week — 14-Game Week",
    value: "133 pts",
    holders: ["Vince, Dave, Tim, Wig — 2024 (Week 6, 14 games)"]
  },
  {
    title: "High Week",
    value: "136 pts",
    holders: ["Mike — 2020 (Week 2, 16 games)", "Vince — 2024 (Week 13, 16 games)"]
  },
  {
    title: "High Games Week",
    value: "16 games",
    holders: ["Mike — 2020 (Week 2)", "Vince — 2024 (Week 13)"]
  },
  {
    title: "Low Week",
    value: "21 pts",
    holders: ["Pat — 2015 (Week 10, 14 games)"]
  },
  {
    title: "Low Games Week",
    value: "3 games",
    holders: ["Pat — 2015 (Week 10, 14 games)"]
  },
  {
    title: "Most Games, Season",
    value: "202 games",
    holders: ["Dave — 2024"]
  },
  {
    title: "Most Points, Season",
    value: "1,847 pts",
    holders: ["Dave — 2024"]
  },
  {
    title: "Fewest Games, Season",
    value: "132 games",
    holders: ["Rob — 2002"]
  },
  {
    title: "Fewest Points, Season",
    value: "1,238 pts",
    holders: ["Rob — 2002"]
  },
  {
    title: "Consecutive Weeks in 1st, Season",
    value: "17 weeks",
    holders: ["Ryan — 2005"]
  },
  {
    title: "Consecutive Weeks in 1st, All-Time",
    value: "29 weeks",
    holders: ["Tom B. — 1992–93"]
  },
  {
    title: "Times in the Money",
    value: "14",
    note: "Not including High Week",
    holders: ["Vince"]
  },
  {
    title: "Times in 1st Place",
    value: "4 (tied)",
    holders: [
      "Roy — 1989, 1998, 2000, 2009",
      "Dick — 1999, 2008, 2015, 2016",
      "Richard — 2001, 2004, 2010, 2017",
      "Ryan — 2005, 2011, 2020, 2021"
    ]
  },
  {
    title: "Times in the Pool Without Winning a Dime",
    value: "12",
    note: "...and proud of it!",
    holders: ["David — 1989–2000"]
  },
  {
    title: "Oldest Person to Win First Place",
    value: "95 years young",
    holders: ["Dick — 2016"]
  }
];

/* Records that once stood but have since been broken — kept on the books
   for the history, not deleted. */
const HISTORY_OLD_RECORDS = [
  { title: "High Week", value: "135 pts", holders: ["Vince — 2013 (Week 17, 16 games)"] },
  { title: "High Games Week", value: "15 games", holders: ["Vince — 2013 (Week 17, 16 games)", "Ryan — 2019 (Week 8, 15 games)"] },
  { title: "Perfect Week — 14-Game Week", value: "133 pts", holders: ["Ryan, Dick, Ricky, Ryan Jr. — 2006 (Week 5, 14 games)"] }
];

/* The oldest era on record, before 2002 — kept separate since the pool's
   size and rules were different back then. */
const HISTORY_PRE_2002_RECORDS = [
  { title: "High Week", value: "119 pts", holders: ["Miguel — 1997 (15 games)"] },
  {
    title: "High Games Week",
    value: "14 games",
    holders: ["Miguel — 1997 (Week 11)", "Ryan, Roy, Martin — 1996 (Week 2)", "Pat — 2001 (Week 17)"]
  },
  {
    title: "Low Week",
    value: "21–23 pts",
    holders: [
      "Mike P. — 1992 (Week 5, 11 games) — 21 pts",
      "Zack, Roy, Uncle Joe — 2001 (Week 6, 13 games) — 22 pts",
      "Tom B. — 1994 (Week 17, 14 games) — 22 pts",
      "Pat — 1997 (Week 15, 15 games) — 23 pts"
    ]
  },
  {
    title: "Low Games Week",
    value: "2–3 games",
    holders: [
      "Zack, Uncle Joe — 2001 (Week 6, 13 games) — 2 games",
      "Tom B., Erik T — 1994 (Week 17, 14 games) — 2 games",
      "Pat — 1997 (Week 15, 15 games) — 3 games"
    ]
  },
  { title: "Most Points, Season", value: "1,520 pts", holders: ["Roy — 1998"] },
  { title: "Fewest Games, Season", value: "109 games", holders: ["Eymard — 1999"] },
  { title: "Fewest Points, Season", value: "992 pts", holders: ["Steve B. — 1994"] }
];

/* All-time leaderboard: how many times each player has finished in the
   money (1st/2nd/3rd), most first. */
const HISTORY_ALL_TIME_MONEY = [
  { name: "Vince", count: 14 },
  { name: "Roy", count: 13 },
  { name: "Dick", count: 10 },
  { name: "Wig", count: 9 },
  { name: "Ryan", count: 8 },
  { name: "Pat", count: 8 },
  { name: "David", count: 7 },
  { name: "John", count: 6 },
  { name: "Ricky", count: 6 },
  { name: "Kurt", count: 5 },
  { name: "Richard", count: 5 },
  { name: "Kenny", count: 3 },
  { name: "Tom B.", count: 3 },
  { name: "Jaxon", count: 2 },
  { name: "Lisa", count: 2 },
  { name: "Miguel", count: 2 },
  { name: "Bob", count: 1 },
  { name: "Brandon", count: 1 },
  { name: "Jeremiah", count: 1 },
  { name: "Joe", count: 1 },
  { name: "Manuel", count: 1 },
  { name: "Nathan", count: 1 },
  { name: "Ron", count: 1 },
  { name: "Ryan Jr", count: 1 },
  { name: "Sam", count: 1 },
  { name: "Skip", count: 1 },
  { name: "Tom C.", count: 1 }
];

/* All-time leaderboard: how many times each player has taken High Week. */
const HISTORY_ALL_TIME_HIGH_WEEK = [
  { name: "Ricky", count: 5 },
  { name: "Vince", count: 5 },
  { name: "Dick", count: 4 },
  { name: "Pat", count: 4 },
  { name: "David", count: 2 },
  { name: "Kenny", count: 2 },
  { name: "Roy", count: 2 },
  { name: "Ryan", count: 2 },
  { name: "Tom B.", count: 2 },
  { name: "Wig", count: 2 },
  { name: "Dave B.", count: 1 },
  { name: "Dre", count: 1 },
  { name: "Edy", count: 1 },
  { name: "Jeff", count: 1 },
  { name: "Kurt", count: 1 },
  { name: "Miguel", count: 1 },
  { name: "Mike", count: 1 },
  { name: "Richard", count: 1 },
  { name: "Rob", count: 1 },
  { name: "Ryan Jr", count: 1 },
  { name: "Sam", count: 1 },
  { name: "Brian", count: 1 }
];

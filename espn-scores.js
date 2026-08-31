/* ============================================================
   ESPN SCORES RELAY
   ============================================================
   Why this exists: Google Apps Script's outbound requests get blocked
   with a 403 "Access Denied" by ESPN's CDN (Akamai blocks Google Cloud's
   shared IP ranges wholesale). Requests from here — Netlify's servers —
   are not Google's IPs, so this small function fetches ESPN's public
   scoreboard JSON on Apps Script's behalf and hands it back unchanged.

   Apps Script's fetchEspnWeekResults() calls this instead of calling
   ESPN directly.

   Usage: /.netlify/functions/espn-scores?week=1&year=2025
   ============================================================ */

exports.handler = async (event) => {
  const week = event.queryStringParameters && event.queryStringParameters.week;
  const year = event.queryStringParameters && event.queryStringParameters.year;

  if (!week || !year) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing week or year query parameter" })
    };
  }

  const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=2&week=${encodeURIComponent(week)}&dates=${encodeURIComponent(year)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://www.espn.com/nfl/schedule"
      }
    });

    const text = await res.text();

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `ESPN returned HTTP ${res.status}`,
          preview: text.slice(0, 300)
        })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: String(err) })
    };
  }
};

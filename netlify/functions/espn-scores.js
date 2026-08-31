/* ============================================================
   ESPN SCORES RELAY
   ============================================================
   Why this exists: ESPN's main API subdomain (site.api.espn.com) blocks
   requests from cloud/datacenter IP ranges wholesale (a generic Akamai
   bot-protection rule) — confirmed to block both Google Apps Script's
   servers AND Netlify's, with a 403 "Access Denied" either way.

   Workaround: ESPN's own website loads its scoreboard from a DIFFERENT
   subdomain (cdn.espn.com/core/...) which is not behind that same
   blanket block, so this relay calls that endpoint instead. The game
   data is nested one level deeper in the response (content.sbData.events
   instead of a top-level events array) but is otherwise the same shape.

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

  const url = `https://cdn.espn.com/core/nfl/scoreboard?xhr=1&year=${encodeURIComponent(year)}&week=${encodeURIComponent(week)}&seasontype=2`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://www.espn.com/nfl/scoreboard"
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

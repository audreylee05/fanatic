# Fanatic league research spec

Fanatic is a sports watch-schedule prototype. Its data lives in `../data.js` (read it first to see the existing formats and IDs). You are adding **new leagues** with **real** data. Real-world today is **2026-09-28**. The prototype's "now" is **Thu 2026-09-24, 8:40 PM ET**. The data window is **Sep 17 – Sep 30, 2026**.

## Hard rules
- **Only real, verified data.** Use WebSearch / WebFetch (ESPN site API, league sites, Wikipedia, official schedules). Never invent a team, fixture, time, network or score. If you can't verify something, leave it out. If a league has no verifiable games in the window, give it an `offweek` note with a true fact (e.g. "Season opens Nov 21") and no games.
- **Times and dates in US Eastern (EDT, UTC-4).** Convert from UTC or local time. Asian and Australian games often fall on the *previous* ET date. Use 24h `'HH:MM'`, or `null` if unknown.
- **Scores:** include `{ score: [away, home] }` ONLY for games that finished before the prototype clock. That means date < 2026-09-24, or on 2026-09-24 with start + game length ≤ 20:40 ET. Games on/after that point get **no score**, even though the real result is now known. Soccer draws are fine (`[1, 1]`). Soccer/rugby/cricket still use the `[away, home]` order.
- **Networks = the US TV/stream outlet**, as exact strings. Use one of: `ESPN`, `ESPN2`, `ESPNU`, `ESPNEWS`, `ABC`, `ESPN/ABC`, `ESPN+`, `ESPN Unlimited`, `ESPN Deportes`, `SEC Network`, `ACC Network`, `FOX`, `FS1`, `FS2`, `CBS`, `CBSSN`, `Paramount+`, `NBC`, `USA Network`, `Peacock`, `Prime Video`, `Apple TV`, `TNT`, `truTV`, `Max`, `TBS`, `Tennis Channel`, `Golf Channel`, `Willow`, `NBA TV`, `NHL Network`, `MLB.TV`, `FloSports`, `DAZN`, `YouTube`, `Local TV`, `TBD`. If you need another, add it and list it under NETWORKS_ADDED. (ESPN's streaming service is branded "ESPN Unlimited" in 2026. ESPN+ still exists as the cheaper tier. Pick whichever the source says.)
- **Team abbreviations:** 2–5 uppercase letters, unique within the league. Team colors are the real primary hex.
- **Volume caps**, to keep it usable:
  - A league with a round every week (soccer): include every match in the window, max ~40 rows per league.
  - Big slates (MLS, NPB, KBO): include every game Sep 24–30, plus a curated ~8 notable results from Sep 17–23.
  - UEFA Champions League: every match in the window, if a matchday falls in it.
- Don't touch `../data.js` or any other file. Write ONLY your own output file in this folder.

## Output file format
Write plain text with these exact section headers. Each section is a JS fragment I paste into data.js as-is: trailing commas, single quotes, no `const`.

```
// === LEAGUES
{ id: 'epl', sport: 'soccer', name: 'Premier League', short: 'EPL', color: '#3D195B', espn: false, popular: true },
{ id: 'pwhl', sport: 'hockey', name: 'PWHL', short: 'PWHL', color: '#2E1A47', espn: false, offweek: 'Season opens Nov 21' },
// individual sports add: kind: 'individual', athletes: 'golfers'
// espn: true (all/most on ESPN networks), 'some' (a portion), false (none)

// === TEAM_ROWS
epl: `ARS|Arsenal|#EF0107;AVL|Aston Villa|#670E36;...`,

// === SHORTNAME
epl: club          // one of: pro (use nickname, e.g. "Argonauts"), college (school), club (full name, " FC" stripped)

// === GAME_LEN
epl: 115,          // minutes from start to final, for live/final status

// === GAME_ROWS
// [league, dateET, timeET|null, awayAbbr, homeAbbr, network, note, extras?]
['epl', '2026-09-19', '07:30', 'CHE', 'ARS', 'USA Network', 'Matchweek 5', { score: [1, 2] }],
['epl', '2026-09-26', '10:00', 'LIV', 'MCI', 'NBC', 'Matchweek 6', { tags: ['marquee'] }],
// tags allowed: playoff, primetime, rivalry, marquee, major, allstar — use sparingly, only when true

// === EVENT_ROWS
// individual sports / tournaments: [league, dateET, timeET|null, eventName, network, note, extras]
['lpga', '2026-09-24', '12:00', 'Walmart NW Arkansas Championship · Round 1', 'Golf Channel', 'Rogers, AR', { field: ['korda', 'thitikul'] }],
// multi-day events: add endDate: 'YYYY-MM-DD' in extras. Finished events: add result: 'Winner: Name (-15)'.
// field = player ids from the PLAYERS section (or existing ids in data.js)

// === PLAYERS
// [id, name, position, 'league-ABBR' team id | null, leagueId (only if no team)]
['saka', 'Bukayo Saka', 'FW', 'epl-ARS'],
['korda', 'Nelly Korda', 'World No. 2', null, 'lpga'],

// === RECORDS
// standings as of the prototype clock (Sep 24 evening), best first. Format "ABBR|record|extra" joined by ";"
// record = W-L or W-L-T (soccer: W-D-L). extra = points for soccer/hockey/rugby, else omit
epl: `LIV|4-0-0|12;ARS|3-1-0|10;...`,

// === NETWORKS_ADDED
// === NOTES
// anything I should know: uncertainties, leagues you left as offweek and why
// === SOURCES
// URLs you used
```

Useful source: ESPN's public scoreboard JSON, e.g.
`https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20260917-20260930&limit=200`
(it has UTC `date`, `competitors` with `homeAway`, `score`, `broadcasts`). Other slugs: `soccer/usa.1`, `soccer/uefa.champions`, `soccer/ger.1`, `soccer/esp.1`, `football/cfl`, `basketball/...`, `golf/lpga`, `golf/eur`, `tennis/atp`, `tennis/wta`, `rugby/...`. Standings: `https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings`. Verify slugs; fall back to league sites and Wikipedia.

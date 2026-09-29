/* Fanatic prototype. Vanilla JS, hash router, state mirrored to localStorage. */

const KEY = 'fanatic.v1';
const TABS = ['schedule', 'library', 'profile'];
const fresh = () => ({
  onboarded: false, espn: false,
  sports: [], leagues: [], teams: [], players: [], channels: [],
  added: [], removed: [],            // manual schedule overrides (game ids)
  saved: [], watched: [], progress: {},
  revealed: [],                      // games and clips whose results were shown in spoiler-free mode
  prefs: { autoAdd: true, espnOnly: false, home: 'mine', group: 'teams', spoilerFree: false, tz: 'auto' },
  open: {},                          // league card open/closed
  recent: [],                        // recent searches
});

/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const team = id => TEAMS[id];
const league = id => LEAGUES.find(l => l.id === id);
const sport = id => SPORTS.find(s => s.id === id);
const player = id => PLAYERS.find(p => p.id === id);
const channel = id => CHANNELS.find(c => c.id === id);
const toggleIn = (arr, v) => { const i = arr.indexOf(v); i >= 0 ? arr.splice(i, 1) : arr.push(v); };
const isEspn = net => ESPN_NETWORKS.includes(net);
const isEvent = g => !!g.event;
const playerLeagues = p => [p.league, ...(p.also || [])].filter(l => league(l));

function textOn(hex) {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#111' : '#fff';
}
function tb(id, size = '') {
  const t = team(id);
  if (!t) return '';
  return `<span class="tb ${size}" style="--c:${t.color};--t:${textOn(t.color)}">${esc(t.abbr)}</span>`;
}
function leagueLogo(l, size = '') {
  return `<span class="league-logo ${size}" style="background:${l.color}">${esc(l.short)}</span>`;
}
function espnBadge(l, long = false) {
  if (!l.espn) return '';
  const all = l.espn === true;
  return `<span class="espn-mini ${all ? '' : 'some'}" title="${all ? 'Streams on ESPN' : 'Some games stream on ESPN'}">${long ? (all ? 'On ESPN' : 'Some on ESPN') : 'ESPN'}</span>`;
}
const listNames = names => names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : /(ch|sh|s|x)$/.test(w) ? 'es' : 's'}`;
function ordinal(n) { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
function initials(name) { return name.split(/\s+/).map(w => w[0]).slice(0, 2).join(''); }
function playerColor(p) { return p.team ? team(p.team).color : (league(p.league)?.color || '#444'); }
function pav(p, size = '') {
  const c = playerColor(p);
  return `<span class="pav ${size}" style="--c:${c};--t:${textOn(c)}">${esc(initials(p.name))}</span>`;
}
function playerSub(p) { return p.team ? `${p.pos} · ${team(p.team).name}` : `${p.pos} · ${league(p.league).name}`; }
function lastName(p) { const parts = p.name.split(' '); return parts.length > 1 && /^(Jr\.|Sr\.|II|III)$/.test(parts.at(-1)) ? parts.at(-2) : parts.at(-1); }

/* ---------- time: logic runs on ET, display follows the viewer's zone ---------- */
const ET_OFFSET = '-04:00'; // Sep 17–30, 2026 is entirely Eastern Daylight Time
const TZ_CHOICES = [['auto', 'Automatic'], ['America/New_York', 'Eastern'], ['America/Chicago', 'Central'], ['America/Denver', 'Mountain'],
  ['America/Los_Angeles', 'Pacific'], ['Pacific/Honolulu', 'Hawaii'], ['Europe/London', 'London'], ['Australia/Sydney', 'Sydney']];
function detectedTz() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'; } catch { return 'America/New_York'; } }
function TZ() { const t = S.prefs.tz; return t && t !== 'auto' ? t : detectedTz(); }
const fmtCache = {};
function fmtr(key, opts) {
  const tz = TZ(), k = key + '|' + tz;
  if (!fmtCache[k]) {
    try { fmtCache[k] = new Intl.DateTimeFormat('en-US', { ...opts, timeZone: tz }); }
    catch { fmtCache[k] = new Intl.DateTimeFormat('en-US', { ...opts, timeZone: 'America/New_York' }); }
  }
  return fmtCache[k];
}
function ymd(d) {
  const p = fmtr('ymd', { year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(d);
  const v = t => p.find(x => x.type === t).value;
  return `${v('year')}-${v('month')}-${v('day')}`;
}
function instant(g) { return g.time ? new Date(`${g.date}T${g.time}:00${ET_OFFSET}`) : null; }
function localDate(g) { const i = instant(g); return i ? ymd(i) : g.date; }
function localToday() { return ymd(PROTO_NOW); }
function localHour(d) { return +fmtr('h23', { hour: 'numeric', hourCycle: 'h23' }).formatToParts(d).find(x => x.type === 'hour').value; }
function fmtTime(g) { const i = instant(g); return i ? fmtr('hm', { hour: 'numeric', minute: '2-digit' }).format(i) : 'TBD'; }
function tzAbbr(d) {
  const p = fmtr('tzn', { hour: 'numeric', timeZoneName: 'short' }).formatToParts(d).find(x => x.type === 'timeZoneName');
  return p ? p.value : '';
}
function clockNow() { return fmtr('clk', { hour: 'numeric', minute: '2-digit' }).format(PROTO_NOW).replace(/\s?[AP]M$/i, ''); }
function dateBounds() { const ds = GAMES.map(localDate).sort(); return [ds[0], ds[ds.length - 1]]; }

// Plain calendar dates ('YYYY-MM-DD') are formatted in UTC so they never shift a day.
function dateObj(d) { return new Date(d + 'T12:00:00Z'); }
function shiftDate(d, n) { const o = dateObj(d); o.setUTCDate(o.getUTCDate() + n); return o.toISOString().slice(0, 10); }
function shortDate(d) { return dateObj(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }); }
function weekday(d, long = false) { return dateObj(d).toLocaleDateString('en-US', { weekday: long ? 'long' : 'short', timeZone: 'UTC' }); }
function monthDay(d) { return dateObj(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }); }
function dayLabel(d) {
  const t = localToday();
  if (d === t) return 'Today';
  if (d === shiftDate(t, 1)) return 'Tomorrow';
  if (d === shiftDate(t, -1)) return 'Yesterday';
  return shortDate(d);
}

const NOW_MIN = 20 * 60 + 40; // prototype clock in ET minutes (8:40 PM), independent of viewer timezone
const GAME_LEN = { nfl: 200, cfb: 210, nhl: 160, mlb: 180, wnba: 120 };
function gameLen(g) { return LEAGUE_LEN[g.league] || GAME_LEN[g.league] || 180; }
function status(g) {
  if (g.score || g.date < TODAY) return 'final';
  if (g.endDate && g.date <= TODAY && TODAY <= g.endDate) return g.date === TODAY && g.time && NOW_MIN < toMin(g.time) ? 'upcoming' : 'live';
  if (g.date > TODAY || !g.time) return 'upcoming';
  const start = toMin(g.time);
  if (NOW_MIN < start) return 'upcoming';
  return NOW_MIN < start + gameLen(g) ? 'live' : 'final';
}
function toMin(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }

/* ---------- spoiler-free mode ---------- */
const spoilerOn = () => !!S.prefs.spoilerFree;
function revealed(g) { return !spoilerOn() || S.revealed.includes(g.id) || S.watched.includes('r-' + g.id); }
function hasResult(g) { return status(g) === 'final' && !!(g.score || g.spoil || g.result); }
function clipRevealed(c) {
  if (!spoilerOn() || !c.safe) return true;
  if (S.revealed.includes(c.id) || S.watched.includes(c.id)) return true;
  return !!(c.game && revealed(c.game));
}
const clipTitle = c => clipRevealed(c) ? c.title : c.safe;
function playedLine(g, teamId) {
  const when = weekday(localDate(g));
  if (isEvent(g) || !teamId) return `${g.event || gameName(g)} · ${when}`;
  const home = g.home === teamId;
  return `${home ? 'vs' : 'at'} ${team(home ? g.away : g.home).short} · ${when}`;
}

/* ---------- state ---------- */
function load() {
  let s;
  try { s = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch { return fresh(); }
  try {
    s.prefs = Object.assign(fresh().prefs, s.prefs);
    // drop anything from older data versions that no longer exists
    s.sports = s.sports.filter(id => SPORTS.some(x => x.id === id));
    s.leagues = s.leagues.filter(id => LEAGUES.some(x => x.id === id));
    s.teams = s.teams.filter(id => TEAMS[id]);
    s.players = s.players.filter(id => PLAYERS.some(x => x.id === id));
    s.channels = s.channels.filter(id => CHANNELS.some(x => x.id === id));
    const isGame = id => GAMES.some(g => g.id === id);
    const isClip = id => CONTENT.some(c => c.id === id);
    const known = id => id.startsWith('r-') ? isGame(id.slice(2)) : isClip(id);
    s.saved = s.saved.filter(known); s.watched = s.watched.filter(known);
    s.added = s.added.filter(isGame); s.removed = s.removed.filter(isGame);
    s.revealed = (s.revealed || []).filter(id => isGame(id) || isClip(id));
    // followed teams and players keep their league; a sport stays only while one of its leagues does
    s.teams.forEach(t => addLeague(s, TEAMS[t].league));
    s.players.forEach(id => { const p = player(id); if (!playerLeagues(p).some(l => s.leagues.includes(l))) addLeague(s, p.league); });
    s.sports = s.sports.filter(sid => s.leagues.some(l => sportOf(l) === sid));
    return s;
  } catch { return fresh(); }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }

let S = load();
const ui = {
  schedTab: null, date: localToday(), sport: 'all', view: 'all', onlyMine: true, menu: false,
  espnOnly: null, group: null,
  libTab: 'towatch', libType: 'all', q: '', pickLeague: 'all',
  sheet: null, connecting: false, built: false, recOpen: true,
  search: false, sq: '', sAll: null,
  stickySports: [],                  // sports kept visible in the league picker after their last league is unticked
  tabFrom: 'schedule', pageStack: [], pageTab: 'schedule', showRecords: false, levelUp: false,
};
let knownXp = null, knownLevel = null;
function syncFanBaseline() { if (S.onboarded) { const f = fanLevel(); knownXp = f.xp; knownLevel = f.cur.n; } }

function commit() {
  save();
  if (S.onboarded) {
    const { xp, cur } = fanLevel();
    if (knownXp != null && xp > knownXp) {
      const t = $('#toast');
      if (t.classList.contains('show') && !/XP/.test(t.textContent)) t.textContent = `+${xp - knownXp} XP · ${t.textContent}`;
    }
    if (knownLevel != null && cur.n > knownLevel) {
      ui.levelUp = true;
      setTimeout(() => toast(`Level up! You're a ${cur.name} now`), 1300);
    }
    knownXp = xp; knownLevel = cur.n;
  }
  render();
}

/* ---------- favorites + schedule logic ---------- */
function favPlayerTeams() { return S.players.map(p => player(p)?.team).filter(Boolean); }
function gamePlayers(g, pool = S.players) {
  return pool.map(player).filter(p => p && ((p.team && (p.team === g.away || p.team === g.home)) || (g.field || []).includes(p.id)));
}
function favTeamsIn(g) { return isEvent(g) ? [] : [g.away, g.home].filter(t => S.teams.includes(t)); }
function favIn(g) { return favTeamsIn(g).length > 0 || gamePlayers(g).length > 0; }
function onSchedule(g) {
  if (S.added.includes(g.id)) return true;
  return S.prefs.autoAdd && favIn(g) && !S.removed.includes(g.id);
}
function gameName(g, long = false) {
  if (isEvent(g)) return g.event;
  const k = long ? 'name' : 'short';
  return `${team(g.away)[k]} at ${team(g.home)[k]}`;
}
function toggleSchedule(id) {
  const g = GAMES.find(x => x.id === id);
  if (onSchedule(g)) {
    S.added = S.added.filter(x => x !== id);
    if (favIn(g) && !S.removed.includes(id)) S.removed.push(id);
    toast('Removed from your schedule');
  } else {
    S.removed = S.removed.filter(x => x !== id);
    S.added.push(id);
    toast(`Added · ${gameName(g)}, ${dayLabel(localDate(g))}`);
  }
  commit();
}
function sportOf(leagueId) { return league(leagueId)?.sport; }
function sportMatch(leagueId) { return ui.sport === 'all' || sportOf(leagueId) === ui.sport; }
function espnFilter() { return ui.espnOnly ?? S.prefs.espnOnly; }
function byTime(a, b) { return (a.date + (a.time || '99')).localeCompare(b.date + (b.time || '99')); }
function scheduledGames() {
  return GAMES.filter(g => g.date >= TODAY && status(g) !== 'final' && onSchedule(g) && sportMatch(g.league) && (!espnFilter() || isEspn(g.network))).sort(byTime);
}
function followTeam(id) {
  const t = team(id);
  if (S.teams.includes(id)) { S.teams = S.teams.filter(x => x !== id); toast(`Unfollowed ${t.name}`); }
  else { ensureLeague(t.league); S.teams.push(id); toast(`Following ${t.name}`); }
  commit();
}
function followPlayer(id) {
  const p = player(id);
  if (S.players.includes(id)) { S.players = S.players.filter(x => x !== id); toast(`Unfollowed ${p.name}`); }
  else { ensureLeague(p.league); S.players.push(id); toast(`Following ${p.name}`); }
  commit();
}
function addLeague(s, lid) {
  const sid = sportOf(lid);
  if (!s.sports.includes(sid)) s.sports.push(sid);
  if (!s.leagues.includes(lid)) s.leagues.push(lid);
}
function ensureLeague(lid) { addLeague(S, lid); }
function unfollowLeague(lid) {
  const before = S.teams.length + S.players.length;
  S.leagues = S.leagues.filter(x => x !== lid);
  syncSportLeagues();
  const dropped = before - S.teams.length - S.players.length;
  toast(`Unfollowed ${league(lid).name}${dropped ? ` · ${plural(dropped, 'follow')} removed` : ''}`);
}
function importEspnFavs() {
  ESPN_FAVORITES.teams.filter(t => TEAMS[t]).forEach(t => { ensureLeague(team(t).league); if (!S.teams.includes(t)) S.teams.push(t); });
  ESPN_FAVORITES.players.filter(player).forEach(p => { ensureLeague(player(p).league); if (!S.players.includes(p)) S.players.push(p); });
}
function espnFavNames() {
  return [...ESPN_FAVORITES.teams.filter(t => TEAMS[t]).map(t => team(t).short), ...ESPN_FAVORITES.players.filter(player).map(p => lastName(player(p)))];
}

/* ---------- player form (recent stat line) ---------- */
function playerForm(p) {
  const f = PLAYER_FORM[p.id];
  if (f) {
    const [text, date] = Array.isArray(f) ? f : [f, null];
    if (!date || !spoilerOn()) return text;
    const g = GAMES.find(x => x.date === date && status(x) === 'final' && (p.team ? (x.away === p.team || x.home === p.team) : (x.field || []).includes(p.id)));
    if (!g) return 'Latest result hidden';
    return revealed(g) ? text : `Played ${playedLine(g, p.team)} · result hidden`;
  }
  if (p.team) {
    const last = GAMES.filter(g => status(g) === 'final' && g.score && (g.away === p.team || g.home === p.team)).sort(byTime).at(-1);
    if (last) {
      const home = last.home === p.team, opp = team(home ? last.away : last.home);
      if (!revealed(last)) return `Last game: ${playedLine(last, p.team)} · result hidden`;
      const [us, them] = home ? [last.score[1], last.score[0]] : last.score;
      return `Last game: ${us > them ? 'W' : us < them ? 'L' : 'T'} ${us}–${them} ${home ? 'vs' : 'at'} ${opp.short}${last.ot ? ' (OT)' : ''}`;
    }
  }
  const next = nextGameFor(p);
  return next ? `Next: ${gameName(next)} · ${dayLabel(localDate(next))}` : 'No games this week';
}
function nextGameFor(p) {
  return GAMES.filter(g => g.date >= TODAY && status(g) !== 'final' && gamePlayers(g, [p.id]).length).sort(byTime)[0];
}

/* ---------- content ---------- */
function getContent(id) {
  if (id.startsWith('r-')) {
    const g = GAMES.find(x => x.id === id.slice(2));
    if (!g) return undefined;
    const st = status(g);
    return {
      id, type: 'full', league: g.league, teams: isEvent(g) ? [] : [g.away, g.home], players: [], channel: null,
      title: `${gameName(g, true)} · full ${isEvent(g) ? 'coverage' : 'game'} replay`,
      duration: st === 'final' ? '3:10:00' : '', date: g.date, source: isEspn(g.network) ? 'ESPN Unlimited' : g.network,
      pending: st !== 'final', game: g,
    };
  }
  return CONTENT.find(c => c.id === id);
}
function relevance(c) {
  let s = 0;
  const pts = favPlayerTeams();
  c.teams.forEach(t => { if (S.teams.includes(t)) s += 3; else if (pts.includes(t)) s += 1; });
  c.players.forEach(p => { if (S.players.includes(p)) s += 3; });
  if (c.channel && S.channels.includes(c.channel)) s += 2;
  if (c.league && S.leagues.includes(c.league)) s += 1;
  return s;
}
function suggestions() {
  return CONTENT.filter(c => !S.saved.includes(c.id) && !S.watched.includes(c.id))
    .map(c => [c, relevance(c)]).filter(([, s]) => s >= 2)
    .sort((a, b) => b[1] - a[1] || b[0].date.localeCompare(a[0].date)).map(([c]) => c);
}
function thumbColors(c) {
  const cols = c.teams.map(t => team(t)?.color).filter(Boolean);
  const ch = c.channel && channel(c.channel);
  const pc = c.players.map(player).filter(Boolean).map(playerColor);
  return [cols[0] || pc[0] || ch?.color || league(c.league)?.color || '#444', cols[1] || '#101012'];
}
const TYPE_LABEL = { full: 'Full game', highlight: 'Highlights', recap: 'Recap', interview: 'Interview', show: 'Show' };
function thumbHtml(c, lg = false) {
  const [a, b] = thumbColors(c), p = S.progress[c.id];
  return `<div class="thumb ${lg ? 'lg' : ''}" style="--a:${a};--b:${b}">
    <span class="type">${TYPE_LABEL[c.type]}</span><span class="play">${I.play}</span>
    ${c.duration ? `<span class="dur">${c.duration}</span>` : ''}
    ${p && !S.watched.includes(c.id) ? `<span class="prog" style="width:${p * 100}%"></span>` : ''}</div>`;
}
function clipMeta(c) {
  if (c.pending) return `<span class="pending">Unlocks after the game · ${dayLabel(c.game ? localDate(c.game) : c.date)}</span>`;
  const src = c.channel ? channel(c.channel).name : c.source;
  return `${esc(src)} · ${shortDate(c.date).replace(/^\w+, /, '')}`;
}
function clipRow(c, mode) {
  let act = '';
  if (mode === 'towatch') act = c.pending ? `<span class="act" title="Unlocks after the game" aria-label="Locked until the game ends">${I.lock}</span>`
    : `<button class="act" data-a="watched" data-id="${c.id}" aria-label="Mark watched">${I.check}</button>`;
  if (mode === 'suggest') act = `<button class="act save" data-a="save" data-id="${c.id}" aria-label="Save to To Watch">${I.plus}</button>`;
  if (mode === 'watched') act = `<button class="act on" data-a="unwatch" data-id="${c.id}" aria-label="Move back to To Watch">${I.check}</button>`;
  if (mode === 'related') {
    const on = S.saved.includes(c.id) || S.watched.includes(c.id);
    act = `<button class="act save ${on ? 'on' : ''}" data-a="save" data-id="${c.id}" aria-label="Save">${on ? I.check : I.plus}</button>`;
  }
  return `<div class="clip" data-a="clip" data-id="${c.id}">${thumbHtml(c)}
    <div class="info"><div class="t">${esc(clipTitle(c))}</div><div class="m">${clipMeta(c)}</div></div>${act}</div>`;
}
function saveContent(id) {
  if (S.watched.includes(id)) return toast('Already in Watched');
  if (S.saved.includes(id)) { S.saved = S.saved.filter(x => x !== id); toast('Removed from To Watch'); }
  else { S.saved.unshift(id); toast('Saved to To Watch'); }
  commit();
}
function markWatched(id) {
  S.saved = S.saved.filter(x => x !== id);
  S.watched = [id, ...S.watched.filter(x => x !== id)];
  delete S.progress[id];
  toast('Moved to Watched'); commit();
}
function unwatch(id) {
  S.watched = S.watched.filter(x => x !== id);
  if (!S.saved.includes(id)) S.saved.unshift(id);
  toast('Back on your To Watch list'); commit();
}

/* ---------- fan level ---------- */
const XP_RULES = [
  ['fullGames', 50, 'Watch a full game'], ['clips', 15, 'Watch a clip, recap or show'], ['scheduled', 10, 'Add a game to your schedule'],
  ['teams', 10, 'Follow a team'], ['players', 10, 'Follow a player'], ['channels', 5, 'Follow a show'],
];
function fanStats() {
  const fullGames = S.watched.filter(id => getContent(id)?.type === 'full').length;
  return {
    fullGames, watched: S.watched.length, clips: S.watched.length - fullGames, scheduled: GAMES.filter(onSchedule).length,
    follows: S.teams.length + S.players.length + S.channels.length, teams: S.teams.length, players: S.players.length,
    channels: S.channels.length, sports: S.sports.length, leagues: S.leagues.length,
  };
}
function fanXp(st) { return XP_RULES.reduce((sum, [k, pts]) => sum + st[k] * pts, 0) + Math.max(0, st.sports - 1) * 20 + (S.espn ? 25 : 0); }
function levelMet(L, st, xp) { return xp >= L.xp && Object.entries(L.req).every(([k, n]) => st[k] >= n); }
function fanLevel() {
  const st = fanStats(), xp = fanXp(st);
  let i = 0;
  while (i + 1 < FAN_LEVELS.length && levelMet(FAN_LEVELS[i + 1], st, xp)) i++;
  return { st, xp, cur: FAN_LEVELS[i], next: FAN_LEVELS[i + 1] || null };
}
const REQ_TEXT = {
  fullGames: { todo: n => `Watch ${plural(n, 'more full game')}`, done: n => `Watched ${plural(n, 'full game')}`, a: 'tab', id: 'library', cta: 'Library' },
  watched: { todo: n => `Watch ${plural(n, 'more video')}`, done: n => `Watched ${plural(n, 'video')}`, a: 'tab', id: 'library', cta: 'Library' },
  scheduled: { todo: n => `Add ${plural(n, 'more game')} to your schedule`, done: n => `${plural(n, 'game')} on your schedule`, a: 'sched-all', cta: 'Games' },
  follows: { todo: n => `Follow ${n} more team${n === 1 ? '' : 's'}, players or shows`, done: n => `Following ${n}`, a: 'edit', id: 'teams', cta: 'Add' },
  players: { todo: n => `Follow ${plural(n, 'more player')}`, done: n => `Following ${plural(n, 'player')}`, a: 'edit', id: 'players', cta: 'Add' },
  sports: { todo: n => `Follow ${plural(n, 'more sport')}`, done: n => `Following ${plural(n, 'sport')}`, a: 'edit', id: 'leagues', cta: 'Add' },
  leagues: { todo: n => `Follow ${plural(n, 'more league')}`, done: n => `Following ${plural(n, 'league')}`, a: 'edit', id: 'leagues', cta: 'Add' },
};
function levelSteps(L, st, xp) {
  const steps = Object.entries(L.req).map(([k, need]) => {
    const have = st[k], T = REQ_TEXT[k], ok = have >= need;
    return { ok, have: Math.min(have, need), need, label: ok ? T.done(need) : T.todo(need - have), a: T.a, id: T.id, cta: T.cta };
  });
  const okXp = xp >= L.xp;
  steps.push({ ok: okXp, have: Math.min(xp, L.xp), need: L.xp, label: okXp ? `Earned ${L.xp} XP` : `Earn ${L.xp - xp} more XP`, xp: true });
  return steps.sort((a, b) => a.ok - b.ok);
}
function levelMark(n, size = '') { return `<span class="lvl-mark lv${n} ${size}"><span>${n}</span></span>`; }

/* ---------- icons (line art, currentColor) ---------- */
const svg = (d, w = 22, extra = '') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
const I = {
  cal: svg('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  lib: svg('<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M6 4h12"/><path d="M10.5 11.5v5l4-2.5z" fill="currentColor"/>'),
  user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
  bell: svg('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>', 16),
  bellOn: svg('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" fill="currentColor"/><path d="M10 21h4"/>', 16),
  chev: svg('<path d="m6 9 6 6 6-6"/>', 14, 'stroke-width="2.5"'),
  back: svg('<path d="m15 5-7 7 7 7"/>', 20, 'stroke-width="2.5"'),
  left: svg('<path d="m15 5-7 7 7 7"/>', 16, 'stroke-width="2.5"'),
  right: svg('<path d="m9 5 7 7-7 7"/>', 16, 'stroke-width="2.5"'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>', 16, 'stroke-width="2.4"'),
  replay: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>', 16),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 14, 'stroke-width="2.8"'),
  plus: svg('<path d="M12 5v14M5 12h14"/>', 15, 'stroke-width="2.4"'),
  x: svg('<path d="M6 6l12 12M18 6 6 18"/>', 14, 'stroke-width="2.4"'),
  play: '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
  lock: svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', 15),
  eye: svg('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', 16),
  star: '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>',
  starLine: svg('<path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/>', 16),
  starFill: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>',
  grid: svg('<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>'),
  film: svg('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10 9.5v5l4-2.5z" fill="currentColor"/>'),
  dot: '<span class="live-dot"></span>',
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 16),
  bolt: svg('<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>', 16),
  trophy: svg('<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4"/>', 16),
  layers: svg('<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>', 16),
  history: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 8v4l3 2"/>', 16),
};
const SPORT_ICON = {
  football: '<ellipse cx="12" cy="12" rx="9.5" ry="5.8" transform="rotate(-40 12 12)"/><path d="M8.6 15.4l6.8-6.8M10.3 11.6l2.1 2.1M11.9 10l2.1 2.1M8.7 13.2l2.1 2.1"/>',
  basketball: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5.7 5.7c3.2 3.4 3.2 9.2 0 12.6M18.3 5.7c-3.2 3.4-3.2 9.2 0 12.6"/>',
  baseball: '<circle cx="12" cy="12" r="9"/><path d="M6.2 5.2c2.4 3.4 2.4 10.2 0 13.6M17.8 5.2c-2.4 3.4-2.4 10.2 0 13.6"/><path d="M7.9 8.5l1.6-.6M8.4 12h1.7M7.9 15.5l1.6.6M16.1 8.5l-1.6-.6M15.6 12h-1.7M16.1 15.5l-1.6.6"/>',
  hockey: '<path d="M6 3l5.5 13.5H19a1.5 1.5 0 0 1 0 3h-8.6a1.5 1.5 0 0 1-1.4-1L3.3 4"/><ellipse cx="17.5" cy="11" rx="3" ry="1.4"/>',
  soccer: '<circle cx="12" cy="12" r="9"/><path d="M12 7.6l3.6 2.6-1.4 4.2H9.8l-1.4-4.2z"/><path d="M12 3v4.6M15.6 10.2l4.9-1.6M14.2 14.4l3 4M9.8 14.4l-3 4M8.4 10.2 3.5 8.6"/>',
  golf: '<path d="M8 21V3l9 3.8L8 10.6"/><path d="M4 21h9"/><circle cx="17.5" cy="18.5" r="2"/>',
  tennis: '<ellipse cx="9.5" cy="9.5" rx="5.8" ry="6.8" transform="rotate(-45 9.5 9.5)"/><path d="M13.6 13.6 20 20"/><path d="M6 8.3l5.7 5.7M8.3 6l5.7 5.7"/><circle cx="19" cy="5.5" r="1.8"/>',
  volleyball: '<circle cx="12" cy="12" r="9"/><path d="M12 3c-.6 4.6 1.4 8 5.2 10.3M20.4 15c-4.2-1.8-8.2-1.6-11.8 1.4M5 18.2c.8-4.6 3.4-7.8 7-9.4M12 12 3.6 8.8"/>',
  softball: '<circle cx="12" cy="12" r="9"/><path d="M4.5 8c3.5.8 4.8 6.6 1.4 9.3M19.5 8c-3.5.8-4.8 6.6-1.4 9.3"/>',
  lacrosse: '<path d="M4 20.5 13 11.5"/><path d="M13 11.5c-1.4-3.3-.4-7.3 2.8-8.3 2.4-.7 4.8 1.2 4.3 3.7-.6 3.1-3.8 5.3-7.1 4.6z"/><path d="M15 5.5l3 3M14.3 8l2.4 2.4"/><circle cx="6" cy="8" r="1.8"/>',
  cricket: '<path d="M15.5 3.5l5 5-8.8 8.8-5-5z"/><path d="M6.7 12.3 3 16l5 5 3.7-3.7"/><circle cx="6.5" cy="5.5" r="2"/>',
  rugby: '<ellipse cx="12" cy="12" rx="9.5" ry="5.6" transform="rotate(-35 12 12)"/><path d="M6.8 17.2 17.2 6.8"/><path d="M9 11.5c1.4-.2 2.9.5 3.5 2"/>',
  pickleball: '<rect x="3.5" y="3" width="11" height="12" rx="5"/><path d="M9 15v6"/><circle cx="18.3" cy="17.3" r="2.6"/><path d="M17.4 16.4h.01M19.2 18.2h.01"/>',
};
const sportIcon = (id, w = 22) => svg(SPORT_ICON[id] || '<circle cx="12" cy="12" r="9"/>', w);

/* ---------- router ---------- */
const OB_STEPS = ['connect', 'sports', 'leagues', 'teams', 'players', 'channels'];
function route() {
  const h = location.hash.replace(/^#\/?/, '') || '';
  const [a, raw] = h.split('/');
  const b = raw ? decodeURIComponent(raw) : raw;
  if (!S.onboarded) {
    if (a === 'setup' && (OB_STEPS.includes(b) || b === 'build')) return { name: 'setup', step: b };
    return { name: 'welcome' };
  }
  if (TABS.includes(a)) return { name: a };
  if (a === 'team' && TEAMS[b]) return { name: 'team', id: b };
  if (a === 'league' && league(b)) return { name: 'league', id: b };
  return { name: 'schedule' };
}
function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
function openPage(kind, id) {
  const r = route();
  if (TABS.includes(r.name)) { ui.tabFrom = r.name; ui.pageStack = []; }
  const target = `#/${kind}/${encodeURIComponent(id)}`;
  if (location.hash !== target) ui.pageStack.push(location.hash || '#/' + ui.tabFrom);
  Object.assign(ui, { sheet: null, search: false, menu: false, pageTab: 'schedule', showRecords: false });
  go(target);
}

/* ---------- render ---------- */
function render() {
  const r = route(), screen = $('#screen');
  const scroll = screen.scrollTop;
  let html = '';
  if (r.name === 'welcome') html = viewWelcome();
  else if (r.name === 'setup') html = viewSetup(r.step);
  else if (r.name === 'schedule') html = viewSchedule();
  else if (r.name === 'library') html = viewLibrary();
  else if (r.name === 'profile') html = viewProfile();
  else if (r.name === 'team') html = viewTeam(r.id);
  else if (r.name === 'league') html = viewLeague(r.id);
  const inApp = TABS.includes(r.name) || r.name === 'team' || r.name === 'league';
  screen.className = 'screen' + (inApp ? '' : ' no-tabs');
  screen.innerHTML = html;
  const key = r.name + (r.step || '') + (r.id || '');
  if (screen.dataset.route === key) screen.scrollTop = scroll;
  else screen.scrollTop = 0;
  screen.dataset.route = key;
  const ob = screen.querySelector('.ob-body');
  if (ob && ob.dataset.keep && renderOb.scroll != null && renderOb.step === r.step) ob.scrollTop = renderOb.scroll;
  const clk = $('#sb-clock');
  if (clk) clk.textContent = clockNow();
  renderTabbar(inApp ? (TABS.includes(r.name) ? r.name : ui.tabFrom) : null);
  renderSearch(inApp);
  renderSheet();
}
const renderOb = { scroll: null, step: null };

function renderTabbar(active) {
  const bar = $('#tabbar');
  if (!active) { bar.hidden = true; return; }
  bar.hidden = false;
  const n = S.saved.length;
  bar.innerHTML = [
    ['schedule', 'Schedule', I.cal, ''],
    ['library', 'Library', I.lib, n ? `<span class="badge">${n}</span>` : ''],
    ['profile', 'Profile', I.user, ''],
  ].map(([id, label, icon, badge]) =>
    `<button class="${active === id ? 'on' : ''}" data-a="tab" data-id="${id}" aria-label="${label}">${icon}${badge}<span>${label}</span></button>`).join('');
}

/* ---------- onboarding ---------- */
function viewWelcome() {
  return `<div class="welcome">
    <div class="brand"><span class="brand-mark">F</span>Fanatic</div>
    <h1>Every game.<br>Every highlight.<br>One list.</h1>
    <p>Follow your teams and players, build a watch schedule for the week, and keep every recap, presser, and replay queued up.</p>
    <div class="stack">
      <div><span class="stack-ico">${I.cal}</span><span>A weekly watch schedule built from your teams and players</span></div>
      <div><span class="stack-ico">${I.film}</span><span>Highlights, recaps and interviews saved in one queue</span></div>
      <div><span class="espn-logo" style="font-size:12px;padding:1px 6px;border-radius:4px">ESPN</span><span>Syncs with your ESPN account</span></div>
    </div>
    <button class="btn primary block" data-a="go" data-id="#/setup/connect">Get started</button>
    <p class="credits">Built by ${esc(listNames(PROJECT.members))}<span>${esc(PROJECT.assignment)}</span></p>
  </div>`;
}

function obShell(step, title, sub, body, footer) {
  const i = OB_STEPS.indexOf(step);
  const pct = ((i + 1) / OB_STEPS.length) * 100;
  return `<div class="ob-top">
      <button class="icon-btn" data-a="ob-back" aria-label="Back">${I.back}</button>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <button class="link-btn" data-a="ob-next" data-skip="1">Skip</button>
    </div>
    <div class="ob-body" data-keep="1">
      <h1 class="ob-title">${title}</h1>
      <p class="ob-sub">${sub}</p>
      ${body}
    </div>
    <div class="ob-foot">${footer}</div>`;
}
const checkBox = on => `<span class="check">${on ? I.check : ''}</span>`;
const chipCheck = on => on ? `<span class="chip-ico">${I.check}</span>` : '';

function sportGrid(compact = false) {
  return `<div class="sport-grid ${compact ? 'compact' : ''}">${SPORTS.map(s => {
    const on = S.sports.includes(s.id);
    return `<button class="sport-tile ${on ? 'on' : ''}" data-a="pick-sport" data-id="${s.id}" aria-pressed="${on}">
      <span class="ico">${sportIcon(s.id, compact ? 24 : 30)}</span><span class="nm">${s.name}</span>${checkBox(on)}</button>`;
  }).join('')}</div>`;
}
function leagueGroups() {
  return SPORTS.filter(s => S.sports.includes(s.id) || ui.stickySports.includes(s.id)).map(s => {
    const ls = LEAGUES.filter(l => l.sport === s.id);
    const n = ls.filter(l => S.leagues.includes(l.id)).length;
    return `<div class="league-group"><h4><span class="h-ico">${sportIcon(s.id, 18)}</span>${s.name}<small>${n} of ${ls.length}</small></h4>
      <div class="wrap">${ls.map(l => {
        const on = S.leagues.includes(l.id);
        return `<button class="chip ${on ? 'on' : ''}" data-a="pick-league" data-id="${l.id}" aria-pressed="${on}">${chipCheck(on)}${esc(l.name)}${espnBadge(l)}</button>`;
      }).join('')}</div></div>`;
  }).join('');
}

function viewSetup(step) {
  if (step === 'build') return viewBuild();
  if (step === 'connect') {
    const favs = espnFavNames();
    const body = `<div class="connect-card">
        <span class="espn-logo">ESPN</span>
        <ul>
          <li>Find your ESPN favorites and follow them here</li>
          <li>Import what you've already watched</li>
          <li>Open games and clips straight in the ESPN app</li>
        </ul>
        ${S.espn ? `<div class="connected"><span class="ok">${I.check}</span><div class="txt"><b>Connected · ESPN Unlimited</b>Following ${esc(favs.join(', '))} · ${plural(ESPN_HISTORY.length, 'recent watch')} synced</div></div>`
          : `<button class="btn primary block" data-a="connect" ${ui.connecting ? 'disabled' : ''}>${ui.connecting ? '<span class="spinner"></span> Connecting…' : 'Connect ESPN account'}</button>`}
        <div class="proto-note">Prototype · connection is simulated, no sign-in required</div>
      </div>`;
    return obShell(step, 'Connect your ESPN account', 'Fanatic works alongside the ESPN app you already stream on.', body,
      `<button class="btn primary block" data-a="ob-next">${S.espn ? 'Continue' : 'Continue without ESPN'}</button>`);
  }
  if (step === 'sports') {
    return obShell(step, 'What do you watch?', 'Pick every sport you follow. We cover the major leagues on every network.', sportGrid(),
      `<button class="btn primary block" data-a="ob-next" ${S.sports.length ? '' : 'disabled'}>Continue</button>
       <span class="hint">${plural(S.sports.length, 'sport')} selected</span>`);
  }
  if (step === 'leagues') {
    const body = leagueGroups() || '<div class="empty"><b>No sports picked</b>Go back and choose a sport first.</div>';
    return obShell(step, 'Pick your leagues', `Choose the leagues you follow in each sport. We picked the big one to start. ${espnBadge({ espn: true })} marks leagues on ESPN.`, body,
      `<button class="btn primary block" data-a="ob-next" ${S.leagues.length ? '' : 'disabled'}>Continue</button>
       <span class="hint">${plural(S.leagues.length, 'league')} selected</span>`);
  }
  if (step === 'teams') {
    return obShell(step, 'Your teams', 'Games for these teams go straight onto your watch schedule.', pickerHtml('teams'),
      `<button class="btn primary block" data-a="ob-next">Continue</button><span class="hint">${plural(S.teams.length, 'team')} selected</span>`);
  }
  if (step === 'players') {
    return obShell(step, 'Players you follow', "Their games land on your schedule even if you don't follow the team, and their highlights come first.", pickerHtml('players'),
      `<button class="btn primary block" data-a="ob-next">Continue</button><span class="hint">${plural(S.players.length, 'player')} selected</span>`);
  }
  if (step === 'channels') {
    return obShell(step, 'Shows and channels', 'Pick the shows you already watch. New episodes land in your Library.', pickerHtml('channels'),
      `<button class="btn primary block" data-a="ob-next">Build my schedule</button><span class="hint">${plural(S.channels.length, 'show')} selected</span>`);
  }
}

function viewBuild() {
  const games = GAMES.filter(g => g.date >= TODAY && status(g) !== 'final' && onSchedule(g)).length;
  const clips = suggestions().length;
  if (!ui.built) {
    setTimeout(() => { ui.built = true; render(); }, 1300);
    return `<div class="build"><div class="ring-big"></div><h2>Building your week</h2><p style="color:var(--muted);margin:0">Matching games, highlights and shows to your picks…</p></div>`;
  }
  return `<div class="build">
    <div class="done">${svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 34, 'stroke-width="3"')}</div>
    <h2>Your Fanatic is ready</h2>
    <p style="color:var(--muted);margin:0">Here's what we found for ${monthDay(localToday())} – ${monthDay(dateBounds()[1])}.</p>
    <div class="stats">
      <div><b>${games}</b><span>games on your schedule</span></div>
      <div><b>${clips}</b><span>clips picked for you</span></div>
      <div><b>${S.watched.length}</b><span>synced from ESPN</span></div>
    </div>
    <button class="btn primary block" data-a="finish">Open my schedule</button>
  </div>`;
}

/* Shared picker (onboarding + profile sheets) */
function pickerHtml(kind) {
  if (kind === 'leagues') return sportGrid(true) + leagueGroups();
  const ls = S.leagues;
  const chips = kind === 'channels' ? '' :
    `<div class="chips">${['all', ...ls].map(id => `<button class="chip sm ${ui.pickLeague === id ? 'on' : ''}" data-a="pick-filter" data-id="${id}">${id === 'all' ? 'All' : esc(league(id).short)}</button>`).join('')}</div>`;
  const ph = { teams: 'Search teams', players: 'Search players and athletes', channels: 'Search shows and channels' }[kind];
  return `<label class="search">${I.search}<input type="search" id="pick-q" placeholder="${ph}" value="${esc(ui.q)}" data-input="q" data-kind="${kind}" aria-label="${ph}"></label>
    ${chips}<div id="pick-list">${pickList(kind)}</div>`;
}
function matchQ(s, q = ui.q) { return !q || s.toLowerCase().includes(q.toLowerCase()); }
function teamRow(t) {
  const on = S.teams.includes(t.id);
  return `<button class="pick-row ${on ? 'on' : ''}" data-a="pick-team" data-id="${t.id}" aria-pressed="${on}">${tb(t.id, 'md')}<span class="nm">${esc(t.name)}</span>${checkBox(on)}</button>`;
}
function pickList(kind) {
  const leagues = S.leagues.filter(l => ui.pickLeague === 'all' || l === ui.pickLeague);
  if (kind === 'teams') {
    const out = leagues.map(lid => {
      const l = league(lid);
      if (l.kind === 'individual' || l.teamNote) {
        const msg = l.kind === 'individual' ? `${sport(l.sport).name} is followed by athlete. Pick your ${l.athletes || 'players'} in the Players step.` : l.teamNote;
        return ui.q ? '' : `<div class="card"><div class="grp-label">${esc(l.name)}</div>
          <div class="ind-note"><span class="h-ico">${sportIcon(l.sport, 18)}</span><span>${esc(msg)}</span></div></div>`;
      }
      const ts = Object.values(TEAMS).filter(t => t.league === lid && matchQ(`${t.name} ${t.abbr} ${t.conf || ''}`));
      if (!ts.length) return '';
      const sortT = arr => arr.sort((a, b) => (S.teams.includes(b.id) - S.teams.includes(a.id)) || a.name.localeCompare(b.name));
      if (ts.some(t => t.conf)) {
        const confs = [...new Set(ts.map(t => t.conf || 'Other'))];
        return `<div class="card"><div class="grp-label">${esc(l.name)}</div>${confs.map(c =>
          `<div class="sub-label">${esc(c)}</div>${sortT(ts.filter(t => (t.conf || 'Other') === c)).map(teamRow).join('')}`).join('')}</div>`;
      }
      return `<div class="card"><div class="grp-label">${esc(l.name)}<small>${ts.length} teams</small></div>${sortT(ts).map(teamRow).join('')}</div>`;
    }).join('');
    return out || `<div class="empty"><b>No teams found</b>Try another search or add a league.</div>`;
  }
  if (kind === 'players') {
    const favT = S.teams;
    const home = p => playerLeagues(p).find(l => leagues.includes(l));
    const ps = PLAYERS.filter(p => home(p) && matchQ(`${p.name} ${p.team ? team(p.team).name : ''} ${league(p.league).name}`));
    const groups = [
      ['From your teams', ps.filter(p => favT.includes(p.team))],
      ...leagues.map(lid => [league(lid).name, ps.filter(p => home(p) === lid && !favT.includes(p.team))]),
    ].filter(([, list]) => list.length);
    return groups.map(([label, list]) => `<div class="card"><div class="grp-label">${esc(label)}</div>${list.map(p => {
      const on = S.players.includes(p.id);
      return `<button class="pick-row ${on ? 'on' : ''}" data-a="pick-player" data-id="${p.id}" aria-pressed="${on}">
        ${pav(p, 'md')}<span class="nm">${esc(p.name)}<small>${esc(playerSub(p))}</small></span>${checkBox(on)}</button>`;
    }).join('')}</div>`).join('') || `<div class="empty"><b>No players found</b>Try another search or add a league.</div>`;
  }
  if (kind === 'channels') {
    const cs = CHANNELS.filter(c => matchQ(c.name + ' ' + c.desc));
    const rel = c => c.sports.some(s => S.sports.includes(s));
    const groups = [['Recommended for your sports', cs.filter(rel)], ['More shows', cs.filter(c => !rel(c))]].filter(([, l]) => l.length);
    return groups.map(([label, list]) => `<div class="card"><div class="grp-label">${label}</div>${list.map(c => {
      const on = S.channels.includes(c.id);
      return `<button class="pick-row ${on ? 'on' : ''}" data-a="pick-channel" data-id="${c.id}" aria-pressed="${on}">
        <span class="ch-mark" style="background:${c.color}">${c.mark}</span>
        <span class="nm">${esc(c.name)}<small>${esc(c.desc)}</small></span>${checkBox(on)}</button>`;
    }).join('')}</div>`).join('') || `<div class="empty"><b>No shows found</b>Try another search.</div>`;
  }
  return '';
}
function syncSportLeagues(newSport) {
  // leagues follow their sport; a sport added now starts with its most popular league; a sport with no leagues left drops
  S.leagues = S.leagues.filter(l => S.sports.includes(sportOf(l)));
  if (newSport && S.sports.includes(newSport) && !S.leagues.some(l => sportOf(l) === newSport)) {
    const pop = LEAGUES.filter(l => l.sport === newSport && l.popular);
    S.leagues.push(...(pop.length ? pop : LEAGUES.filter(l => l.sport === newSport).slice(0, 1)).map(l => l.id));
  }
  S.sports = S.sports.filter(s => S.leagues.some(l => sportOf(l) === s));
  S.teams = S.teams.filter(t => S.leagues.includes(team(t).league));
  S.players = S.players.filter(p => playerLeagues(player(p)).some(l => S.leagues.includes(l)));
  if (ui.pickLeague !== 'all' && !S.leagues.includes(ui.pickLeague)) ui.pickLeague = 'all';
}

/* ---------- top bar + search ---------- */
function topbar(title) {
  const lv = fanLevel().cur.n;
  return `<div class="topbar">
    <span class="brand-mark sm">F</span>
    <button class="search-pill" data-a="search-open" aria-label="Search Fanatic">${I.search}<span>Search teams, leagues, players</span></button>
    <button class="avatar ${lv >= 6 ? 'gold' : ''}" data-a="tab" data-id="profile" aria-label="Profile, fan level ${lv}">${svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>', 18)}<span class="lvl-pip lv${lv}">${lv}</span>${S.espn ? '<span class="dot" title="ESPN connected"></span>' : ''}</button>
  </div>${title ? `<h1 class="page-title">${title}</h1>` : ''}`;
}
function renderSearch(app) {
  const root = $('#search-root');
  if (!ui.search || !app) { root.innerHTML = ''; return; }
  if (root.querySelector('.search-screen')) { $('#search-results').innerHTML = searchResults(); return; }
  root.innerHTML = `<div class="search-screen">
    <div class="search-top">
      <label class="search-pill field">${I.search}<input type="search" id="search-q" data-input="search" value="${esc(ui.sq)}" placeholder="Search teams, leagues, players, games" aria-label="Search" autocomplete="off"></label>
      <button class="link-btn" data-a="search-close">Cancel</button>
    </div>
    <div class="search-body" id="search-results">${searchResults()}</div></div>`;
  const inp = root.querySelector('input'); inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length);
}
function followBtn(kind, id, on) {
  return `<button class="follow ${on ? 'on' : ''}" data-a="follow-${kind}" data-id="${id}" aria-pressed="${on}" aria-label="${on ? 'Unfollow' : 'Follow'}">${on ? I.starFill : I.starLine}</button>`;
}
function teamLinkRow(t, sub = '') {
  return `<div class="pick-row"><button class="pr-link" data-a="team" data-id="${t.id}">${tb(t.id, 'md')}<span class="nm">${esc(t.name)}${sub ? `<small>${sub}</small>` : ''}</span></button>${followBtn('team', t.id, S.teams.includes(t.id))}</div>`;
}
function leagueLinkRow(l) {
  return `<div class="pick-row"><button class="pr-link" data-a="league" data-id="${l.id}">${leagueLogo(l)}<span class="nm">${esc(l.name)}<small>${esc(sport(l.sport).name)}</small></span>${espnBadge(l)}</button>${followBtn('league', l.id, S.leagues.includes(l.id))}</div>`;
}
function searchResults() {
  const q = ui.sq.trim();
  if (!q) {
    const follows = [...S.teams.map(t => [team(t).name, tb(t)]), ...S.players.map(p => [player(p).name, pav(player(p), 'xs')])];
    const big = GAMES.filter(g => g.date >= TODAY && status(g) !== 'final' && (g.tags || []).length && baseFilter(g)).sort(byTime).slice(0, 4);
    return `${follows.length ? `<div class="section-label">Your follows</div><div class="chip-wrap">${follows.map(([n, av]) =>
        `<button class="x-chip" data-a="search-set" data-id="${esc(n)}">${av}${esc(n)}</button>`).join('')}</div>` : ''}
      ${S.recent.length ? `<div class="section-label">Recent<button class="link" data-a="search-clear">Clear</button></div><div class="card">${S.recent.map(r =>
        `<button class="pick-row" data-a="search-set" data-id="${esc(r)}"><span class="h-ico muted">${I.clock}</span><span class="nm">${esc(r)}</span></button>`).join('')}</div>` : ''}
      ${big.length ? `<div class="section-label">Big games this week</div><div class="card">${big.map(g => gameRow(g)).join('')}</div>` : ''}`;
  }
  const lim = k => ui.sAll === k ? 999 : 4;
  const ql = q.toLowerCase();
  const rank = s => (s.toLowerCase().startsWith(ql) ? 0 : 1);
  const leagues = LEAGUES.filter(l => matchQ(`${l.name} ${l.short} ${sport(l.sport).name}`, q))
    .sort((a, b) => (S.leagues.includes(b.id) - S.leagues.includes(a.id)) || rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
  const teams = Object.values(TEAMS).filter(t => matchQ(`${t.name} ${t.abbr}`, q))
    .sort((a, b) => (S.teams.includes(b.id) - S.teams.includes(a.id)) || (S.leagues.includes(b.league) - S.leagues.includes(a.league)) || rank(a.short) - rank(b.short) || a.name.localeCompare(b.name));
  const players = PLAYERS.filter(p => matchQ(`${p.name} ${p.team ? team(p.team).name : ''}`, q))
    .sort((a, b) => (S.players.includes(b.id) - S.players.includes(a.id)) || rank(lastName(a)) - rank(lastName(b)));
  const games = GAMES.filter(g => matchQ(`${gameName(g, true)} ${g.note || ''} ${league(g.league).name} ${isEvent(g) ? '' : team(g.away).abbr + ' ' + team(g.home).abbr}`, q))
    .sort((a, b) => (favIn(b) - favIn(a)) || ((status(a) === 'final') - (status(b) === 'final')) || (gameRank(a) - gameRank(b)) || byTime(a, b));
  function gameRank(g) {
    if (isEvent(g)) return rank(g.event);
    return Math.min(rank(team(g.away).short), rank(team(g.home).short), S.leagues.includes(g.league) ? 1 : 2) + (S.leagues.includes(g.league) ? 0 : 1);
  }
  const clips = CONTENT.filter(c => matchQ(`${clipTitle(c)} ${c.channel ? channel(c.channel).name : ''}`, q));
  const group = (k, label, list, row) => list.length ? `<div class="section-label">${label}<span class="n">${list.length}</span>
      ${list.length > 4 ? `<button class="link" data-a="search-all" data-id="${k}">${ui.sAll === k ? 'Show less' : 'See all'}</button>` : ''}</div>
      <div class="card">${list.slice(0, lim(k)).map(row).join('')}</div>` : '';
  const out = group('leagues', 'Leagues', leagues, leagueLinkRow)
    + group('teams', 'Teams', teams, t => teamLinkRow(t, `${esc(league(t.league).name)}${t.conf ? ' · ' + esc(t.conf) : ''}`))
    + group('players', 'Players', players, p => `<div class="pick-row">${pav(p, 'md')}<span class="nm">${esc(p.name)}<small>${esc(playerSub(p))}</small></span>${followBtn('player', p.id, S.players.includes(p.id))}</div>`)
    + group('games', 'Games & events', games, g => gameRow(g))
    + group('clips', 'Clips', clips, c => clipRow(c, 'related'));
  return out || `<div class="empty"><b>No results for "${esc(q)}"</b>Try a team, player, league or show.</div>`;
}
function rememberSearch() {
  const q = ui.sq.trim();
  if (q.length < 2) return;
  S.recent = [q, ...S.recent.filter(r => r.toLowerCase() !== q.toLowerCase())].slice(0, 5);
}

/* ---------- Schedule ---------- */
function sportTabs() {
  const list = [{ id: 'all', name: 'All' }, ...S.sports.map(sport)];
  return `<div class="sport-tabs">${list.map(s => `<button class="sport-tab ${ui.sport === s.id ? 'on' : ''}" data-a="sport" data-id="${s.id}"><span class="ico">${s.id === 'all' ? I.grid : sportIcon(s.id, 20)}</span>${s.name}</button>`).join('')}</div>`;
}
const TAG_LABEL = { playoff: 'Playoffs', primetime: 'Primetime', rivalry: 'Rivalry', allstar: 'All-Star', marquee: 'Marquee', major: 'Major' };
function playerLine(g) {
  const ps = gamePlayers(g);
  if (!ps.length) return '';
  return `<div class="pl-line">${ps.slice(0, 3).map(p => `<span class="pl">${pav(p, 'xs')}${esc(lastName(p))}${p.team ? `<em>${esc(p.pos)}</em>` : ''}</span>`).join('')}</div>`;
}
function gameRow(g, opts = {}) {
  const st = status(g), fav = isEvent(g) ? [] : [g.away, g.home].map(t => S.teams.includes(t));
  const final = st === 'final', show = revealed(g), ld = localDate(g);
  const when = st === 'live' ? `<span class="live-tag">LIVE</span>${g.endDate ? '<span class="sm">In progress</span>' : ''}` :
    final ? `<b>${show && g.ot ? 'F/OT' : 'Final'}</b>${opts.showDate ? `<span class="sm">${weekday(ld)}</span>` : ''}`
      : `<b>${fmtTime(g)}</b>${g.time ? tzAbbr(instant(g)) : ''}${opts.showDate ? `<span class="sm">${ld === localToday() ? 'Today' : weekday(ld)}</span>` : ''}`;
  const on = onSchedule(g);
  let middle;
  if (isEvent(g)) {
    middle = `<div class="event-line"><span class="ev-ico">${sportIcon(sportOf(g.league), 16)}</span><span class="nm">${esc(g.event)}</span></div>`;
  } else {
    const sc = final && g.score && show;
    const line = (t, f, i) => {
      const win = sc && g.score[i] > g.score[1 - i];
      return `<div class="team-line ${f ? 'fav' : ''} ${sc && !win ? 'lost' : ''}">${tb(t)}${RANKS[t] ? `<span class="rk">${RANKS[t]}</span>` : ''}<span class="nm">${esc(team(t).short)}</span>${f ? `<span class="star">${I.star}</span>` : ''}${sc ? `<span class="sc">${g.score[i]}</span>` : ''}</div>`;
    };
    middle = line(g.away, fav[0], 0) + line(g.home, fav[1], 1);
  }
  const tags = (g.tags || []).map(t => `<span class="tag-pill">${TAG_LABEL[t] || t}</span>`).join('');
  const noteTxt = [g.note, show && g.spoil, show && final && g.result].filter(Boolean).join(' · ');
  const note = noteTxt || tags ? `<div class="note">${tags}${esc(noteTxt)}</div>` : '';
  const rid = 'r-' + g.id, rSaved = S.saved.includes(rid) || S.watched.includes(rid);
  const hidden = final && !show && hasResult(g);
  const action = final
    ? `${hidden ? `<button class="bell reveal" data-a="reveal" data-id="${g.id}" aria-label="Show ${isEvent(g) ? 'result' : 'score'}">${I.eye}</button>` : ''}<button class="bell ${rSaved ? 'on' : ''}" data-a="replay" data-id="${g.id}" aria-label="${rSaved ? 'Replay saved' : 'Save replay'}" aria-pressed="${rSaved}">${I.replay}</button>`
    : `<button class="bell ${on ? 'on' : ''}" data-a="bell" data-id="${g.id}" aria-label="${on ? 'Remove from my schedule' : 'Add to my schedule'}" aria-pressed="${on}">${on ? I.bellOn : I.bell}</button>`;
  return `<div class="game" data-a="game" data-id="${g.id}">
    <div class="when">${when}</div>
    <div class="teams">${middle}${playerLine(g)}${note}</div>
    <div class="right">${final ? '' : `<span class="net ${isEspn(g.network) ? 'espn' : ''}">${esc(g.network)}</span>`}${action}</div>
  </div>`;
}
function dayGroups(games, rowOpts = {}) {
  const byDay = {};
  games.forEach(g => (byDay[localDate(g)] ||= []).push(g));
  const today = localToday();
  return Object.entries(byDay).map(([d, list]) => {
    const wd = weekday(d, true), md = monthDay(d);
    const rel = d === today ? (localHour(PROTO_NOW) >= 17 ? 'Tonight' : 'Today') : d === shiftDate(today, 1) ? 'Tomorrow' : d === shiftDate(today, -1) ? 'Yesterday' : wd;
    return `<div class="day-head"><b>${rel}</b><span>${rel === wd ? md : `${wd}, ${md}`}</span></div>
      <div class="card">${list.map(g => gameRow(g, rowOpts)).join('')}</div>`;
  }).join('');
}
function viewSchedule() {
  const tab = ui.schedTab || S.prefs.home;
  const mine = scheduledGames();
  return `${topbar()}${sportTabs()}
    <div class="seg" role="tablist">
      <button class="${tab === 'mine' ? 'on' : ''}" data-a="sched-tab" data-id="mine" role="tab">MY SCHEDULE<span class="count">${mine.length}</span></button>
      <button class="${tab === 'all' ? 'on' : ''}" data-a="sched-tab" data-id="all" role="tab">ALL GAMES</button>
    </div>
    ${tab === 'mine' ? viewMine(mine) : viewAll()}`;
}
function groupMode() { return ui.group || S.prefs.group; }
function viewMine(games) {
  const espnN = games.filter(g => isEspn(g.network)).length;
  const liveN = games.filter(g => status(g) === 'live').length;
  const gm = groupMode();
  let html = `<div class="summary"><div class="big">${games.length}</div>
    <div class="txt"><b>games on your schedule this week</b><br>${espnN} on ESPN networks${liveN ? ` · <span style="color:var(--live)">${liveN} live now</span>` : ''}</div></div>
    <div class="chips">
      <span class="mini-seg" role="tablist" aria-label="Group by"><button class="${gm === 'teams' ? 'on' : ''}" data-a="group" data-id="teams">By day</button><button class="${gm === 'players' ? 'on' : ''}" data-a="group" data-id="players">By player</button></span>
      <button class="chip ${espnFilter() ? 'on' : ''}" data-a="espn-only">ESPN only</button>
      <button class="chip" data-a="sched-tab" data-id="all">${I.plus} More games</button></div>`;
  if (gm === 'players') return html + viewByPlayer();
  if (!games.length) {
    return html + `<div class="empty"><b>Your week is open</b>Browse All Games and tap the bell on anything you want to catch.
      <br><button class="btn primary sm" data-a="sched-tab" data-id="all">Browse all games</button></div>`;
  }
  return html + dayGroups(games);
}
function viewByPlayer() {
  const ps = S.players.map(player).filter(p => p && playerLeagues(p).some(sportMatch));
  if (!ps.length) return `<div class="empty"><b>Follow a player to plan around them</b>Their games land here with their recent form, even if you don't follow the team.
    <br><button class="btn primary sm" data-a="edit" data-id="players">Add players</button></div>`;
  return ps.map(p => {
    const games = GAMES.filter(g => g.date >= TODAY && status(g) !== 'final' && gamePlayers(g, [p.id]).length && (!espnFilter() || isEspn(g.network))).sort(byTime);
    return `<div class="card player-card">
      <div class="pc-head">${pav(p, 'lg')}<div class="pc-txt"><b>${esc(p.name)}</b><span>${esc(playerSub(p))}</span></div>
        <button class="follow on" data-a="follow-player" data-id="${p.id}" aria-label="Unfollow ${esc(p.name)}">${I.starFill}</button></div>
      <div class="form-line"><span class="form-lbl">Recent form</span>${esc(playerForm(p))}</div>
      ${games.length ? games.map(g => gameRow(g, { showDate: true })).join('') : `<div class="card-empty">No games this week</div>`}
    </div>`;
  }).join('');
}

const VIEWS = [
  { id: 'all', name: 'All games', icon: 'layers', sub: 'Everything on the selected day' },
  { id: 'live', name: 'Live now', icon: 'dot', sub: 'In progress right now' },
  { id: 'upcoming', name: 'Upcoming', icon: 'clock', sub: 'Rest of this week' },
  { id: 'past', name: 'Past games', icon: 'history', sub: 'Final scores with replays' },
  { id: 'highlights', name: 'Highlights', icon: 'film', sub: 'Latest clips' },
  { id: 'big', name: 'Big games', icon: 'trophy', sub: 'Playoffs, primetime, rivalries, All-Star' },
];
function viewChip() {
  const v = VIEWS.find(x => x.id === ui.view);
  return `<button class="chip live ${ui.view !== 'all' ? 'on' : ''}" data-a="menu" aria-haspopup="menu" aria-expanded="${ui.menu}">
      ${v.id === 'live' ? I.dot : ''}${ui.view === 'all' ? 'Live' : esc(v.name)}<span class="dd-chev ${ui.menu ? 'open' : ''}">${I.chev}</span></button>`;
}
function viewMenu() {
  if (!ui.menu) return '';
  return `<div class="dd-scrim" data-a="menu"></div><div class="dd-menu" role="menu">
    ${VIEWS.map(o => `<button class="dd-item ${ui.view === o.id ? 'on' : ''}" role="menuitemradio" aria-checked="${ui.view === o.id}" data-a="view" data-id="${o.id}">
      <span class="dd-ico">${o.icon === 'dot' ? I.dot : I[o.icon]}</span><span class="dd-txt">${o.name}<small>${o.sub}</small></span>${ui.view === o.id ? `<span class="dd-check">${I.check}</span>` : ''}</button>`).join('')}
    <button class="dd-toggle" data-a="only-mine" role="menuitemcheckbox" aria-checked="${ui.onlyMine}"><span class="dd-txt">Only my teams & players<small>Applies to every view except All games</small></span><span class="switch ${ui.onlyMine ? 'on' : ''}"></span></button>
    <button class="dd-toggle" data-a="pref" data-id="spoilerFree" role="menuitemcheckbox" aria-checked="${spoilerOn()}"><span class="dd-txt">Hide scores<small>Spoiler-free mode for finals and recaps</small></span><span class="switch ${spoilerOn() ? 'on' : ''}"></span></button>
  </div>`;
}
function dateStepper(d) {
  const [first, last] = dateBounds();
  return `<div class="date-step"><button data-a="date" data-id="-1" ${d <= first ? 'disabled' : ''} aria-label="Previous day">${I.left}</button><span>${dayLabel(d)}</span><button data-a="date" data-id="1" ${d >= last ? 'disabled' : ''} aria-label="Next day">${I.right}</button></div>`;
}
function baseFilter(g) { return S.leagues.includes(g.league) && sportMatch(g.league) && (!espnFilter() || isEspn(g.network)); }
function mineFilter(g) { return !ui.onlyMine || favIn(g) || onSchedule(g); }
function leagueCards(pool, { showEmpty = true, openAll = false, date = null } = {}) {
  let html = '';
  S.leagues.filter(sportMatch).forEach(lid => {
    const l = league(lid), list = pool.filter(g => g.league === lid);
    if (!list.length && !showEmpty) return;
    const liveN = list.filter(g => status(g) === 'live').length;
    const hasFav = list.some(favIn);
    const open = openAll || (S.open[lid] ?? (hasFav || list.length <= 4));
    const count = liveN ? `<span class="l">${liveN}</span>/${list.length}` : list.length;
    const elsewhere = !list.length && espnFilter() && date && GAMES.some(g => g.league === lid && localDate(g) === date);
    const emptySub = elsewhere ? 'No ESPN games on this date' : (spoilerOn() && l.offweekSafe) || l.offweek || 'No games on this date';
    html += `<div class="card"><button class="card-head" data-a="league-toggle" data-id="${lid}" aria-expanded="${open}">
      ${leagueLogo(l)}<span class="title">${esc(l.name)}${list.length ? '' : `<span class="sub">${esc(emptySub)}</span>`}</span>
      ${list.length ? `<span class="count-pill">${count}</span><span class="chev ${open ? 'open' : ''}">${I.chev}</span>` : ''}</button>
      ${open && list.length ? list.map(g => gameRow(g)).join('') : ''}
      ${open || !list.length ? `<button class="card-foot" data-a="league" data-id="${lid}">${esc(l.short)} schedule, results & standings${I.right}</button>` : ''}</div>`;
  });
  return html;
}
function emptyView(title, body) {
  const hint = ui.onlyMine && ui.view !== 'all' ? `<br><button class="btn ghost sm" data-a="only-mine">Show everyone's games</button>` : '';
  return `<div class="empty"><b>${title}</b>${body}${hint}</div>`;
}
function viewAll() {
  const d = ui.date, v = ui.view;
  const dated = v === 'all' || v === 'past';
  let html = `<div class="filter-wrap"><div class="chips">
      ${viewChip()}
      <button class="chip ${espnFilter() ? 'on' : ''}" data-a="espn-only">ESPN only</button>
      ${dated ? dateStepper(d) : `<span class="view-sub">${esc(VIEWS.find(x => x.id === v).sub)}</span>`}
    </div>${viewMenu()}</div>`;
  if (v === 'all') {
    const pool = GAMES.filter(g => localDate(g) === d && baseFilter(g)).sort(byTime);
    const rec = pool.filter(favIn);
    if (rec.length) {
      html += `<div class="card"><button class="card-head" data-a="rec-toggle">
        <span class="title">Recommended for you<span class="sub">Games with your teams and players</span></span>
        <span class="count-pill">${rec.length}</span><span class="chev ${ui.recOpen ? 'open' : ''}">${I.chev}</span></button>
        ${ui.recOpen ? rec.map(g => gameRow(g)).join('') : ''}</div>`;
    }
    const cards = leagueCards(pool, { date: d });
    html += cards || (rec.length ? '' : emptyView('No games match', 'Try another day or clear a filter.'));
  } else if (v === 'live') {
    const pool = GAMES.filter(g => status(g) === 'live' && baseFilter(g) && mineFilter(g));
    html += pool.length ? leagueCards(pool, { showEmpty: false, openAll: true }) : emptyView('Nothing live right now', 'Your next games are under Upcoming.');
  } else if (v === 'upcoming') {
    const pool = GAMES.filter(g => g.date >= TODAY && status(g) === 'upcoming' && baseFilter(g) && mineFilter(g)).sort(byTime);
    html += pool.length ? dayGroups(pool) : emptyView('No upcoming games', 'Nothing left on the calendar this week.');
  } else if (v === 'past') {
    const pool = GAMES.filter(g => localDate(g) === d && status(g) === 'final' && baseFilter(g) && mineFilter(g)).sort(byTime);
    html += pool.length ? leagueCards(pool, { showEmpty: false, openAll: true })
      : emptyView(`No final scores on ${shortDate(d)}`, 'Step back a day with the arrows.');
  } else if (v === 'highlights') {
    const clips = CONTENT.filter(c => c.type !== 'show' && (!c.league || sportMatch(c.league)) && (!ui.onlyMine || relevance(c) >= 3 || c.players.some(p => S.players.includes(p))))
      .sort((a, b) => b.date.localeCompare(a.date));
    const byDay = {};
    clips.forEach(c => (byDay[c.date] ||= []).push(c));
    html += clips.length ? Object.entries(byDay).map(([day, list]) =>
      `<div class="day-head"><b>${dayLabel(day)}</b><span>${list.length} clips</span></div><div class="card">${list.map(c => clipRow(c, 'related')).join('')}</div>`).join('')
      : emptyView('No highlights yet', 'Clips for your teams and players show up here after their games.');
  } else if (v === 'big') {
    const pool = GAMES.filter(g => g.date >= TODAY && status(g) !== 'final' && (g.tags || []).length && baseFilter(g) && mineFilter(g)).sort(byTime);
    html += pool.length ? dayGroups(pool) : emptyView('No big games for your picks', 'Playoffs, primetime and rivalry games land here.');
  }
  if (dated && d !== localToday()) html += `<button class="today-pill" data-a="today">${I.left} TODAY</button>`;
  return html;
}

/* ---------- Team & league pages ---------- */
function pageHead(av, title, sub, action) {
  return `<div class="page-top"><button class="icon-btn" data-a="page-back" aria-label="Back">${I.back}</button><span class="spacer"></span>${action}</div>
    <div class="page-head">${av}<div class="ph-txt"><h1>${title}</h1><p>${sub}</p></div></div>`;
}
function standings(lid) {
  return (RECORDS[lid] || '').split(';').map(s => s.trim()).filter(Boolean).map((s, i) => {
    const [abbr, rec, pts] = s.split('|').map(x => x && x.trim());
    return { id: `${lid}-${abbr}`, rec, pts, pos: i + 1 };
  }).filter(r => TEAMS[r.id]);
}
function windowRecord(id) {
  let w = 0, l = 0, t = 0;
  GAMES.forEach(g => {
    if (!g.score || status(g) !== 'final' || (g.away !== id && g.home !== id)) return;
    const us = g.home === id ? g.score[1] : g.score[0], them = g.home === id ? g.score[0] : g.score[1];
    us > them ? w++ : us < them ? l++ : t++;
  });
  return w + l + t ? `${w}-${l}${t ? '-' + t : ''}` : '';
}
const recordsHidden = () => spoilerOn() && !ui.showRecords;
const hiddenRecordsBtn = label => `<button class="rec-card hidden" data-a="show-records">${I.eye}<span>Show ${label}<small>Hidden by spoiler-free mode</small></span></button>`;
function playerRow(p) {
  return `<div class="ptw">${pav(p, 'md')}<div class="ptw-txt"><b>${esc(p.name)}${S.players.includes(p.id) ? `<span class="star">${I.star}</span>` : ''}</b><span>${esc(playerSub(p))}</span><span class="form">${esc(playerForm(p))}</span></div>${followBtn('player', p.id, S.players.includes(p.id))}</div>`;
}
function viewTeam(id) {
  const t = team(id), l = league(t.league), on = S.teams.includes(id);
  const games = GAMES.filter(g => !isEvent(g) && (g.away === id || g.home === id)).sort(byTime);
  const up = games.filter(g => status(g) !== 'final'), done = games.filter(g => status(g) === 'final').reverse();
  const ps = PLAYERS.filter(p => p.team === id);
  const clips = CONTENT.filter(c => c.teams.includes(id));
  const sub = `<button class="ph-link" data-a="league" data-id="${l.id}">${esc(l.name)}</button>${t.conf ? ' · ' + esc(t.conf) : ''}${RANKS[id] ? ` · No. ${RANKS[id]}` : ''}`;
  let html = pageHead(tb(id, 'xl'), esc(t.name), sub, followBtn('team', id, on));
  const st = standings(l.id).find(r => r.id === id), wr = windowRecord(id);
  const rec = st ? { big: st.rec, sub: `${st.pts ? `${st.pts} pts · ` : ''}${ordinal(st.pos)} in ${l.short}` } : wr ? { big: wr, sub: 'Record since Sep 17' } : null;
  if (rec) html += recordsHidden() ? hiddenRecordsBtn('record') : `<div class="rec-card"><span class="form-lbl">Record</span><b>${esc(rec.big)}</b><span>${esc(rec.sub)}</span></div>`;
  if (up.length) html += `<div class="section-label">Upcoming</div>${dayGroups(up)}`;
  if (done.length) html += `<div class="section-label">Results</div><div class="card">${done.map(g => gameRow(g, { showDate: true })).join('')}</div>`;
  if (!games.length) html += `<div class="empty"><b>No games Sep 17–30</b>${esc(l.offweek || 'Nothing on the calendar in this window.')}</div>`;
  if (ps.length) html += `<div class="section-label">Players</div><div class="card">${ps.map(playerRow).join('')}</div>`;
  if (clips.length) html += `<div class="section-label">Clips</div><div class="card">${clips.map(c => clipRow(c, 'related')).join('')}</div>`;
  return html;
}
function viewLeague(lid) {
  const l = league(lid), sp = sport(l.sport), on = S.leagues.includes(lid), ind = l.kind === 'individual';
  const games = GAMES.filter(g => g.league === lid).sort(byTime);
  const up = games.filter(g => status(g) !== 'final'), done = games.filter(g => status(g) === 'final').reverse();
  const teams = Object.values(TEAMS).filter(t => t.league === lid).sort((a, b) => a.name.localeCompare(b.name));
  const athletes = PLAYERS.filter(p => playerLeagues(p).includes(lid));
  const clips = CONTENT.filter(c => c.league === lid);
  const table = standings(lid);
  const count = ind ? plural(athletes.length, (l.athletes || 'players').replace(/s$/, '')) : plural(teams.length, 'team');
  const tabs = [['schedule', 'Schedule'], ['results', 'Results'], ['table', ind ? 'Players' : table.length ? 'Standings' : 'Teams'], ['clips', 'Clips']];
  let html = pageHead(leagueLogo(l, 'lg'), esc(l.name), `${esc(sp.name)} · ${count} ${espnBadge(l, true)}`, followBtn('league', lid, on));
  html += `<div class="seg four" role="tablist">${tabs.map(([id, name]) => `<button class="${ui.pageTab === id ? 'on' : ''}" data-a="page-tab" data-id="${id}" role="tab" aria-selected="${ui.pageTab === id}">${name.toUpperCase()}</button>`).join('')}</div>`;
  const note = l.offweek ? `<div class="league-note">${sportIcon(l.sport, 18)}<span>${esc((spoilerOn() && l.offweekSafe) || l.offweek)}</span></div>` : '';
  if (ui.pageTab === 'schedule') {
    html += up.length ? dayGroups(up) : `${note}<div class="empty"><b>${done.length ? 'No more games this week' : 'No games this week'}</b>${done.length ? 'Recent finals are under Results.' : 'Nothing on the calendar for Sep 24–30.'}</div>`;
  } else if (ui.pageTab === 'results') {
    html += done.length ? dayGroups(done) : `${note}<div class="empty"><b>No results yet</b>Finals from Sep 17 on show up here.</div>`;
  } else if (ui.pageTab === 'table') {
    if (ind) {
      html += athletes.length ? `<div class="card">${athletes.map(playerRow).join('')}</div>` : `<div class="empty"><b>No athletes yet</b>Players for ${esc(l.name)} aren't in this prototype.</div>`;
    } else if (table.length) {
      const soccer = l.sport === 'soccer', pts = table.some(r => r.pts);
      html += recordsHidden() ? hiddenRecordsBtn('standings') : `<div class="card"><div class="stand-row head"><span class="pos">#</span><span class="nm">Team</span><span class="rec">${soccer ? 'W-D-L' : 'Record'}</span>${pts ? '<span class="pts">PTS</span>' : ''}</div>
        ${table.map(r => `<button class="stand-row" data-a="team" data-id="${r.id}"><span class="pos">${r.pos}</span>${tb(r.id)}<span class="nm">${esc(team(r.id).short)}</span><span class="rec">${esc(r.rec)}</span>${pts ? `<span class="pts">${esc(r.pts || '')}</span>` : ''}</button>`).join('')}</div>`;
    } else {
      const ranked = teams.filter(t => RANKS[t.id]).sort((a, b) => RANKS[a.id] - RANKS[b.id]);
      if (ranked.length) html += `<div class="section-label">Rankings</div><div class="card">${ranked.map(t => teamLinkRow(t, `No. ${RANKS[t.id]}${t.conf ? ' · ' + esc(t.conf) : ''}`)).join('')}</div>`;
      const confs = [...new Set(teams.map(t => t.conf || ''))];
      html += confs.map(c => `<div class="section-label">${esc(c || 'Teams')}<span class="n">${teams.filter(t => (t.conf || '') === c).length}</span></div>
        <div class="card">${teams.filter(t => (t.conf || '') === c).map(t => teamLinkRow(t)).join('')}</div>`).join('')
        || `<div class="empty"><b>No teams listed</b>${esc(l.teamNote || '')}</div>`;
    }
  } else {
    html += clips.length ? `<div class="card">${clips.map(c => clipRow(c, 'related')).join('')}</div>` : `<div class="empty"><b>No clips yet</b>Highlights and shows for ${esc(l.name)} land here.</div>`;
  }
  return html;
}

/* ---------- Library ---------- */
function viewLibrary() {
  const typeOk = c => ui.libType === 'all' || (ui.libType === 'players' ? c.players.some(p => S.players.includes(p)) : c.type === ui.libType);
  const saved = S.saved.map(getContent).filter(Boolean);
  const watched = S.watched.map(getContent).filter(Boolean);
  const types = [CONTENT_TYPES[0], { id: 'players', name: 'My players' }, ...CONTENT_TYPES.slice(1)];
  let html = `${topbar('Library')}
    <div class="seg" role="tablist">
      <button class="${ui.libTab === 'towatch' ? 'on' : ''}" data-a="lib-tab" data-id="towatch" role="tab">TO WATCH<span class="count">${saved.length}</span></button>
      <button class="${ui.libTab === 'watched' ? 'on' : ''}" data-a="lib-tab" data-id="watched" role="tab">WATCHED<span class="count">${watched.length}</span></button>
    </div>
    <div class="chips">${types.map(t => `<button class="chip sm ${ui.libType === t.id ? 'on' : ''}" data-a="lib-type" data-id="${t.id}">${t.name}</button>`).join('')}</div>`;
  if (ui.libTab === 'towatch') {
    const list = saved.filter(typeOk);
    html += list.length ? `<div class="card">${list.map(c => clipRow(c, 'towatch')).join('')}</div>`
      : `<div class="empty"><b>Your queue is clear</b>Tap the plus on anything below to save it for later.</div>`;
    const sug = suggestions().filter(typeOk).slice(0, 12);
    if (sug.length) html += `<div class="section-label">New for you<span class="link muted">From your teams, players & shows</span></div>
      <div class="card">${sug.map(c => clipRow(c, 'suggest')).join('')}</div>`;
  } else {
    const list = watched.filter(typeOk);
    html += list.length ? `<div class="section-label">Recently watched${S.espn ? '<span class="link muted">Synced with ESPN</span>' : ''}</div><div class="card">${list.map(c => clipRow(c, 'watched')).join('')}</div>`
      : `<div class="empty"><b>Nothing watched yet</b>Tap the check on a clip in To Watch once you've seen it.</div>`;
  }
  return html;
}

/* ---------- Profile ---------- */
function fanCard() {
  const { st, xp, cur, next } = fanLevel();
  const up = ui.levelUp; ui.levelUp = false;
  const pct = next ? Math.min(100, Math.round(((xp - cur.xp) / (next.xp - cur.xp)) * 100)) : 100;
  const steps = next ? levelSteps(next, st, xp) : [];
  const stepRow = s => `<div class="step ${s.ok ? 'ok' : ''}">
      <span class="step-check">${s.ok ? I.check : ''}</span>
      <span class="step-txt">${esc(s.label)}<span class="mini-bar"><i style="width:${Math.round((s.have / s.need) * 100)}%"></i></span></span>
      ${s.ok ? `<span class="step-n">${s.xp ? '' : `${s.have}/${s.need}`}</span>` : s.xp ? `<span class="step-n">${s.have}/${s.need}</span>` : `<button class="mini-btn" data-a="${s.a}" data-id="${s.id || ''}">${s.cta}${I.right}</button>`}
    </div>`;
  return `<div class="card fan-card ${up ? 'lvl-up' : ''}">
    <div class="fan-top">${levelMark(cur.n, 'lg')}
      <div class="fan-txt"><small>Fan level ${cur.n} of ${FAN_LEVELS.length}</small><b>${esc(cur.name)}</b></div>
      <div class="fan-xp"><b>${xp}</b><small>XP</small></div></div>
    <div class="xp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Progress to the next level"><i style="width:${pct}%"></i></div>
    <div class="xp-meta"><span>${esc(cur.name)} · ${cur.xp} XP</span><span>${next ? `${esc(next.name)} · ${next.xp} XP` : 'Top level reached'}</span></div>
    ${next ? `<div class="grp-label">How to reach ${esc(next.name)}${next.perk ? `<small>Unlocks ${esc(next.perk.toLowerCase())}</small>` : ''}</div>
      <div class="steps">${steps.map(stepRow).join('')}</div>`
      : `<div class="ind-note">${I.trophy}<span>You've reached the top. Hall of Famers keep earning XP for every game they watch.</span></div>`}
    <div class="badges">${FAN_LEVELS.map(L => `<div class="badge-item ${L.n <= cur.n ? 'got' : ''}" title="${esc(L.name)} · ${L.xp} XP${L.perk ? ' · ' + esc(L.perk) : ''}">${levelMark(L.n)}<span>${esc(L.name)}</span></div>`).join('')}</div>
    <details class="xp-rules"><summary>How XP works</summary><div class="rules">
      ${XP_RULES.map(([, pts, label]) => `<div><span>${label}</span><b>+${pts}</b></div>`).join('')}
      <div><span>Follow another sport</span><b>+20</b></div><div><span>Connect ESPN</span><b>+25</b></div>
    </div></details>
  </div>`;
}
function viewProfile() {
  const sched = GAMES.filter(g => g.date >= TODAY && status(g) !== 'final' && onSchedule(g)).length;
  const lv = fanLevel().cur;
  const xchip = (a, id, label, av = '', link = '') => `<span class="x-chip ${av ? '' : 'noav'}">${link ? `<button class="xc-link" data-a="${link}" data-id="${id}">${av}${esc(label)}</button>` : `${av}${esc(label)}`}<button class="x" data-a="${a}" data-id="${id}" aria-label="Remove ${esc(label)}">${I.x}</button></span>`;
  const section = (title, n, kind, chips) => `<div class="card"><div class="sec-head"><h3>${title}<small>${n}</small></h3><button class="edit" data-a="edit" data-id="${kind}">${kind === 'leagues' ? 'Edit' : 'Add'}</button></div>
    <div class="chip-wrap">${chips || `<button class="add-chip" data-a="edit" data-id="${kind}">Add ${title.toLowerCase()}</button>`}</div></div>`;
  const tzNow = S.prefs.tz || 'auto';
  return `${topbar('Profile')}
    ${lv.n >= 7 ? `<div class="hof-banner">${I.trophy}<span>Hall of Famer</span></div>` : ''}
    <div class="prof-head"><div class="avatar ${lv.n >= 6 ? 'gold' : ''}">${svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>', 28)}</div><div><h2>My Fanatic${lv.n >= 5 ? `<span class="title-pill">${esc(lv.name)}</span>` : ''}</h2><p>Following ${plural(S.teams.length, 'team')} · ${plural(S.players.length, 'player')} · ${plural(S.channels.length, 'show')}</p></div></div>
    ${fanCard()}
    <div class="stat-row">
      <button data-a="tab" data-id="schedule"><b>${sched}</b><span>On schedule</span></button>
      <button data-a="tab" data-id="library"><b>${S.saved.length}</b><span>To watch</span></button>
      <button data-a="lib-watched"><b>${S.watched.length}</b><span>Watched</span></button>
    </div>
    <div class="card"><div class="espn-row"><span class="espn-logo">ESPN</span>
      <div class="txt">${S.espn ? '<b>Connected · ESPN Unlimited</b>Watch history and favorites in sync' : '<b>ESPN not connected</b>Connect to import your favorites and watch history'}</div>
      <button class="btn ${S.espn ? 'ghost' : 'primary'} sm" data-a="espn-toggle">${S.espn ? 'Disconnect' : 'Connect'}</button></div></div>
    ${section('Sports & leagues', S.leagues.length, 'leagues', S.leagues.map(l => xchip('rm-league', l, league(l).name, `<span class="h-ico">${sportIcon(sportOf(l), 16)}</span>`, 'league')).join(''))}
    ${section('Teams', S.teams.length, 'teams', S.teams.map(t => xchip('rm-team', t, team(t).name, tb(t), 'team')).join(''))}
    ${section('Players', S.players.length, 'players', S.players.map(p => xchip('rm-player', p, player(p).name, pav(player(p), 'xs'))).join(''))}
    ${section('Shows & channels', S.channels.length, 'channels', S.channels.map(c => xchip('rm-channel', c, channel(c).name, `<span class="ch-mark" style="width:22px;height:22px;border-radius:6px;font-size:8px;background:${channel(c).color}">${channel(c).mark}</span>`)).join(''))}
    <div class="section-label">Customize</div>
    <div class="card">
      <button class="toggle-row" style="border-top:0" data-a="pref" data-id="autoAdd"><span class="txt">Auto-add games for my teams and players<small>Their games land on your schedule automatically</small></span><span class="switch ${S.prefs.autoAdd ? 'on' : ''}"></span></button>
      <button class="toggle-row" data-a="pref" data-id="spoilerFree"><span class="txt">Spoiler-free mode<small>Hide final scores and result headlines until you tap to show them or watch the replay</small></span><span class="switch ${spoilerOn() ? 'on' : ''}"></span></button>
      <button class="toggle-row" data-a="pref" data-id="espnOnly"><span class="txt">ESPN networks only<small>Hide games airing outside ESPN, ABC and ESPN Unlimited</small></span><span class="switch ${S.prefs.espnOnly ? 'on' : ''}"></span></button>
      <div class="toggle-row"><label class="txt" for="tz-select">Time zone<small>Game times show in this zone · now ${esc(tzAbbr(PROTO_NOW))}</small></label>
        <select id="tz-select" class="tz-select" data-input="tz">${TZ_CHOICES.map(([v, n]) => `<option value="${v}" ${tzNow === v ? 'selected' : ''}>${v === 'auto' ? `${n} (${esc(detectedTz().split('/').pop().replace(/_/g, ' '))})` : n}</option>`).join('')}</select></div>
      <div class="toggle-row"><span class="txt">Schedule opens to</span>
        <span class="mini-seg"><button class="${S.prefs.home === 'mine' ? 'on' : ''}" data-a="home-pref" data-id="mine">My schedule</button><button class="${S.prefs.home === 'all' ? 'on' : ''}" data-a="home-pref" data-id="all">All games</button></span></div>
      <div class="toggle-row"><span class="txt">Group my schedule<small>Player view shows recent form for each player</small></span>
        <span class="mini-seg"><button class="${S.prefs.group === 'teams' ? 'on' : ''}" data-a="group-pref" data-id="teams">By day</button><button class="${S.prefs.group === 'players' ? 'on' : ''}" data-a="group-pref" data-id="players">By player</button></span></div>
    </div>
    <div class="section-label">About this prototype</div>
    <div class="card about-card"><p>Fanatic was designed and built by</p>
      <ul>${PROJECT.members.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
      <p class="muted">${esc(PROJECT.assignment)} · Sample data covers Sep 17–30, 2026</p></div>
    <div style="text-align:center;padding:14px"><button class="link-btn" data-a="reset">Restart prototype</button></div>`;
}

/* ---------- Sheets ---------- */
function openSheet(s) { ui.sheet = s; ui.q = ''; ui.pickLeague = 'all'; ui.menu = false; ui.stickySports = []; render(); }
function closeSheet() { ui.sheet = null; ui.q = ''; ui.stickySports = []; render(); }
function renderSheet() {
  const root = $('#sheet-root');
  if (!ui.sheet) { root.innerHTML = ''; delete root.dataset.key; return; }
  const prev = root.querySelector('.sheet-body')?.scrollTop || 0;
  const same = root.dataset.key === JSON.stringify(ui.sheet);
  let head = '', body = '';
  const s = ui.sheet;
  if (s.type === 'game') [head, body] = sheetGame(GAMES.find(g => g.id === s.id));
  else if (s.type === 'clip') [head, body] = sheetClip(getContent(s.id));
  else if (s.type === 'pick') {
    const titles = { teams: 'Add teams', players: 'Add players', channels: 'Add shows & channels', leagues: 'Sports & leagues' };
    head = `<h3>${titles[s.kind]}</h3><button class="btn primary sm" data-a="close">Done</button>`;
    body = pickerHtml(s.kind);
  }
  root.innerHTML = `<div class="scrim" data-a="close"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div><div class="sheet-head">${head}</div><div class="sheet-body">${body}</div></div>`;
  root.dataset.key = JSON.stringify(s);
  if (same) root.querySelector('.sheet-body').scrollTop = prev;
  root.querySelector('.sheet').style.animation = same ? 'none' : '';
  root.querySelector('.scrim').style.animation = same ? 'none' : '';
}
function playersToWatch(g) {
  const followed = gamePlayers(g);
  const others = isEvent(g) ? PLAYERS.filter(p => (g.field || []).includes(p.id) && !S.players.includes(p.id))
    : [g.away, g.home].flatMap(t => PLAYERS.filter(p => p.team === t && !S.players.includes(p.id)).slice(0, 2));
  return [...followed, ...others].slice(0, 6);
}
function sheetGame(g) {
  const l = league(g.league), st = status(g), on = onSchedule(g), rid = 'r-' + g.id;
  const replaySaved = S.saved.includes(rid) || S.watched.includes(rid);
  const final = st === 'final', show = revealed(g), ld = localDate(g);
  const hidden = final && !show && hasResult(g);
  const revealBtn = `<button class="reveal-btn" data-a="reveal" data-id="${g.id}">${I.eye} Show ${isEvent(g) ? 'result' : 'score'}</button>`;
  const upcomingTxt = `${fmtTime(g)}${g.time ? ` <small style="font-size:11px;color:var(--muted)">${tzAbbr(instant(g))}</small>` : ''}`;
  const espn = isEspn(g.network);
  const whereTxt = final ? `<b>${replaySaved ? 'Replay saved to your Library' : 'Replay available'}</b>${espn ? 'Stream the full game in the ESPN app' : `Aired on ${esc(g.network)}`}`
    : g.network === 'TBD' ? '<b>Network to be announced</b>Slot and channel set after seeding'
    : espn ? `<b>Watch on ${esc(g.network)}</b>Streams in the ESPN app with your ESPN Unlimited plan`
    : `<b>Airs on ${esc(g.network)}</b>Outside ESPN · we'll still remind you at start time`;
  const related = CONTENT.filter(c => (!isEvent(g) && (c.teams.includes(g.away) || c.teams.includes(g.home))) || (isEvent(g) && c.league === g.league)).slice(0, 4);
  const ptw = playersToWatch(g);
  const headNote = [g.note, show && g.spoil].filter(Boolean).join(' · ') || shortDate(ld);
  const head = `<button class="lg-link" data-a="league" data-id="${l.id}" aria-label="${esc(l.name)} page">${leagueLogo(l)}</button><h3>${esc(l.name)}<span style="display:block;font-size:12px;color:var(--muted);font-weight:500">${esc(headNote)}</span></h3><button class="icon-btn" data-a="close" aria-label="Close">${I.x}</button>`;
  let matchup;
  if (isEvent(g)) {
    const line = st === 'live' ? `<span class="live-tag">LIVE</span> In progress` : final ? (hidden ? `Final · ${dayLabel(ld)}` : `${esc(g.result || 'Final')} · ${dayLabel(ld)}`) : `${upcomingTxt} · ${dayLabel(ld)}`;
    matchup = `<div class="event-hero"><span class="ev-ico lg">${sportIcon(l.sport, 30)}</span><b>${esc(g.event)}</b><span>${line}</span>${hidden ? revealBtn : ''}</div>`;
  } else {
    const mid = st === 'live' ? `<span class="live-tag">LIVE</span>In progress`
      : final ? (hidden ? `<b>Final</b>${dayLabel(ld)}${revealBtn}` : `<b>${g.score ? `${g.score[0]} – ${g.score[1]}` : 'Final'}</b>${g.ot ? 'Final/OT' : 'Final'} · ${dayLabel(ld)}`)
      : `<b>${upcomingTxt}</b>${dayLabel(ld)}`;
    const side = t => `<button class="side" data-a="team" data-id="${t}">${tb(t, 'lg')}<span>${RANKS[t] ? `#${RANKS[t]} ` : ''}${esc(team(t).name)}</span></button>`;
    matchup = `<div class="matchup">${side(g.away)}<div class="mid">${mid}</div>${side(g.home)}</div>`;
  }
  const body = `${matchup}
    <div class="where"><span class="net ${espn ? 'espn' : ''}">${esc(g.network)}</span><div class="txt">${whereTxt}</div></div>
    <div class="btn-row">
      ${final ? '' : `<button class="btn ${on ? 'on-state' : 'primary'}" data-a="bell" data-id="${g.id}">${on ? I.bellOn + ' Scheduled' : I.bell + ' Add to schedule'}</button>`}
      <button class="btn ${replaySaved ? 'on-state' : 'ghost'}" data-a="replay" data-id="${g.id}">${I.replay} ${replaySaved ? 'Replay saved' : 'Save replay'}</button>
    </div>
    ${ptw.length ? `<div class="section-label">Players to watch</div><div class="card">${ptw.map(p => {
      const clip = CONTENT.find(c => c.players.includes(p.id));
      const fav = S.players.includes(p.id);
      return `<div class="ptw">${pav(p, 'md')}<div class="ptw-txt"><b>${esc(p.name)}${fav ? `<span class="star">${I.star}</span>` : ''}</b><span>${esc(playerSub(p))}</span><span class="form">${esc(playerForm(p))}</span></div>
        ${clip ? `<button class="mini-btn" data-a="clip" data-id="${clip.id}">${I.play} Clips</button>` : ''}${followBtn('player', p.id, fav)}</div>`;
    }).join('')}</div>` : ''}
    ${related.length ? `<div class="section-label">Catch up</div><div class="card">${related.map(c => clipRow(c, 'related')).join('')}</div>` : ''}`;
  return [head, body];
}
function sheetClip(c) {
  const saved = S.saved.includes(c.id), watched = S.watched.includes(c.id), hiddenTitle = !clipRevealed(c);
  const head = `<h3 style="font-size:15px">${TYPE_LABEL[c.type]}</h3><button class="icon-btn" data-a="close" aria-label="Close">${I.x}</button>`;
  const tags = [...c.teams.filter(team).map(t => `<button class="tag" data-a="team" data-id="${t}">${tb(t)}${esc(team(t).name)}</button>`),
    ...c.players.map(player).filter(Boolean).map(p => `<span class="tag">${pav(p, 'xs')}${esc(p.name)}</span>`)].join('');
  const body = `<div class="pad">${thumbHtml(c, true)}</div>
    <div class="pad" style="padding-top:12px"><div style="font-weight:700;font-size:17px;line-height:1.3">${esc(clipTitle(c))}</div>
      <div style="color:var(--muted);font-size:13px;margin-top:4px">${clipMeta(c)}${c.duration ? ' · ' + c.duration : ''}</div>
      ${hiddenTitle ? `<button class="reveal-btn" data-a="reveal-clip" data-id="${c.id}">${I.eye} Show full title</button>` : ''}</div>
    ${tags ? `<div class="tagline">${tags}</div>` : ''}
    <div class="btn-row" style="padding-top:8px">
      <button class="btn primary" data-a="play" data-id="${c.id}">${c.pending ? I.lock + ' Locked until final' : I.play + (S.progress[c.id] ? ' Resume in ESPN' : ' Play in ESPN')}</button>
      ${c.pending ? '' : `<button class="btn ${watched ? 'on-state' : 'ghost'}" data-a="${watched ? 'unwatch' : 'watched'}" data-id="${c.id}">${I.check} ${watched ? 'Watched' : 'Mark watched'}</button>`}
    </div>
    ${watched ? '' : `<div class="btn-row"><button class="btn ${saved ? 'ghost' : 'on-state'}" data-a="save" data-id="${c.id}">${saved ? 'Remove from To Watch' : I.plus + ' Save to To Watch'}</button></div>`}`;
  return [head, body];
}

/* ---------- toast ---------- */
let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2100);
}

/* ---------- events ---------- */
function latestPastDate() {
  const ds = GAMES.filter(g => status(g) === 'final' && baseFilter(g) && mineFilter(g)).map(localDate).sort();
  return ds.at(-1) || GAMES.filter(g => g.date < TODAY).map(localDate).sort().at(-1);
}
function reveal(ids) { ids.filter(Boolean).forEach(id => { if (!S.revealed.includes(id)) S.revealed.push(id); }); }
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (!el || el.disabled) return;
  const a = el.dataset.a, id = el.dataset.id;
  const r = route();
  const obScroll = () => { const ob = $('.ob-body'); renderOb.scroll = ob ? ob.scrollTop : null; renderOb.step = r.step; };
  const fromSearch = !!el.closest('.search-screen');
  if (fromSearch && ['follow-team', 'follow-player', 'follow-league', 'bell', 'save', 'game', 'clip', 'replay', 'team', 'league'].includes(a)) { rememberSearch(); save(); }
  switch (a) {
    case 'go': go(id); break;
    case 'tab': ui.sheet = null; ui.search = false; ui.menu = false; if (route().name === id) { $('#screen').scrollTop = 0; render(); } else go('#/' + id); break;
    case 'ob-back': {
      const i = OB_STEPS.indexOf(r.step);
      ui.q = ''; ui.pickLeague = 'all'; ui.stickySports = []; renderOb.scroll = null;
      go(i <= 0 ? '#/' : '#/setup/' + OB_STEPS[i - 1]); break;
    }
    case 'ob-next': {
      const i = OB_STEPS.indexOf(r.step);
      if (r.step === 'sports' && !S.sports.length && el.dataset.skip) { S.sports = ['football']; syncSportLeagues('football'); }
      ui.q = ''; ui.pickLeague = 'all'; ui.built = false; ui.stickySports = []; renderOb.scroll = null; save();
      go(i === OB_STEPS.length - 1 ? '#/setup/build' : '#/setup/' + OB_STEPS[i + 1]); break;
    }
    case 'connect':
      ui.connecting = true; render();
      setTimeout(() => {
        ui.connecting = false; S.espn = true;
        ESPN_HISTORY.forEach(h => { if (!S.watched.includes(h)) S.watched.push(h); });
        importEspnFavs();
        commit(); toast('ESPN connected · favorites imported');
      }, 1100);
      break;
    case 'finish': S.onboarded = true; ui.schedTab = null; save(); syncFanBaseline(); go('#/schedule'); break;
    case 'pick-sport':
      obScroll(); toggleIn(S.sports, id);
      if (!S.sports.includes(id)) ui.stickySports = ui.stickySports.filter(s => s !== id);
      syncSportLeagues(id); commit(); break;
    case 'pick-league': {
      obScroll();
      const sid = sportOf(id);
      if (S.leagues.includes(id)) {
        S.leagues = S.leagues.filter(x => x !== id);
        if (!ui.stickySports.includes(sid)) ui.stickySports.push(sid);
      } else ensureLeague(id);
      syncSportLeagues(); commit(); break;
    }
    case 'pick-team': obScroll(); toggleIn(S.teams, id); commit(); break;
    case 'pick-player': obScroll(); toggleIn(S.players, id); commit(); break;
    case 'pick-channel': obScroll(); toggleIn(S.channels, id); commit(); break;
    case 'pick-filter': obScroll(); ui.pickLeague = id; render(); break;
    case 'sport': ui.sport = id; render(); break;
    case 'sched-tab': ui.schedTab = id; ui.menu = false; render(); break;
    case 'sched-all': ui.schedTab = 'all'; ui.view = 'all'; ui.date = localToday(); go('#/schedule'); break;
    case 'espn-only': ui.espnOnly = !espnFilter(); render(); break;
    case 'menu': ui.menu = !ui.menu; render(); break;
    case 'view':
      ui.view = id; ui.menu = false;
      if (id === 'past') ui.date = latestPastDate();
      render(); break;
    case 'only-mine': ui.onlyMine = !ui.onlyMine; render(); break;
    case 'group': ui.group = id; render(); break;
    case 'group-pref': S.prefs.group = id; ui.group = null; commit(); break;
    case 'date': ui.date = shiftDate(ui.date, +id); render(); break;
    case 'today': ui.date = localToday(); if (ui.view === 'past') ui.view = 'all'; render(); break;
    case 'rec-toggle': ui.recOpen = !ui.recOpen; render(); break;
    case 'league-toggle': S.open[id] = el.getAttribute('aria-expanded') !== 'true'; commit(); break;
    case 'bell': toggleSchedule(id); break;
    case 'game': openSheet({ type: 'game', id }); break;
    case 'clip': openSheet({ type: 'clip', id }); break;
    case 'close': closeSheet(); break;
    case 'replay': {
      const rid = 'r-' + id;
      if (S.saved.includes(rid)) { S.saved = S.saved.filter(x => x !== rid); toast('Replay removed'); }
      else if (S.watched.includes(rid)) { toast('Already in Watched'); break; }
      else { S.saved.unshift(rid); toast('Replay saved to Library'); }
      commit(); break;
    }
    case 'reveal': reveal([id]); toast('Result shown'); commit(); break;
    case 'reveal-clip': { const c = getContent(id); reveal([id, c?.game?.id]); commit(); break; }
    case 'show-records': ui.showRecords = true; render(); break;
    case 'save': saveContent(id); break;
    case 'watched': markWatched(id); break;
    case 'unwatch': unwatch(id); break;
    case 'play': {
      const c = getContent(id);
      if (c.pending) { toast('Replay unlocks after the final whistle'); break; }
      S.progress[id] = Math.max(S.progress[id] || 0, 0.35);
      if (!S.saved.includes(id) && !S.watched.includes(id)) S.saved.unshift(id);
      toast('Opening in the ESPN app…'); commit(); break;
    }
    case 'lib-tab': ui.libTab = id; render(); break;
    case 'lib-type': ui.libType = id; render(); break;
    case 'lib-watched': ui.libTab = 'watched'; go('#/library'); break;
    case 'espn-toggle':
      S.espn = !S.espn;
      if (S.espn) { ESPN_HISTORY.forEach(h => { if (!S.watched.includes(h)) S.watched.push(h); }); importEspnFavs(); }
      toast(S.espn ? 'ESPN connected · favorites imported' : 'ESPN disconnected'); commit(); break;
    case 'edit': openSheet({ type: 'pick', kind: id }); break;
    case 'rm-league': unfollowLeague(id); commit(); break;
    case 'rm-team': S.teams = S.teams.filter(x => x !== id); toast(`Unfollowed ${team(id).name}`); commit(); break;
    case 'rm-player': S.players = S.players.filter(x => x !== id); toast(`Unfollowed ${player(id).name}`); commit(); break;
    case 'rm-channel': S.channels = S.channels.filter(x => x !== id); toast(`Unfollowed ${channel(id).name}`); commit(); break;
    case 'follow-team': followTeam(id); break;
    case 'follow-player': followPlayer(id); break;
    case 'follow-league':
      if (S.leagues.includes(id)) unfollowLeague(id);
      else { ensureLeague(id); toast(`Following ${league(id).name}`); }
      commit(); break;
    case 'team': openPage('team', id); break;
    case 'league': openPage('league', id); break;
    case 'page-back': go(ui.pageStack.pop() || '#/' + ui.tabFrom); break;
    case 'page-tab': ui.pageTab = id; render(); break;
    case 'search-open': ui.search = true; ui.menu = false; ui.sAll = null; render(); break;
    case 'search-close': ui.search = false; ui.sq = ''; ui.sAll = null; render(); break;
    case 'search-set': {
      ui.sq = id; ui.sAll = null;
      const inp = $('.search-screen input'); if (inp) inp.value = id;
      render(); break;
    }
    case 'search-all': ui.sAll = ui.sAll === id ? null : id; render(); break;
    case 'search-clear': S.recent = []; commit(); break;
    case 'pref':
      S.prefs[id] = !S.prefs[id];
      if (id === 'espnOnly') ui.espnOnly = null;
      if (id === 'spoilerFree') { ui.showRecords = false; toast(S.prefs.spoilerFree ? 'Spoiler-free mode on · scores hidden' : 'Scores visible'); }
      commit(); break;
    case 'home-pref': S.prefs.home = id; ui.schedTab = null; commit(); break;
    case 'reset':
      S = fresh(); save(); knownXp = null; knownLevel = null;
      Object.assign(ui, { schedTab: null, date: localToday(), sport: 'all', view: 'all', onlyMine: true, menu: false, espnOnly: null, group: null, libTab: 'towatch', libType: 'all', sheet: null, built: false, search: false, sq: '',
        stickySports: [], tabFrom: 'schedule', pageStack: [], pageTab: 'schedule', showRecords: false, levelUp: false });
      go('#/');
      break;
  }
});

function onField(e) {
  const kind = e.target.dataset.input;
  if (kind === 'q') {
    ui.q = e.target.value;
    const list = document.getElementById('pick-list');
    if (list) list.innerHTML = pickList(e.target.dataset.kind);
  } else if (kind === 'search') {
    ui.sq = e.target.value; ui.sAll = null;
    $('#search-results').innerHTML = searchResults();
  } else if (kind === 'tz' && e.type === 'change') {
    S.prefs.tz = e.target.value;
    ui.date = localToday();
    toast(`Times now in ${tzAbbr(PROTO_NOW)}`);
    commit();
  }
}
document.addEventListener('input', onField);
document.addEventListener('change', onField);
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.dataset.input === 'search') { rememberSearch(); save(); }
  if (e.key === 'Escape') {
    if (ui.menu) { ui.menu = false; render(); }
    else if (ui.sheet) closeSheet();
    else if (ui.search) { ui.search = false; ui.sq = ''; render(); }
  }
});

/* ---------- development checks on the sample data ---------- */
(function validateData() {
  const warn = (...m) => console.warn('[Fanatic data]', ...m);
  const seen = new Set();
  GAMES.forEach(g => {
    if (!league(g.league)) warn('unknown league', g.id, g.league);
    if (!isEvent(g) && (!TEAMS[g.away] || !TEAMS[g.home])) warn('unknown team', g.id, g.away, g.home);
    if (g.date < '2026-09-17' || g.date > '2026-09-30' || !/^\d{4}-\d\d-\d\d$/.test(g.date)) warn('date outside Sep 17–30', g.id, g.date);
    if (g.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(g.time)) warn('bad time', g.id, g.time);
    if (!NETWORKS.includes(g.network)) warn('unknown network', g.id, g.network);
    const k = [g.league, g.date, g.time, g.away, g.home, g.event].join('|');
    if (seen.has(k)) warn('duplicate game', g.id, k);
    seen.add(k);
    const done = g.date < TODAY || (g.date === TODAY && (!g.time || toMin(g.time) + gameLen(g) <= NOW_MIN));
    if (g.score && !done) warn('score on a game that has not finished at the prototype clock', g.id);
    (g.field || []).forEach(p => { if (!player(p)) warn('unknown player in field', g.id, p); });
  });
  PLAYERS.forEach(p => {
    if (p.team && !TEAMS[p.team]) warn('player on unknown team', p.id, p.team);
    if (!league(p.league)) warn('player in unknown league', p.id, p.league);
  });
  SPORTS.forEach(s => { const n = LEAGUES.filter(l => l.sport === s.id && l.popular).length; if (n !== 1) warn('sport needs exactly one popular league', s.id, n); });
  LEAGUES.forEach(l => { if (!sport(l.sport)) warn('league in unknown sport', l.id); });
  Object.keys(SAFE_TITLES).forEach(id => { if (!CONTENT.some(c => c.id === id)) warn('safe title for unknown clip', id); });
  Object.entries(RECORDS).forEach(([lid, raw]) => raw.split(';').map(s => s.trim()).filter(Boolean).forEach(s => {
    if (!TEAMS[`${lid}-${s.split('|')[0].trim()}`]) warn('standings row for unknown team', lid, s);
  }));
  [...ESPN_FAVORITES.teams.filter(t => !TEAMS[t]), ...ESPN_FAVORITES.players.filter(p => !player(p))].forEach(x => warn('unknown ESPN favorite', x));
})();

window.addEventListener('hashchange', render);
syncFanBaseline();
render();

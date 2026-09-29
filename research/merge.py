"""Merge a research fragment file (see SPEC.md) into ../data.js. Usage: python3 merge.py soccer.txt"""
import re, sys, os
here = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(here, sys.argv[1]); dst = os.path.join(here, '..', 'data.js')
tag = os.path.splitext(os.path.basename(src))[0]
merged_log = os.path.join(here, 'merged.txt')
done = open(merged_log).read().split() if os.path.exists(merged_log) else []
if tag in done: sys.exit(f'{tag} already merged')

sections, cur = {}, None
for line in open(src).read().splitlines():
    m = re.match(r'^// === ([A-Z_]+)\s*$', line)
    if m: cur = m.group(1); sections[cur] = []; continue
    if cur: sections[cur].append(line)
def body(name):  # keep code lines, drop full-line comments and blanks
    return [l for l in sections.get(name, []) if l.strip() and not l.strip().startswith('//')]

s = open(dst).read()
def insert_before_close(s, start_marker, close, text):
    i = s.index(start_marker); j = s.index(close, i)
    return s[:j] + text + s[j:]
hdr = f'  // --- {tag} research, verified Sep 28, 2026\n'
def block(lines): return hdr + '\n'.join('  ' + l.strip() for l in lines) + '\n'

if body('LEAGUES'): s = insert_before_close(s, 'const LEAGUES = [', '\n];', '\n' + block(body('LEAGUES')).rstrip('\n'))
if body('TEAM_ROWS'): s = insert_before_close(s, 'const TEAM_ROWS = {', '\n};', '\n' + block(body('TEAM_ROWS')).rstrip('\n'))
if body('GAME_ROWS'): s = insert_before_close(s, 'const GAME_ROWS = [', '\n];', '\n' + block(body('GAME_ROWS')).rstrip('\n'))
if body('EVENT_ROWS'): s = insert_before_close(s, 'const EVENT_ROWS = [', '\n];', '\n' + block(body('EVENT_ROWS')).rstrip('\n'))
if body('PLAYERS'):
    i = s.index('].map(([id, name, pos, team, lg, also])')
    s = s[:i] + block(body('PLAYERS')) + s[i:]
if body('RECORDS'):
    s = s.replace('const RECORDS = {};', 'const RECORDS = {\n};')
    s = insert_before_close(s, 'const RECORDS = {', '\n};', '\n' + block(body('RECORDS')).rstrip('\n'))
lens = [l.strip().rstrip(',') for l in body('GAME_LEN')]
if lens: s = insert_before_close(s, 'const LEAGUE_LEN = {', '\n};', '\n' + '\n'.join(f'  {l},' for l in lens))
for l in body('SHORTNAME'):
    m = re.match(r"\s*'?(\w+)'?\s*:\s*'?(pro|college|club)", l)
    if not m: continue
    lid, kind = m.groups()
    if kind == 'club': continue
    name = 'PRO_LEAGUES' if kind == 'pro' else 'COLLEGE_LEAGUES'
    s = re.sub(r"(const %s = \[)([^\]]*)\]" % name, lambda mm: f"{mm.group(1)}{mm.group(2)}, '{lid}']", s, count=1)
nets = re.findall(r"'([^']+)'", '\n'.join(l.split('//')[0] for l in body('NETWORKS_ADDED')))
for n in nets:
    if f"'{n}'" not in s.split('const NETWORKS = [')[1].split('];')[0]:
        s = s.replace("'Local TV', 'TBD'];", f"'{n}', 'Local TV', 'TBD'];", 1)
open(dst, 'w').write(s)
open(merged_log, 'a').write(tag + '\n')
print(tag, {k: len(body(k)) for k in sections if k not in ('NOTES', 'SOURCES')}, 'networks+', nets)

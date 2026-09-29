# Fanatic

A clickable prototype of a sports watch-list app. Fanatic builds a weekly watch schedule from the teams, players and shows you follow, and keeps highlights, recaps and full-game replays in one queue.

It's a class project built with plain HTML, CSS and JavaScript. There's no build step and nothing to install.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## What's in it

- **Onboarding:** pick sports, then leagues (every major league on any network; leagues that stream on ESPN are marked), then teams, players and shows.
- **Schedule:** your games by day or by player, all games by league, live and big-game views, and an "ESPN only" filter.
- **Team and league pages:** schedule, results, standings and clips, plus follow buttons.
- **Library:** a To Watch queue and a Watched list.
- **Spoiler-free mode:** hides final scores and result headlines until you tap to reveal or watch the replay.
- **Local time zones:** times show in your zone, or pick one in Profile.
- **Fan Level:** earn XP by watching and following, climb seven levels from Bandwagoner to Hall of Famer, and see the next steps for each level.

## Data

`data.js` holds real schedules, results and standings for **Sep 17–30, 2026**, gathered from league sites and public scoreboards. Sources are listed in `research/`. The prototype clock is fixed at **Thu Sep 24, 2026, 8:40 PM ET**, so games after that point show as upcoming.

The ESPN account connection is simulated. There is no sign-in, and nothing is sent anywhere. Fanatic is a student prototype and is not affiliated with ESPN or any league.

## Files

| File | What it is |
| --- | --- |
| `index.html` | App shell |
| `app.js` | UI, routing and state (saved in the browser's localStorage) |
| `data.js` | Sports, leagues, teams, players, games, clips and fan levels |
| `styles.css` | Styles |
| `artifact.html` | Copy of the shell used for the published Claude artifact |
| `research/` | Data research notes, sources and the merge script |

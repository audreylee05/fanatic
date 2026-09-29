// Fanatic sample data. Real schedules and results for Thu Sep 17 – Wed Sep 30, 2026.
// Sources: ESPN site API + ESPN Press Room, NFL.com, fbschedules.com, league sites, Wikipedia 2026 season pages.
// Every sport lists its major leagues on any network. `espn` marks leagues that stream on ESPN (true = all or most, 'some' = part).
// Clip titles are illustrative sample content.

// Group members credited on the welcome screen and in Profile.
const PROJECT = {
  members: ['Saumya Lohia', 'Audrey Lourdes Lee', 'Anandi Joshi', 'Meruyert Tastybay'],
  assignment: 'Group Assignment · Lecture 3',
};

const PROTO_NOW = new Date('2026-09-24T20:40:00-04:00'); // prototype clock: Thu 8:40 PM ET
const TODAY = '2026-09-24';

const SPORTS = [
  { id: 'football', name: 'Football' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'baseball', name: 'Baseball' },
  { id: 'hockey', name: 'Hockey' },
  { id: 'soccer', name: 'Soccer' },
  { id: 'golf', name: 'Golf' },
  { id: 'tennis', name: 'Tennis' },
  { id: 'volleyball', name: 'Volleyball' },
  { id: 'softball', name: 'Softball' },
  { id: 'lacrosse', name: 'Lacrosse' },
  { id: 'cricket', name: 'Cricket' },
  { id: 'rugby', name: 'Rugby' },
  { id: 'pickleball', name: 'Pickleball' },
];

const LEAGUES = [
  { id: 'nfl', sport: 'football', espn: 'some', name: 'NFL', short: 'NFL', popular: true, color: '#013369' },
  { id: 'cfb', sport: 'football', espn: 'some', name: 'College Football', short: 'NCAAF', color: '#1f5fa8' },
  { id: 'ufl', sport: 'football', espn: 'some', name: 'UFL', short: 'UFL', color: '#0b3d91', offweek: 'Season runs March–June', teamNote: 'UFL teams open for following when the 2027 schedule is set.' },
  { id: 'nba', sport: 'basketball', espn: 'some', name: 'NBA', short: 'NBA', popular: true, color: '#c9082a', offweek: 'Preseason tips off Oct 3' },
  { id: 'wnba', sport: 'basketball', espn: 'some', name: 'WNBA', short: 'WNBA', color: '#ff6f00' },
  { id: 'mcbb', sport: 'basketball', espn: 'some', name: "Men's College Basketball", short: 'NCAAM', color: '#2b5aa0', offweek: 'Season tips off in November' },
  { id: 'wcbb', sport: 'basketball', espn: 'some', name: "Women's College Basketball", short: 'NCAAW', color: '#8a3ab9', offweek: 'Season tips off in November' },
  { id: 'gleague', sport: 'basketball', espn: 'some', name: 'NBA G League', short: 'G LG', color: '#4b4b8f', offweek: 'Season tips off in November' },
  { id: 'mlb', sport: 'baseball', espn: 'some', name: 'MLB', short: 'MLB', popular: true, color: '#0b2d5b' },
  { id: 'cbase', sport: 'baseball', espn: 'some', name: 'College Baseball', short: 'NCAABB', color: '#305a3a', offweek: 'Season opens in February' },
  { id: 'nhl', sport: 'hockey', espn: 'some', name: 'NHL', short: 'NHL', popular: true, color: '#3a3a3a' },
  { id: 'chockey', sport: 'hockey', espn: 'some', name: 'College Hockey', short: 'NCAAH', color: '#1c4f7c', offweek: 'Season opens in October' },
  { id: 'laliga', sport: 'soccer', espn: true, name: 'LaLiga', short: 'LALIGA', color: '#ff4b44', offweek: 'International break · Matchday 8 starts Oct 9' },
  { id: 'nwsl', sport: 'soccer', espn: 'some', name: 'NWSL', short: 'NWSL', color: '#0b1f41' },
  { id: 'ligamx', sport: 'soccer', espn: 'some', name: 'Liga MX', short: 'LIGA MX', color: '#1a7a3a' },
  { id: 'pga', sport: 'golf', espn: 'some', name: 'PGA Tour', short: 'PGA', popular: true, kind: 'individual', athletes: 'golfers', color: '#0a2d5a', offweek: 'Next PGA Tour event Oct 1–4 in Utah' },
  { id: 'slams', sport: 'tennis', espn: 'some', name: 'Grand Slams', short: 'SLAMS', popular: true, kind: 'individual', athletes: 'players', color: '#1b6b3a', offweek: 'Next on ESPN: Australian Open in January' },
  { id: 'ncaavb', sport: 'volleyball', espn: 'some', name: "NCAA Women's Volleyball", short: 'NCAAVB', popular: true, color: '#7a2a8a' },
  { id: 'ncaasb', sport: 'softball', espn: true, name: 'College Softball', short: 'NCAASB', popular: true, color: '#c2571a', offweek: 'Season opens in February' },
  { id: 'pll', sport: 'lacrosse', espn: true, name: 'Premier Lacrosse League', short: 'PLL', popular: true, color: '#111111', offweek: 'Season complete · Waterdogs won the title Sep 20', offweekSafe: 'Season complete · Championship was Sep 20' },
  { id: 'wicricket', sport: 'cricket', espn: 'some', name: 'West Indies Cricket', short: 'WI', popular: true, color: '#7b0a2a', offweek: 'In India for 3 ODIs from Sep 27 · on Willow, not ESPN' },
  { id: 'mlr', sport: 'rugby', name: 'Major League Rugby', short: 'MLR', popular: true, color: '#0d3b66', offweek: 'Offseason · season runs spring to summer', teamNote: 'MLR teams open for following when the next season is set.' },
  { id: 'mlp', sport: 'pickleball', name: 'Major League Pickleball', short: 'MLP', popular: true, kind: 'individual', athletes: 'players', color: '#0f7c6c', offweek: 'Season wrapped in August' },
  // --- soccer research, verified Sep 28, 2026
  { id: 'epl', sport: 'soccer', name: 'Premier League', short: 'EPL', color: '#3D195B', espn: false, popular: true, offweek: 'International break · Matchweek 6 starts Oct 10' },
  { id: 'mls', sport: 'soccer', name: 'MLS', short: 'MLS', color: '#001F5B', espn: false },
  { id: 'ucl', sport: 'soccer', name: 'UEFA Champions League', short: 'UCL', color: '#0E1E5B', espn: false, offweek: 'League phase resumes with Matchday 2 on Oct 13–14' },
  { id: 'bund', sport: 'soccer', name: 'Bundesliga', short: 'BUND', color: '#D20515', espn: false, offweek: 'International break · Matchday 5 starts Oct 9' },
  // --- teamsports research, verified Sep 28, 2026
  { id: 'cfl', sport: 'football', name: 'Canadian Football League', short: 'CFL', color: '#C8102E', espn: false },
  { id: 'euroleague', sport: 'basketball', name: 'EuroLeague', short: 'EL', color: '#F47B20', espn: false },
  { id: 'nbl', sport: 'basketball', name: 'NBL (Australia)', short: 'NBL', color: '#1D1D1B', espn: false },
  { id: 'unrivaled', sport: 'basketball', name: 'Unrivaled', short: 'UNRVLD', color: '#40347D', espn: false, offweek: 'Offseason · Season 3 tips off in January 2027' },
  { id: 'npb', sport: 'baseball', name: 'Nippon Professional Baseball', short: 'NPB', color: '#002B5C', espn: false },
  { id: 'kbo', sport: 'baseball', name: 'KBO League', short: 'KBO', color: '#0A3D91', espn: false },
  { id: 'pwhl', sport: 'hockey', name: 'PWHL', short: 'PWHL', color: '#33058D', espn: false, offweek: 'Offseason · 2026–27 season opens Dec 5' },
  { id: 'ahl', sport: 'hockey', name: 'American Hockey League', short: 'AHL', color: '#231F20', espn: false, offweek: 'Season opens Oct 2' },
  // --- individual research, verified Sep 28, 2026
  { id: 'lpga', sport: 'golf', name: 'LPGA Tour', short: 'LPGA', color: '#00205B', espn: false, kind: 'individual', athletes: 'golfers' },
  { id: 'dpwt', sport: 'golf', name: 'DP World Tour', short: 'DPWT', color: '#0A1F44', espn: false, kind: 'individual', athletes: 'golfers' },
  { id: 'liv', sport: 'golf', name: 'LIV Golf', short: 'LIV', color: '#1A1A1A', espn: false, kind: 'individual', athletes: 'golfers', offweek: 'Season complete · Jon Rahm won the 2026 individual title' },
  { id: 'atp', sport: 'tennis', name: 'ATP Tour', short: 'ATP', color: '#00235B', espn: false, kind: 'individual', athletes: 'players' },
  { id: 'wta', sport: 'tennis', name: 'WTA Tour', short: 'WTA', color: '#5B2A86', espn: false, kind: 'individual', athletes: 'players' },
  { id: 'lovb', sport: 'volleyball', name: 'LOVB Pro', short: 'LOVB', color: '#0B1F3A', espn: 'some', offweek: 'Season opens Dec 17 in San Antonio' },
  { id: 'mlv', sport: 'volleyball', name: 'Major League Volleyball', short: 'MLV', color: '#12284C', espn: false, offweek: 'Offseason · Dallas Pulse won the 2026 title' },
  { id: 'ausl', sport: 'softball', name: 'Athletes Unlimited Softball League', short: 'AUSL', color: '#1D1D3B', espn: true, offweek: 'Offseason · Utah Talons won the 2026 title Jul 26' },
  { id: 'ncaaml', sport: 'lacrosse', name: "NCAA Men's Lacrosse", short: 'NCAAML', color: '#1f4e79', espn: true, offweek: 'Season opens in February · Princeton won the 2026 title' },
  { id: 'nll', sport: 'lacrosse', name: 'National Lacrosse League', short: 'NLL', color: '#0A2240', espn: true, offweek: 'Season opens Nov 27' },
  { id: 'cpl', sport: 'cricket', name: 'Caribbean Premier League', short: 'CPL', color: '#5B2C83', espn: false, offweek: 'Season complete · Falcons won the title Sep 20' },
  { id: 'ipl', sport: 'cricket', name: 'Indian Premier League', short: 'IPL', color: '#19398A', espn: false, offweek: 'Season complete · RCB won the 2026 title May 31' },
  { id: 'mlc', sport: 'cricket', name: 'Major League Cricket', short: 'MLC', color: '#002D62', espn: false, offweek: 'Season complete · LA Knight Riders won the title Jul 18' },
  { id: 'prem', sport: 'rugby', name: 'Premiership Rugby', short: 'PREM', color: '#0B2240', espn: false },
  { id: 'sixnations', sport: 'rugby', name: 'Six Nations', short: '6N', color: '#0B1E3F', espn: false, offweek: '2027 Championship opens Feb 5' },
  { id: 'rugbychamp', sport: 'rugby', name: 'Nations Championship', short: 'NATIONS', color: '#00205B', espn: false, offweek: 'No Tests this week · Nations Championship resumes Nov 6' },
  { id: 'ppa', sport: 'pickleball', name: 'PPA Tour', short: 'PPA', color: '#228BE6', espn: false, kind: 'individual', athletes: 'players' },
];

// One team per ";" entry: "ABBR|Name|#color" (college football adds "|Conference").
const TEAM_ROWS = {
  nfl: `ARI|Arizona Cardinals|#97233F;ATL|Atlanta Falcons|#A71930;BAL|Baltimore Ravens|#241773;BUF|Buffalo Bills|#00338D;
CAR|Carolina Panthers|#0085CA;CHI|Chicago Bears|#C83803;CIN|Cincinnati Bengals|#FB4F14;CLE|Cleveland Browns|#FF3C00;
DAL|Dallas Cowboys|#003594;DEN|Denver Broncos|#FB4F14;DET|Detroit Lions|#0076B6;GB|Green Bay Packers|#203731;
HOU|Houston Texans|#1F3A5F;IND|Indianapolis Colts|#1A4D8F;JAX|Jacksonville Jaguars|#006778;KC|Kansas City Chiefs|#E31837;
LV|Las Vegas Raiders|#A5ACAF;LAC|Los Angeles Chargers|#0080C6;LAR|Los Angeles Rams|#003594;MIA|Miami Dolphins|#008E97;
MIN|Minnesota Vikings|#4F2683;NE|New England Patriots|#1B3A66;NO|New Orleans Saints|#D3BC8D;NYG|New York Giants|#1D3A8A;
NYJ|New York Jets|#125740;PHI|Philadelphia Eagles|#004C54;PIT|Pittsburgh Steelers|#FFB612;SF|San Francisco 49ers|#AA0000;
SEA|Seattle Seahawks|#1D4F91;TB|Tampa Bay Buccaneers|#D50A0A;TEN|Tennessee Titans|#4B92DB;WAS|Washington Commanders|#5A1414`,
  cfb: `BAMA|Alabama Crimson Tide|#9E1B32|SEC;ARK|Arkansas Razorbacks|#A32136|SEC;AUB|Auburn Tigers|#E87722|SEC;FLA|Florida Gators|#0021A5|SEC;
UGA|Georgia Bulldogs|#BA0C2F|SEC;UK|Kentucky Wildcats|#0033A0|SEC;LSU|LSU Tigers|#461D7C|SEC;MSST|Mississippi State Bulldogs|#660000|SEC;
MIZ|Missouri Tigers|#F1B82D|SEC;OU|Oklahoma Sooners|#841617|SEC;MISS|Ole Miss Rebels|#CE1126|SEC;SC|South Carolina Gamecocks|#73000A|SEC;
TENN|Tennessee Volunteers|#FF8200|SEC;TAMU|Texas A&M Aggies|#500000|SEC;TEX|Texas Longhorns|#BF5700|SEC;VAN|Vanderbilt Commodores|#866D4B|SEC;
ILL|Illinois Fighting Illini|#E84A27|Big Ten;IU|Indiana Hoosiers|#990000|Big Ten;IOWA|Iowa Hawkeyes|#FCD116|Big Ten;MD|Maryland Terrapins|#CE1126|Big Ten;
MSU|Michigan State Spartans|#18453B|Big Ten;MICH|Michigan Wolverines|#00274C|Big Ten;MINN|Minnesota Golden Gophers|#7A0019|Big Ten;NEB|Nebraska Cornhuskers|#E41C38|Big Ten;
NU|Northwestern Wildcats|#4E2A84|Big Ten;OSU|Ohio State Buckeyes|#BB0000|Big Ten;ORE|Oregon Ducks|#154733|Big Ten;PSU|Penn State Nittany Lions|#041E42|Big Ten;
PUR|Purdue Boilermakers|#CEB888|Big Ten;RUTG|Rutgers Scarlet Knights|#CC0033|Big Ten;UCLA|UCLA Bruins|#2D68C4|Big Ten;USC|USC Trojans|#990000|Big Ten;
WASH|Washington Huskies|#4B2E83|Big Ten;WIS|Wisconsin Badgers|#C5050C|Big Ten;
ASU|Arizona State Sun Devils|#8C1D40|Big 12;ARIZ|Arizona Wildcats|#CC0033|Big 12;BYU|BYU Cougars|#002E5D|Big 12;BAY|Baylor Bears|#154734|Big 12;
CIN|Cincinnati Bearcats|#E00122|Big 12;COLO|Colorado Buffaloes|#CFB87C|Big 12;HOU|Houston Cougars|#C8102E|Big 12;ISU|Iowa State Cyclones|#C8102E|Big 12;
KU|Kansas Jayhawks|#0051BA|Big 12;KSU|Kansas State Wildcats|#512888|Big 12;OKST|Oklahoma State Cowboys|#FE5C00|Big 12;TCU|TCU Horned Frogs|#4D1979|Big 12;
TTU|Texas Tech Red Raiders|#CC0000|Big 12;UCF|UCF Knights|#BA9B37|Big 12;UTAH|Utah Utes|#BE0000|Big 12;WVU|West Virginia Mountaineers|#EAAA00|Big 12;
BC|Boston College Eagles|#98002E|ACC;CAL|California Golden Bears|#003262|ACC;CLEM|Clemson Tigers|#F56600|ACC;DUKE|Duke Blue Devils|#00539B|ACC;
FSU|Florida State Seminoles|#782F40|ACC;GT|Georgia Tech Yellow Jackets|#B3A369|ACC;LOU|Louisville Cardinals|#AD0000|ACC;MIA|Miami Hurricanes|#F47423|ACC;
NCST|NC State Wolfpack|#CC0000|ACC;UNC|North Carolina Tar Heels|#7BAFD4|ACC;PITT|Pittsburgh Panthers|#003594|ACC;SMU|SMU Mustangs|#C8102E|ACC;
STAN|Stanford Cardinal|#8C1515|ACC;SYR|Syracuse Orange|#F76900|ACC;UVA|Virginia Cavaliers|#F84C1E|ACC;VT|Virginia Tech Hokies|#630031|ACC;
WAKE|Wake Forest Demon Deacons|#9E7E38|ACC;ND|Notre Dame Fighting Irish|#0C2340|Independent;
APP|App State Mountaineers|#FFCC00|Other FBS & FCS;BSU|Boise State Broncos|#0033A0|Other FBS & FCS;UCA|Central Arkansas Bears|#4F2D7F|Other FBS & FCS;
CMU|Central Michigan Chippewas|#6A0032|Other FBS & FCS;CCU|Coastal Carolina Chanticleers|#006F71|Other FBS & FCS;CSU|Colorado State Rams|#1E4D2B|Other FBS & FCS;
DEL|Delaware Blue Hens|#00539F|Other FBS & FCS;GASO|Georgia Southern Eagles|#87714D|Other FBS & FCS;LIB|Liberty Flames|#0A254E|Other FBS & FCS;
MOST|Missouri State Bears|#5E0009|Other FBS & FCS;NAVY|Navy Midshipmen|#00205B|Other FBS & FCS;UNM|New Mexico Lobos|#BA0C2F|Other FBS & FCS;
SHSU|Sam Houston Bearkats|#F47B20|Other FBS & FCS;USA|South Alabama Jaguars|#00205B|Other FBS & FCS;TULN|Tulane Green Wave|#006747|Other FBS & FCS;
UAB|UAB Blazers|#1E6B52|Other FBS & FCS;UTSA|UTSA Roadrunners|#F15A22|Other FBS & FCS;WMU|Western Michigan Broncos|#6C4023|Other FBS & FCS`,
  nba: `ATL|Atlanta Hawks|#C8102E;BOS|Boston Celtics|#007A33;BKN|Brooklyn Nets|#3A3A3A;CHA|Charlotte Hornets|#00788C;CHI|Chicago Bulls|#CE1141;
CLE|Cleveland Cavaliers|#860038;DAL|Dallas Mavericks|#00538C;DEN|Denver Nuggets|#FEC524;DET|Detroit Pistons|#1D428A;GSW|Golden State Warriors|#1D428A;
HOU|Houston Rockets|#CE1141;IND|Indiana Pacers|#FDBB30;LAC|LA Clippers|#C8102E;LAL|Los Angeles Lakers|#552583;MEM|Memphis Grizzlies|#5D76A9;
MIA|Miami Heat|#98002E;MIL|Milwaukee Bucks|#00471B;MIN|Minnesota Timberwolves|#236192;NOP|New Orleans Pelicans|#0C2340;NYK|New York Knicks|#F58426;
OKC|Oklahoma City Thunder|#007AC1;ORL|Orlando Magic|#0077C0;PHI|Philadelphia 76ers|#006BB6;PHX|Phoenix Suns|#E56020;POR|Portland Trail Blazers|#E03A3E;
SAC|Sacramento Kings|#5A2D81;SAS|San Antonio Spurs|#8A8D8F;TOR|Toronto Raptors|#CE1141;UTA|Utah Jazz|#4E008E;WAS|Washington Wizards|#002B5C`,
  wnba: `ATL|Atlanta Dream|#E31837;CHI|Chicago Sky|#418FDE;CON|Connecticut Sun|#F05023;DAL|Dallas Wings|#C4D600;GSV|Golden State Valkyries|#B896D4;
IND|Indiana Fever|#E03A3E;LVA|Las Vegas Aces|#C8102E;LA|Los Angeles Sparks|#702F8A;MIN|Minnesota Lynx|#236192;NYL|New York Liberty|#6ECEB2;
PHX|Phoenix Mercury|#CB6015;POR|Portland Fire|#C8102E;SEA|Seattle Storm|#2C5234;TOR|Toronto Tempo|#441E36;WAS|Washington Mystics|#0C2340`,
  mcbb: `DUKE|Duke Blue Devils|#003087;UCONN|UConn Huskies|#0E1A3F;KU|Kansas Jayhawks|#0051BA;UK|Kentucky Wildcats|#0033A0;UNC|North Carolina Tar Heels|#7BAFD4;
HOU|Houston Cougars|#C8102E;PUR|Purdue Boilermakers|#CEB888;ARIZ|Arizona Wildcats|#CC0033;FLA|Florida Gators|#0021A5;AUB|Auburn Tigers|#E87722`,
  wcbb: `UCONN|UConn Huskies|#0E1A3F;SC|South Carolina Gamecocks|#73000A;UCLA|UCLA Bruins|#2D68C4;LSU|LSU Tigers|#461D7C;TEX|Texas Longhorns|#BF5700;
ND|Notre Dame Fighting Irish|#0C2340;TENN|Tennessee Lady Vols|#FF8200;USC|USC Trojans|#990000;DUKE|Duke Blue Devils|#003087;OU|Oklahoma Sooners|#841617`,
  gleague: `SBL|South Bay Lakers|#552583;MNE|Maine Celtics|#007A33;SCW|Santa Cruz Warriors|#1D428A;WCK|Westchester Knicks|#F58426;OKCB|Oklahoma City Blue|#007AC1;AUS|Austin Spurs|#8A8D8F`,
  mlb: `ARI|Arizona Diamondbacks|#A71930;ATH|Athletics|#003831;ATL|Atlanta Braves|#CE1141;BAL|Baltimore Orioles|#DF4601;BOS|Boston Red Sox|#BD3039;
CHC|Chicago Cubs|#0E3386;CWS|Chicago White Sox|#4A4A4A;CIN|Cincinnati Reds|#C6011F;CLE|Cleveland Guardians|#E50022;COL|Colorado Rockies|#33006F;
DET|Detroit Tigers|#FA4616;HOU|Houston Astros|#EB6E1F;KC|Kansas City Royals|#004687;LAA|Los Angeles Angels|#BA0021;LAD|Los Angeles Dodgers|#005A9C;
MIA|Miami Marlins|#00A3E0;MIL|Milwaukee Brewers|#FFC52F;MIN|Minnesota Twins|#D31145;NYM|New York Mets|#FF5910;NYY|New York Yankees|#1C2841;
PHI|Philadelphia Phillies|#E81828;PIT|Pittsburgh Pirates|#FDB827;SD|San Diego Padres|#FFC425;SF|San Francisco Giants|#FD5A1E;SEA|Seattle Mariners|#005C5C;
STL|St. Louis Cardinals|#C41E3A;TB|Tampa Bay Rays|#8FBCE6;TEX|Texas Rangers|#003278;TOR|Toronto Blue Jays|#134A8E;WSH|Washington Nationals|#AB0003`,
  cbase: `LSU|LSU Tigers|#461D7C;TENN|Tennessee Volunteers|#FF8200;TAMU|Texas A&M Aggies|#500000;FLA|Florida Gators|#0021A5;ARK|Arkansas Razorbacks|#9D2235;
VAN|Vanderbilt Commodores|#866D4B;WAKE|Wake Forest Demon Deacons|#9E7E38;UVA|Virginia Cavaliers|#F84C1E;TEX|Texas Longhorns|#BF5700;UNC|North Carolina Tar Heels|#7BAFD4`,
  nhl: `ANA|Anaheim Ducks|#F47A38;BOS|Boston Bruins|#FFB81C;BUF|Buffalo Sabres|#003087;CGY|Calgary Flames|#C8102E;CAR|Carolina Hurricanes|#CC0000;
CHI|Chicago Blackhawks|#CF0A2C;COL|Colorado Avalanche|#6F263D;CBJ|Columbus Blue Jackets|#002654;DAL|Dallas Stars|#006847;DET|Detroit Red Wings|#CE1126;
EDM|Edmonton Oilers|#FF4C00;FLA|Florida Panthers|#C8102E;LAK|Los Angeles Kings|#A2AAAD;MIN|Minnesota Wild|#154734;MTL|Montreal Canadiens|#AF1E2D;
NSH|Nashville Predators|#FFB81C;NJD|New Jersey Devils|#CE1126;NYI|New York Islanders|#00539B;NYR|New York Rangers|#0038A8;OTT|Ottawa Senators|#C52032;
PHI|Philadelphia Flyers|#F74902;PIT|Pittsburgh Penguins|#FCB514;SJS|San Jose Sharks|#006D75;SEA|Seattle Kraken|#99D9D9;STL|St. Louis Blues|#002F87;
TBL|Tampa Bay Lightning|#002868;TOR|Toronto Maple Leafs|#00205B;UTA|Utah Mammoth|#7AB2E0;VAN|Vancouver Canucks|#00843D;VGK|Vegas Golden Knights|#B4975A;
WSH|Washington Capitals|#C8102E;WPG|Winnipeg Jets|#004C97`,
  chockey: `BC|Boston College Eagles|#98002E;BU|Boston University Terriers|#CC0000;MICH|Michigan Wolverines|#00274C;MINN|Minnesota Golden Gophers|#7A0019;
DEN|Denver Pioneers|#8B2332;MSU|Michigan State Spartans|#18453B;UND|North Dakota Fighting Hawks|#009A44;WIS|Wisconsin Badgers|#C5050C`,
  laliga: `ALA|Alavés|#0761AF;ATH|Athletic Club|#EE2523;ATM|Atlético Madrid|#CB3524;BAR|FC Barcelona|#A50044;CEL|Celta Vigo|#6CACE4;
DEP|Deportivo La Coruña|#3366CC;ELC|Elche|#288A00;ESP|Espanyol|#3366CC;GET|Getafe|#0000FF;LEV|Levante|#C8142F;
MCF|Málaga|#6CACE4;OSA|Osasuna|#CD0000;RAC|Racing Santander|#3B6C1A;RAY|Rayo Vallecano|#CD0000;BET|Real Betis|#288A00;
RMA|Real Madrid|#FEBE10;RSO|Real Sociedad|#3366CC;SEV|Sevilla|#D81022;VAL|Valencia|#FF6F00;VIL|Villarreal|#FFE667`,
  nwsl: `LA|Angel City FC|#202121;BAY|Bay FC|#FF5049;BOS|Boston Legacy FC|#1F6B45;CHI|Chicago Stars FC|#C7102E;DEN|Denver Summit FC|#20604E;
GFC|Gotham FC|#A9F1FD;HOU|Houston Dash|#FF6900;KC|Kansas City Current|#CF3339;NC|North Carolina Courage|#AB0033;ORL|Orlando Pride|#60269E;
POR|Portland Thorns FC|#99242B;LOU|Racing Louisville FC|#C5B5F2;SD|San Diego Wave FC|#032E62;SEA|Seattle Reign FC|#2E407A;UTA|Utah Royals|#AE122A;WAS|Washington Spirit|#EDE939`,
  ligamx: `AME|América|#FFE600;ATL|Atlante|#022789;ATS|Atlas|#EF0107;ASL|Atlético de San Luis|#DFA829;CAZ|Cruz Azul|#0047AB;
JUA|FC Juárez|#89F442;GDL|Guadalajara|#EF0107;LEO|León|#008000;MTY|Monterrey|#001C58;NCX|Necaxa|#C8102E;
PAC|Pachuca|#02B0D0;PUE|Puebla|#0032A8;UNAM|Pumas UNAM|#060040;QRO|Querétaro|#02B0D0;SAN|Santos Laguna|#15926D;
UANL|Tigres UANL|#FFD011;TIJ|Tijuana|#B5121B;TOL|Toluca|#D5001C`,
  ncaavb: `TEX|Texas Longhorns|#BF5700;TENN|Tennessee Volunteers|#FF8200;STAN|Stanford Cardinal|#8C1515;SMU|SMU Mustangs|#C8102E;IU|Indiana Hoosiers|#990000;
WIS|Wisconsin Badgers|#C5050C;UK|Kentucky Wildcats|#0033A0;CAL|California Golden Bears|#003262;MISS|Ole Miss Rebels|#CE1126;BAMA|Alabama Crimson Tide|#9E1B32;
UNC|North Carolina Tar Heels|#7BAFD4;WAKE|Wake Forest Demon Deacons|#9E7E38;PITT|Pittsburgh Panthers|#003594;VAN|Vanderbilt Commodores|#866D4B;LSU|LSU Tigers|#461D7C;
NEB|Nebraska Cornhuskers|#E41C38;LOU|Louisville Cardinals|#AD0000;FLA|Florida Gators|#0021A5;ASU|Arizona State Sun Devils|#8C1D40;PUR|Purdue Boilermakers|#CEB888`,
  ncaasb: `OU|Oklahoma Sooners|#841617;TEX|Texas Longhorns|#BF5700;TENN|Tennessee Volunteers|#FF8200;FLA|Florida Gators|#0021A5;UCLA|UCLA Bruins|#2D68C4;
TTU|Texas Tech Red Raiders|#CC0000;OKST|Oklahoma State Cowgirls|#FE5C00;FSU|Florida State Seminoles|#782F40`,
  pll: `CAN|Boston Cannons|#011E41;RED|California Redwoods|#0C7056;CHA|Carolina Chaos|#E4002B;OUT|Denver Outlaws|#E65F00;
WHP|Maryland Whipsnakes|#3CDBC0;ATL|New York Atlas|#0CB7F2;WAT|Philadelphia Waterdogs|#9932CC;ARC|Utah Archers|#EF694D`,
  wicricket: `WI|West Indies|#7B0A2A`,
  // --- soccer research, verified Sep 28, 2026
  epl: `ARS|Arsenal|#EF0107;AVL|Aston Villa|#670E36;BOU|Bournemouth|#DA291C;BRE|Brentford|#E30613;BHA|Brighton & Hove Albion|#0057B8;
  CHE|Chelsea|#034694;COV|Coventry City|#59CBE8;CRY|Crystal Palace|#1B458F;EVE|Everton|#003399;FUL|Fulham|#000000;
  HUL|Hull City|#F5A12D;IPS|Ipswich Town|#0044A9;LEE|Leeds United|#1D428A;LIV|Liverpool|#C8102E;MCI|Manchester City|#6CABDD;
  MUN|Manchester United|#DA291C;NEW|Newcastle United|#241F20;NFO|Nottingham Forest|#DD0000;SUN|Sunderland|#EB172B;TOT|Tottenham Hotspur|#132257`,
  mls: `ATL|Atlanta United FC|#9D2235;ATX|Austin FC|#00B140;MTL|CF Montréal|#0033A1;CLT|Charlotte FC|#0085CA;CHI|Chicago Fire FC|#C8102E;
  COL|Colorado Rapids|#8A2432;CLB|Columbus Crew|#FEDD00;DC|D.C. United|#000000;CIN|FC Cincinnati|#003087;DAL|FC Dallas|#C6093B;
  HOU|Houston Dynamo FC|#FF6B00;MIA|Inter Miami CF|#F7B5CD;LA|LA Galaxy|#00245D;LAFC|LAFC|#C39E6D;MIN|Minnesota United FC|#8CD2F4;
  NSH|Nashville SC|#ECE83A;NE|New England Revolution|#022166;NYC|New York City FC|#6CACE4;ORL|Orlando City SC|#633492;PHI|Philadelphia Union|#071B2C;
  POR|Portland Timbers|#004812;RSL|Real Salt Lake|#B30838;RBNY|Red Bull New York|#ED1E36;SD|San Diego FC|#697A7C;SJ|San Jose Earthquakes|#0067B1;
  SEA|Seattle Sounders FC|#5D9741;SKC|Sporting Kansas City|#93B1D7;STL|St. Louis CITY SC|#EC1458;TOR|Toronto FC|#B81137;VAN|Vancouver Whitecaps FC|#00245E`,
  ucl: `AEK|AEK Athens|#FFD100;ROMA|AS Roma|#8E1F2F;ARS|Arsenal|#EF0107;AVL|Aston Villa|#670E36;ATM|Atlético Madrid|#CB3524;
  BAR|FC Barcelona|#A50044;FCB|Bayern Munich|#DC052D;BOD|Bodø/Glimt|#FCEE33;BVB|Borussia Dortmund|#FDE100;BRU|Club Brugge|#0078C1;
  COMO|Como|#1E3A8A;FCP|FC Porto|#003893;FEN|Fenerbahçe|#163962;FEY|Feyenoord|#E30613;GAL|Galatasaray|#A90432;
  INT|Inter|#010E80;LASK|LASK|#000000;RCL|Lens|#E91514;LIL|Lille|#E01E13;LIV|Liverpool|#C8102E;
  MCI|Manchester City|#6CABDD;MUN|Manchester United|#DA291C;NAP|Napoli|#12A0D7;PSG|Paris Saint-Germain|#004170;PSV|PSV Eindhoven|#ED1C24;
  RBL|RB Leipzig|#DD0741;BET|Real Betis|#288A00;RMA|Real Madrid|#FEBE10;SAB|Sabah|#000000;SHK|Shakhtar Donetsk|#F26522;
  SLP|Slavia Prague|#DC1F26;SLB|Slovan Bratislava|#74B4E3;SCP|Sporting CP|#008057;VFB|VfB Stuttgart|#E32219;VIK|Viking FK|#002F6C;VIL|Villarreal|#FFE667`,
  bund: `FCB|Bayern Munich|#DC052D;BVB|Borussia Dortmund|#FDE100;LEV|Bayer Leverkusen|#E32221;RBL|RB Leipzig|#DD0741;SGE|Eintracht Frankfurt|#E1000F;
  VFB|VfB Stuttgart|#E32219;SCF|SC Freiburg|#E2001A;FCA|FC Augsburg|#BA3733;MAI|Mainz 05|#C3141E;SVW|Werder Bremen|#1D9053;
  ELV|SV Elversberg|#000000;SCH|Schalke 04|#004D9D;PAD|SC Paderborn|#005CA9;KOE|1. FC Köln|#ED1C24;TSG|TSG Hoffenheim|#1961B5;
  HSV|Hamburger SV|#0A3F86;FCU|Union Berlin|#EB1923;BMG|Borussia Mönchengladbach|#000000`,
  // --- teamsports research, verified Sep 28, 2026
  cfl: `BC|BC Lions|#F15623;CGY|Calgary Stampeders|#CC202C;EDM|Edmonton Elks|#2B5134;SSK|Saskatchewan Roughriders|#006241;WPG|Winnipeg Blue Bombers|#1E3D79;
  HAM|Hamilton Tiger-Cats|#FCB525;MTL|Montreal Alouettes|#071D49;OTT|Ottawa Redblacks|#AC1F2D;TOR|Toronto Argonauts|#0A2240`,
  euroleague: `EFS|Anadolu Efes|#213557;BAR|Barcelona|#A50044;BKN|Baskonia|#CE0E2D;BAY|Bayern Munich|#ED0037;CZV|Crvena Zvezda|#EC1C24;
  DUB|Dubai Basketball|#5C4033;MIL|Olimpia Milano|#E2231A;FEN|Fenerbahçe|#FFED00;HTA|Hapoel Tel Aviv|#CC0305;ASV|ASVEL|#000000;
  MTA|Maccabi Tel Aviv|#FCE13C;BJK|Beşiktaş|#000000;OLY|Olympiacos|#D0061F;PAO|Panathinaikos|#007942;PBB|Paris Basketball|#000000;
  PAR|Partizan|#000000;RMB|Real Madrid|#FEBE10;VBC|Valencia Basket|#FE5900;VIR|Virtus Bologna|#222222;ZAL|Žalgiris|#006D3E`,
  nbl: `ADL|Adelaide 36ers|#000943;BRI|Brisbane Bullets|#064591;CNS|Cairns Taipans|#F79239;ILL|Illawarra Hawks|#000000;MEL|Melbourne United|#000526;
  NZB|New Zealand Breakers|#000000;PER|Perth Wildcats|#EE0000;SEM|South East Melbourne Phoenix|#303030;SYD|Sydney Kings|#5B4099;TAS|Tasmania JackJumpers|#012A22`,
  unrivaled: `BRZ|Breeze BC|#4C3971;HIV|Hive BC|#FFC728;LAC|Laces BC|#74B29F;LUN|Lunar Owls BC|#40347D;MST|Mist BC|#A3D3E7;
  PHA|Phantom BC|#000000;ROS|Rose BC|#DDA493;VIN|Vinyl BC|#820234`,
  npb: `HAN|Hanshin Tigers|#FFD101;YOM|Yomiuri Giants|#ED9E21;YDB|Yokohama DeNA BayStars|#003F8E;HIR|Hiroshima Toyo Carp|#B50A14;YAK|Tokyo Yakult Swallows|#05294D;CHU|Chunichi Dragons|#003884;
  SOF|Fukuoka SoftBank Hawks|#FFC30F;SEI|Saitama Seibu Lions|#102951;NIP|Hokkaido Nippon-Ham Fighters|#006298;ORI|Orix Buffaloes|#000020;LOT|Chiba Lotte Marines|#000000;RAK|Tohoku Rakuten Golden Eagles|#870010`,
  kbo: `KT|KT Wiz|#000000;SAM|Samsung Lions|#074CA1;LG|LG Twins|#C7004E;KIA|Kia Tigers|#EA0029;DOO|Doosan Bears|#131230;
  NC|NC Dinos|#002B69;LOT|Lotte Giants|#0C2340;SSG|SSG Landers|#CE0E2D;HAN|Hanwha Eagles|#FC4E00;KIW|Kiwoom Heroes|#570514`,
  pwhl: `BOS|Boston Fleet|#173F35;MIN|Minnesota Frost|#250E62;MTL|Montréal Victoire|#862633;NY|New York Sirens|#00BFB3;OTT|Ottawa Charge|#A6192E;
  TOR|Toronto Sceptres|#0067B9;SEA|Seattle Torrent|#0A5458;VAN|Vancouver Goldeneyes|#10457F;DET|PWHL Detroit|#000000;HAM|PWHL Hamilton|#F2A900;
  LV|PWHL Las Vegas|#717237;SJ|PWHL San Jose|#F69245`,
  ahl: `CLT|Charlotte Checkers|#F5002A;HFD|Hartford Wolf Pack|#00548E;HER|Hershey Bears|#472A2B;LV|Lehigh Valley Phantoms|#F58427;PRO|Providence Bruins|#231F20;
  SPR|Springfield Thunderbirds|#E31837;WBS|Wilkes-Barre/Scranton Penguins|#1E191A;BEL|Belleville Senators|#E4103C;CLE|Cleveland Monsters|#115687;HAM|Hamilton Hammers|#00539B;
  LAV|Laval Rocket|#083A81;ROC|Rochester Americans|#DF2442;SYR|Syracuse Crunch|#1D427C;TOR|Toronto Marlies|#003C7F;UTI|Utica Comets|#CF1F30;
  CHI|Chicago Wolves|#50000A;GR|Grand Rapids Griffins|#231F20;IA|Iowa Wild|#004F30;MB|Manitoba Moose|#041E41;MIL|Milwaukee Admirals|#0E2B58;
  RFD|Rockford IceHogs|#DA1A32;TEX|Texas Stars|#14602D;ABB|Abbotsford Canucks|#007934;BAK|Bakersfield Condors|#00205B;CGY|Calgary Wranglers|#CE0E2D;
  CV|Coachella Valley Firebirds|#001425;COL|Colorado Eagles|#12368B;HSK|Henderson Silver Knights|#C3C7C9;ONT|Ontario Reign|#000000;SD|San Diego Gulls|#231F20;
  SJ|San Jose Barracuda|#216B74;TUC|Tucson Roadrunners|#6F263D`,
  // --- individual research, verified Sep 28, 2026
  lovb: `ATL|LOVB Atlanta|#C8102E;AUS|LOVB Austin|#E35205;HOU|LOVB Houston|#002D72;LA|Los Angeles Orbit|#3A2A6B;MAD|LOVB Madison|#C5050C;
  MIA|LOVB Miami|#00A3AD;MIN|LOVB Minnesota|#0A3161;NEB|LOVB Nebraska|#D00000;SLC|LOVB Salt Lake|#1F4E79;SF|SF Signal|#F2A900`,
  mlv: `ATL|Atlanta Vibe|#B5D334;CLB|Columbus Fury|#D22630;DAL|Dallas Pulse|#E4007C;GR|Grand Rapids Rise|#F47B20;IND|Indy Ignite|#E35205;
  OMA|Omaha Supernovas|#4B2E83;ORL|Orlando Valkyries|#6A2C91;VGS|Vegas Thrill|#00A9CE;DC|DC Flight|#0A3161;MIN|Minnesota Forge|#1B365D;NCR|NorCal Rumble|#C8102E`,
  ausl: `CHI|Chicago Bandits|#0C2340;CAR|Carolina Blaze|#E35205;POR|Portland Cascade|#006B3F;OKC|Oklahoma City Spark|#F2A900;UTA|Utah Talons|#5B2C83;TEX|Texas Volts|#00A3E0`,
  ncaaml: `PRIN|Princeton Tigers|#E77500;ND|Notre Dame Fighting Irish|#0C2340;SYR|Syracuse Orange|#F76900;DUKE|Duke Blue Devils|#003087;
  UNC|North Carolina Tar Heels|#7BAFD4;PSU|Penn State Nittany Lions|#041E42;RICH|Richmond Spiders|#990000;JHU|Johns Hopkins Blue Jays|#002D72;
  GTWN|Georgetown Hoyas|#041E42;COR|Cornell Big Red|#B31B1B;UVA|Virginia Cavaliers|#F84C1E;YALE|Yale Bulldogs|#00356B`,
  nll: `BUF|Buffalo Bandits|#FF671F;CGY|Calgary Roughnecks|#97999B;COL|Colorado Mammoth|#8A2432;GA|Georgia Swarm|#002855;
  HFX|Halifax Thunderbirds|#582C83;LV|Las Vegas Desert Dogs|#010101;OSH|Oshawa FireWolves|#7A303F;ROC|Rochester Knighthawks|#4D5A31;
  SD|San Diego Seals|#62269E;SAS|Saskatchewan Rush|#70BF4A;TOR|Toronto Rock|#003DA5;VAN|Vancouver Warriors|#B3A168`,
  cpl: `ABF|Antigua and Barbuda Falcons|#E8172C;BT|Barbados Tridents|#F40BEC;GAW|Guyana Amazon Warriors|#00843D;JAK|Jamaica Kingsmen|#009B3A;
  SKNP|St Kitts and Nevis Patriots|#E90C0C;SLK|St Lucia Kings|#0DC4F2;TKR|Trinbago Knight Riders|#D11F2A`,
  ipl: `CSK|Chennai Super Kings|#FDB913;DC|Delhi Capitals|#17449B;GT|Gujarat Titans|#1B2133;KKR|Kolkata Knight Riders|#3A225D;LSG|Lucknow Super Giants|#0057E2;
  MI|Mumbai Indians|#004BA0;PBKS|Punjab Kings|#DD1F2D;RR|Rajasthan Royals|#EA1A85;RCB|Royal Challengers Bengaluru|#EC1C24;SRH|Sunrisers Hyderabad|#F26522`,
  mlc: `LAKR|Los Angeles Knight Riders|#3A225D;MINY|MI New York|#004BA0;SFU|San Francisco Unicorns|#F26522;SEO|Seattle Orcas|#002D62;
  TSK|Texas Super Kings|#FDB913;WAF|Washington Freedom|#C8102E`,
  prem: `BAT|Bath Rugby|#1B3B6F;BRI|Bristol Bears|#0A2D6E;EXE|Exeter Chiefs|#000000;GLO|Gloucester Rugby|#C8102E;HAR|Harlequins|#6CACE4;
  LEI|Leicester Tigers|#00543C;NEW|Newcastle Red Bulls|#DB0A40;NOR|Northampton Saints|#00553E;SAL|Sale Sharks|#002D62;SAR|Saracens|#1A1A1A`,
  sixnations: `ENG|England|#E4002B;FRA|France|#002395;IRE|Ireland|#169B62;ITA|Italy|#0066B3;SCO|Scotland|#003A70;WAL|Wales|#D30731`,
  rugbychamp: `ARG|Argentina|#75AADB;AUS|Australia|#FFCD00;FIJ|Fiji|#1F1F1F;JPN|Japan|#D7002A;NZL|New Zealand|#000000;RSA|South Africa|#006A4E`,
};

// Compact names for dense rows: nickname for pro teams, school for college, full name for clubs.
const PRO_NICK2 = ['Desert Dogs', 'Wolf Pack', 'Silver Knights', 'Blue Bombers', 'Golden Eagles', 'Red Sox', 'White Sox', 'Blue Jays', 'Red Wings', 'Blue Jackets', 'Maple Leafs', 'Golden Knights', 'Trail Blazers'];
const COLLEGE_MASCOT2 = ['Blue Jays', 'Big Red', 'Crimson Tide', 'Fighting Illini', 'Demon Deacons', 'Blue Hens', 'Tar Heels', 'Blue Devils', 'Fighting Irish', 'Golden Gophers',
  'Nittany Lions', 'Scarlet Knights', 'Sun Devils', 'Horned Frogs', 'Red Raiders', 'Golden Bears', 'Yellow Jackets', 'Green Wave', 'Fighting Hawks', 'Lady Vols'];
const PRO_LEAGUES = ['nfl', 'nba', 'wnba', 'mlb', 'nhl', 'pll', 'cfl', 'nbl', 'npb', 'kbo', 'pwhl', 'ahl', 'mlv', 'ausl', 'nll'];
const COLLEGE_LEAGUES = ['cfb', 'mcbb', 'wcbb', 'cbase', 'chockey', 'ncaavb', 'ncaasb', 'ncaaml'];
const SHORT_NAMES = { 'Melbourne United': 'Melbourne', 'PWHL Detroit': 'Detroit', 'PWHL Hamilton': 'Hamilton', 'PWHL Las Vegas': 'Las Vegas', 'PWHL San Jose': 'San Jose' };
function shortName(league, name) {
  if (SHORT_NAMES[name]) return SHORT_NAMES[name];
  if (PRO_LEAGUES.includes(league)) {
    return PRO_NICK2.find(n => name.endsWith(n)) || name.split(' ').pop();
  }
  if (COLLEGE_LEAGUES.includes(league)) {
    const m2 = COLLEGE_MASCOT2.find(n => name.endsWith(' ' + n));
    return m2 ? name.slice(0, -m2.length - 1) : name.split(' ').slice(0, -1).join(' ') || name;
  }
  return name.replace(/ FC$/, '');
}

const TEAMS = {};
for (const [league, rows] of Object.entries(TEAM_ROWS)) {
  rows.split(';').map(r => r.trim()).filter(Boolean).forEach(r => {
    const [abbr, name, color, conf] = r.split('|');
    TEAMS[`${league}-${abbr}`] = { id: `${league}-${abbr}`, league, abbr, name, color, conf, short: shortName(league, name) };
  });
}

// AP Top 25 (Sep 20) and AVCA volleyball Top 15 (Sep 21), shown as a rank before the school.
const RANKS = {
  'cfb-TEX': 1, 'cfb-UGA': 2, 'cfb-ND': 3, 'cfb-MISS': 4, 'cfb-IU': 5, 'cfb-MIA': 6, 'cfb-OSU': 7, 'cfb-BAMA': 8, 'cfb-BYU': 9, 'cfb-LSU': 10,
  'cfb-TTU': 11, 'cfb-USC': 12, 'cfb-PSU': 13, 'cfb-TENN': 14, 'cfb-UTAH': 15, 'cfb-LOU': 16, 'cfb-IOWA': 17, 'cfb-MICH': 18, 'cfb-MIZ': 19,
  'cfb-ORE': 20, 'cfb-FLA': 21, 'cfb-SMU': 22, 'cfb-TAMU': 23, 'cfb-MSST': 24, 'cfb-HOU': 25,
  'ncaavb-NEB': 1, 'ncaavb-PITT': 2, 'ncaavb-UK': 3, 'ncaavb-LOU': 4, 'ncaavb-SMU': 5, 'ncaavb-WIS': 6, 'ncaavb-TEX': 7, 'ncaavb-FLA': 8,
  'ncaavb-ASU': 9, 'ncaavb-PUR': 10, 'ncaavb-STAN': 12, 'ncaavb-TENN': 13,
};

// [id, name, position, team id | null, league (for athletes without a team)]
const PLAYERS = [
  ['mahomes', 'Patrick Mahomes', 'QB', 'nfl-KC'], ['allen', 'Josh Allen', 'QB', 'nfl-BUF'],
  ['lamar', 'Lamar Jackson', 'QB', 'nfl-BAL'], ['hurts', 'Jalen Hurts', 'QB', 'nfl-PHI'],
  ['barkley', 'Saquon Barkley', 'RB', 'nfl-PHI'], ['jefferson', 'Justin Jefferson', 'WR', 'nfl-MIN'],
  ['caleb', 'Caleb Williams', 'QB', 'nfl-CHI'], ['daniels', 'Jayden Daniels', 'QB', 'nfl-WAS'],
  ['chase', "Ja'Marr Chase", 'WR', 'nfl-CIN'], ['lamb', 'CeeDee Lamb', 'WR', 'nfl-DAL'],
  ['nacua', 'Puka Nacua', 'WR', 'nfl-LAR'], ['parsons', 'Micah Parsons', 'EDGE', 'nfl-GB'],
  ['arch', 'Arch Manning', 'QB', 'cfb-TEX'],
  ['luka', 'Luka Dončić', 'G', 'nba-LAL'], ['tatum', 'Jayson Tatum', 'F', 'nba-BOS'],
  ['curry', 'Stephen Curry', 'G', 'nba-GSW'], ['brunson', 'Jalen Brunson', 'G', 'nba-NYK'],
  ['sga', 'Shai Gilgeous-Alexander', 'G', 'nba-OKC'], ['wemby', 'Victor Wembanyama', 'C', 'nba-SAS'],
  ['flagg', 'Cooper Flagg', 'F', 'nba-DAL'], ['jokic', 'Nikola Jokić', 'C', 'nba-DEN'],
  ['ant', 'Anthony Edwards', 'G', 'nba-MIN'],
  ['clark', 'Caitlin Clark', 'G', 'wnba-IND'], ['wilson', "A'ja Wilson", 'F', 'wnba-LVA'],
  ['collier', 'Napheesa Collier', 'F', 'wnba-MIN'], ['stewart', 'Breanna Stewart', 'F', 'wnba-NYL'],
  ['bueckers', 'Paige Bueckers', 'G', 'wnba-DAL'], ['reese', 'Angel Reese', 'F', 'wnba-ATL'],
  ['ohtani', 'Shohei Ohtani', 'DH/P', 'mlb-LAD'], ['judge', 'Aaron Judge', 'RF', 'mlb-NYY'],
  ['harper', 'Bryce Harper', '1B', 'mlb-PHI'], ['soto', 'Juan Soto', 'RF', 'mlb-NYM'],
  ['raleigh', 'Cal Raleigh', 'C', 'mlb-SEA'], ['witt', 'Bobby Witt Jr.', 'SS', 'mlb-KC'],
  ['skenes', 'Paul Skenes', 'P', 'mlb-PIT'],
  ['mcdavid', 'Connor McDavid', 'C', 'nhl-EDM'], ['crosby', 'Sidney Crosby', 'C', 'nhl-PIT'],
  ['matthews', 'Auston Matthews', 'C', 'nhl-TOR'], ['mackinnon', 'Nathan MacKinnon', 'C', 'nhl-COL'],
  ['celebrini', 'Macklin Celebrini', 'C', 'nhl-SJS'],
  ['yamal', 'Lamine Yamal', 'FW', 'laliga-BAR'], ['mbappe', 'Kylian Mbappé', 'FW', 'laliga-RMA'],
  // Golf (OWGR top 8 + Schauffele, Fleetwood)
  ['scheffler', 'Scottie Scheffler', 'World No. 1', null, 'pga'], ['mcilroy', 'Rory McIlroy', 'World No. 2', null, 'pga'],
  ['cyoung', 'Cameron Young', 'World No. 3', null, 'pga'], ['fitzpatrick', 'Matt Fitzpatrick', 'World No. 4', null, 'pga'],
  ['wclark', 'Wyndham Clark', 'World No. 5', null, 'pga'], ['henley', 'Russell Henley', 'World No. 6', null, 'pga'],
  ['gotterup', 'Chris Gotterup', 'World No. 7', null, 'pga'], ['burns', 'Sam Burns', 'World No. 8', null, 'pga'],
  ['fleetwood', 'Tommy Fleetwood', 'World No. 9', null, 'pga'], ['schauffele', 'Xander Schauffele', 'World No. 10', null, 'pga'],
  // Tennis (ATP / WTA top rankings)
  ['sinner', 'Jannik Sinner', 'ATP No. 1', null, 'slams'], ['zverev', 'Alexander Zverev', 'ATP No. 2', null, 'slams'],
  ['alcaraz', 'Carlos Alcaraz', 'ATP No. 3', null, 'slams'], ['shelton', 'Ben Shelton', 'ATP No. 4', null, 'slams'],
  ['tiafoe', 'Frances Tiafoe', 'ATP No. 8', null, 'slams'],
  ['rybakina', 'Elena Rybakina', 'WTA No. 1', null, 'slams'], ['sabalenka', 'Aryna Sabalenka', 'WTA No. 2', null, 'slams'],
  ['pegula', 'Jessica Pegula', 'WTA No. 3', null, 'slams'], ['gauff', 'Coco Gauff', 'WTA No. 4', null, 'slams'],
  ['andreeva', 'Mirra Andreeva', 'WTA No. 5', null, 'slams'],
  // Pickleball
  ['johns', 'Ben Johns', 'Pro', null, 'mlp'], ['waters', 'Anna Leigh Waters', 'Pro', null, 'mlp'],
  ['bright', 'Anna Bright', 'Pro', null, 'mlp'], ['patriquin', 'Hayden Patriquin', 'Pro', null, 'mlp'],
  ['staksrud', 'Federico Staksrud', 'Pro', null, 'mlp'], ['parenteau', 'Catherine Parenteau', 'Pro', null, 'mlp'],
  // PLL
  ['kirst', 'CJ Kirst', 'A', 'pll-WAT'], ['sowers', 'Michael Sowers', 'A', 'pll-WAT'],
  ['oneill', "Brennan O'Neill", 'A', 'pll-OUT'], ['kavanagh', 'Pat Kavanagh', 'A', 'pll-OUT'],
  ['shellenberger', 'Connor Shellenberger', 'A', 'pll-ATL'], ['gray', 'Chris Gray', 'A', 'pll-RED'],
  // --- soccer research, verified Sep 28, 2026
  ['haaland', 'Erling Haaland', 'FW', 'epl-MCI'],
  ['saka', 'Bukayo Saka', 'FW', 'epl-ARS'],
  ['palmer', 'Cole Palmer', 'MF', 'epl-CHE'],
  ['messi', 'Lionel Messi', 'FW', 'mls-MIA'],
  ['son', 'Son Heung-min', 'FW', 'mls-LAFC'],
  ['muller', 'Thomas Müller', 'MF', 'mls-VAN'],
  ['kane', 'Harry Kane', 'FW', 'bund-FCB'],
  ['musiala', 'Jamal Musiala', 'MF', 'bund-FCB'],
  ['guirassy', 'Serhou Guirassy', 'FW', 'bund-BVB'],
  ['dembele', 'Ousmane Dembélé', 'FW', 'ucl-PSG'],
  ['lautaro', 'Lautaro Martínez', 'FW', 'ucl-INT'],
  // --- teamsports research, verified Sep 28, 2026
  ['dalexander', 'Davis Alexander', 'QB', 'cfl-MTL'], ['philpot', 'Tyson Philpot', 'WR', 'cfl-MTL'], ['fajardo', 'Cody Fajardo', 'QB', 'cfl-EDM'],
  ['vezenkov', 'Sasha Vezenkov', 'F', 'euroleague-OLY'], ['valanciunas', 'Jonas Valančiūnas', 'C', 'euroleague-ZAL'], ['punter', 'Kevin Punter', 'G', 'euroleague-BAR'],
  ['cotton', 'Bryce Cotton', 'G', 'nbl-ADL'], ['dellavedova', 'Matthew Dellavedova', 'G', 'nbl-SYD'], ['pjc', 'Parker Jackson-Cartwright', 'G', 'nbl-NZB'],
  ['tsato', 'Teruaki Sato', '3B', 'npb-HAN'], ['kondoh', 'Kensuke Kondoh', 'OF', 'npb-SOF'], ['freyes', 'Franmil Reyes', 'DH', 'npb-NIP'],
  ['kimdoyeong', 'Kim Do-yeong', '3B', 'kbo-KIA'], ['adean', 'Austin Dean', '1B', 'kbo-LG'], ['kwakbin', 'Kwak Bin', 'P', 'kbo-DOO'],
  // --- individual research, verified Sep 28, 2026
  ['korda', 'Nelly Korda', 'Rolex No. 1', null, 'lpga'], ['thitikul', 'Jeeno Thitikul', 'Rolex No. 2', null, 'lpga'],
  ['hryu', 'Haeran Ryu', 'Rolex No. 3', null, 'lpga'], ['hjkim', 'Hyo Joo Kim', 'Rolex No. 4', null, 'lpga'],
  ['yamashita', 'Miyu Yamashita', 'Rolex No. 5', null, 'lpga'], ['ryin', 'Ruoning Yin', 'Rolex No. 6', null, 'lpga'],
  ['woad', 'Lottie Woad', 'Rolex No. 7', null, 'lpga'], ['hull', 'Charley Hull', 'Rolex No. 8', null, 'lpga'],
  ['reed', 'Patrick Reed', 'Race to Dubai No. 1', null, 'dpwt'], ['rai', 'Aaron Rai', 'Race to Dubai No. 4', null, 'dpwt'],
  ['rfox', 'Ryan Fox', 'Race to Dubai No. 5', null, 'dpwt'],
  ['rahm', 'Jon Rahm', 'LIV No. 1 · Legion XIII', null, 'liv'], ['dechambeau', 'Bryson DeChambeau', 'LIV No. 2 · Crushers GC', null, 'liv'],
  ['niemann', 'Joaquin Niemann', 'LIV No. 3 · Torque GC', null, 'liv'], ['herbert', 'Lucas Herbert', 'LIV No. 4 · Ripper GC', null, 'liv'],
  ['hatton', 'Tyrrell Hatton', 'LIV No. 5 · Legion XIII', null, 'liv'], ['detry', 'Thomas Detry', 'LIV No. 6 · 4Aces GC', null, 'liv'],
  ['akim', 'Anthony Kim', 'LIV No. 7 · 4Aces GC', null, 'liv'], ['sgarcia', 'Sergio Garcia', 'LIV No. 8 · Fireballs GC', null, 'liv'],
].map(([id, name, pos, team, lg, also]) => ({ id, name, pos, team, league: team ? TEAMS[team].league : lg, also }));

// Most recent verified stat line (ESPN box scores). [text, date] entries describe one game and hide in spoiler-free mode.
// Players without one fall back to their team's last result.
const PLAYER_FORM = {
  mahomes: ['Wk 2 vs IND: 32/47, 382 yds, 3 TD, 0 INT · W 33–30 OT', '2026-09-20'],
  allen: ['Wk 2 vs DET: 248 yds, 3 TD + 69 rush yds, 2 rush TD · W 41–31', '2026-09-17'],
  hurts: ['Wk 2 at TEN: 264 yds, 2 TD, 2 INT · W 24–20', '2026-09-20'],
  barkley: ['Wk 2 at TEN: 4 carries, 9 yds; 1 catch, 11 yds', '2026-09-20'],
  lamar: ['Wk 2 vs NO: 235 yds, 1 TD, 1 INT + 34 rush yds · L 17–24', '2026-09-20'],
  clark: ['Sep 22 vs MIN: 27 pts, 9 ast · W 96–77', '2026-09-22'],
  wilson: ['Sep 22 vs LA: 18 pts, 10 reb, 2 blk · W 89–79', '2026-09-22'],
  stewart: ['Sep 21 vs ATL: 27 pts, 14 reb, 4 ast · L 84–95', '2026-09-21'],
  bueckers: ['Sep 23 at SEA: 25 pts, 5 reb, 7 ast · W 103–91', '2026-09-23'],
  ohtani: ['Sep 23 vs SD: 1-for-4, BB, 2 K · season .277/.381/.520', '2026-09-23'],
  judge: 'On the 10-day IL (right calf strain)',
  scheffler: 'Presidents Cup Day 1 four-ball with Sam Burns',
  burns: 'Presidents Cup Day 1 four-ball with Scottie Scheffler',
  mcilroy: '2026 Masters champion (back-to-back)',
  wclark: '2026 U.S. Open champion',
  zverev: '2026 US Open champion · def. Shelton in 4 sets',
  shelton: '2026 US Open finalist',
  sinner: '2026 Wimbledon champion',
  alcaraz: '2026 Australian Open champion',
  rybakina: '2026 Australian Open and US Open champion',
  sabalenka: '2026 US Open finalist',
  andreeva: '2026 Roland Garros champion',
  kirst: ['2026 PLL MVP and Championship MVP · W 14–4', '2026-09-20'],
  sowers: '2026 PLL Attackman of the Year',
};

const CHANNELS = [
  { id: 'sportscenter', name: 'SportsCenter', desc: 'Daily highlights across every sport', sports: SPORTS.map(s => s.id), color: '#CC0000', mark: 'SC' },
  { id: 'mcafee', name: 'The Pat McAfee Show', desc: 'Weekday NFL and college football talk', sports: ['football'], color: '#1F6FEB', mark: 'PM' },
  { id: 'firsttake', name: 'First Take', desc: 'Stephen A. Smith and the morning debate', sports: ['football', 'basketball'], color: '#E4572E', mark: '1T' },
  { id: 'getup', name: 'Get Up', desc: 'Morning NFL and NBA news show', sports: ['football', 'basketball'], color: '#F2A900', mark: 'GU' },
  { id: 'nfllive', name: 'NFL Live', desc: 'Afternoon NFL news and analysis', sports: ['football'], color: '#013369', mark: 'NL' },
  { id: 'gameday', name: 'College GameDay', desc: 'Saturday morning college football tradition', sports: ['football'], color: '#E87722', mark: 'GD' },
  { id: 'nbatoday', name: 'NBA Today', desc: 'Daily NBA news, trades and takes', sports: ['basketball'], color: '#C9082A', mark: 'NT' },
  { id: 'wnbacountdown', name: 'WNBA Countdown', desc: 'Pregame show for WNBA on ESPN', sports: ['basketball'], color: '#FF6F00', mark: 'WC' },
  { id: 'baseballtonight', name: 'Baseball Tonight', desc: 'MLB highlights and analysis', sports: ['baseball'], color: '#0B2D5B', mark: 'BT' },
  { id: 'espnfc', name: 'ESPN FC', desc: 'Global soccer news and debate', sports: ['soccer'], color: '#00A651', mark: 'FC' },
  { id: 'pgatourlive', name: 'PGA Tour Live', desc: 'Every shot from featured groups on ESPN', sports: ['golf'], color: '#0A2D5A', mark: 'PG' },
  { id: 'hoh', name: 'House of Highlights', desc: 'Viral plays and top moments', sports: SPORTS.map(s => s.id), color: '#111111', mark: 'HH' },
  { id: 'simmons', name: 'The Bill Simmons Podcast', desc: 'The Ringer · NFL and NBA conversation', sports: ['football', 'basketball'], color: '#6B2FB3', mark: 'BS' },
];

const ESPN_NETWORKS = ['ESPN', 'ESPN2', 'ESPNU', 'ESPNEWS', 'ABC', 'ESPN/ABC', 'SEC Network', 'ACC Network', 'SECN+', 'ESPN+', 'ESPN Unlimited', 'ESPN Deportes'];

// APPEND ONLY: game ids are g0, g1, … by row position and saved state stores them. Add new rows at the end.
// [league, date, time ET (24h) | null, away, home, network, note, extras]
// extras: { score: [away, home], ot, tags: [...], spoil: 'result words hidden in spoiler-free mode' } for team games.
const P = { tags: ['primetime'] }, PO = { tags: ['playoff'] }, BIG = { tags: ['marquee'] }, RIV = { tags: ['rivalry'] };
const GAME_ROWS = [
  // ---- NFL Week 2 results
  ['nfl', '2026-09-17', '20:15', 'DET', 'BUF', 'Prime Video', 'Thursday Night Football', { score: [31, 41], tags: ['primetime'] }],
  ['nfl', '2026-09-20', '13:00', 'CAR', 'ATL', 'FOX', '', { score: [34, 3] }], ['nfl', '2026-09-20', '13:00', 'MIN', 'CHI', 'FOX', '', { score: [9, 3] }],
  ['nfl', '2026-09-20', '13:00', 'PHI', 'TEN', 'FOX', '', { score: [24, 20] }], ['nfl', '2026-09-20', '13:00', 'PIT', 'NE', 'CBS', '', { score: [3, 20] }],
  ['nfl', '2026-09-20', '13:00', 'GB', 'NYJ', 'FOX', '', { score: [20, 17], ot: true }], ['nfl', '2026-09-20', '13:00', 'CLE', 'TB', 'CBS', '', { score: [23, 19] }],
  ['nfl', '2026-09-20', '13:00', 'NO', 'BAL', 'CBS', '', { score: [24, 17] }], ['nfl', '2026-09-20', '13:00', 'CIN', 'HOU', 'CBS', '', { score: [20, 6] }],
  ['nfl', '2026-09-20', '16:05', 'JAX', 'DEN', 'CBS', '', { score: [13, 20] }], ['nfl', '2026-09-20', '16:05', 'LV', 'LAC', 'CBS', '', { score: [26, 14] }],
  ['nfl', '2026-09-20', '16:25', 'WAS', 'DAL', 'FOX', '', { score: [20, 37], tags: ['rivalry'] }], ['nfl', '2026-09-20', '16:25', 'SEA', 'ARI', 'FOX', '', { score: [31, 7] }],
  ['nfl', '2026-09-20', '16:25', 'MIA', 'SF', 'FOX', '', { score: [13, 35] }],
  ['nfl', '2026-09-20', '20:20', 'IND', 'KC', 'NBC', 'Sunday Night Football', { score: [30, 33], ot: true, tags: ['primetime'] }],
  ['nfl', '2026-09-21', '20:15', 'NYG', 'LAR', 'ESPN/ABC', 'Monday Night Football', { score: [6, 28], tags: ['primetime'] }],
  // ---- NFL Week 3
  ['nfl', '2026-09-24', '20:15', 'ATL', 'GB', 'Prime Video', 'Thursday Night Football', P],
  ['nfl', '2026-09-27', '13:00', 'LAC', 'BUF', 'FOX'], ['nfl', '2026-09-27', '13:00', 'CAR', 'CLE', 'FOX'],
  ['nfl', '2026-09-27', '13:00', 'NYJ', 'DET', 'FOX'], ['nfl', '2026-09-27', '13:00', 'SEA', 'WAS', 'FOX'],
  ['nfl', '2026-09-27', '13:00', 'HOU', 'IND', 'CBS'], ['nfl', '2026-09-27', '13:00', 'KC', 'MIA', 'CBS'],
  ['nfl', '2026-09-27', '13:00', 'TEN', 'NYG', 'CBS'], ['nfl', '2026-09-27', '13:00', 'CIN', 'PIT', 'CBS', '', RIV],
  ['nfl', '2026-09-27', '13:00', 'NE', 'JAX', 'CBS'],
  ['nfl', '2026-09-27', '16:05', 'ARI', 'SF', 'FOX'], ['nfl', '2026-09-27', '16:05', 'MIN', 'TB', 'FOX'],
  ['nfl', '2026-09-27', '16:25', 'BAL', 'DAL', 'CBS', 'Rio de Janeiro', BIG], ['nfl', '2026-09-27', '16:25', 'LV', 'NO', 'CBS'],
  ['nfl', '2026-09-27', '20:20', 'LAR', 'DEN', 'NBC', 'Sunday Night Football', P],
  ['nfl', '2026-09-28', '20:15', 'PHI', 'CHI', 'ESPN/ABC', 'Monday Night Football', P],
  // ---- College football, Sep 19 results (ESPN networks + ranked)
  ['cfb', '2026-09-19', '12:00', 'UGA', 'ARK', 'ABC', '', { score: [45, 17] }], ['cfb', '2026-09-19', '15:30', 'LSU', 'MISS', 'ABC', '', { score: [24, 32], tags: ['marquee'] }],
  ['cfb', '2026-09-19', '12:00', 'UK', 'TAMU', 'ESPN', '', { score: [31, 21], spoil: 'Upset' }], ['cfb', '2026-09-19', '15:30', 'FSU', 'BAMA', 'ESPN2', '', { score: [36, 50] }],
  ['cfb', '2026-09-19', '19:00', 'SMU', 'LOU', 'ESPN2', '', { score: [31, 41] }], ['cfb', '2026-09-19', '19:30', 'FLA', 'AUB', 'ESPN', '', { score: [44, 39] }],
  ['cfb', '2026-09-19', '12:00', 'UNC', 'CLEM', 'ESPNEWS', '', { score: [20, 28] }], ['cfb', '2026-09-19', '16:15', 'NCST', 'VAN', 'SEC Network', '', { score: [31, 35] }],
  ['cfb', '2026-09-19', '19:45', 'MSST', 'SC', 'SEC Network', '', { score: [41, 34] }], ['cfb', '2026-09-19', '15:00', 'WVU', 'UVA', 'ACC Network', '', { score: [38, 27], spoil: 'Upset' }],
  ['cfb', '2026-09-19', '19:00', 'UNM', 'OU', 'ESPNEWS', '', { score: [6, 14] }], ['cfb', '2026-09-19', '19:30', 'UTSA', 'TEX', 'SECN+', '', { score: [6, 30] }],
  ['cfb', '2026-09-19', '12:00', 'TULN', 'KSU', 'ESPN2', '', { score: [20, 31] }],
  ['cfb', '2026-09-19', '15:30', 'MSU', 'ND', 'NBC', '', { score: [10, 27] }], ['cfb', '2026-09-19', '12:00', 'USC', 'RUTG', 'CBS', '', { score: [42, 35] }],
  // ---- College football Week 5
  ['cfb', '2026-09-24', '19:30', 'LIB', 'CCU', 'ESPN'],
  ['cfb', '2026-09-25', '19:00', 'NAVY', 'UAB', 'ESPN'], ['cfb', '2026-09-25', '20:00', 'NU', 'IU', 'FOX'],
  ['cfb', '2026-09-25', '22:30', 'CLEM', 'CAL', 'ESPN'],
  ['cfb', '2026-09-26', '12:00', 'TEX', 'TENN', 'ABC', 'SEC · Top 15 matchup', BIG], ['cfb', '2026-09-26', '12:00', 'WAKE', 'LOU', 'ESPN'],
  ['cfb', '2026-09-26', '12:00', 'ILL', 'OSU', 'FOX'], ['cfb', '2026-09-26', '12:00', 'SHSU', 'TTU', 'TNT'],
  ['cfb', '2026-09-26', '12:00', 'COLO', 'BAY', 'ESPN2'], ['cfb', '2026-09-26', '12:00', 'CSU', 'UTSA', 'ESPNU'],
  ['cfb', '2026-09-26', '12:00', 'VT', 'BC', 'ACC Network'], ['cfb', '2026-09-26', '12:45', 'USA', 'UK', 'SEC Network'],
  ['cfb', '2026-09-26', '14:00', 'ND', 'PUR', 'Peacock'], ['cfb', '2026-09-26', '15:00', 'UCA', 'FSU', 'ACC Network'],
  ['cfb', '2026-09-26', '15:30', 'OU', 'UGA', 'ESPN', '', BIG], ['cfb', '2026-09-26', '15:30', 'MISS', 'FLA', 'ABC', '', BIG],
  ['cfb', '2026-09-26', '15:30', 'UTAH', 'ISU', 'FOX'], ['cfb', '2026-09-26', '15:30', 'IOWA', 'MICH', 'CBS', '', BIG],
  ['cfb', '2026-09-26', '15:30', 'BSU', 'WMU', 'ESPN2'], ['cfb', '2026-09-26', '16:00', 'HOU', 'GASO', 'ESPNU'],
  ['cfb', '2026-09-26', '16:15', 'VAN', 'AUB', 'SEC Network'], ['cfb', '2026-09-26', '17:00', 'WIS', 'PSU', 'Peacock'],
  ['cfb', '2026-09-26', '18:00', 'DEL', 'UVA', 'ACC Network'], ['cfb', '2026-09-26', '18:30', 'CMU', 'MIA', 'CW'],
  ['cfb', '2026-09-26', '19:00', 'SC', 'BAMA', 'ESPN', '', P], ['cfb', '2026-09-26', '19:00', 'KSU', 'CIN', 'ESPN2'],
  ['cfb', '2026-09-26', '19:30', 'TAMU', 'LSU', 'ABC', '', { tags: ['primetime', 'marquee'] }], ['cfb', '2026-09-26', '19:30', 'ORE', 'USC', 'NBC', '', { tags: ['primetime', 'marquee'] }],
  ['cfb', '2026-09-26', '19:30', 'APP', 'NCST', 'ESPNU'], ['cfb', '2026-09-26', '19:45', 'MIZ', 'MSST', 'SEC Network'],
  ['cfb', '2026-09-26', '21:00', 'MOST', 'SMU', 'ACC Network'],
  // ---- WNBA: late regular season results, then projected first-round matchups (seeding final after tonight)
  ['wnba', '2026-09-17', '19:30', 'CON', 'ATL', '', '', { score: [59, 103] }], ['wnba', '2026-09-17', '20:00', 'WAS', 'CHI', '', '', { score: [110, 80] }],
  ['wnba', '2026-09-17', '20:00', 'LA', 'DAL', '', '', { score: [77, 97] }], ['wnba', '2026-09-17', '22:00', 'PHX', 'POR', '', '', { score: [94, 91] }],
  ['wnba', '2026-09-17', '22:00', 'LVA', 'SEA', '', '', { score: [114, 77] }],
  ['wnba', '2026-09-18', '19:30', 'IND', 'TOR', '', '', { score: [103, 85] }], ['wnba', '2026-09-18', '20:00', 'NYL', 'MIN', '', '', { score: [93, 81] }],
  ['wnba', '2026-09-18', '22:00', 'POR', 'GSV', '', '', { score: [66, 82] }],
  ['wnba', '2026-09-19', '15:00', 'PHX', 'DAL', 'CBS', '', { score: [82, 87] }], ['wnba', '2026-09-19', '19:30', 'CHI', 'ATL', 'Prime Video', '', { score: [81, 106] }],
  ['wnba', '2026-09-19', '22:00', 'SEA', 'GSV', 'Prime Video', '', { score: [57, 70] }],
  ['wnba', '2026-09-20', '15:00', 'MIN', 'CON', '', '', { score: [101, 89] }], ['wnba', '2026-09-20', '15:00', 'NYL', 'TOR', '', '', { score: [106, 69] }],
  ['wnba', '2026-09-20', '15:00', 'WAS', 'IND', '', '', { score: [93, 77] }], ['wnba', '2026-09-20', '18:00', 'POR', 'LA', '', '', { score: [84, 105] }],
  ['wnba', '2026-09-20', '18:00', 'SEA', 'LVA', '', '', { score: [77, 98] }],
  ['wnba', '2026-09-21', '19:30', 'ATL', 'NYL', 'Peacock', '', { score: [95, 84] }], ['wnba', '2026-09-21', '22:00', 'DAL', 'PHX', '', '', { score: [86, 87] }],
  ['wnba', '2026-09-22', '19:00', 'CON', 'WAS', '', '', { score: [69, 79] }], ['wnba', '2026-09-22', '19:30', 'MIN', 'IND', 'ESPN', '', { score: [77, 96] }],
  ['wnba', '2026-09-22', '20:00', 'TOR', 'CHI', '', '', { score: [85, 97] }], ['wnba', '2026-09-22', '22:00', 'LA', 'LVA', 'ESPN', '', { score: [79, 89] }],
  ['wnba', '2026-09-22', '22:00', 'GSV', 'POR', '', '', { score: [82, 90], ot: true }],
  ['wnba', '2026-09-23', '19:30', 'ATL', 'NYL', '', '', { score: [83, 65] }], ['wnba', '2026-09-23', '22:00', 'DAL', 'SEA', '', '', { score: [103, 91] }],
  ['wnba', '2026-09-24', '19:00', 'TOR', 'CON', '', 'Regular-season finale'], ['wnba', '2026-09-24', '19:30', 'CHI', 'WAS', '', 'Regular-season finale'],
  ['wnba', '2026-09-24', '20:00', 'IND', 'MIN', '', 'Regular-season finale'],
  ['wnba', '2026-09-27', null, 'NYL', 'MIN', 'TBD', 'First Round · Game 1 · projected', PO],
  ['wnba', '2026-09-27', null, 'DAL', 'GSV', 'TBD', 'First Round · Game 1 · projected', PO],
  ['wnba', '2026-09-27', null, 'IND', 'LVA', 'TBD', 'First Round · Game 1 · projected', PO],
  ['wnba', '2026-09-27', null, 'WAS', 'ATL', 'TBD', 'First Round · Game 1 · projected', PO],
  ['wnba', '2026-09-29', null, 'MIN', 'NYL', 'TBD', 'First Round · Game 2 · projected', PO],
  ['wnba', '2026-09-29', null, 'GSV', 'DAL', 'TBD', 'First Round · Game 2 · projected', PO],
  ['wnba', '2026-09-30', null, 'LVA', 'IND', 'TBD', 'First Round · Game 2 · projected', PO],
  ['wnba', '2026-09-30', null, 'ATL', 'WAS', 'TBD', 'First Round · Game 2 · projected', PO],
  // ---- MLB results
  ['mlb', '2026-09-20', '13:40', 'PHI', 'NYM', '', '', { score: [7, 2], tags: ['rivalry'] }], ['mlb', '2026-09-20', '13:35', 'BOS', 'TB', '', '', { score: [1, 5] }],
  ['mlb', '2026-09-20', '13:40', 'CHC', 'CIN', '', '', { score: [9, 1] }], ['mlb', '2026-09-20', '16:10', 'NYY', 'ARI', '', '', { score: [4, 8] }],
  ['mlb', '2026-09-20', '16:10', 'SF', 'LAD', '', '', { score: [1, 3], tags: ['rivalry'] }], ['mlb', '2026-09-20', '19:10', 'MIL', 'BAL', 'Peacock', '', { score: [3, 0] }],
  ['mlb', '2026-09-22', '13:05', 'TB', 'NYY', '', 'Doubleheader · Game 1', { score: [0, 2] }], ['mlb', '2026-09-22', '19:05', 'TB', 'NYY', 'TBS', 'Doubleheader · Game 2', { score: [6, 1] }],
  ['mlb', '2026-09-22', '18:40', 'MIL', 'PHI', '', '', { score: [4, 6] }], ['mlb', '2026-09-22', '19:10', 'CLE', 'BOS', '', '', { score: [3, 2] }],
  ['mlb', '2026-09-22', '19:40', 'MIA', 'CHC', '', '12 innings', { score: [8, 2] }], ['mlb', '2026-09-22', '20:05', 'NYM', 'TEX', '', '', { score: [6, 3] }],
  ['mlb', '2026-09-22', '22:10', 'SD', 'LAD', 'TBS', '', { score: [0, 7] }],
  ['mlb', '2026-09-23', '18:40', 'MIL', 'PHI', '', '', { score: [4, 1] }], ['mlb', '2026-09-23', '19:10', 'CLE', 'BOS', 'ESPN', '', { score: [0, 1] }],
  ['mlb', '2026-09-23', '19:05', 'TB', 'NYY', 'Prime Video', '', { score: [2, 9] }], ['mlb', '2026-09-23', '19:40', 'MIA', 'CHC', '', '', { score: [3, 2] }],
  ['mlb', '2026-09-23', '20:05', 'NYM', 'TEX', '', '', { score: [7, 2] }], ['mlb', '2026-09-23', '22:10', 'SD', 'LAD', '', '', { score: [5, 1] }],
  // ---- MLB final weekend
  ['mlb', '2026-09-25', '13:05', 'CHC', 'BOS', 'MLB.TV', 'Doubleheader · Game 1'], ['mlb', '2026-09-25', '16:05', 'BAL', 'NYY', 'FOX'],
  ['mlb', '2026-09-25', '18:00', 'CHC', 'BOS', 'ESPN Unlimited', 'Doubleheader · Game 2'], ['mlb', '2026-09-25', '18:40', 'PIT', 'DET', 'MLB.TV'],
  ['mlb', '2026-09-25', '18:40', 'TB', 'PHI', 'MLB.TV'], ['mlb', '2026-09-25', '18:45', 'NYM', 'WSH', 'MLB.TV'],
  ['mlb', '2026-09-25', '19:07', 'CIN', 'TOR', 'MLB.TV'], ['mlb', '2026-09-25', '19:10', 'ATL', 'MIA', 'MLB.TV'],
  ['mlb', '2026-09-25', '19:40', 'CLE', 'KC', 'MLB.TV'], ['mlb', '2026-09-25', '19:40', 'COL', 'CWS', 'MLB.TV'],
  ['mlb', '2026-09-25', '19:40', 'STL', 'MIL', 'MLB.TV'], ['mlb', '2026-09-25', '20:10', 'TEX', 'MIN', 'MLB.TV'],
  ['mlb', '2026-09-25', '21:40', 'ARI', 'SD', 'MLB.TV'], ['mlb', '2026-09-25', '21:40', 'HOU', 'ATH', 'MLB.TV'],
  ['mlb', '2026-09-25', '22:10', 'LAA', 'SEA', 'MLB.TV'], ['mlb', '2026-09-25', '22:15', 'LAD', 'SF', 'MLB.TV', '', RIV],
  ['mlb', '2026-09-26', '13:10', 'PIT', 'DET', 'MLB.TV'], ['mlb', '2026-09-26', '15:07', 'CIN', 'TOR', 'MLB.TV'],
  ['mlb', '2026-09-26', '16:05', 'NYM', 'WSH', 'ESPN Unlimited'], ['mlb', '2026-09-26', '16:05', 'LAD', 'SF', 'MLB.TV', '', RIV],
  ['mlb', '2026-09-26', '16:10', 'ATL', 'MIA', 'MLB.TV'], ['mlb', '2026-09-26', '16:10', 'TEX', 'MIN', 'MLB.TV'],
  ['mlb', '2026-09-26', '19:10', 'CLE', 'KC', 'MLB.TV'], ['mlb', '2026-09-26', '19:10', 'COL', 'CWS', 'MLB.TV'],
  ['mlb', '2026-09-26', '19:10', 'STL', 'MIL', 'MLB.TV'], ['mlb', '2026-09-26', '19:15', 'CHC', 'BOS', 'MLB.TV'],
  ['mlb', '2026-09-26', '19:15', 'TB', 'PHI', 'FOX'], ['mlb', '2026-09-26', '20:40', 'ARI', 'SD', 'MLB.TV'],
  ['mlb', '2026-09-26', '21:40', 'LAA', 'SEA', 'MLB.TV'], ['mlb', '2026-09-26', '21:40', 'HOU', 'ATH', 'MLB.TV'],
  ['mlb', '2026-09-27', '15:05', 'NYM', 'WSH', 'MLB.TV'], ['mlb', '2026-09-27', '15:05', 'TB', 'PHI', 'MLB.TV'],
  ['mlb', '2026-09-27', '15:05', 'HOU', 'ATH', 'MLB.TV'], ['mlb', '2026-09-27', '15:05', 'LAD', 'SF', 'MLB.TV', '', RIV],
  ['mlb', '2026-09-27', '15:07', 'CIN', 'TOR', 'MLB.TV'], ['mlb', '2026-09-27', '15:10', 'ATL', 'MIA', 'MLB.TV'],
  ['mlb', '2026-09-27', '15:10', 'PIT', 'DET', 'MLB.TV'], ['mlb', '2026-09-27', '15:10', 'CLE', 'KC', 'MLB.TV'],
  ['mlb', '2026-09-27', '15:10', 'COL', 'CWS', 'MLB.TV'], ['mlb', '2026-09-27', '15:10', 'STL', 'MIL', 'MLB.TV'],
  ['mlb', '2026-09-27', '15:10', 'TEX', 'MIN', 'MLB.TV'], ['mlb', '2026-09-27', '15:10', 'LAA', 'SEA', 'MLB.TV'],
  ['mlb', '2026-09-27', '15:10', 'ARI', 'SD', 'MLB.TV'], ['mlb', '2026-09-27', '15:20', 'BAL', 'NYY', 'MLB.TV'],
  // ---- NHL preseason, then opening night (ESPN tripleheader)
  ['nhl', '2026-09-24', '19:00', 'BOS', 'PHI', 'Local TV', 'Preseason'], ['nhl', '2026-09-24', '19:00', 'BUF', 'DET', 'Local TV', 'Preseason'],
  ['nhl', '2026-09-24', '19:00', 'FLA', 'TBL', 'Local TV', 'Preseason'], ['nhl', '2026-09-24', '19:00', 'CAR', 'NSH', 'Local TV', 'Preseason · Greensboro, NC'],
  ['nhl', '2026-09-24', '19:00', 'NJD', 'NYR', 'Local TV', 'Preseason'], ['nhl', '2026-09-24', '19:00', 'PIT', 'CBJ', 'Local TV', 'Preseason'],
  ['nhl', '2026-09-24', '20:00', 'CHI', 'STL', 'Local TV', 'Preseason'], ['nhl', '2026-09-24', '21:00', 'EDM', 'VAN', 'Local TV', 'Preseason'],
  ['nhl', '2026-09-24', '21:40', 'CGY', 'SEA', 'Local TV', 'Preseason'], ['nhl', '2026-09-24', '22:00', 'ANA', 'SJS', 'Local TV', 'Preseason'],
  ['nhl', '2026-09-24', '22:00', 'UTA', 'VGK', 'Local TV', 'Preseason'],
  ['nhl', '2026-09-25', '19:00', 'BOS', 'WSH', 'Local TV', 'Preseason'], ['nhl', '2026-09-25', '19:30', 'NYR', 'NYI', 'Local TV', 'Preseason'],
  ['nhl', '2026-09-25', '20:00', 'DAL', 'MIN', 'Local TV', 'Preseason'], ['nhl', '2026-09-25', '20:30', 'WPG', 'COL', 'Local TV', 'Preseason'],
  ['nhl', '2026-09-26', '15:00', 'CAR', 'NSH', 'Local TV', 'Preseason'], ['nhl', '2026-09-26', '15:00', 'PIT', 'BUF', 'Local TV', 'Preseason'],
  ['nhl', '2026-09-26', '16:00', 'ANA', 'LAK', 'Local TV', 'Preseason'], ['nhl', '2026-09-26', '17:00', 'COL', 'UTA', 'Local TV', 'Preseason'],
  ['nhl', '2026-09-26', '17:00', 'WSH', 'PHI', 'Local TV', 'Preseason'], ['nhl', '2026-09-26', '18:00', 'TBL', 'FLA', 'Local TV', 'Preseason'],
  ['nhl', '2026-09-26', '19:00', 'SEA', 'VAN', 'Local TV', 'Preseason'], ['nhl', '2026-09-26', '19:00', 'STL', 'CHI', 'Local TV', 'Preseason'],
  ['nhl', '2026-09-26', '19:00', 'CBJ', 'DET', 'Local TV', 'Preseason'], ['nhl', '2026-09-26', '19:00', 'MTL', 'OTT', 'Local TV', 'Preseason · split squad'],
  ['nhl', '2026-09-29', '17:00', 'FLA', 'CAR', 'ESPN', 'Opening Night · Carolina raises its Cup banner', { tags: ['marquee', 'rivalry'] }],
  ['nhl', '2026-09-29', '19:00', 'MTL', 'TOR', 'Canadian TV', 'Opening Night', RIV],
  ['nhl', '2026-09-29', '20:00', 'NYR', 'BOS', 'ESPN', 'Opening Night', BIG],
  ['nhl', '2026-09-29', '22:00', 'VAN', 'EDM', 'Canadian TV', 'Opening Night'],
  ['nhl', '2026-09-29', '22:30', 'CHI', 'VGK', 'ESPN', 'Opening Night', BIG],
  // ---- NCAA women's volleyball (ESPN networks)
  ['ncaavb', '2026-09-25', '19:00', 'TEX', 'TENN', 'SEC Network'], ['ncaavb', '2026-09-25', '21:00', 'STAN', 'SMU', 'ACC Network'],
  ['ncaavb', '2026-09-26', '19:00', 'IU', 'WIS', 'ESPN+'],
  ['ncaavb', '2026-09-27', '13:00', 'TEX', 'UK', 'ESPN', 'Top 10 matchup', BIG], ['ncaavb', '2026-09-27', '14:00', 'CAL', 'SMU', 'ACC Network'],
  ['ncaavb', '2026-09-27', '15:00', 'MISS', 'BAMA', 'SEC Network'], ['ncaavb', '2026-09-27', '16:00', 'UNC', 'WAKE', 'ACC Network'],
  ['ncaavb', '2026-09-27', '20:30', 'STAN', 'PITT', 'ESPN', '', BIG], ['ncaavb', '2026-09-30', '19:00', 'VAN', 'LSU', 'SEC Network'],
  // ---- NWSL
  ['nwsl', '2026-09-25', '18:30', 'SD', 'LOU', 'NWSL+'], ['nwsl', '2026-09-25', '20:00', 'CHI', 'GFC', 'Prime Video'],
  ['nwsl', '2026-09-25', '20:30', 'BOS', 'SEA', 'NWSL+'], ['nwsl', '2026-09-26', '12:30', 'DEN', 'KC', 'CBS'],
  ['nwsl', '2026-09-26', '18:30', 'LA', 'WAS', 'ION'], ['nwsl', '2026-09-26', '20:45', 'HOU', 'POR', 'ION'],
  ['nwsl', '2026-09-27', '17:00', 'ORL', 'BAY', 'ESPN'],
  // ---- Liga MX, Jornada 10 (US networks vary by club)
  ['ligamx', '2026-09-25', '21:00', 'MTY', 'ATL', 'TBD', 'Jornada 10'], ['ligamx', '2026-09-25', '23:00', 'ATS', 'TIJ', 'TBD', 'Jornada 10'],
  ['ligamx', '2026-09-26', '18:50', 'TOL', 'CAZ', 'TBD', 'Jornada 10'], ['ligamx', '2026-09-26', '19:07', 'QRO', 'GDL', 'TBD', 'Jornada 10'],
  ['ligamx', '2026-09-26', '23:05', 'PAC', 'SAN', 'TBD', 'Jornada 10 · Santos home matches can air on ESPN'],
  ['ligamx', '2026-09-26', '23:10', 'PUE', 'UANL', 'TBD', 'Jornada 10'], ['ligamx', '2026-09-27', '14:00', 'ASL', 'UNAM', 'TBD', 'Jornada 10'],
  ['ligamx', '2026-09-27', '21:00', 'JUA', 'LEO', 'TBD', 'Jornada 10'], ['ligamx', '2026-09-27', '23:10', 'AME', 'NCX', 'TBD', 'Jornada 10'],
  // ---- PLL Championship
  ['pll', '2026-09-20', '15:00', 'OUT', 'WAT', 'ABC', 'PLL Championship · Harrison, NJ', { score: [4, 14], tags: ['playoff'] }],
  // --- soccer research, verified Sep 28, 2026
  ['epl', '2026-09-18', '15:00', 'CHE', 'BRE', 'USA Network', 'Matchweek 5', { score: [0, 3] }],
  ['epl', '2026-09-19', '07:30', 'AVL', 'TOT', 'USA Network', 'Matchweek 5', { score: [3, 2] }],
  ['epl', '2026-09-19', '10:00', 'ARS', 'BHA', 'USA Network', 'Matchweek 5', { score: [0, 3] }],
  ['epl', '2026-09-19', '10:00', 'HUL', 'NEW', 'Peacock', 'Matchweek 5', { score: [1, 2] }],
  ['epl', '2026-09-19', '10:00', 'IPS', 'EVE', 'Peacock', 'Matchweek 5', { score: [0, 1] }],
  ['epl', '2026-09-19', '12:30', 'COV', 'NFO', 'NBC', 'Matchweek 5', { score: [1, 0] }],
  ['epl', '2026-09-20', '09:00', 'CRY', 'LEE', 'Peacock', 'Matchweek 5', { score: [0, 0] }],
  ['epl', '2026-09-20', '09:00', 'LIV', 'BOU', 'USA Network', 'Matchweek 5', { score: [1, 0] }],
  ['epl', '2026-09-20', '09:00', 'SUN', 'MCI', 'Peacock', 'Matchweek 5', { score: [3, 5] }],
  ['epl', '2026-09-20', '11:30', 'MUN', 'FUL', 'NBC', 'Matchweek 5', { score: [1, 1] }],
  ['bund', '2026-09-18', '14:30', 'FCU', 'FCB', 'Fandango', 'Matchday 4', { score: [0, 7] }],
  ['bund', '2026-09-19', '09:30', 'FCA', 'SVW', 'Fandango', 'Matchday 4', { score: [2, 3] }],
  ['bund', '2026-09-19', '09:30', 'KOE', 'HSV', 'Fandango', 'Matchday 4', { score: [1, 2] }],
  ['bund', '2026-09-19', '09:30', 'MAI', 'BMG', 'Fandango', 'Matchday 4', { score: [4, 3] }],
  ['bund', '2026-09-19', '09:30', 'SCF', 'SGE', 'Fandango', 'Matchday 4', { score: [2, 2] }],
  ['bund', '2026-09-19', '12:30', 'BVB', 'VFB', 'Fandango', 'Matchday 4', { score: [1, 0] }],
  ['bund', '2026-09-20', '09:30', 'RBL', 'LEV', 'Fandango', 'Matchday 4', { score: [0, 2] }],
  ['bund', '2026-09-20', '11:30', 'ELV', 'SCH', 'Fandango', 'Matchday 4', { score: [0, 0] }],
  ['bund', '2026-09-20', '13:30', 'TSG', 'PAD', 'Fandango', 'Matchday 4', { score: [1, 3] }],
  ['laliga', '2026-09-17', '13:00', 'GET', 'BET', 'ESPN+', 'Matchday 6', { score: [0, 1] }],
  ['laliga', '2026-09-17', '15:30', 'VIL', 'MCF', 'ESPN+', 'Matchday 6', { score: [3, 1] }],
  ['laliga', '2026-09-18', '15:00', 'ELC', 'ESP', 'ESPN+', 'Matchday 7', { score: [3, 1] }],
  ['laliga', '2026-09-19', '08:00', 'RAY', 'OSA', 'ESPN+', 'Matchday 7', { score: [1, 1] }],
  ['laliga', '2026-09-19', '10:15', 'ALA', 'ATH', 'ESPN+', 'Matchday 7', { score: [0, 0] }],
  ['laliga', '2026-09-19', '12:30', 'RAC', 'CEL', 'ESPN+', 'Matchday 7', { score: [0, 5] }],
  ['laliga', '2026-09-19', '15:00', 'BAR', 'SEV', 'ESPN+', 'Matchday 7', { score: [3, 1] }],
  ['laliga', '2026-09-20', '08:00', 'MCF', 'GET', 'ESPN+', 'Matchday 7', { score: [0, 1] }],
  ['laliga', '2026-09-20', '10:15', 'RMA', 'ATM', 'ESPN2', 'Matchday 7 · Madrid derby', { score: [1, 2], tags: ['rivalry', 'marquee'] }],
  ['laliga', '2026-09-20', '12:30', 'BET', 'DEP', 'ESPN+', 'Matchday 7', { score: [1, 1] }],
  ['laliga', '2026-09-20', '12:30', 'LEV', 'VIL', 'ESPN+', 'Matchday 7', { score: [1, 3] }],
  ['laliga', '2026-09-20', '15:00', 'RSO', 'VAL', 'ESPN+', 'Matchday 7', { score: [3, 2] }],
  ['mls', '2026-09-18', '19:30', 'RBNY', 'NYC', 'Apple TV', 'Hudson River Derby · Yankee Stadium', { score: [1, 0], tags: ['rivalry'] }],
  ['mls', '2026-09-19', '19:30', 'LAFC', 'SJ', 'Apple TV', "Levi's Stadium", { score: [2, 2] }],
  ['mls', '2026-09-19', '20:30', 'ATX', 'DAL', 'Apple TV', 'Texas derby', { score: [0, 0], tags: ['rivalry'] }],
  ['mls', '2026-09-19', '20:30', 'LA', 'MIN', 'Apple TV', '', { score: [3, 2] }],
  ['mls', '2026-09-19', '20:30', 'PHI', 'SKC', 'Apple TV', '', { score: [4, 3] }],
  ['mls', '2026-09-19', '21:30', 'CHI', 'NSH', 'Apple TV', '', { score: [0, 3] }],
  ['mls', '2026-09-19', '21:30', 'SEA', 'COL', 'Apple TV', '', { score: [3, 3] }],
  ['mls', '2026-09-20', '19:00', 'SD', 'MIA', 'Apple TV', '', { score: [2, 2] }],
  ['mls', '2026-09-23', '21:30', 'RSL', 'SEA', 'Apple TV', 'Midweek', { score: [0, 2] }],
  ['mls', '2026-09-26', '19:30', 'CHI', 'CLT', 'Apple TV', ''],
  ['mls', '2026-09-26', '19:30', 'CIN', 'MTL', 'Apple TV', ''],
  ['mls', '2026-09-26', '19:30', 'NYC', 'ATL', 'Apple TV', ''],
  ['mls', '2026-09-26', '19:30', 'ORL', 'PHI', 'Apple TV', ''],
  ['mls', '2026-09-26', '20:30', 'LAFC', 'DAL', 'Apple TV', ''],
  ['mls', '2026-09-26', '20:30', 'MIN', 'SEA', 'Apple TV', ''],
  ['mls', '2026-09-26', '20:30', 'SD', 'ATX', 'Apple TV', ''],
  ['mls', '2026-09-26', '20:30', 'SKC', 'HOU', 'Apple TV', ''],
  ['mls', '2026-09-26', '20:30', 'TOR', 'NSH', 'Apple TV', ''],
  ['mls', '2026-09-26', '21:30', 'NE', 'RSL', 'Apple TV', ''],
  ['mls', '2026-09-26', '22:30', 'COL', 'LA', 'Apple TV', ''],
  ['mls', '2026-09-26', '22:30', 'DC', 'VAN', 'Apple TV', ''],
  ['mls', '2026-09-26', '22:30', 'POR', 'SJ', 'Apple TV', ''],
  ['mls', '2026-09-27', '19:00', 'MIA', 'CLB', 'Apple TV', ''],
  ['mls', '2026-09-30', '19:30', 'STL', 'RBNY', 'Apple TV', 'Midweek'],
  ['nwsl', '2026-09-27', '19:00', 'NC', 'UTA', 'Roku'],
  // --- teamsports research, verified Sep 28, 2026
  ['cfl', '2026-09-18', '19:30', 'MTL', 'HAM', 'CBSSN', 'Week 16', { score: [37, 25] }],
  ['cfl', '2026-09-19', '15:00', 'EDM', 'TOR', 'CFL+', 'Week 16', { score: [19, 24] }],
  ['cfl', '2026-09-19', '19:00', 'OTT', 'CGY', 'CFL+', 'Week 16', { score: [38, 40] }],
  ['cfl', '2026-09-25', '20:00', 'TOR', 'WPG', 'CBSSN', 'Week 17'],
  ['cfl', '2026-09-25', '22:30', 'SSK', 'BC', 'CFL+', 'Week 17'],
  ['cfl', '2026-09-26', '15:00', 'CGY', 'OTT', 'CFL+', 'Week 17'],
  ['cfl', '2026-09-26', '19:00', 'HAM', 'EDM', 'CFL+', 'Week 17'],
  ['euroleague', '2026-09-24', '12:00', 'RMB', 'DUB', 'EuroLeague TV', 'Round 1', { score: [77, 78] }],
  ['euroleague', '2026-09-24', '12:00', 'BAY', 'HTA', 'EuroLeague TV', 'Round 1 · played in Sofia', { score: [86, 84] }],
  ['euroleague', '2026-09-24', '14:00', 'ZAL', 'CZV', 'EuroLeague TV', 'Round 1', { score: [83, 77] }],
  ['euroleague', '2026-09-24', '14:15', 'PBB', 'PAO', 'EuroLeague TV', 'Round 1', { score: [72, 91] }],
  ['euroleague', '2026-09-24', '14:30', 'EFS', 'BAR', 'EuroLeague TV', 'Round 1', { score: [82, 89] }],
  ['euroleague', '2026-09-24', '14:30', 'OLY', 'BKN', 'EuroLeague TV', 'Round 1', { score: [106, 89] }],
  ['euroleague', '2026-09-24', '14:45', 'MTA', 'ASV', 'EuroLeague TV', 'Round 1', { score: [74, 84] }],
  ['euroleague', '2026-09-25', '13:00', 'VBC', 'BJK', 'EuroLeague TV', 'Round 1'],
  ['euroleague', '2026-09-25', '13:45', 'VIR', 'FEN', 'EuroLeague TV', 'Round 1'],
  ['euroleague', '2026-09-25', '14:45', 'MIL', 'PAR', 'EuroLeague TV', 'Round 1'],
  ['euroleague', '2026-09-29', '12:00', 'BAR', 'DUB', 'EuroLeague TV', 'Round 2'],
  ['euroleague', '2026-09-29', '13:00', 'OLY', 'ZAL', 'EuroLeague TV', 'Round 2'],
  ['euroleague', '2026-09-29', '13:00', 'RMB', 'EFS', 'EuroLeague TV', 'Round 2'],
  ['euroleague', '2026-09-29', '13:45', 'BAY', 'FEN', 'EuroLeague TV', 'Round 2'],
  ['euroleague', '2026-09-29', '14:00', 'HTA', 'CZV', 'EuroLeague TV', 'Round 2'],
  ['euroleague', '2026-09-29', '14:30', 'VIR', 'MIL', 'EuroLeague TV', 'Round 2'],
  ['euroleague', '2026-09-29', '14:30', 'BKN', 'VBC', 'EuroLeague TV', 'Round 2'],
  ['euroleague', '2026-09-29', '14:45', 'PAR', 'PBB', 'EuroLeague TV', 'Round 2'],
  ['euroleague', '2026-09-30', '14:05', 'BJK', 'MTA', 'EuroLeague TV', 'Round 2 · played in Belgrade'],
  ['euroleague', '2026-09-30', '14:15', 'ASV', 'PAO', 'EuroLeague TV', 'Round 2'],
  ['nbl', '2026-09-19', '05:30', 'ADL', 'MEL', 'EuroLeague TV', 'Round 1 · season opener', { score: [97, 95] }],
  ['nbl', '2026-09-19', '07:30', 'SEM', 'PER', 'EuroLeague TV', 'Round 1', { score: [100, 79] }],
  ['nbl', '2026-09-20', '01:00', 'ILL', 'NZB', 'EuroLeague TV', 'Round 1', { score: [81, 95] }],
  ['nbl', '2026-09-20', '03:00', 'CNS', 'SYD', 'EuroLeague TV', 'Round 1', { score: [90, 111] }],
  ['nbl', '2026-09-21', '05:30', 'SEM', 'TAS', 'EuroLeague TV', 'Round 1', { score: [91, 96] }],
  ['nbl', '2026-09-22', '05:30', 'NZB', 'BRI', 'EuroLeague TV', 'Round 1', { score: [85, 88] }],
  ['nbl', '2026-09-23', '05:30', 'TAS', 'CNS', 'EuroLeague TV', 'Round 2', { score: [87, 93] }],
  ['nbl', '2026-09-24', '05:30', 'MEL', 'SEM', 'EuroLeague TV', 'Round 2', { score: [86, 61] }],
  ['nbl', '2026-09-24', '07:30', 'ADL', 'PER', 'EuroLeague TV', 'Round 2', { score: [97, 98] }],
  ['nbl', '2026-09-25', '05:30', 'ILL', 'BRI', 'EuroLeague TV', 'Round 2'],
  ['nbl', '2026-09-26', '07:30', 'NZB', 'PER', 'EuroLeague TV', 'Round 2'],
  ['nbl', '2026-09-27', '02:00', 'CNS', 'ADL', 'EuroLeague TV', 'Round 2'],
  ['nbl', '2026-09-27', '04:00', 'ILL', 'SYD', 'EuroLeague TV', 'Round 2'],
  ['nbl', '2026-09-30', '03:30', 'CNS', 'NZB', 'EuroLeague TV', 'Round 3'],
  ['nbl', '2026-09-30', '05:30', 'BRI', 'SYD', 'EuroLeague TV', 'Round 3'],
  ['npb', '2026-09-17', '05:00', 'SOF', 'ORI', 'TBD', 'Pacific League · Hawks clinch 3rd straight pennant', { score: [7, 1] }],
  ['npb', '2026-09-18', '05:00', 'HIR', 'HAN', 'TBD', 'Central League', { score: [1, 2] }],
  ['npb', '2026-09-19', '01:00', 'CHU', 'YOM', 'TBD', 'Central League', { score: [1, 14] }],
  ['npb', '2026-09-20', '01:00', 'YAK', 'YOM', 'TBD', 'Central League', { score: [2, 3] }],
  ['npb', '2026-09-21', '01:00', 'YDB', 'HAN', 'TBD', 'Central League', { score: [2, 3] }],
  ['npb', '2026-09-22', '05:00', 'SEI', 'SOF', 'TBD', 'Pacific League', { score: [5, 6] }],
  ['npb', '2026-09-23', '01:00', 'HAN', 'YAK', 'TBD', 'Central League', { score: [8, 4] }],
  ['npb', '2026-09-23', '02:00', 'YOM', 'HIR', 'TBD', 'Central League', { score: [2, 1] }],
  ['npb', '2026-09-24', '05:00', 'YOM', 'HIR', 'TBD', 'Central League', { score: [1, 3] }],
  ['npb', '2026-09-24', '05:00', 'RAK', 'NIP', 'TBD', 'Pacific League', { score: [6, 0] }],
  ['npb', '2026-09-25', '05:00', 'CHU', 'YAK', 'TBD', 'Central League'],
  ['npb', '2026-09-25', '05:00', 'HAN', 'YDB', 'TBD', 'Central League'],
  ['npb', '2026-09-25', '05:00', 'YOM', 'HIR', 'TBD', 'Central League'],
  ['npb', '2026-09-25', '05:00', 'LOT', 'SEI', 'TBD', 'Pacific League'],
  ['npb', '2026-09-25', '05:00', 'SOF', 'ORI', 'TBD', 'Pacific League'],
  ['npb', '2026-09-26', '01:00', 'HAN', 'YDB', 'TBD', 'Central League'],
  ['npb', '2026-09-26', '01:00', 'LOT', 'SEI', 'TBD', 'Pacific League'],
  ['npb', '2026-09-26', '01:00', 'NIP', 'ORI', 'TBD', 'Pacific League'],
  ['npb', '2026-09-26', '05:00', 'CHU', 'YAK', 'TBD', 'Central League'],
  ['npb', '2026-09-26', '05:00', 'RAK', 'SOF', 'TBD', 'Pacific League'],
  ['npb', '2026-09-27', '01:00', 'HIR', 'YDB', 'TBD', 'Central League'],
  ['npb', '2026-09-27', '01:00', 'ORI', 'SOF', 'TBD', 'Pacific League'],
  ['npb', '2026-09-27', '05:00', 'YAK', 'YOM', 'TBD', 'Central League'],
  ['npb', '2026-09-27', '05:00', 'RAK', 'SEI', 'TBD', 'Pacific League'],
  ['npb', '2026-09-27', '05:00', 'NIP', 'LOT', 'TBD', 'Pacific League'],
  ['npb', '2026-09-28', '05:00', 'HIR', 'YDB', 'TBD', 'Central League'],
  ['npb', '2026-09-28', '05:00', 'RAK', 'SEI', 'TBD', 'Pacific League'],
  ['npb', '2026-09-28', '05:00', 'NIP', 'LOT', 'TBD', 'Pacific League'],
  ['npb', '2026-09-29', '05:00', 'HIR', 'YOM', 'TBD', 'Central League'],
  ['npb', '2026-09-29', '05:00', 'YAK', 'HAN', 'TBD', 'Central League'],
  ['npb', '2026-09-29', '05:00', 'LOT', 'RAK', 'TBD', 'Pacific League'],
  ['npb', '2026-09-29', '05:00', 'ORI', 'SEI', 'TBD', 'Pacific League'],
  ['npb', '2026-09-30', '05:00', 'YAK', 'HAN', 'TBD', 'Central League'],
  ['npb', '2026-09-30', '05:00', 'LOT', 'RAK', 'TBD', 'Pacific League'],
  ['kbo', '2026-09-18', '05:30', 'LG', 'KT', 'SOOP', '', { score: [12, 1] }],
  ['kbo', '2026-09-18', '05:30', 'SAM', 'HAN', 'SOOP', '', { score: [10, 4] }],
  ['kbo', '2026-09-19', '04:00', 'HAN', 'LG', 'SOOP', '', { score: [1, 2] }],
  ['kbo', '2026-09-19', '04:00', 'DOO', 'KT', 'SOOP', '', { score: [3, 15] }],
  ['kbo', '2026-09-20', '01:00', 'DOO', 'KT', 'SOOP', '', { score: [8, 9] }],
  ['kbo', '2026-09-20', '01:00', 'SAM', 'LOT', 'SOOP', '', { score: [6, 13] }],
  ['kbo', '2026-09-22', '05:30', 'KT', 'SSG', 'SOOP', '', { score: [8, 2] }],
  ['kbo', '2026-09-23', '05:30', 'KIA', 'DOO', 'SOOP', '', { score: [2, 3] }],
  ['kbo', '2026-09-24', '04:00', 'LOT', 'LG', 'SOOP', 'Chuseok holiday', { score: [6, 4] }],
  ['kbo', '2026-09-24', '04:00', 'SAM', 'SSG', 'SOOP', 'Chuseok holiday', { score: [5, 4] }],
  ['kbo', '2026-09-24', '04:00', 'NC', 'KT', 'SOOP', 'Chuseok holiday', { score: [2, 3] }],
  ['kbo', '2026-09-25', '04:00', 'LOT', 'DOO', 'SOOP', ''],
  ['kbo', '2026-09-25', '04:00', 'SAM', 'SSG', 'SOOP', ''],
  ['kbo', '2026-09-25', '04:00', 'HAN', 'NC', 'SOOP', ''],
  ['kbo', '2026-09-26', '04:00', 'LG', 'KIA', 'SOOP', ''],
  ['kbo', '2026-09-26', '04:00', 'KIW', 'KT', 'SOOP', ''],
  ['kbo', '2026-09-26', '04:00', 'HAN', 'NC', 'SOOP', ''],
  ['kbo', '2026-09-27', '04:00', 'KT', 'DOO', 'SOOP', ''],
  ['kbo', '2026-09-27', '04:00', 'HAN', 'LOT', 'SOOP', ''],
  ['kbo', '2026-09-27', '04:00', 'LG', 'KIA', 'SOOP', ''],
  ['kbo', '2026-09-27', '04:00', 'KIW', 'NC', 'SOOP', ''],
  ['kbo', '2026-09-29', '05:30', 'NC', 'DOO', 'SOOP', ''],
  ['kbo', '2026-09-29', '05:30', 'HAN', 'SAM', 'SOOP', ''],
  ['kbo', '2026-09-29', '05:30', 'KIW', 'LOT', 'SOOP', ''],
  ['kbo', '2026-09-29', '05:30', 'LG', 'SSG', 'SOOP', ''],
  ['kbo', '2026-09-29', '05:30', 'KT', 'KIA', 'SOOP', ''],
  ['kbo', '2026-09-30', '05:30', 'NC', 'DOO', 'SOOP', ''],
  ['kbo', '2026-09-30', '05:30', 'HAN', 'SAM', 'SOOP', ''],
  ['kbo', '2026-09-30', '05:30', 'KIW', 'LOT', 'SOOP', ''],
  ['kbo', '2026-09-30', '05:30', 'LG', 'SSG', 'SOOP', ''],
  ['kbo', '2026-09-30', '05:30', 'KT', 'KIA', 'SOOP', ''],
  ['wnba', '2026-09-24', '22:00', 'GSV', 'LA', '', 'Regular-season finale'],
  ['wnba', '2026-09-24', '22:00', 'LVA', 'PHX', '', 'Regular-season finale'],
  // --- individual research, verified Sep 28, 2026
  ['cpl', '2026-09-17', '20:00', 'GAW', 'ABF', 'Willow', 'Qualifier 1 · Falcons won by 9 wkts (GAW 76, ABF 77/1)', { score: [76, 77], tags: ['playoff'] }],
  ['cpl', '2026-09-18', '19:00', 'JAK', 'GAW', 'Willow', 'Qualifier 2 · Kingsmen won by 5 wkts (GAW 206/4, JAK 207/5)', { score: [207, 206], tags: ['playoff'] }],
  ['cpl', '2026-09-20', '19:00', 'JAK', 'ABF', 'Willow', 'Final · Falcons won by 8 wkts (JAK 170/9, ABF 173/2)', { score: [170, 173], tags: ['playoff'] }],
  ['prem', '2026-09-25', '14:45', 'NEW', 'NOR', 'FloSports', 'Round 1 · Franklin\'s Gardens'],
  ['prem', '2026-09-25', '14:45', 'BAT', 'HAR', 'FloSports', 'Round 1 · Twickenham Stoop'],
  ['prem', '2026-09-26', '10:05', 'GLO', 'EXE', 'FloSports', 'Round 1 · Sandy Park'],
  ['prem', '2026-09-26', '12:30', 'BRI', 'SAL', 'FloSports', 'Round 1 · Salford'],
  ['prem', '2026-09-27', '10:00', 'SAR', 'LEI', 'FloSports', 'Round 1 · Welford Road'],
];

// Events without a home/away matchup (golf rounds, tour stops, etc.). APPEND ONLY, same reason as GAME_ROWS.
// [league, date, time, event name, network, note, extras]
const EVENT_ROWS = [
  ['pga', '2026-09-24', '12:30', 'Presidents Cup · Day 1 Four-ball', 'Golf Channel', 'Medinah, IL · USA vs International', { tags: ['marquee'], field: ['scheffler', 'burns', 'cyoung', 'schauffele', 'wclark', 'gotterup'] }],
  ['pga', '2026-09-25', '14:00', 'Presidents Cup · Day 2 Foursomes', 'Golf Channel', 'Medinah, IL', { tags: ['marquee'], field: ['scheffler', 'burns', 'cyoung', 'schauffele', 'wclark', 'gotterup'] }],
  ['pga', '2026-09-26', '09:00', 'Presidents Cup · Day 3', 'NBC', 'Four-ball and foursomes', { tags: ['marquee'], field: ['scheffler', 'burns', 'cyoung', 'schauffele', 'wclark', 'gotterup'] }],
  ['pga', '2026-09-27', '12:00', 'Presidents Cup · Singles', 'NBC', 'Final day at Medinah', { tags: ['marquee'], field: ['scheffler', 'burns', 'cyoung', 'schauffele', 'wclark', 'gotterup'] }],
  ['mlb', '2026-09-29', null, 'MLB Wild Card Series · Game 1s', 'NBC', 'Matchups set after Sunday', { tags: ['playoff'] }],
  // --- individual research, verified Sep 28, 2026
  ['lpga', '2026-09-25', null, 'Walmart NW Arkansas Championship · Round 1', 'Golf Channel', 'Pinnacle CC · Rogers, AR', { field: ['yamashita', 'woad', 'hull'] }],
  ['lpga', '2026-09-26', null, 'Walmart NW Arkansas Championship · Round 2', 'Golf Channel', 'Pinnacle CC · Rogers, AR', { field: ['yamashita', 'woad', 'hull'] }],
  ['lpga', '2026-09-27', null, 'Walmart NW Arkansas Championship · Final Round', 'Golf Channel', 'Pinnacle CC · Rogers, AR', { field: ['yamashita', 'woad', 'hull'] }],
  ['dpwt', '2026-09-17', '07:00', 'BMW PGA Championship · Round 1', 'Golf Channel', 'Wentworth Club · Surrey, England', { field: ['mcilroy', 'fitzpatrick', 'fleetwood', 'reed', 'rai', 'rfox'], result: 'R1 co-leaders: Aaron Rai, Joakim Lagergren (-6)' }],
  ['dpwt', '2026-09-18', '07:00', 'BMW PGA Championship · Round 2', 'Golf Channel', 'Wentworth Club · Surrey, England', { field: ['mcilroy', 'fitzpatrick', 'fleetwood', 'reed', 'rai', 'rfox'], result: 'R2 leader: Ryan Gerard (-12)' }],
  ['dpwt', '2026-09-19', '07:00', 'BMW PGA Championship · Round 3', 'Golf Channel', 'Wentworth Club · Surrey, England', { field: ['mcilroy', 'fitzpatrick', 'rai', 'rfox'], result: 'R3 co-leaders: Filippo Celli, Manuel Elvira (-13)' }],
  ['dpwt', '2026-09-20', '07:00', 'BMW PGA Championship · Final Round', 'Golf Channel', 'Wentworth Club · Surrey, England', { tags: ['marquee'], field: ['mcilroy', 'fitzpatrick', 'rai', 'rfox'], result: 'Winner: J.J. Spaun (-17) · McIlroy, Rai T2 (-15)' }],
  ['dpwt', '2026-09-24', '07:30', 'FedEx Open de France · Round 1', 'Golf Channel', 'Le Golf National · Paris', { field: ['fitzpatrick', 'fleetwood'], result: 'R1 leader: Michael Kim (-8)' }],
  ['dpwt', '2026-09-25', '07:30', 'FedEx Open de France · Round 2', 'Golf Channel', 'Le Golf National · Paris', { field: ['fitzpatrick', 'fleetwood'] }],
  ['dpwt', '2026-09-26', null, 'FedEx Open de France · Round 3', 'Golf Channel', 'Le Golf National · Paris', { field: ['fitzpatrick'] }],
  ['dpwt', '2026-09-27', null, 'FedEx Open de France · Final Round', 'Golf Channel', 'Le Golf National · Paris', { field: ['fitzpatrick'] }],
  ['atp', '2026-09-23', '01:05', 'Chengdu Open', 'Tennis Channel', 'Chengdu, China · ATP 250 · final Sep 29', { endDate: '2026-09-29' }],
  ['atp', '2026-09-23', '04:20', 'Hangzhou Open', 'Tennis Channel', 'Hangzhou, China · ATP 250 · final Sep 29', { endDate: '2026-09-29' }],
  ['atp', '2026-09-25', '08:00', 'Laver Cup', 'Tennis Channel', 'The O2, London · Team Europe vs Team World', { endDate: '2026-09-27', tags: ['marquee'], field: ['zverev', 'alcaraz'] }],
  ['atp', '2026-09-29', '22:00', 'Japan Open', 'Tennis Channel', 'Tokyo · ATP 500 · main draw from Sep 30 local', { endDate: '2026-10-06', field: ['alcaraz', 'tiafoe'] }],
  ['atp', '2026-09-29', '23:00', 'China Open', 'Tennis Channel', 'Beijing · ATP 500 · main draw from Sep 30 local', { endDate: '2026-10-06', field: ['zverev'] }],
  ['wta', '2026-09-13', '15:05', 'Guadalajara Open', 'Tennis Channel', 'Guadalajara, Mexico · WTA 500', { endDate: '2026-09-19', result: 'Winner: Iva Jovic (d. Peyton Stearns 6-4, 6-2)' }],
  ['wta', '2026-09-15', '09:35', 'SP Open', 'Tennis Channel', 'São Paulo · WTA 250', { endDate: '2026-09-21', result: 'Winner: Kaitlin Quevedo (d. Nadia Podoroska 4-6, 6-4, 6-2)' }],
  ['wta', '2026-09-20', '23:05', 'Korea Open', 'Tennis Channel', 'Seoul · WTA 250 · final Sep 27', { endDate: '2026-09-27' }],
  ['wta', '2026-09-20', '23:05', 'Singapore Tennis Open', 'Tennis Channel', 'Singapore · WTA 500 · final Sep 27', { endDate: '2026-09-27', field: ['andreeva'] }],
  ['wta', '2026-09-30', null, 'China Open', 'Tennis Channel', 'Beijing · WTA 1000 · main draw from Sep 30 local', { endDate: '2026-10-11', tags: ['marquee'], field: ['sabalenka', 'rybakina', 'gauff', 'andreeva'] }],
  ['ppa', '2026-09-14', null, 'Veolia Arizona Open', 'PickleballTV', 'Mesa, AZ · PPA Open (1,000)', { endDate: '2026-09-20', field: ['johns', 'waters', 'staksrud'], result: 'Champions: Johns/Waters (MX), Waters (WS), Haworth (MS), Alshon/Daescu (MD), Rohrabacher/Todd (WD)' }],
  ['ppa', '2026-09-30', '17:00', 'Rate Las Vegas Open', 'PickleballTV', 'Las Vegas · PPA Open (1,000) · finals Oct 4 on Tennis Channel', { endDate: '2026-10-04' }],
];

const GAMES = [
  ...GAME_ROWS.map(([league, date, time, away, home, network, note, extra = {}], i) => ({
    id: `g${i}`, league, date, time, away: `${league}-${away}`, home: `${league}-${home}`, network: network || 'Local TV', note: note || '', ...extra,
  })),
  ...EVENT_ROWS.map(([league, date, time, event, network, note, extra = {}], i) => ({
    id: `e${i}`, league, date, time, event, network, note: note || '', ...extra,
  })),
];

// Content library. type: full | highlight | recap | interview | show
// [id, type, title, league, teams[], players[], channel|null, duration, date, source]
const CONTENT_ROWS = [
  ['c1', 'highlight', 'Mahomes throws for 382 yards and 3 TDs in OT win over the Colts', 'nfl', ['KC', 'IND'], ['mahomes'], 'sportscenter', '4:12', '2026-09-20'],
  ['c2', 'highlight', "Butker's 40-yard walk-off field goal beats Indianapolis", 'nfl', ['KC', 'IND'], [], 'hoh', '0:52', '2026-09-20'],
  ['c3', 'interview', 'Mahomes postgame press conference after the OT win', 'nfl', ['KC'], ['mahomes'], null, '8:05', '2026-09-20'],
  ['c4', 'full', 'Giants at Rams · Monday Night Football full replay', 'nfl', ['NYG', 'LAR'], ['nacua'], null, '3:04:10', '2026-09-21', 'ESPN Unlimited'],
  ['c5', 'recap', 'Eagles edge the Titans 24–20', 'nfl', ['PHI', 'TEN'], ['hurts', 'barkley'], 'sportscenter', '2:38', '2026-09-20'],
  ['c6', 'recap', 'Cowboys roll past the Commanders 37–20', 'nfl', ['DAL', 'WAS'], ['lamb', 'daniels'], 'sportscenter', '2:51', '2026-09-20'],
  ['c7', 'highlight', 'Seahawks rout the Cardinals 31–7', 'nfl', ['SEA', 'ARI'], [], 'sportscenter', '3:20', '2026-09-20'],
  ['c8', 'highlight', '49ers pull away from the Dolphins 35–13', 'nfl', ['SF', 'MIA'], [], 'sportscenter', '3:05', '2026-09-20'],
  ['c9', 'recap', 'Packers outlast the Jets 20–17 in overtime', 'nfl', ['GB', 'NYJ'], ['parsons'], 'sportscenter', '2:44', '2026-09-20'],
  ['c10', 'recap', 'Vikings grind out a 9–3 win over the Bears', 'nfl', ['MIN', 'CHI'], ['jefferson', 'caleb'], 'sportscenter', '2:10', '2026-09-20'],
  ['c11', 'show', 'NFL Live: Week 3 storylines', 'nfl', [], [], 'nfllive', '22:00', '2026-09-23'],
  ['c12', 'show', 'The Pat McAfee Show · Wednesday, Sep 23', 'nfl', [], [], 'mcafee', '2:58:00', '2026-09-23'],
  ['c13', 'show', 'First Take: Are the Chiefs back?', 'nfl', ['KC'], ['mahomes'], 'firsttake', '11:40', '2026-09-22'],
  ['c14', 'show', 'Get Up: Falcons at Packers TNF preview', 'nfl', ['ATL', 'GB'], ['parsons'], 'getup', '9:15', '2026-09-24'],
  ['c15', 'highlight', 'SportsCenter Top 10 · Sep 23', null, [], [], 'sportscenter', '3:30', '2026-09-23'],
  ['c16', 'show', 'WNBA playoff picture heading into the final night', 'wnba', ['MIN', 'NYL', 'LVA', 'IND', 'GSV', 'DAL', 'ATL', 'WAS'], [], 'wnbacountdown', '14:20', '2026-09-23'],
  ['c17', 'highlight', 'Caitlin Clark posts 27 points and 9 assists against the Lynx', 'wnba', ['IND', 'MIN'], ['clark'], 'sportscenter', '3:45', '2026-09-22'],
  ['c18', 'interview', "Breanna Stewart on the Liberty's playoff push", 'wnba', ['NYL'], ['stewart'], null, '4:30', '2026-09-23'],
  ['c19', 'highlight', "A'ja Wilson's double-double in the win over the Sparks", 'wnba', ['LVA', 'LA'], ['wilson'], 'sportscenter', '2:50', '2026-09-22'],
  ['c20', 'show', "Baseball Tonight: the race for the last playoff spots", 'mlb', ['PHI', 'SD', 'CHC'], ['harper'], 'baseballtonight', '12:05', '2026-09-23'],
  ['c21', 'recap', 'Brewers beat the Phillies 4–1 in the chase for the best record', 'mlb', ['MIL', 'PHI'], ['harper'], 'baseballtonight', '2:40', '2026-09-23'],
  ['c22', 'highlight', "Shohei Ohtani's top swings of 2026", 'mlb', ['LAD'], ['ohtani'], 'hoh', '6:00', '2026-09-22'],
  ['c23', 'show', "Aaron Judge's calf strain and the Yankees' final weekend", 'mlb', ['NYY'], ['judge'], 'baseballtonight', '5:30', '2026-09-22'],
  ['c24', 'show', 'College GameDay: Week 5 preview', 'cfb', ['TEX', 'TENN', 'OU', 'UGA'], ['arch'], 'gameday', '18:00', '2026-09-24'],
  ['c25', 'show', 'No. 1 Texas at No. 14 Tennessee: three things to watch', 'cfb', ['TEX', 'TENN'], ['arch'], 'mcafee', '4:15', '2026-09-24'],
  ['c26', 'show', 'NBA Today: Western Conference preview', 'nba', ['OKC', 'SAS', 'DEN', 'LAL'], ['sga', 'wemby', 'jokic', 'luka'], 'nbatoday', '15:30', '2026-09-22'],
  ['c27', 'highlight', "Cooper Flagg's best plays from his rookie season", 'nba', ['DAL'], ['flagg'], 'hoh', '7:20', '2026-09-21'],
  ['c28', 'show', 'ESPN FC: International break roundtable', 'laliga', ['BAR', 'RMA'], ['yamal', 'mbappe'], 'espnfc', '16:00', '2026-09-22'],
  ['c30', 'highlight', "Connor McDavid's top goals of 2025–26", 'nhl', ['EDM'], ['mcdavid'], 'sportscenter', '5:45', '2026-09-22'],
  ['c31', 'show', 'Wildest plays of NFL Week 2', 'nfl', ['KC', 'GB', 'SEA'], [], 'hoh', '8:10', '2026-09-22'],
  ['c32', 'show', 'The Bill Simmons Podcast: Week 3 NFL picks', 'nfl', [], [], 'simmons', '1:12:00', '2026-09-24'],
  ['c33', 'recap', 'Rams handle the Giants 28–6 on Monday Night Football', 'nfl', ['NYG', 'LAR'], ['nacua'], null, '2:55', '2026-09-21'],
  ['c34', 'recap', 'Raiders top the Chargers 26–14', 'nfl', ['LV', 'LAC'], [], 'sportscenter', '2:40', '2026-09-20'],
  ['c35', 'recap', 'Patriots handle the Steelers 20–3', 'nfl', ['NE', 'PIT'], [], 'sportscenter', '2:22', '2026-09-20'],
  ['c36', 'interview', 'Eagles locker room ahead of Monday night in Chicago', 'nfl', ['PHI', 'CHI'], ['hurts'], null, '6:15', '2026-09-24'],
  ['c37', 'show', 'NBA Today: Lakers training camp preview', 'nba', ['LAL'], ['luka'], 'nbatoday', '10:45', '2026-09-24'],
  ['c38', 'interview', 'Napheesa Collier on the Lynx locking up the No. 1 seed', 'wnba', ['MIN'], ['collier'], null, '5:05', '2026-09-22'],
  ['c39', 'highlight', 'Josh Allen accounts for 5 TDs as the Bills beat the Lions 41–31', 'nfl', ['DET', 'BUF'], ['allen'], 'sportscenter', '4:05', '2026-09-17'],
  ['c40', 'highlight', 'Waterdogs rout the Outlaws 14–4 for the PLL title', 'pll', ['OUT', 'WAT'], ['kirst', 'sowers'], 'sportscenter', '5:20', '2026-09-20'],
  ['c41', 'recap', 'Kentucky stuns No. 9 Texas A&M 31–21', 'cfb', ['UK', 'TAMU'], [], 'sportscenter', '2:48', '2026-09-19'],
  ['c42', 'recap', 'No. 8 Ole Miss holds off No. 7 LSU 32–24', 'cfb', ['LSU', 'MISS'], [], 'sportscenter', '3:02', '2026-09-19'],
  ['c43', 'highlight', 'Paige Bueckers scores 25 as the Wings beat the Storm', 'wnba', ['DAL', 'SEA'], ['bueckers'], 'sportscenter', '2:35', '2026-09-23'],
  ['c44', 'highlight', "Zverev's US Open title run", 'slams', [], ['zverev', 'shelton'], 'sportscenter', '9:30', '2026-09-14'],
  ['c45', 'highlight', 'Rybakina beats Sabalenka for the US Open title', 'slams', [], ['rybakina', 'sabalenka'], 'sportscenter', '7:10', '2026-09-13'],
  ['c46', 'show', 'PGA Tour Live: Presidents Cup week preview', 'pga', [], ['scheffler', 'burns', 'schauffele'], 'pgatourlive', '12:00', '2026-09-23'],
  ['c47', 'show', "Kentucky volleyball ahead of Sunday's Texas showdown", 'ncaavb', ['UK', 'TEX'], [], 'sportscenter', '4:10', '2026-09-24'],
  ['c48', 'show', 'Hurricanes get set to raise the Cup banner on opening night', 'nhl', ['CAR', 'FLA'], [], 'sportscenter', '6:40', '2026-09-24'],
  ['c49', 'recap', 'Red Sox edge the Guardians 1–0', 'mlb', ['CLE', 'BOS'], [], 'baseballtonight', '2:15', '2026-09-23'],
];

const CONTENT = CONTENT_ROWS.map(([id, type, title, league, teams, players, channel, duration, date, source]) => ({
  id, type, title, league, channel, duration, date, source: source || 'ESPN',
  teams: teams.map(t => `${league}-${t}`), players,
}));

// Watch history "synced" from ESPN on connect.
const ESPN_HISTORY = ['c4', 'c15', 'c11'];

const CONTENT_TYPES = [
  { id: 'all', name: 'All' },
  { id: 'full', name: 'Full games' },
  { id: 'highlight', name: 'Highlights' },
  { id: 'recap', name: 'Recaps' },
  { id: 'interview', name: 'Interviews' },
  { id: 'show', name: 'Shows' },
];

// Spoiler-free titles for clips whose headline gives away a result.
const SAFE_TITLES = {
  c1: 'Mahomes vs. the Colts · Week 2 highlights',
  c2: 'Colts at Chiefs · the final drive',
  c3: 'Mahomes postgame press conference · Week 2',
  c5: 'Eagles at Titans · Week 2 recap',
  c6: 'Commanders at Cowboys · Week 2 recap',
  c7: 'Seahawks at Cardinals · Week 2 highlights',
  c8: 'Dolphins at 49ers · Week 2 highlights',
  c9: 'Packers at Jets · Week 2 recap',
  c10: 'Vikings at Bears · Week 2 recap',
  c17: 'Caitlin Clark vs. the Lynx · Sep 22 highlights',
  c19: "A'ja Wilson vs. the Sparks · Sep 22 highlights",
  c21: 'Brewers at Phillies · Sep 23 recap',
  c33: 'Giants at Rams · Monday Night Football recap',
  c34: 'Raiders at Chargers · Week 2 recap',
  c35: 'Steelers at Patriots · Week 2 recap',
  c38: 'Napheesa Collier on the Lynx playoff push',
  c39: 'Lions at Bills · Thursday Night Football highlights',
  c40: 'Outlaws vs. Waterdogs · PLL Championship highlights',
  c41: 'Kentucky at Texas A&M · Week 4 recap',
  c42: 'LSU at Ole Miss · Week 4 recap',
  c43: 'Paige Bueckers vs. the Storm · Sep 23 highlights',
  c44: "US Open men's highlights",
  c45: "US Open women's final highlights",
  c49: 'Guardians at Red Sox · Sep 23 recap',
};
// Link clips to the game they cover so revealing one reveals the other.
CONTENT.forEach(c => {
  c.safe = SAFE_TITLES[c.id];
  if (c.teams.length >= 1 && c.teams.length <= 2) {
    c.game = GAMES.find(g => !g.event && g.league === c.league && g.date === c.date && c.teams.every(t => t === g.away || t === g.home));
  }
});

// Tennis players also follow the tour they play week to week.
PLAYERS.forEach(p => { if (p.league === 'slams' && !p.also) p.also = [p.pos.startsWith('ATP') ? 'atp' : 'wta']; });

// Favorites "found" on the viewer's ESPN account when they connect.
const ESPN_FAVORITES = { teams: ['nfl-PHI', 'nba-NYK', 'cfb-TEX'], players: ['brunson', 'clark'] };

// Standings as of the prototype clock, best first: "ABBR|record|points" joined by ";".
const RECORDS = {
  // --- soccer research, verified Sep 28, 2026
  epl: `MCI|5-0-0|15;ARS|4-0-1|12;BHA|3-1-1|10;BRE|2-3-0|9;LEE|2-3-0|9;LIV|2-3-0|9;EVE|2-3-0|9;HUL|2-2-1|8;NEW|2-2-1|8;CHE|2-1-2|7;IPS|2-0-3|6;MUN|1-2-2|5;NFO|1-2-2|5;SUN|1-1-3|4;CRY|1-1-3|4;AVL|1-1-3|4;BOU|0-3-2|3;COV|1-0-4|3;FUL|0-2-3|2;TOT|0-2-3|2`,
  bund: `BVB|4-0-0|12;FCB|3-1-0|10;SCF|3-1-0|10;FCA|2-1-1|7;LEV|2-1-1|7;MAI|2-1-1|7;ELV|2-1-1|7;SVW|2-1-1|7;RBL|2-0-2|6;SGE|1-2-1|5;SCH|1-2-1|5;PAD|1-1-2|4;KOE|1-1-2|4;TSG|1-0-3|3;VFB|1-0-3|3;HSV|1-0-3|3;FCU|0-1-3|1;BMG|0-0-4|0`,
  laliga: `BAR|7-0-0|21;ATM|5-1-1|16;BET|5-1-1|16;RMA|5-0-2|15;SEV|4-1-2|13;ALA|3-2-2|11;DEP|2-4-1|10;RSO|3-1-3|10;VIL|2-2-3|8;ATH|2-2-2|8;GET|2-2-3|8;RAY|2-2-3|8;OSA|2-2-3|8;CEL|1-4-2|7;ESP|2-1-4|7;RAC|2-1-4|7;LEV|1-2-3|5;ELC|1-2-4|5;VAL|1-1-5|4;MCF|0-3-4|3`,
  mls: `NSH|17-6-3|57;VAN|15-4-6|49;NE|14-4-8|46;MIA|12-10-4|46;HOU|13-5-8|44;STL|12-8-6|44;DAL|12-8-6|44;CLT|12-7-7|43;SJ|12-6-8|42;LAFC|11-8-8|41;CHI|11-6-8|39;COL|11-3-12|36;PHI|10-6-10|36;ORL|10-4-12|34;RBNY|9-6-11|33;CIN|8-9-8|33;LA|8-9-10|33;POR|9-5-12|32;NYC|8-8-10|32;SEA|8-8-9|32;SD|8-7-11|31;ATX|7-9-10|30;RSL|8-5-13|29;MIN|7-8-11|29;DC|6-11-8|29;TOR|6-11-9|29;CLB|7-5-14|26;ATL|7-5-14|26;MTL|5-6-15|21;SKC|5-3-17|18`,
  nwsl: `GFC|15-6-4|51;WAS|14-4-7|46;SD|14-3-8|45;UTA|13-3-9|42;POR|12-6-7|42;LA|11-6-8|39;NC|12-3-10|39;KC|11-5-9|38;SEA|11-4-10|37;DEN|9-8-8|35;ORL|9-3-13|30;HOU|8-5-12|29;BAY|7-5-13|26;BOS|7-5-13|26;LOU|7-2-16|23;CHI|5-2-18|17`,
  ligamx: `TOL|6-1-2|19;GDL|5-3-1|18;AME|5-2-1|17;CAZ|5-0-4|15;QRO|4-2-2|14;LEO|4-2-3|14;TIJ|4-2-2|14;PUE|4-2-3|14;ATS|4-2-3|14;MTY|4-1-3|13;PAC|3-3-3|12;UNAM|3-3-3|12;ASL|2-3-4|9;ATL|1-5-3|8;NCX|2-2-5|8;UANL|1-4-4|7;SAN|2-1-6|7;JUA|1-0-8|3`,
  // --- teamsports research, verified Sep 28, 2026
  cfl: `MTL|11-3;EDM|10-4;SSK|8-5;TOR|8-6;BC|7-6;WPG|7-6;CGY|6-8;HAM|4-10;OTT|0-13`,
  euroleague: `PAO|1-0;OLY|1-0;ASV|1-0;BAR|1-0;ZAL|1-0;BAY|1-0;DUB|1-0;BJK|0-0;FEN|0-0;MIL|0-0;PAR|0-0;VBC|0-0;VIR|0-0;RMB|0-1;HTA|0-1;CZV|0-1;EFS|0-1;MTA|0-1;BKN|0-1;PBB|0-1`,
  nbl: `SYD|1-0;BRI|1-0;MEL|1-1;NZB|1-1;ADL|1-1;TAS|1-1;CNS|1-1;PER|1-1;SEM|1-2;ILL|0-1`,
  npb: `SOF|86-47-3;HAN|75-58-1;SEI|74-58-4;NIP|75-61-3;YOM|74-61-2;YDB|68-66-3;ORI|65-71-2;LOT|58-70-3;CHU|59-78-2;YAK|57-76-2;HIR|55-75-4;RAK|54-79-1`,
  kbo: `KT|80-48-4;SAM|78-52-3;LG|75-56-1;KIA|71-58-2;DOO|67-62-5;NC|60-69-2;LOT|59-71-2;SSG|58-71-5;HAN|54-74-4;KIW|45-86-4`,
  nfl: `SF|2-0;SEA|2-0;LV|2-0;KC|2-0;MIN|2-0;CIN|2-0;BUF|2-0;PHI|2-0;JAX|1-1;CHI|1-1;NE|1-1;BAL|1-1;NYJ|1-1;CAR|1-1;DAL|1-1;NO|1-1;LAR|1-1;DET|1-1;PIT|1-1;ARI|1-1;GB|1-1;NYG|1-1;DEN|1-1;CLE|1-1;TB|0-2;TEN|0-2;HOU|0-2;WAS|0-2;IND|0-2;LAC|0-2;MIA|0-2;ATL|0-2`,
  mlb: `MIL|99-59;LAD|97-61;TB|96-62;ATL|93-65;NYY|91-67;SD|88-70;CHC|87-71;PHI|87-71;BOS|85-73;ARI|84-74;CLE|82-76;CWS|81-77;PIT|80-78;HOU|78-80;TEX|78-80;MIA|78-80;BAL|78-81;STL|77-81;TOR|77-82;MIN|75-84;WSH|75-84;SEA|74-84;DET|74-85;CIN|73-85;NYM|73-85;KC|68-90;SF|65-94;ATH|63-95;LAA|60-98;COL|57-101`,
  wnba: `MIN|33-11;GSV|32-12;LVA|31-13;ATL|30-14;WAS|28-16;IND|28-16;DAL|27-17;NYL|26-18;POR|17-27;CHI|16-28;LA|16-28;PHX|16-28;TOR|11-33;CON|11-33;SEA|8-36`,
};

// Fan Level: XP thresholds plus requirements that become the "next steps" on Profile.
const FAN_LEVELS = [
  { n: 1, name: 'Bandwagoner', xp: 0, req: {} },
  { n: 2, name: 'Casual', xp: 100, req: { follows: 3 } },
  { n: 3, name: 'Regular', xp: 400, req: { watched: 5, scheduled: 5 } },
  { n: 4, name: 'Die-hard', xp: 800, req: { fullGames: 3, sports: 2 } },
  { n: 5, name: 'Superfan', xp: 1400, req: { fullGames: 6, watched: 12, players: 3 }, perk: 'Superfan title on your profile' },
  { n: 6, name: 'Fanatic', xp: 2200, req: { fullGames: 10, leagues: 4 }, perk: 'Gold ring on your avatar' },
  { n: 7, name: 'Hall of Famer', xp: 3500, req: { fullGames: 20, sports: 4, watched: 30 }, perk: 'Hall of Fame banner' },
];

// Every network string a game may use (checked in development).
const NETWORKS = ['ESPN', 'ESPN2', 'ESPNU', 'ESPNEWS', 'ABC', 'ESPN/ABC', 'ESPN+', 'ESPN Unlimited', 'ESPN Deportes', 'SEC Network', 'ACC Network', 'SECN+',
  'FOX', 'FS1', 'FS2', 'CBS', 'CBSSN', 'Paramount+', 'NBC', 'USA Network', 'Peacock', 'Prime Video', 'Apple TV', 'TNT', 'truTV', 'Max', 'TBS', 'CW', 'ION',
  'Tennis Channel', 'Golf Channel', 'Willow', 'NBA TV', 'NHL Network', 'MLB.TV', 'NWSL+', 'FloSports', 'DAZN', 'YouTube', 'Canadian TV', 'Fandango', 'Roku', 'CFL+', 'EuroLeague TV', 'SOOP', 'PickleballTV', 'Local TV', 'TBD'];

// Minutes from start to final, per league, for live/final status.
const LEAGUE_LEN = {
  epl: 115,
  mls: 115,
  ucl: 115,
  bund: 115,
  laliga: 115,
  nwsl: 115,
  ligamx: 115,
  cfl: 185,
  euroleague: 115,
  nbl: 115,
  unrivaled: 60,
  npb: 195,
  kbo: 190,
  pwhl: 150,
  ahl: 150,
  lovb: 120,
  mlv: 120,
  ausl: 150,
  ncaaml: 150,
  nll: 150,
  cpl: 210,
  ipl: 210,
  mlc: 210,
  prem: 110,
  sixnations: 110,
  rugbychamp: 110,
};

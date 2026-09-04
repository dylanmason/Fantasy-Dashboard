import { parseGamelog } from "./parseGameLog";

const leagueDataPath = '/leagueData';

const positionKey: Record<string, string> = {
    'WR': process.env.REACT_APP_WIDE_RECEIVER_QUERY as string,
    'TE': process.env.REACT_APP_TIGHT_END_QUERY as string,
    'QB' : process.env.REACT_APP_QUARTERBACK_QUERY as string,
    'RB' : process.env.REACT_APP_RUNNING_BACK_QUERY as string
}

const weights: Record<'WR' | 'TE' | 'RB' | 'QB', Record<string, number>> = {
    'WR': {
        targets: 0.35,
        receptions: 0.15,
        receivingYards: 0.25,
        receivingTouchdowns: 0.50,
        yardsAfterCatch: 0.10
    },
    'TE': {
        targets: 0.35,
        receptions: 0.15,
        receivingYards: 0.25,
        receivingTouchdowns: 0.30,
        yardsAfterCatch: 0.10
    },
    'RB': {
        rushingAttempts: 0.30,
        rushingYards: 0.25,
        fumbles: -0.20,
        rushingTouchdowns: 0.50,
        targets: 0.15,
        receptions: 0.20,
        receivingYards: 0.25,
        receivingTouchdowns: 0.50,
        yardsAfterCatch: 0.10
    },
    'QB': {
        passingAttempts: 0.15,
        completedPasses: 0.20,
        passingYards: 0.15,
        passingTouchdowns: 0.50,
        interceptions: -0.20,
        rushingAttempts: 0.20,
        rushingYards: 0.20,
        rushingTouchdowns: 0.50
    }
}

export const statPaths: Record<'WR' | 'TE' | 'RB' | 'QB', Record<string, number[]>> = {
    'WR': {
        targets: [3, 1],
        receptions: [3, 0],
        receivingYards: [3, 2],
        receivingTouchdowns: [3, 4],
        yardsAfterCatch: [3, 10]
    },
    'TE': {
        targets: [3, 1],
        receptions: [3, 0],
        receivingYards: [3, 2],
        receivingTouchdowns: [3, 4],
        yardsAfterCatch: [3, 10]
    },
    'RB': {
        rushingAttempts: [2, 0],
        rushingYards: [2, 1],
        fumbles: [2, 7],
        rushingTouchdowns: [2, 5],
        targets: [3, 1],
        receptions: [3, 0],
        receivingYards: [3, 2],
        receivingTouchdowns: [3, 4],
        yardsAfterCatch: [3, 10]
    },
    'QB': {
        passingAttempts: [1, 1],
        completedPasses: [1, 0],
        passingYards: [1, 3],
        passingTouchdowns: [1, 7],
        interceptions: [1, 8],
        rushingAttempts: [2, 0],
        rushingYards: [2, 1],
        rushingTouchdowns: [2, 5]
    }
}

export async function getCurrentWeek(seasonYear: number) {
    const response = await fetch(`${process.env.REACT_APP_GAME_WEEK_DOMAIN}/${seasonYear}/types/${process.env.REACT_APP_SEASON_TYPE}/weeks?lang=en&region=us`)
    const data = await response.json();
    return data.count;
}

export function cleanAndParseInt(num: string): number| string {
    return num !== 'DNP' && num !== 'BYE' ? parseInt(num.replace(/,/g, '')) : num;
}

function sortDataField(field: string, data: any[]) {
    const sortedData = data.sort((a: any, b: any) => b[field] - a[field]);
    return sortedData.map((item: any, index: number) => ({...item, rank: index + 1}));
}

/**
 * Gets team data including passing and rushing attempts, and calculates grades and ranks.
 * @returns An array of team data mentioned in the line above
 */
async function getTeamData(seasonYear: number) {
    console.log(`Fetching team data for season year: ${seasonYear}`);
    const teamStatsMap: Record<number | string, any> = {};

    for (let i = 1; i < 35; i++) {
        if (i !== 31 && i !== 32) {
            teamStatsMap[i] = null;
        }
    }

    const fetchTeamStatsMap = Object.keys(teamStatsMap).map(async (teamId) => {
        const teamStatsFetch = await fetch(`${process.env.REACT_APP_TEAM_DATA_DOMAIN}/${teamId}/${process.env.REACT_APP_TEAM_STATS_PATH}&season=${seasonYear}&seasontype=${process.env.REACT_APP_SEASON_TYPE}`);
        const teamStats = await teamStatsFetch.json();
        const teamScheduleFetch = await fetch(`${process.env.REACT_APP_TEAM_DATA_DOMAIN}/${teamId}/${process.env.REACT_APP_TEAM_SCHEDULE_PATH}&season=${seasonYear}&seasontype=${process.env.REACT_APP_SEASON_TYPE}`);
        const teamSchedule = await teamScheduleFetch.json();
        teamStatsMap[parseInt(teamId)] = {
            passingAttempts: teamStats.results.stats.categories[0].stats[7].value,
            rushingAttempts: teamStats.results.stats.categories[1].stats[0].value,
            schedule: teamSchedule
        };
    });

    await Promise.all(fetchTeamStatsMap);

    const maxPassingAttempts = Math.max(...Object.values(teamStatsMap).map((team: any) => parseInt(team.passingAttempts)));
    const maxRushingAttempts = Math.max(...Object.values(teamStatsMap).map((team: any) => parseInt(team.rushingAttempts)));

    teamStatsMap["maxPassingAttempts"] = maxPassingAttempts;
    teamStatsMap["maxRushingAttempts"] = maxRushingAttempts;

    const sortedPassingAttempts = sortDataField('passingAttempts', Object.values(teamStatsMap).filter((team: any) => team !== null));
    const sortedRushingAttempts = sortDataField('rushingAttempts', Object.values(teamStatsMap).filter((team: any) => team !== null));

    Object.keys(teamStatsMap).forEach((teamId) => {
        if (teamId !== "maxPassingAttempts" && teamId !== "maxRushingAttempts") {
            const team = teamStatsMap[teamId];
            teamStatsMap[teamId].passingAttemptsGrade = (team.passingAttempts / teamStatsMap["maxPassingAttempts"] * 100) || 0;
            teamStatsMap[teamId].rushingAttemptsGrade = (team.rushingAttempts / teamStatsMap["maxRushingAttempts"] * 100) || 0;
            teamStatsMap[teamId].passingAttemptsRank = sortedPassingAttempts.find((team: any) => team.passingAttempts === teamStatsMap[teamId].passingAttempts)?.rank || 0;
            teamStatsMap[teamId].rushingAttemptsRank = sortedRushingAttempts.find((team: any) => team.rushingAttempts === teamStatsMap[teamId].rushingAttempts)?.rank || 0;
        }

    });

    return teamStatsMap;
}

/**
 * This function calculates average stats for players based on their position weights and paths.
 * @param averages Object to store calculated averages
 * @param positionWeights Weights assigned to each position stat
 * @param positionPaths Paths to access specific stats within player data
 * @param playerData Array of player data objects
 * @returns Calculated average player score for a specific position based on weights and averages
 */
function calculateAverages(averages: Record<string, number>, positionWeights: Record<string, number>, positionPaths: Record<string, number[]>, playerData: any) {
    for (const stat in positionWeights) {
        if (positionPaths[stat]) {
            const {0: categoryIndex, 1: statIndex} = positionPaths[stat];
            const sum = playerData.map((element: any) => {
                return cleanAndParseInt(element.categories[categoryIndex].totals[statIndex]);
            }).reduce((a: number, b: number) => a + b, 0);
            averages[stat] = sum / playerData.length;
        }
    }

    let averagePlayerScore = 0;

    for (const stat in positionWeights) {
        averagePlayerScore += positionWeights[stat] * averages[stat];
    }

    return parseFloat(averagePlayerScore.toFixed(2));
}

/**
 * This function fetches and processes gamelogs for players of a specific position.
 * @param positionData All relevant stat data for specific position
 * @param allTeamData Team data for all NFL teams
 * @param playerGamesPlayed Array of all players' active status for each game
 * @param playerGamelogs Array of all players' stats for each game they participated in
 * @returns Gamelogs for each player
 */
async function getGameLogs(positionData: any, allTeamData: any, playerGamesPlayed: any, playerGamelogs: any, seasonYear: number) {
    const gameLogMap = positionData.map(async (element: any) => {
        const [gamelog, getGamesPlayed] = await Promise.all([
            fetch(`${process.env.REACT_APP_PLAYER_GAMELOG_DOMAIN}/${element.athlete.id}/${process.env.REACT_APP_PLAYER_GAMELOG_PATH}&season=${seasonYear}&seasontype=${process.env.REACT_APP_SEASON_TYPE}`),
            fetch(`${process.env.REACT_APP_PLAYER_GAMES_PLAYED_DOMAIN}/${seasonYear}/athletes/${element.athlete.id}/${process.env.REACT_APP_PLAYER_GAMES_PLAYED_PATH}&seasonType=${process.env.REACT_APP_SEASON_TYPE}&season=${seasonYear}`)
        ]);
        const jsonLog = await gamelog.json();
        const gamesPlayed = await getGamesPlayed.json();

        if (!gamesPlayed.events) {
            console.warn(`No games played data for ${element.athlete.displayName}: ${JSON.stringify(gamesPlayed.events)} Skipping this player.`);
            return { id: element.athlete.id, name: element.athlete.displayName, gamelog: [], schedule: allTeamData[element.athlete.teamId].schedule, gamesPlayed: [] };
        }

        const gamesPlayedWithBye = gamesPlayed.events.items.map((game: any) => { return { played: game.played, bye: false } });
        
        if (allTeamData[element.athlete.teamId].schedule.byeWeek <= gamesPlayedWithBye.length - 1) {
            gamesPlayedWithBye.splice(allTeamData[element.athlete.teamId].schedule.byeWeek - 1, 0, { played: false, bye: true });
        }

        playerGamesPlayed[element.athlete.displayName] = gamesPlayedWithBye;
        
        const playerGamelog = parseGamelog(element.athlete.position.abbreviation, jsonLog, gamesPlayedWithBye);

        playerGamelogs[element.athlete.displayName] = { gamelog: jsonLog, stats: playerGamelog };

        return { id: element.athlete.id, name: element.athlete.displayName, gamelog: playerGamelog, schedule: allTeamData[element.athlete.teamId].schedule, gamesPlayed: gamesPlayedWithBye };
    });

    return Promise.all(gameLogMap);
}

/**
 * Creates the final results array with all necessary player data and calculated scores.
 * @param positionData Data for players at the specified position
 * @param weeklyRankings Weekly rankings data for players
 * @param allTeamData Data for all teams
 * @param currentWeek The current week of the season
 * @param position The position of players ('WR', 'TE', 'RB', or 'QB')
 * @param playerGamesPlayed Data on games played by players
 * @param playerGamelogs Gamelog data for players
 * @param allPlayerGamelogs All gamelog data for players
 * @returns The final results array with all necessary player data and calculated scores
 */
function createResults(positionData: any, weeklyRankings: Record<number, any[]>, allTeamData: any, currentWeek: number, position: 'WR' | 'TE' | 'RB' | 'QB', playerGamesPlayed: any, playerGamelogs: any, allPlayerGamelogs: any) {
    return positionData.map((element: any) => {
        const playerRankingData = weeklyRankings[currentWeek].find((player: any) => player.id === element.athlete.id);
        const score = playerRankingData ? playerRankingData.totalScore : 0;
        const situationGrades: any = {
            passingAttemptsGrade: allTeamData[element.athlete.teamId]?.passingAttemptsGrade,
            passingAttempts: allTeamData[element.athlete.teamId]?.passingAttempts,
            passingAttemptsRank: allTeamData[element.athlete.teamId]?.passingAttemptsRank,
        };
        if (position === 'RB') {
            situationGrades['rushingAttemptsGrade'] = allTeamData[element.athlete.teamId]?.rushingAttemptsGrade;
            situationGrades['rushingAttempts'] = allTeamData[element.athlete.teamId]?.rushingAttempts;
            situationGrades['rushingAttemptsRank'] = allTeamData[element.athlete.teamId]?.rushingAttemptsRank;
        }
        if (!playerGamelogs[element.athlete.displayName]) {
            console.warn(`No gamelog data for ${element.athlete.displayName}. Skipping this player.`);
            return { ...element, score, gamelog: [], statsByGame: {}, combinedStats: {}, schedule: allTeamData[element.athlete.teamId].schedule, gamesPlayed: [], situationGrades: {}, weeklyRankings: [] };
        }
        return { ...element, score: score.toFixed(2), gamelog: playerGamelogs[element.athlete.displayName].gamelog || [], statsByGame: playerGamelogs[element.athlete.displayName].stats, combinedStats: { ...Object.keys(playerGamelogs[element.athlete.displayName].stats).reduce((acc: any, key: string) => ({ ...acc, [key]: playerGamelogs[element.athlete.displayName].stats[key].filter((element: any) => typeof element === 'number').reduce((a: number, b: number) => a + b, 0) }), {}), pointsPerGame: (score / (playerGamesPlayed[element.athlete.displayName].filter((game: any) => game.played).length)).toFixed(2), yardsAfterCatch: element.categories[3].totals[10] }, schedule: allPlayerGamelogs.find((player: any) => player.id === element.athlete.id)?.schedule, gamesPlayed: playerGamesPlayed[element.athlete.displayName], situationGrades, weeklyRankings: Object.keys(weeklyRankings).map((weekNumber: any) => weeklyRankings[weekNumber].find((player: any) => player.id === element.athlete.id)) };
    });
}

/**
 * Main function that the React app calls to fetch and process player data for a specific position.
 * @param position The position of players to fetch data for ('WR', 'TE', 'RB', or 'QB')
 * @param existingTeamData Optional existing team data to use instead of fetching new data
 * @returns Processed player data for the specified position
 */
async function fetchData(position: 'WR' | 'TE' | 'RB' | 'QB' = 'WR', existingTeamData: any = null, seasonYear: number) {
    const apiFetch = await fetch(`${process.env.REACT_APP_POSITION_DATA_DOMAIN}&limit=${position === 'QB' ? 25 : 100}&category=offense${positionKey[position]}&season=${seasonYear}&seasontype=${process.env.REACT_APP_SEASON_TYPE}&po`);

    const allData = await apiFetch.json();
    const currentWeek = await getCurrentWeek(seasonYear);
    const playerData = allData.athletes;

    const allTeamData = existingTeamData || await getTeamData(seasonYear);

    const positionWeights = weights[position];
    const positionPaths = statPaths[position];

    const averages: Record<string, number> = {};

    const averagePlayerScore = calculateAverages(averages, positionWeights, positionPaths, playerData);

    const positionData = playerData.filter((element: any) => element.athlete.position.abbreviation === position);

    const playerGamesPlayed: any = {};
    const playerGamelogs: any = {};

    const allPlayerGamelogs = await getGameLogs(positionData, allTeamData, playerGamesPlayed, playerGamelogs, seasonYear);

    const weeklyRankings = rankPlayersByWeek(allPlayerGamelogs, positionWeights, currentWeek);

    const results = createResults(positionData, weeklyRankings, allTeamData, currentWeek, position, playerGamesPlayed, playerGamelogs, allPlayerGamelogs);

    let filteredResults = results.filter((element: any) => element.athlete.position.abbreviation === position);

    filteredResults.sort((a: any, b: any) => b.score - a.score).forEach((element: any, index: number) => {
        element.rank = index + 1;
        element.combinedStats.stockRise = getRankingDifference(element.rank || 0, element.weeklyRankings || []).stockRise;
    });

    return { seasonYear, averagePlayerScore, playerData: filteredResults };
}

/**
 * Ranks players by their accumulated weekly scores based on gamelogs and position weights.
 * @param gamelogs Gamelog data for players
 * @param positionWeights Weights for each position's stats
 * @param currentWeek The current week of the season
 * @returns Weekly rankings of players based on their scores
 */
function rankPlayersByWeek(gamelogs: any[], positionWeights: any, currentWeek: number) {
    const weeklyScoresMap: Record<number, { id: string, name: string, totalScore: number }[]> = {};

    for (let i = 1; i <= currentWeek; i++) {
        weeklyScoresMap[i] = [];
    }

    for (const playerLog of gamelogs) {
        const { id, name, gamelog, gamesPlayed } = playerLog;
        const statKeys = Object.keys(gamelog);

        let currentTotalScore = 0;
        let gameIndex = 0;

        for (let week = 1; week <= currentWeek; week++) {
            const weekIndex = week - 1;
            const gameStatus = gamesPlayed[weekIndex];

            if (gameStatus && gameStatus.played && !gameStatus.bye) {
                let weekScore = 0;

                statKeys.forEach(key => {
                    const val = gamelog[key]?.[gameIndex];
                    if (typeof val === 'number') {
                        weekScore += (positionWeights[key] || 0) * val;
                    }
                });

                currentTotalScore += weekScore;
                gameIndex++;
            }

            weeklyScoresMap[week].push({
                id,
                name,
                totalScore: parseFloat(currentTotalScore.toFixed(2))
            });
        }
    }

    const finalRankings: Record<number, any[]> = {};
    
    Object.keys(weeklyScoresMap).forEach((weekStr) => {
        const week = parseInt(weekStr);
        const sortedPlayers = weeklyScoresMap[week].sort((a, b) => b.totalScore - a.totalScore);
        
        finalRankings[week] = sortedPlayers.map((p, index) => ({
            ...p,
            weekRank: index + 1
        }));
    });

    return finalRankings;
}

/**
 * Gets the difference in rankings between the current and previous week.
 * @param currentRanking The current ranking of the player
 * @param weeklyRankings Array of weekly rankings for the player
 * @returns An object containing the current and previous rankings, as well as the stock rise (difference) between them
 */
function getRankingDifference(currentRanking: number, weeklyRankings: any[]) {
    if (weeklyRankings.length < 2) return { currentRanking, previousRanking: currentRanking, stockRise: 0 };

    let previousRanking = 0;
    for (let i = 0; i < weeklyRankings.length - 1; i++) {
        if (weeklyRankings[i] && weeklyRankings[i].weekRank !== undefined) {
            previousRanking = weeklyRankings[i].weekRank;
        }
    }
    const stockRise = previousRanking ? previousRanking - currentRanking : 0;
    return { currentRanking, previousRanking, stockRise };
}

async function readLeagueDataForYear(seasonYear: number, leagueId: number): Promise<any> {
    console.log(`Reading league data for year ${seasonYear} and league ID ${leagueId} at path: ${leagueDataPath}/${leagueId}/${seasonYear}.json `);
    return await fetch(`${leagueDataPath}/${leagueId}/${seasonYear}.json`).then(res => res.json());
}

async function fetchLeagueIds(): Promise<number[]> {
    return await fetch(`${leagueDataPath}/leagueIds.json`).then(res => res.json());
}

export async function getLeaguesInfo(): Promise<Record<string, any>[]> {
    const leagueNames = [];
    const leagueIds = await fetchLeagueIds();
    for (const leagueId of leagueIds) {
        const leagueData = await fetch(`${leagueDataPath}/${leagueId}/leagueInfo.json`).then(res => res.json());
        leagueNames.push({ leagueName: leagueData.leagueName, id: leagueId });
    }
    return leagueNames;
}

async function buildLeagueDataForYear(seasonYear: number, leagueId: number): Promise<any> {
    try {
        const builtData: Record<number | 'attempted', any> = { attempted: false };
        const leagueData = await readLeagueDataForYear(seasonYear, leagueId);
        console.log(`Successfully read league data for year ${seasonYear}:`, leagueData);
        const teams = leagueData.teams;

        for (const team of teams) {
            for (const player of team.roster.entries) {
                builtData[player.playerId as number] = {
                    id: player.playerId,
                    fantasyTeamId: team.id,
                    teamLogo: team.logo,
                    teamName: team.name
                };
            }
        }

        builtData['attempted'] = true;

        return builtData;
    } catch (err) {
        console.error(`Error reading league data for year ${seasonYear}:`, err);
        return { attempted: true };
    }
}

export { fetchData, getRankingDifference, getTeamData, buildLeagueDataForYear };
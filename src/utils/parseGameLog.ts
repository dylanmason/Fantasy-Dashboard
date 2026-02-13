import { cleanAndParseInt } from ".";

type StatCategory = 'receiving' | 'touchdowns' | 'rushing' | 'passing' | 'turnovers';

export const statDisplayInfo: Record<string, { label: string; category: StatCategory }> = {
    receptions: { label: 'Receptions', category: 'receiving' },
    targets: { label: 'Targets', category: 'receiving' },
    receivingYards: { label: 'Receiving Yards', category: 'receiving' },
    receivingTouchdowns: { label: 'Receiving Touchdowns', category: 'receiving' },

    rushingAttempts: { label: 'Rushing Attempts', category: 'rushing' },
    rushingYards: { label: 'Rushing Yards', category: 'rushing' },
    rushingTouchdowns: { label: 'Rushing Touchdowns', category: 'rushing' },
    fumbles: { label: 'Fumbles', category: 'turnovers' },

    passingAttempts: { label: 'Passing Attempts', category: 'passing' },
    completedPasses: { label: 'Completed Passes', category: 'passing' },
    passingYards: { label: 'Passing Yards', category: 'passing' },
    passingTouchdowns: { label: 'Passing Touchdowns', category: 'passing' },
    interceptions: { label: 'Interceptions', category: 'turnovers' },
};

export function parseGamelog(position: string, gamelog: any, gamesPlayed: {played: boolean; bye: boolean;}[]) {
    let updatedGamelog = checkWeek(gamelog.seasonTypes.length > 1 ? gamelog.seasonTypes[1].categories[0].events : gamelog.seasonTypes[0].categories[0].events, gamesPlayed);
    if (position === 'WR' || position === 'TE') {
        return wrGameLog(updatedGamelog);
    } else if (position === 'RB') {
        return rbGameLog(updatedGamelog);
    } else if (position === 'QB') {
        return qbGameLog(updatedGamelog);
    } else {
        return undefined;
    }
}

function wrGameLog(games: any) {
    const receptions = games.map((game: any) => cleanAndParseInt(game.stats[0]));
    const targets = games.map((game: any) => cleanAndParseInt(game.stats[1]));
    const receivingYards = games.map((game: any) => cleanAndParseInt(game.stats[2]));
    const receivingTouchdowns = games.map((game: any) => cleanAndParseInt(game.stats[4]));

    return { receptions, targets, receivingYards, receivingTouchdowns };
}

function rbGameLog(games: any) {
    const rushingAttempts = games.map((game: any) => cleanAndParseInt(game.stats[0]));
    const rushingYards = games.map((game: any) => cleanAndParseInt(game.stats[1]));
    const fumbles = games.map((game: any) => cleanAndParseInt(game.stats[11]));
    const rushingTouchdowns = games.map((game: any) => cleanAndParseInt(game.stats[3]));
    const targets = games.map((game: any) => cleanAndParseInt(game.stats[6]));
    const receptions = games.map((game: any) => cleanAndParseInt(game.stats[5]));
    const receivingYards = games.map((game: any) => cleanAndParseInt(game.stats[7]));
    const receivingTouchdowns = games.map((game: any) => cleanAndParseInt(game.stats[9]));
    return { rushingAttempts, rushingYards, rushingTouchdowns, receptions, receivingYards, receivingTouchdowns, fumbles, targets };
}

function qbGameLog(games: any) {
    const passingAttempts = games.map((game: any) => cleanAndParseInt(game.stats[1]));
    const completedPasses = games.map((game: any) => cleanAndParseInt(game.stats[0]));
    const passingYards = games.map((game: any) => cleanAndParseInt(game.stats[2]));
    const passingTouchdowns = games.map((game: any) => cleanAndParseInt(game.stats[5]));
    const interceptions = games.map((game: any) => cleanAndParseInt(game.stats[6]));
    const rushingAttempts = games.map((game: any) => cleanAndParseInt(game.stats[11]));
    const rushingYards = games.map((game: any) => cleanAndParseInt(game.stats[12]));
    const rushingTouchdowns = games.map((game: any) => cleanAndParseInt(game.stats[14]));

    return { passingAttempts, completedPasses, passingYards, passingTouchdowns, interceptions, rushingAttempts, rushingYards, rushingTouchdowns };
}

function checkWeek(gamelog: any, gamesPlayed: {played: boolean; bye: boolean;}[]) {
    let dnp: any = [];
    let bye: any = [];

    for (let i = 0; i < 15; i++) {
        dnp.push('DNP');
        bye.push('BYE');
    }
    

    gamelog = gamelog.reverse();
    let updatedGamelog = gamelog;

    let week = 0;
    while (week < gamesPlayed.length) {
        if (gamesPlayed[week]?.bye && updatedGamelog[week]?.stats[0] !== 'BYE') {
            updatedGamelog.splice(week, 0, { stats: bye });
        } else if (!gamesPlayed[week]?.played && updatedGamelog[week]?.stats[0] !== 'DNP') {
            updatedGamelog.splice(week, 0, { stats: dnp });
        }
        week++;
    }

    // for (let i = 0; i < 18; i++) {
        // if (updatedGamelog[i] === undefined) {
        //     if (i < gamesPlayed.length && !gamesPlayed[i] && i + 1 !== byeWeek) {
        //         updatedGamelog.push({ stats: dnp });
        //     }
        //     else if (i + 1 === byeWeek && updatedGamelog[i]?.stats[0] !== 'BYE') {
        //         updatedGamelog.push({ stats: bye });
        //         break;
        //     } else {
        //         break;
        //     }
        // } else if (i < gamesPlayed.length && i + 1 === byeWeek && updatedGamelog[i].stats[0] !== 'BYE') {
        //     updatedGamelog.splice(i, 0, { stats: bye });
        // } else if (i < gamesPlayed.length && !gamesPlayed[i] && updatedGamelog[i].stats[0] !== 'DNP') {
        //     updatedGamelog.splice(i, 0, { stats: dnp });
        // }
    // }
    
    return updatedGamelog;
}
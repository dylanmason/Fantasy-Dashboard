import 'dotenv/config';
import { mkdir, writeFile } from 'fs/promises';
const OUTPUT_FILE_PATH = '../front-end/public/leagueData';
function generateCurrentSeasonYear() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    return currentMonth >= 7 ? currentYear : currentYear - 1;
}
async function fetchLeagueData(year, leagueId) {
    const SWID = process.env.SWID;
    const espnS2 = process.env.ESPN_S2;
    if (!SWID || !espnS2) {
        console.warn('SWID and/or ESPN_S2 environment variables are not set. Please check your .env file.');
        return;
    }
    const rosterFetch = await fetch(`${process.env.FANTASY_URL}${year}${process.env.FANTASY_PATH}${leagueId}${process.env.FANTASY_QUERY_PARAMS}`, {
        method: 'GET',
        headers: {
            'Cookie': `SWID=${SWID}; espn_s2=${espnS2};`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
        }
    });
    if (!rosterFetch.ok) {
        console.error(`Failed to fetch league data: ${rosterFetch.status} ${rosterFetch.statusText}`);
        return { rosterInformation: null, success: false };
    }
    console.log('Successfully fetched league data.');
    return { rosterInformation: await rosterFetch.json(), success: true };
}
function fetchLeagueInfo(leagueData) {
    return {
        leagueName: leagueData.settings.name,
    };
}
async function writeData() {
    const leagueIds = process.env.FANTASY_LEAGUE_IDS?.split(',').map(id => parseInt(id.trim(), 10));
    await mkdir(OUTPUT_FILE_PATH, { recursive: true });
    await writeFile(`${OUTPUT_FILE_PATH}/leagueIds.json`, JSON.stringify(leagueIds), { flag: 'w' });
    for (const leagueId of leagueIds || []) {
        let year = generateCurrentSeasonYear();
        await mkdir(`${OUTPUT_FILE_PATH}/${leagueId}`, { recursive: true });
        let firstFind = true;
        while (true) {
            const data = await fetchLeagueData(year, leagueId);
            if (!data.success) {
                console.warn('Failed to fetch league data either for league and/or year. Aborting write operation.');
                break;
            }
            try {
                await writeFile(`${OUTPUT_FILE_PATH}/${leagueId}/${year}.json`, JSON.stringify(data.rosterInformation, null, 2));
                if (firstFind) {
                    const leagueInfo = fetchLeagueInfo(data.rosterInformation);
                    await writeFile(`${OUTPUT_FILE_PATH}/${leagueId}/leagueInfo.json`, JSON.stringify(leagueInfo, null, 2));
                    firstFind = false;
                    console.log(`League data successfully written to ${OUTPUT_FILE_PATH}/${leagueId}/leagueInfo.json`);
                }
                console.log(`League data successfully written to ${OUTPUT_FILE_PATH}/${leagueId}_${year}.json`);
            }
            catch (error) {
                console.error('Error writing league data to file:', error);
            }
            year--;
        }
    }
}
await writeData();
//# sourceMappingURL=index.js.map
import { useEffect, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Switch, Typography } from "@mui/material";

const sortFields = {
    'WR': ['receptions', 'receivingYards', 'receivingTouchdowns', 'targets', 'yardsAfterCatch', 'stockRise'],
    'TE': ['receptions', 'receivingYards', 'receivingTouchdowns', 'targets', 'yardsAfterCatch', 'stockRise'],
    'RB': ['rushingYards', 'rushingTouchdowns', 'rushingAttempts', 'receptions', 'receivingYards', 'receivingTouchdowns', 'targets', 'yardsAfterCatch', 'stockRise'],
    'QB': ['passingYards', 'passingTouchdowns', 'passingAttempts', 'completedPasses', 'rushingYards', 'rushingTouchdowns', 'rushingAttempts', 'stockRise'],
}

function getISOWeekNumber(date: Date) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - (target as unknown as number)) / 604800000);
}

console.log(getISOWeekNumber(new Date()));

export function generateCurrentSeasonYear() {
    const laborDay = new Date(new Date().getFullYear(), 8, 1);
    let laborDayWeek = 36;
    if (laborDay.getDay() === 2 && laborDay.getDay() === 3) {
        laborDayWeek = 37;
    }
    const weekNumber = getISOWeekNumber(new Date());
    return weekNumber >= laborDayWeek + 1 ? new Date().getFullYear() : new Date().getFullYear() - 1;
}

function generateLastDecadeYears(retrieveFantasyData: boolean = false) {
    let currentYear = generateCurrentSeasonYear();
    if (retrieveFantasyData) {
        currentYear = generateCurrentFantasySeasonYear();
    }
    const years = [];
    for (let i = 0; i < 10; i++) {
        years.push(currentYear - i);
    }
    return years;
}

export function generateCurrentFantasySeasonYear(): number {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return currentMonth >= 7 ? currentYear : currentYear - 1;
}

function sortByField(players: any[], field: string) {
    return players.slice().sort((a, b) => {
        let aValue, bValue;

        if (field === 'rank') {
            aValue = a.rank || 0;
            bValue = b.rank || 0;
            return aValue - bValue;
        }

        aValue = a.combinedStats[field as keyof typeof a.combinedStats] || 0;
        bValue = b.combinedStats[field as keyof typeof b.combinedStats] || 0;
        return bValue - aValue;
    });
}

export default function PositionSelection(props: any) {
    const [lastDecadeYears, setLastDecadeYears] = useState<number[]>(generateLastDecadeYears(props.retrieveFantasyData));
    useEffect(() => {
        setLastDecadeYears(generateLastDecadeYears(props.retrieveFantasyData));
        if (!props.retrieveFantasyData) {
            props.setSeasonYear(generateCurrentSeasonYear());
        } else {
            props.setSeasonYear(generateCurrentFantasySeasonYear());
        }
    }, [props.retrieveFantasyData]);
    return (
        <Paper sx={{ width: '80%', borderRadius: 3, padding: 2, margin: 2 }}>
            <Stack spacing={2} justifyContent="space-between">
            <FormControl fullWidth>
                <InputLabel id="category-select-label">Position</InputLabel>
                <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={props.position}
                    onChange={(e) => props.setPosition(e.target.value)}
                >
                    <MenuItem value="WR">Wide Receiver</MenuItem>
                    <MenuItem value="RB">Running Back</MenuItem>
                    <MenuItem value="TE">Tight End</MenuItem>
                    <MenuItem value="QB">Quarterback</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="sort-select-label">Sort By</InputLabel>
                <Select
                    labelId="sort-select-label"
                    id="sort-select"
                    value={props.sortBy}
                    onChange={(e) => {
                        props.setSortBy(e.target.value);
                        const sortedPlayers = sortByField(props.players, e.target.value);
                        console.log('Sorted Players by', e.target.value, sortedPlayers);
                        props.setPlayers(sortedPlayers);
                    }}
                >
                    <MenuItem value="rank">Rank</MenuItem>
                    <MenuItem value="pointsPerGame">Points Per Game</MenuItem>
                    {sortFields[props.position as keyof typeof sortFields].map((field: string) => (
                        <MenuItem key={field} value={field}>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                    labelId="year-select-label"
                    id="year-select"
                    value={props.seasonYear}
                    onChange={(e) => {
                        props.setSeasonYear(e.target.value);
                    }}
                >
                    {lastDecadeYears.map((year: number) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            { props.retrieveFantasyData ? (
            <FormControl fullWidth>
                <InputLabel id="league-select-label">Fantasy League</InputLabel>
                <Select
                    labelId="league-select-label"
                    id="league-select"
                    value={props.selectedFantasyLeague?.id ?? ''}
                    onChange={(e) => {
                        const selectedLeague = props.fantasyLeagues.find((league: any) => league.id === Number(e.target.value));
                        props.setSelectedFantasyLeague(selectedLeague);
                    }}
                >
                    {props.fantasyLeagues.map((league: { id: number; leagueName: string; }) => (
                        <MenuItem key={league.id} value={league.id}>{league.leagueName}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            ) : ( <></> ) }
            <FormControl fullWidth>
                <Stack direction='row' spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>Retrieve Fantasy Data</Typography>
                <Box>
                <Switch
                    checked={props.retrieveFantasyData}
                    onChange={(e) => props.setRetrieveFantasyData(e.target.checked)}
                />
                </Box>
                </Stack>
            </FormControl>
            </Stack>
        </Paper>
    )
}
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Stack } from "@mui/material";

const sortFields = {
    'WR': ['receptions', 'receivingYards', 'receivingTouchdowns', 'targets', 'yardsAfterCatch'],
    'TE': ['receptions', 'receivingYards', 'receivingTouchdowns', 'targets', 'yardsAfterCatch'],
    'RB': ['rushingYards', 'rushingTouchdowns', 'rushingAttempts', 'receptions', 'receivingYards', 'receivingTouchdowns', 'targets', 'yardsAfterCatch'],
    'QB': ['passingYards', 'passingTouchdowns', 'passingAttempts', 'completedPasses', 'rushingYards', 'rushingTouchdowns', 'rushingAttempts'],
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

function generateLastDecadeYears() {
    const currentYear = generateCurrentSeasonYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
        years.push(currentYear - i);
    }
    return years;
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
                <InputLabel id="sort-select-label">Year</InputLabel>
                <Select
                    labelId="year-select-label"
                    id="year-select"
                    value={props.seasonYear}
                    onChange={(e) => {
                        props.setSeasonYear(e.target.value);
                        console.log('Selected Year:', e.target.value);
                    }}
                >
                    {generateLastDecadeYears().map((year: number) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            </Stack>
        </Paper>
    )
}
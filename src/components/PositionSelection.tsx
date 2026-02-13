import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Stack } from "@mui/material";

const sortFields = {
    'WR': ['receptions', 'receivingYards', 'receivingTouchdowns', 'targets', 'yardsAfterCatch'],
    'TE': ['receptions', 'receivingYards', 'receivingTouchdowns', 'targets', 'yardsAfterCatch'],
    'RB': ['rushingYards', 'rushingTouchdowns', 'rushingAttempts', 'receptions', 'receivingYards', 'receivingTouchdowns', 'targets', 'yardsAfterCatch'],
    'QB': ['passingYards', 'passingTouchdowns', 'passingAttempts', 'completedPasses', 'rushingYards', 'rushingTouchdowns', 'rushingAttempts'],
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
            </Stack>
        </Paper>
    )
}
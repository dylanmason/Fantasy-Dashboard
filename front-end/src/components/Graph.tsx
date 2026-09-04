import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { parseGamelog, statDisplayInfo } from "../utils/parseGameLog";
import LineGraph from "./LineGraph";
import PlayerRankingGraph from "./PlayerRankingGraph";

export default function Graph(props: any) {
    const { selectedPlayer } = props;
    const defaultCategory = {
    'WR': 'receiving',
    'RB': 'rushing',
    'QB': 'passing',
    'TE': 'receiving',
    } as const;

    type PlayerCategory = 'receiving' | 'touchdowns' | 'yards' | 'rushing' | 'passing' | 'turnovers';

    const { statsByGame, schedule, gamesPlayed } = selectedPlayer || {};

    console.log('Selected Player in LineGraph:', selectedPlayer);

    let initialCategory: PlayerCategory = 'receiving';

    const playerAbbreviation = selectedPlayer?.athlete?.position?.abbreviation;

    if (playerAbbreviation && playerAbbreviation in defaultCategory) {
        initialCategory = defaultCategory[playerAbbreviation as keyof typeof defaultCategory];
    }

    const [category, setCategory] = useState<PlayerCategory>(initialCategory);
    const [graphType, setGraphType] = useState<'line' | 'stock'>('line');
    const categorizedFields: any = {
        receiving: [],
        touchdowns: [],
        rushing: [],
        passing: [],
        turnovers: [],
    }
    if (statsByGame) {
        Object.keys(statsByGame).forEach((statKey) => {
            if (statKey !== 'pointsPerGame') {
                const info = statDisplayInfo[statKey];
                categorizedFields[info.category].push({ label: info.label, data: statsByGame[statKey as keyof typeof statsByGame].map((stat: any) => typeof stat === 'number' ? stat : null ), id: statKey });
            }
        });
    }

    console.log('Categorized Fields:', categorizedFields);

    const currentCategoryFields = categorizedFields[category];

    const filteredXAxisData: any = [];

    if (currentCategoryFields.length > 0) {
        console.log('Games Played:', gamesPlayed, 'Schedule:', schedule);
        for (let i = 0; i < gamesPlayed.length; i++) {
            filteredXAxisData.push(`Week ${i + 1}`);
        }
        console.log('Filtered X Axis Data:', filteredXAxisData, 'Player:', selectedPlayer?.athlete?.displayName);
        console.log('Current Category Fields:', currentCategoryFields);
    }

    useEffect(() => {
        if (playerAbbreviation) {
            setCategory(defaultCategory[playerAbbreviation as keyof typeof defaultCategory]);
        }
    }, [selectedPlayer?.athlete?.position?.abbreviation]);

    return (
        <Paper elevation={3} sx={{ padding: 2, margin: 2, width: '90%', borderRadius: 3, justifyContent: 'center', alignItems: 'center' }}>
            { !selectedPlayer ? <Typography variant="h6">Loading...</Typography> : (
            <>
            <Stack direction='row' spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
            { graphType !== 'stock' ? (
                <FormControl sx={{ width: '50%'}}>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {
                            Object.keys(categorizedFields).filter((cat) => categorizedFields[cat].length > 0).map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            ) : (
                <></>
            )}
            <FormControl sx={{ width: graphType === 'stock' ? '100%' : '50%'}}>
                <InputLabel id="graph-select-label">Graph</InputLabel>
                <Select
                    labelId="graph-select-label"
                    id="graph-select"
                    value={graphType}
                    onChange={(e) => setGraphType(e.target.value as 'line' | 'stock')}
                >
                    {
                        ['line', 'stock'].map((type) => (
                            <MenuItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            { !(currentCategoryFields.length > 0) ? (
                <Typography variant="h6">Loading...</Typography>
            ) : (
                graphType === 'line' ? (
                <LineGraph
                    currentCategoryFields={currentCategoryFields}
                    filteredXAxisData={filteredXAxisData}
                />
            ) : (
                <PlayerRankingGraph
                    weeklyRankings={selectedPlayer?.weeklyRankings}
                />
            )
            )}
            </Box>
            </>
            )}
        </Paper>
    );
}
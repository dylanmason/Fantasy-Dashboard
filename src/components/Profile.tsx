import { Avatar, Box, Grid, IconButton, Paper, Stack, Typography, useColorScheme } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { useEffect, useState } from "react";
import StatsTable from "./StatsTable";

export default function Profile(props: any) {
    const [gaugeValue, setGaugeValue] = useState(0);
    const { mode, setMode } = useColorScheme();
    
    useEffect(() => {
        if (!props?.selectedPlayer) return;
        setGaugeValue(Math.min((props.selectedPlayer?.score / props?.currentMaxScore) * 100, 100) || 0);
    }, [props.selectedPlayer]);

  return (
    <Paper elevation={3} sx={{ padding: 2, margin: 2, width: '90%', height: 300, borderRadius: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Grid container spacing={2} sx={{ width: '100%', flexGrow: 1, justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Grid size={9}>
                <Stack direction="column" spacing={4} alignItems="center" sx={{ width: '100%' }}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="left" sx={{ width: '100%' }}>
                    <IconButton onClick={() => mode === 'dark' ? setMode('light') : setMode('dark')}>
                        <Avatar alt='Player Image' src={props.selectedPlayer?.athlete?.headshot?.href} sx={{ width: 56, height: 56, borderColor: 'gray', borderWidth: 2, borderStyle: 'solid' }} />
                    </IconButton>
                    <h2>{props.selectedPlayer?.athlete?.displayName}</h2>
                    </Stack>
                <StatsTable selectedPlayer={props.selectedPlayer} />
                </Stack>
            </Grid>
            <Grid size={3} sx={{ height: '100%' }}>
                <Stack direction="column" spacing={4} alignItems="center" justifyContent='space-between'>
                <Gauge value={gaugeValue} startAngle={0} endAngle={360} text={gaugeValue.toFixed(0) + '%'} sx={(theme) => ({
                [`& .${gaugeClasses.valueArc}`]: {
                    fill: `hsl(${(gaugeValue / 100) * 120}, 100%, 40%)`,
                },
                })}/>
                <Box sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                <Typography component="span" sx={{ fontSize: 18, fontWeight: 'light' }}>Dylan's Ranking:&nbsp; 
                    <Typography component="span" sx={{ fontSize: 18, fontWeight: 'bold' }}>{props.selectedPlayer?.rank || 0}
                    {/* {
                        props.selectedPlayer?.weeklyRankings.length > 1 && currentRank < previousRank ? (
                            <TrendingUp sx={{ color: '#4caf50', fontSize: 20, verticalAlign: 'middle' }} />
                        ) : props.selectedPlayer?.weeklyRankings.length > 1 && currentRank > previousRank ? (
                            <TrendingDown sx={{ color: 'red', fontSize: 20, verticalAlign: 'middle' }} />
                        ) : null
                    } */}
                    </Typography>
                </Typography>
                </Box>
                {/* <Box sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                <Typography component="span" sx={{ fontSize: 15, fontWeight: 'light', opacity: 0.7 }}>
                    Last weeks rank: {props.selectedPlayer?.weeklyRankings.length > 1 ? props.selectedPlayer?.weeklyRankings[props.selectedPlayer?.weeklyRankings.length - 2].weekRank : 'N/A'}
                </Typography>
                </Box> */}
                </Stack>
            </Grid>
        </Grid>
    </Paper>
  );
}
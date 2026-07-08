import { useEffect, useState } from 'react';
import './App.css';
import Profile from './components/Profile';
import { Box, createTheme, Grid, Stack, ThemeProvider } from '@mui/material';
import { fetchData, getTeamData } from './utils';
import PlayerList from './components/PlayerList';
import Chart from './components/Chart';
import { generateCurrentSeasonYear } from './components/PositionSelection';
import { 
  getAveragePassingAttempts, getAveragePassingCompletions, getAveragePassingTouchdowns, getAveragePassingYards, 
  getAverageReceivingTouchdowns, getAverageReceivingYards, getAverageReceptions, getAverageRushingAttempts, 
  getAverageRushingTouchdowns, getAverageRushingYards, getAverageTargets, getAverageYardsAfterCatch, 
  getMaxPassingAttempts, getMaxPassingCompletions, getMaxPassingTouchdowns, getMaxPassingYards, 
  getMaxReceivingTouchdowns, getMaxReceivingYards, getMaxReceptions, getMaxRushingAttempts, 
  getMaxRushingTouchdowns, getMaxRushingYards, getMaxTargets, getMaxYardsAfterCatch 
} from './utils/maxCategory';
import PositionSelection from './components/PositionSelection';
import TeamStats from './components/TeamStats';
import Graph from './components/Graph';

interface StatMetrics {
  receivingYards: number;
  receptions: number;
  targets: number;
  receivingTouchdowns: number;
  yardsAfterCatch: number;
  rushingAttempts: number;
  rushingYards: number;
  rushingTouchdowns: number;
  passingAttempts: number;
  passingCompletions: number;
  passingYards: number;
  passingTouchdowns: number;
}

const initialStats: StatMetrics = {
  receivingYards: 0,
  receptions: 0,
  targets: 0,
  receivingTouchdowns: 0,
  yardsAfterCatch: 0,
  rushingAttempts: 0,
  rushingYards: 0,
  rushingTouchdowns: 0,
  passingAttempts: 0,
  passingCompletions: 0,
  passingYards: 0,
  passingTouchdowns: 0,
};

function App() {
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [currentMaxScore, setCurrentMaxScore] = useState<number>(0);
  const [averagePlayerScore, setAveragePlayerScore] = useState<number>(0);
  const [position, setPosition] = useState<'WR' | 'RB' | 'QB' | 'TE'>('WR');
  const [sortBy, setSortBy] = useState<string>('rank');
  const [seasonYear, setSeasonYear] = useState<number>(generateCurrentSeasonYear());

  const [maxStats, setMaxStats] = useState<StatMetrics>(initialStats);
  const [averageStats, setAverageStats] = useState<StatMetrics>(initialStats);

  const [cachedAveragePlayerScore, setCachedAveragePlayerScore] = useState<Record<string, Record<string, number>>>({});
  const [cachedTeamData, setCachedTeamData] = useState<any>(null);
  const [cachedPlayerData, setCachedPlayerData] = useState<Record<string, Record<string, any[]>>>({});
  
  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  const updateStatsFromData = (data: any[], avgScore: number) => {
    setPlayers(data);
    setAveragePlayerScore(avgScore);
    setSelectedPlayer(data[0]);
    setCurrentMaxScore(data[0]?.score || 0);
    setSortBy('rank');

    const newMaxes = { ...initialStats };
    const newAverages = { ...initialStats };

    newMaxes.rushingAttempts = getMaxRushingAttempts(data);
    newMaxes.rushingYards = getMaxRushingYards(data);
    newMaxes.rushingTouchdowns = getMaxRushingTouchdowns(data);
    
    newAverages.rushingAttempts = getAverageRushingAttempts(data);
    newAverages.rushingYards = getAverageRushingYards(data);
    newAverages.rushingTouchdowns = getAverageRushingTouchdowns(data);

    if (position === 'QB') {
      newMaxes.passingAttempts = getMaxPassingAttempts(data);
      newMaxes.passingCompletions = getMaxPassingCompletions(data);
      newMaxes.passingTouchdowns = getMaxPassingTouchdowns(data);
      newMaxes.passingYards = getMaxPassingYards(data);

      newAverages.passingAttempts = getAveragePassingAttempts(data);
      newAverages.passingCompletions = getAveragePassingCompletions(data);
      newAverages.passingTouchdowns = getAveragePassingTouchdowns(data);
      newAverages.passingYards = getAveragePassingYards(data);
    } else {
      newMaxes.receivingYards = getMaxReceivingYards(data);
      newMaxes.receptions = getMaxReceptions(data);
      newMaxes.targets = getMaxTargets(data);
      newMaxes.receivingTouchdowns = getMaxReceivingTouchdowns(data);
      newMaxes.yardsAfterCatch = getMaxYardsAfterCatch(data);

      newAverages.receivingYards = getAverageReceivingYards(data);
      newAverages.receptions = getAverageReceptions(data);
      newAverages.targets = getAverageTargets(data);
      newAverages.receivingTouchdowns = getAverageReceivingTouchdowns(data);
      newAverages.yardsAfterCatch = getAverageYardsAfterCatch(data);
    }

    setMaxStats(newMaxes);
    setAverageStats(newAverages);
  };

  useEffect(() => {
    console.log(`Fetching data for position: ${position}, season year: ${seasonYear}`);
    (async () => {
      let currentTeamData = cachedTeamData;
      if (!currentTeamData || !currentTeamData[seasonYear]) {
        currentTeamData = await getTeamData(seasonYear);
        setCachedTeamData(currentTeamData);
      }

      if (cachedPlayerData[seasonYear] && cachedPlayerData[seasonYear][position]) {
        updateStatsFromData(cachedPlayerData[seasonYear][position], cachedAveragePlayerScore[seasonYear][position]);
      } 
      else {
        const { seasonYear: selectedSeasonYear, averagePlayerScore, playerData: data } = await fetchData(position, currentTeamData, seasonYear);
        
        updateStatsFromData(data, averagePlayerScore);

        setCachedPlayerData((prev) => ({ ...prev, [selectedSeasonYear]: { ...prev[selectedSeasonYear], [position]: data } }));
        setCachedAveragePlayerScore((prev) => ({ ...prev, [selectedSeasonYear]: { ...prev[selectedSeasonYear], [position]: averagePlayerScore } }));
      }
    })();
  }, [position, seasonYear]); 

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ alignContent: 'center', justifyContent: 'center', display: 'flex', width: '100%', height: '100%', bgcolor: 'background.default', color: 'text.primary' }} overflow='auto'>
        <Grid container spacing={2} sx={{ width: '100%', height: '100vh', flexGrow: 1 }}>
          <Grid size={{ xs: 12, md: 9}} sx={{ justifyContent: 'left', alignItems: 'flex-start', paddingTop: 2 }}>
            <Stack spacing={2} alignItems="flex-start" justifyContent="left" sx={{ width: '100%', paddingLeft: 2}}>
              <Box sx={{ width: '100%' }}>
                <Profile selectedPlayer={selectedPlayer} currentMaxScore={currentMaxScore} averagePlayerScore={averagePlayerScore} />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Graph selectedPlayer={selectedPlayer} />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Chart 
                  selectedPlayer={selectedPlayer} 
                  maxes={{
                    maxReceivingYards: maxStats.receivingYards,
                    maxReceptions: maxStats.receptions,
                    maxTargets: maxStats.targets,
                    maxReceivingTouchdowns: maxStats.receivingTouchdowns,
                    maxYardsAfterCatch: maxStats.yardsAfterCatch,
                    maxRushingAttempts: maxStats.rushingAttempts,
                    maxRushingYards: maxStats.rushingYards,
                    maxRushingTouchdowns: maxStats.rushingTouchdowns,
                    maxPassingAttempts: maxStats.passingAttempts,
                    maxPassingCompletions: maxStats.passingCompletions,
                    maxPassingYards: maxStats.passingYards,
                    maxPassingTouchdowns: maxStats.passingTouchdowns
                  }} 
                  averages={{
                    averageReceivingYards: averageStats.receivingYards,
                    averageReceptions: averageStats.receptions,
                    averageTargets: averageStats.targets,
                    averageReceivingTouchdowns: averageStats.receivingTouchdowns,
                    averageYardsAfterCatch: averageStats.yardsAfterCatch,
                    averageRushingAttempts: averageStats.rushingAttempts,
                    averageRushingYards: averageStats.rushingYards,
                    averageRushingTouchdowns: averageStats.rushingTouchdowns,
                    averagePassingAttempts: averageStats.passingAttempts,
                    averagePassingCompletions: averageStats.passingCompletions,
                    averagePassingYards: averageStats.passingYards,
                    averagePassingTouchdowns: averageStats.passingTouchdowns
                  }} 
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <TeamStats selectedPlayer={selectedPlayer} />
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} sx={{ paddingTop: 2 }}>
            <Box>
              <PositionSelection position={position} players={players} setPlayers={setPlayers} setPosition={setPosition} sortBy={sortBy} setSortBy={setSortBy} seasonYear={seasonYear} setSeasonYear={setSeasonYear} />
              <PlayerList players={players} setSelectedPlayer={setSelectedPlayer} sortBy={sortBy} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
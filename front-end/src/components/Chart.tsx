import { Paper, Typography } from "@mui/material";
import { RadarChart } from "@mui/x-charts";
import { cleanAndParseInt } from "../utils";


function getPositionStats(position: 'WR' | 'RB' | 'QB' | 'TE', selectedPlayer: any): number[] {
    if (position === 'WR' || position === 'TE') {
        return [cleanAndParseInt(selectedPlayer.categories[3].totals[1]) as number || 0, cleanAndParseInt(selectedPlayer.categories[3].totals[0]) as number || 0, cleanAndParseInt(selectedPlayer.categories[3].totals[2]) as number || 0, cleanAndParseInt(selectedPlayer.categories[3].totals[4]) as number|| 0, cleanAndParseInt(selectedPlayer.categories[3].totals[10]) as number || 0];
    } else if (position === 'RB') {
        return [cleanAndParseInt(selectedPlayer.categories[2].totals[0]) as number || 0, cleanAndParseInt(selectedPlayer.categories[2].totals[1]) as number || 0, cleanAndParseInt(selectedPlayer.categories[2].totals[5]) as number || 0, cleanAndParseInt(selectedPlayer.categories[3].totals[1]) as number || 0, cleanAndParseInt(selectedPlayer.categories[3].totals[0]) as number || 0, cleanAndParseInt(selectedPlayer.categories[3].totals[2]) as number || 0, cleanAndParseInt(selectedPlayer.categories[3].totals[4]) as number || 0, cleanAndParseInt(selectedPlayer.categories[3].totals[10]) as number || 0];
    } else if (position === 'QB') {
        return [cleanAndParseInt(selectedPlayer.categories[1].totals[1]) as number || 0, cleanAndParseInt(selectedPlayer.categories[1].totals[0]) as number || 0, cleanAndParseInt(selectedPlayer.categories[1].totals[3]) as number || 0, cleanAndParseInt(selectedPlayer.categories[1].totals[7]) as number || 0, cleanAndParseInt(selectedPlayer.categories[2].totals[1]) as number || 0, cleanAndParseInt(selectedPlayer.categories[2].totals[5]) as number || 0];
    } else {
        return [];
    }
}

export default function Chart(props: any) {
    const { selectedPlayer } = props;

    const positionStatsLabels = {
        'WR': [{ name: 'Targets', max: props.maxes.maxTargets}, { name: 'Receptions', max: props.maxes.maxReceptions}, { name: 'Receiving Yards', max: props.maxes.maxReceivingYards}, { name: 'Receiving Touchdowns', max: props.maxes.maxReceivingTouchdowns}, { name: 'Yards After Catch', max: props.maxes.maxYardsAfterCatch}],
        'RB': [{ name: 'Rushing Attempts', max: props.maxes.maxRushingAttempts}, { name: 'Rushing Yards', max: props.maxes.maxRushingYards}, { name: 'Rushing Touchdowns', max: props.maxes.maxRushingTouchdowns}, { name: 'Targets', max: props.maxes.maxTargets}, { name: 'Receptions', max: props.maxes.maxReceptions}, { name: 'Receiving Yards', max: props.maxes.maxReceivingYards}, { name: 'Receiving Touchdowns', max: props.maxes.maxReceivingTouchdowns}, { name: 'Yards After Catch', max: props.maxes.maxYardsAfterCatch}],
        'TE': [{ name: 'Targets', max: props.maxes.maxTargets}, { name: 'Receptions', max: props.maxes.maxReceptions}, { name: 'Receiving Yards', max: props.maxes.maxReceivingYards}, { name: 'Receiving Touchdowns', max: props.maxes.maxReceivingTouchdowns}, { name: 'Yards After Catch', max: props.maxes.maxYardsAfterCatch}],
        'QB': [{ name: 'Passing Attempts', max: props.maxes.maxPassingAttempts}, { name: 'Completed Passes', max: props.maxes.maxPassingCompletions}, { name: 'Passing Yards', max: props.maxes.maxPassingYards}, { name: 'Passing Touchdowns', max: props.maxes.maxPassingTouchdowns}, { name: 'Rushing Yards', max: props.maxes.maxRushingYards}, { name: 'Rushing Touchdowns', max: props.maxes.maxRushingTouchdowns}],
    };

    const averageStatsLabels = {
        'WR': [props.averages.averageTargets, props.averages.averageReceptions, props.averages.averageReceivingYards, props.averages.averageReceivingTouchdowns, props.averages.averageYardsAfterCatch],
        'RB': [props.averages.averageRushingAttempts, props.averages.averageRushingYards, props.averages.averageRushingTouchdowns, props.averages.averageTargets, props.averages.averageReceptions, props.averages.averageReceivingYards, props.averages.averageReceivingTouchdowns, props.averages.averageYardsAfterCatch],
        'TE': [props.averages.averageTargets, props.averages.averageReceptions, props.averages.averageReceivingYards, props.averages.averageReceivingTouchdowns, props.averages.averageYardsAfterCatch],
        'QB': [props.averages.averagePassingAttempts, props.averages.averagePassingCompletions, props.averages.averagePassingYards, props.averages.averagePassingTouchdowns, props.averages.averageRushingYards, props.averages.averageRushingTouchdowns],
    };

    return(
        <Paper elevation={3} sx={{ padding: 2, margin: 2, width: '90%', height: '25%', borderRadius: 3, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            {
                !selectedPlayer ? <Typography variant="h6">Loading...</Typography> : (
                <RadarChart
                    height={300}
                    divisions={6}
                    width={1000}
                    series={[{color: '#23d50b', label: selectedPlayer.athlete.displayName, fillArea: true, data: getPositionStats(selectedPlayer.athlete.position.abbreviation, selectedPlayer)}, {color: '#e22222ff', label: 'Average', fillArea: true, data: averageStatsLabels[selectedPlayer.athlete.position.abbreviation as keyof typeof averageStatsLabels]}]}
                    radar={{
                        metrics: positionStatsLabels[selectedPlayer.athlete.position.abbreviation as keyof typeof positionStatsLabels]
                    }}
                />
            )}
        </Paper>
    );
}
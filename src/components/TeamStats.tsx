import { Paper, Stack, Typography } from "@mui/material";
import { statPaths } from "../utils";
import { useEffect, useState } from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts";

function createOverviewFields(player: any) {
    const overviewFields: Record<string, number>[] = [{'Passing Attempts Grade': player.situationGrades['passingAttemptsGrade']}];
    if (player.athlete.position.abbreviation === 'QB') {
        const paIndexes = statPaths['QB']['passingAttempts']
        overviewFields.push({'Passing Attempts': player.categories[paIndexes[0]].totals[paIndexes[1]] / player.situationGrades['passingAttempts'] * 100});
    } else if (player.athlete.position.abbreviation === 'RB') {
        const taIndexes = statPaths['RB']['targets']
        overviewFields.push({'Targets': player.categories[taIndexes[0]].totals[taIndexes[1]] / player.situationGrades['passingAttempts'] * 100});
        overviewFields.push({'Rushing Attempts Grade': player.situationGrades['rushingAttemptsGrade']});
        const raIndexes = statPaths['RB']['rushingAttempts']
        overviewFields.push({'Rushing Attempts': player.categories[raIndexes[0]].totals[raIndexes[1]] / player.situationGrades['rushingAttempts'] * 100});
    } else if (player.athlete.position.abbreviation === 'WR' || player.athlete.position.abbreviation === 'TE') {
        const taIndexes = statPaths['WR']['targets']
        overviewFields.push({'Targets': player.categories[taIndexes[0]].totals[taIndexes[1]] / player.situationGrades['passingAttempts'] * 100});
    }
    return overviewFields;
}

function numberSuffix(num: number): string {
    if (num >= 10 && num <= 20) {
        return 'th';
    }
    const lastDigit = num % 10;
    switch (lastDigit) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

function setFillValues(value: number, label: string): string {
    const fillMap: Record<string, string> = {
        'Passing Attempts': `hsl(${value}, 100%, 40%)`,
        'Targets': `hsl(${value > 25 ? 120 : value * 3.5}, 100%, 40%)`,
        'Rushing Attempts': `hsl(${value * 1.35}, 100%, 40%)`,
    }
    return fillMap[label as keyof typeof fillMap] || `hsl(${value}, 100%, 40%)`;
}

export default function TeamStats(props: any) {
    const [overviewFields, setOverviewFields] = useState<any[]>([]);

    useEffect(() => {
        if (!props?.selectedPlayer) return;
        setOverviewFields(createOverviewFields(props.selectedPlayer));
    }, [props.selectedPlayer])
    return (
        <Paper elevation={3} sx={{ padding: 2, margin: 2, width: '90%', borderRadius: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Stack direction="column" spacing={4} alignItems="center" justifyContent="center" sx={{ width: '100%', mb: 2 }}>
                <h2>Team Situation Overview</h2>
                <Stack direction="row" spacing={4} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
                    {
                        !props.selectedPlayer && overviewFields.length > 0 ? <Typography variant="h6">Loading...</Typography> : (
                            overviewFields.map((item: any) => {
                                const label = Object.keys(item)[0];
                                let rankKey;
                                let fontSize = 16;
                                if (label.includes('Grade')) {
                                    const replaceStr = label.replace(' Grade', 'Rank').replace(' ', '');
                                    rankKey = replaceStr.charAt(0).toLowerCase() + replaceStr.slice(1);
                                    fontSize = 14;
                                }
                                const value = Object.values(item)[0] as number;
                                const rank = label.includes('Grade') && rankKey ? props.selectedPlayer.situationGrades[rankKey] : null;
                                return (
                                    <Stack key={label} direction="column" spacing={1} alignItems="center" justifyContent="center">
                                    <Gauge value={value} startAngle={0} endAngle={360} height={100} width={100} text={`${value.toFixed(0)}% ${label.includes('Grade') ? `\n(${rank}${numberSuffix(rank)})` : ''}`} sx={(theme) => ({
                                        [`& .${gaugeClasses.valueArc}`]: {
                                            fill: setFillValues(value, label),
                                        },
                                        [`& .${gaugeClasses.valueText}`]: {
                                            fontSize: fontSize,
                                        },
                                    })}/>
                                    <Typography variant="body1">{label}</Typography>
                                    </Stack>
                                );
                            })
                        )
                    }
                </Stack>
            </Stack>
        </Paper>
    );
}
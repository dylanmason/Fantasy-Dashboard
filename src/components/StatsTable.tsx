import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography } from "@mui/material";
import { statDisplayInfo } from "../utils/parseGameLog";

function createData(playerStats: any, teamSchedule: any) {
    if (!playerStats || !teamSchedule) {
        return [];
    }

    const rows = [];
    const statKeys = Object.keys(playerStats);
    
    let stat = 0;
    for (let i = 0; i < 18; i++) {
        const rowData: any = { week: i + 1 };
        statKeys.forEach((key) => {
            rowData[key as keyof typeof rowData] = stat < playerStats[statKeys[0]].length ? playerStats[key][stat] || 0 : teamSchedule.byeWeek === i + 1 ? 'BYE' : '_';
        });

        stat += 1;

        rows.push(rowData);
    }

    return rows;
}

export default function StatsTable(props: any) {
    const { selectedPlayer } = props;

    if (!selectedPlayer) {
        return <Typography>Loading...</Typography>;
    }

    const playerStats = selectedPlayer?.gamelog?.seasonTypes ? selectedPlayer.statsByGame : undefined;
    const rows = createData(playerStats, selectedPlayer?.schedule);
    const tableHeaders = [{ id: 'week', 'label': 'Week' }];

    if (playerStats) {
        Object.keys(playerStats).forEach((statKey) => {
            if (statKey !== 'pointsPerGame') {
                const info = statDisplayInfo[statKey];
                tableHeaders.push({ id: statKey, label: info.label });
            }
        });
    }

    // Sticky header messes with dark mode bg color, this is to fix it
    const headerBg = (theme: Theme) =>
        theme.palette.mode === 'dark' ? '#262626' : '#ffffff';

    return (
        <Box sx={{ width: '100%' }}>
            <TableContainer sx={{ maxHeight: '15vh', overflow: 'auto' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {
                                tableHeaders.map((header) => (
                                    <TableCell key={header.id} sx={{ fontSize: '0.9rem', backgroundColor: headerBg }}>{header.label}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { rows.map((row, index) => (
                            <TableRow key={index}>
                                { tableHeaders.map((header) => (
                                    <TableCell key={header.id} sx={{ fontWeight: 'light' }}>{row[header.id as keyof typeof row] || 0}</TableCell>
                                )) }
                            </TableRow>
                        )) }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
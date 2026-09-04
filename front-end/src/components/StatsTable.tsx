import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography } from "@mui/material";
import { statDisplayInfo } from "../utils/parseGameLog";

function getGame(game: any, playerTeam: string) {
    const matchup = game.shortName;
    const teams = matchup.split(' @ ').flatMap((part: string) => part.split(' VS '));
    return `${teams[0] === playerTeam ? `@ ${teams[1]}` : `vs ${teams[0]}`}`;
}

function createData(selectedPlayer: any, teamSchedule: any) {
    const playerStats = selectedPlayer?.statsByGame;
    if (!playerStats || !teamSchedule) {
        return [];
    }

    const rows = [];
    const statKeys = [...Object.keys(playerStats), 'opponent'];
    
    let stat = 0;
    let week = 0;
    for (let i = 0; i < 18; i++) {
        const rowData: any = { week: i + 1 };
        statKeys.forEach((key) => {
            if (key === "opponent") {
                rowData[key] =
                    i + 1 !== teamSchedule.byeWeek && teamSchedule.events[week]
                        ? getGame(teamSchedule.events[week], selectedPlayer.athlete.teamShortName)
                        : teamSchedule.byeWeek === i + 1
                            ? "BYE"
                            : "_";
            } else {
                rowData[key] =
                    stat < playerStats[statKeys[0]].length
                        ? playerStats[key][stat] || 0
                        : teamSchedule.byeWeek === i + 1
                            ? "BYE"
                            : "_";
            }
        });

        if (i + 1 !== teamSchedule.byeWeek) {
            week++;
        }

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

    const rows = createData(selectedPlayer, selectedPlayer?.schedule);
    const tableHeaders = [{ id: 'week', 'label': 'Week' }, { id: 'opponent', label: 'Opponent' }];
    const playerStats = selectedPlayer?.gamelog?.seasonTypes ? selectedPlayer.statsByGame : undefined;

    if (playerStats) {
        Object.keys(playerStats).forEach((statKey) => {
            if (statKey !== 'pointsPerGame') {
                const info = statDisplayInfo[statKey];
                tableHeaders.push({ id: statKey, label: info.label });
            } if (statKey === 'opponent') {
                tableHeaders.push({ id: statKey, label: 'Opponent' });
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
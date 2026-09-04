import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";
import { TrendingDown, TrendingUp } from "@mui/icons-material";

export function fieldToDisplay(field: string, player: any) {
  if (field === 'rank') {
    return `Score: ${player.score || 0}`;
  } else {
    return `${field.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ').map((word, index) => index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.charAt(0).toLowerCase() + word.slice(1)).join(' ')}: ${player?.combinedStats[field] || 0}`;
  }
}
export default function PlayerList(props: any) {
  return (
      <Paper elevation={3} sx={{ padding: 2, margin: 2, width: '80%', maxHeight: '85vh', overflow: 'auto', borderRadius: 3 }}>
      <List>
        {props?.players.map((player: any, index: number) =>
          {
            let color = 'black';
            const stockRise = player.combinedStats.stockRise || 0;
            if (stockRise > 0) {
                color = '#4caf50';
            } else if (stockRise < 0) {
                color = 'red';
            } else {
                color = 'black';
            }
          return(
          <>
          <ListItemButton key={player.athlete.id} onClick={() => props.setSelectedPlayer(player)} onMouseEnter={() => props.setSelectedPlayer(player)} sx={{ bgcolor: props.fantasyData?.[player.athlete.id]?.teamName ? 'rgba(34, 0, 255, 0.26)' : 'transparent', mt: 1, mb: 1 }}>
            <ListItemAvatar>
                <Avatar alt='Player Image' src={player.athlete.headshot?.href} sx={{ borderColor: 'gray', borderWidth: 2, borderStyle: 'solid' }}/>
            </ListItemAvatar>
            <ListItemText 
                primary={
                  <>
                  <Typography>{player.athlete.displayName} <Typography component="span" sx={{ fontSize: 14, color: 'gray' }}>{player.athlete.teamName}</Typography></Typography>
                  </>
                } 
                secondary={
                <Typography component="span" sx={{ fontSize: 14, color: 'gray' }}>Rank: {player.rank || 0} <Typography component="span" sx={{ color: color, fontSize: 15, fontWeight: 'bold' }}></Typography>
                {
                  stockRise > 0 ? (
                    <TrendingUp sx={{ color: '#4caf50', fontSize: 14, verticalAlign: 'middle' }} />
                  ) : stockRise < 0 ? (
                    <TrendingDown sx={{ color: 'red', fontSize: 14, verticalAlign: 'middle' }} />
                  ) : null
                }
                {
                  stockRise > 0 ? (
                    <Typography component="span" sx={{ color: '#4caf50', fontSize: 14, verticalAlign: 'middle' }}>
                      &nbsp;+{Math.abs(stockRise)}
                    </Typography>
                  ) : stockRise < 0 ? (
                    <Typography component="span" sx={{ color: 'red', fontSize: 14, verticalAlign: 'middle' }}>
                      &nbsp;-{Math.abs(stockRise)}
                    </Typography>
                  ) : null
                }
                  <br />{fieldToDisplay(props.sortBy, player)}
                  <br />{props.fantasyData?.[player.athlete.id]?.teamName ? `Fantasy team: ${props.fantasyData?.[player.athlete.id]?.teamName}` : ''}
                </Typography>
                }
                secondaryTypographyProps={{ whiteSpace: 'pre-line' }}
            />
            { (props.fantasyData?.[player.athlete.id]?.teamLogo) ? (
              <Avatar alt={`${props.fantasyData?.[player.athlete.id]?.teamName}`} src={props.fantasyData?.[player.athlete.id]?.teamLogo} sx={{ borderColor: 'gray', borderWidth: 2, borderStyle: 'solid', ml: 2 }}/>
            ) : <></> }
          </ListItemButton>
          {
            index < props.players.length - 1 ? (
            <Divider />
          ) : (null)}
          </>
          );
          })}
      </List>

      </Paper>
  );
}

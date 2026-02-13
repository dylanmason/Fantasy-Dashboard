import { Avatar, Divider, List, ListItemAvatar, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { getRankingDifference } from "../utils";
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
            // const { currentRanking, previousRanking } = getRankingDifference(player.rank || 0, player.weeklyRankings || []);
            // if (currentRanking < previousRanking) {
            //     color = '#4caf50';
            // } else if (currentRanking > previousRanking) {
            //     color = 'red';
            // } else {
            //     color = 'black';
            // }
          return(
          <>
          <ListItemButton key={player.athlete.id} onClick={() => props.setSelectedPlayer(player)} onMouseEnter={() => props.setSelectedPlayer(player)}>
            <ListItemAvatar>
                <Avatar alt='Player Image' src={player.athlete.headshot?.href} sx={{ borderColor: 'gray', borderWidth: 2, borderStyle: 'solid' }}/>
            </ListItemAvatar>
            <ListItemText 
                primary={player.athlete.displayName} 
                secondary={
                <Typography component="span" sx={{ fontSize: 14, color: 'gray' }}>Rank: {player.rank || 0} <Typography component="span" sx={{ color: color, fontSize: 15, fontWeight: 'bold' }}></Typography>
                {
                  // currentRanking < previousRanking ? (
                  //   <TrendingUp sx={{ color: '#4caf50', fontSize: 14, verticalAlign: 'middle' }} />
                  // ) : currentRanking > previousRanking ? (
                  //   <TrendingDown sx={{ color: 'red', fontSize: 14, verticalAlign: 'middle' }} />
                  // ) : null
                }
                {
                  // currentRanking < previousRanking ? (
                  //   <Typography component="span" sx={{ color: '#4caf50', fontSize: 14, verticalAlign: 'middle' }}>
                  //     &nbsp;+{Math.abs(previousRanking - currentRanking)}
                  //   </Typography>
                  // ) : currentRanking > previousRanking ? (
                  //   <Typography component="span" sx={{ color: 'red', fontSize: 14, verticalAlign: 'middle' }}>
                  //     &nbsp;-{Math.abs(currentRanking - previousRanking)}
                  //   </Typography>
                  // ) : null
                }
                  <br />{fieldToDisplay(props.sortBy, player)}
                </Typography>
                }
                secondaryTypographyProps={{ whiteSpace: 'pre-line' }}
            />
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

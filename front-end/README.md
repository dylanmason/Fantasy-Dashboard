# Fantasy Dashboard

## Preface

This application uses stat weights in `utils/index.ts` that are based on **<u>my</u>** opinion of statistical importance, please feel free to update these values to your liking.

## Overview

A way to analyze players for fantasy football on more than just PPG. This dashboard includes (statistically opinionated) player rankings, grades, charts, and team situation overviews pertaining to a player.

## Usage

### Required dependencies to run:

1) Git
2) Node

### Spinning up the application

In order to run this locally, you'll first need to pull this repo down to your local machine by running:

```bash
git clone https://github.com/dylanmason/Fantasy-Dashboard.git
```

After which you'll need to cd into the cloned repo and from the base directory run:

```bash
npm install
```

Once the `node_modules` are installed, you'll need to reach out to me for my params in the `.env` which are related to the API fetches (or you can update the source code to pull from your choice of API and parse the fields). Finally, you can run:

```bash
npm run start
```

and your machine will spin up the React application and host it on `localhost:3000`.

## Application areas

### Player Profile

In the top section on the left side, the `Player Profile` will show you a player's gamelogs, overall grade for their position, and rankings.

### Player Graphs

In the second section on the left side, this features the following:

#### Player Stat Graph

The `Player Stat Graph` will show you a visualized representation of their stats each week in different categories and areas. 

#### Player Ranking Graph

The `Player Ranking Graph` shows you throughout the course of a season a player's weekly ranking/stock.

### Player Stat Chart

In the third section on the left side, the `Player Stat Chart` shows a visualization of where a players accumulated stats compare with their position's averages.

### Team Situation Overview

In the bottom section on the left side, the `Team Situation Overview` shows where a player's team ranks in the league for stats that their position depends on, as well as a grade. It also shows their share of those stats.

### Player List

On the right side of the application, there is a list of players with a filter above. These show the ranks of players for a selected position based on the selected sort key (top being better ranked).

## Application functionality

### Selecting a player from the player list

You do not need to click on a player in the list to view their stats, simply hover over the player you would like to view, and the application will update to show their stats.

### Light and dark mode

You can toggle between light and dark mode by clicking the player profile picture in the top left of the app (yes this is a weird place to put it, however adding a switch to the UI would have looked weirder).

## Player Scoring

For determining rank, each player of a specific position has their accumulated stats parsed and gets a summed up score, the following fields are taken into account:

| Position | Statistical Area |
| ---------- | ---------- |
| WR/TE | targets, receptions, receiving yards, receiving touchdowns, yards after catch |
| RB | rushing attempts, rushing yards, fumbles, rushing touchdowns, targets, receptions, receiving yards, receiving touchdowns, yards after catch |
| QB | passing attempts, completed passes, passing yards, passing touchdowns, interceptions, rushing attempts, rushing yards, rushing touchdowns |

## ESPN Fantasy Plugin

Optionally, you can enable roster data from your fantasy league to show which team players are on. To do so, you will have to do the following:

1. Create a `.env` file in the `/fantasy-data` directory that has the following env vars:
    - `SWID`
    - `ESPN_S2`
    - `FANTASY_URL`
    - `FANTASY_LEAGUE_ID`
    - `FANTASY_PATH`

    NOTE: The `SWID` and `ESPN_S2` values are cookies from your browser session of logging into fantasy and are needed in order to pull the data from your league, to obtain them you'll have to login to your fantasy league, open developer tools (`F12` or just right click and select `Inspect`), go to the `Network` tab, and find a `json` type response which has the cookies in the `Cookies` tab. **These two cookies expire after a few hours, so you will need to refresh these entries**.

2. Run the script inside `/fantasy-data` to generate output files of your league data throughout the years:

    ```bash
    # From root directory of repository, go into the fantasy-data directory
    cd ./fantasy-data

    # Make sure all necessary dependencies are installed
    npm install

    # Run the script
    npm run dev
    ```

    NOTE: There will be an error at the bottom of the log outputs referencing a 404 even on successful runs, this is expected as it queries your league data until it runs into a year in which the league didn't exist.

After running these steps, output of your league data is stored in `front-end/public/leagueData`. The only thing left to do in enable it by selecting the switch in the position selector and you will see players highlighted in the player list which are already on a team in your league. You don't need to run the above commands every time you want to see your league data as the data comes from the outputted files, **but the data in the files can become stale after awhile, it is recommended that you run these commands once a week to stay up to date during the season**.

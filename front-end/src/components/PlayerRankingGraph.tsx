import { LineChart, LineSeriesType } from "@mui/x-charts";

export default function PlayerRankingGraph(props: any) {
    const { weeklyRankings } = props;
    const rankings = weeklyRankings?.map((ranking: any) => ranking.weekRank);

    const xAxisFormat = [];
    for (let i = 1; i <= 18; i++) {
        xAxisFormat.push(`Week ${i}`);
    }

    const series = [{
        id: 'playerRanking',
        label: 'Weekly Rankings',
        showMark: false,
        data: rankings,
        area: true,
        baseline: 'max' as LineSeriesType['baseline'],
    }]

    const customize = {
        hideLegend: true,
        experimentalFeatures: { preferStrictDomainInLineCharts: true },
    };

    return (
        <>
            <LineChart
                series={series}
                sx={{ '& .MuiAreaElement-root': { opacity: 0.25 }, height: 250 }}
                grid={{ vertical: true, horizontal: true }}
                yAxis={[{ 
                    reverse: true,
                    tickInterval: [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
                }]}
                xAxis={[
                    { 
                        id: 'weekAxis',
                        scaleType: 'point',
                        data: xAxisFormat,
                        tickLabelStyle: {
                            textAnchor: 'end',
                        }
                    }
                ]}
                {...customize}
            />
        </>
    );
}
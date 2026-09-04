import { LineChart } from "@mui/x-charts";

export default function LineGraph(props: any) {
    const { currentCategoryFields, filteredXAxisData } = props;

    return (
        <>
            <LineChart
                sx={{ height: 250 }}
                series={currentCategoryFields}
                grid={{ vertical: true, horizontal: true }}
                xAxis={[
                    { 
                        id: 'gameAxis',
                        scaleType: 'point',
                        data: filteredXAxisData,
                        tickLabelStyle: {
                            textAnchor: 'end',
                        }
                    }
                ]}
            />
        </>
    );
}
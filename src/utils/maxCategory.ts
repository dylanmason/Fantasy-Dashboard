import { cleanAndParseInt } from ".";

function getStatValueFromElement(element: any, categoryIndex: number, totalIndex: number): number {
    const value = element?.categories?.[categoryIndex]?.totals?.[totalIndex];
    return cleanAndParseInt(value) as number;
}

function getAllStatValues(data: any[], categoryIndex: number, totalIndex: number): number[] {
    return data.map(element => getStatValueFromElement(element, categoryIndex, totalIndex));
}

function calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    return sum / numbers.length;
}

function calculateMax(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return Math.max(...numbers);
}

function getMaxReceivingYards(data: any[]): number {
    const values = getAllStatValues(data, 3, 2);
    return calculateMax(values);
}

function getMaxReceptions(data: any[]): number {
    const values = getAllStatValues(data, 3, 0);
    return calculateMax(values);
}

function getMaxTargets(data: any[]): number {
    const values = getAllStatValues(data, 3, 1);
    return calculateMax(values);
}

function getMaxReceivingTouchdowns(data: any[]): number {
    const values = getAllStatValues(data, 3, 4);
    return calculateMax(values);
}

function getMaxYardsAfterCatch(data: any[]): number {
    const values = getAllStatValues(data, 3, 10);
    return calculateMax(values);
}

function getMaxRushingAttempts(data: any[]): number {
    const values = getAllStatValues(data, 2, 0);
    return calculateMax(values);
}

function getMaxRushingYards(data: any[]): number {
    const values = getAllStatValues(data, 2, 1);
    return calculateMax(values);
}

function getMaxRushingTouchdowns(data: any[]): number {
    const values = getAllStatValues(data, 2, 5);
    return calculateMax(values);
}

function getMaxPassingAttempts(data: any[]): number {
    const values = getAllStatValues(data, 1, 1);
    return calculateMax(values);
}

function getMaxPassingCompletions(data: any[]): number {
    const values = getAllStatValues(data, 1, 0);
    return calculateMax(values);
}


function getMaxPassingYards(data: any[]): number {
    const values = getAllStatValues(data, 1, 3);
    return calculateMax(values);
}

function getMaxPassingTouchdowns(data: any[]): number {
    const values = getAllStatValues(data, 1, 7);
    return calculateMax(values);
}

function getAverageReceivingYards(data: any[]): number {
    const values = getAllStatValues(data, 3, 2);
    return calculateAverage(values);
}

function getAverageReceptions(data: any[]): number {
    const values = getAllStatValues(data, 3, 0);
    return calculateAverage(values);
}

function getAverageTargets(data: any[]): number {
    const values = getAllStatValues(data, 3, 1);
    return calculateAverage(values);
}

function getAverageReceivingTouchdowns(data: any[]): number {
    const values = getAllStatValues(data, 3, 4);
    return calculateAverage(values);
}

function getAverageYardsAfterCatch(data: any[]): number {
    const values = getAllStatValues(data, 3, 10);
    return calculateAverage(values);
}

function getAverageRushingAttempts(data: any[]): number {
    const values = getAllStatValues(data, 2, 0);
    return calculateAverage(values);
}

function getAverageRushingYards(data: any[]): number {
    const values = getAllStatValues(data, 2, 1);
    return calculateAverage(values);
}

function getAverageRushingTouchdowns(data: any[]): number {
    const values = getAllStatValues(data, 2, 5);
    return calculateAverage(values);
}

function getAveragePassingAttempts(data: any[]): number {
    const values = getAllStatValues(data, 1, 1);
    return calculateAverage(values);
}

function getAveragePassingCompletions(data: any[]): number {
    const values = getAllStatValues(data, 1, 0);
    return calculateAverage(values);
}

function getAveragePassingYards(data: any[]): number {
    const values = getAllStatValues(data, 1, 3);
    return calculateAverage(values);
}

function getAveragePassingTouchdowns(data: any[]): number {
    const values = getAllStatValues(data, 1, 7);
    return calculateAverage(values);
}

export {
    getMaxReceivingYards, getMaxReceptions, getMaxTargets, getMaxReceivingTouchdowns, getMaxYardsAfterCatch,
    getMaxRushingAttempts, getMaxRushingYards, getMaxRushingTouchdowns, getMaxPassingAttempts, getMaxPassingCompletions, getMaxPassingYards, getMaxPassingTouchdowns,
    getAverageReceivingYards, getAverageReceptions, getAverageTargets, getAverageReceivingTouchdowns, getAverageYardsAfterCatch,
    getAverageRushingYards, getAverageRushingTouchdowns, getAverageRushingAttempts, getAveragePassingAttempts, getAveragePassingCompletions, getAveragePassingYards, getAveragePassingTouchdowns
};
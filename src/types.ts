export type config = {
    Rpc: string,
    DelayTimeRange: DelayTimeRange,
}

export type DelayTimeRange = {
    timeSecMin: number;
    timeSecMax: number;
}
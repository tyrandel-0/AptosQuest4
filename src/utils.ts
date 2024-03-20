import * as fs from 'fs';
import { DelayTimeRange, config } from "./types.js";
import { AptosAccount, Network, Provider } from 'aptos';

export function readFromFile(filePath: string): string[] {
    const items: string[] = [];

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const lines = data.split('\n');

        lines.forEach((line) => {
            const item = line.trim();
            if (item) {
                items.push(item);
            }
        });

        return items;
    } catch (error) {
        throw Error("Canot read file")
    }
}

export function readConfig(configPath: string): config {
    try {
        const data = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw Error("Canot read config")
    }
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getRandomInRange(min: number, max: number): string {
    let random = Math.random() * (max - min) + min;
    return random.toFixed(8);
}

export function getRandomDelayTime(range: DelayTimeRange): number {
    const { timeSecMin, timeSecMax } = range;
    const randomDelay = Math.floor(Math.random() * (timeSecMax - timeSecMin + 1)) + timeSecMin;
    return randomDelay;
}

export function convertToFloat(balance: string, decimal: number) {
    if (balance == "Error") return balance
    return parseFloat((parseInt(balance) / 10 ** decimal).toFixed(6))
}

export async function getV2TokenID(aptosAccount: AptosAccount): Promise<string> {
    const provider = new Provider("mainnet" as Network)
	const tokenData = await provider.getTokenOwnedFromCollectionAddress(aptosAccount.address(), "0x30e2f18b1f9c447e7dadd7a05966e721ab6512b81ee977cb053edb86cc1b1d65", {tokenStandard: "v2"})
	if (tokenData.current_token_ownerships_v2.length != 0) return tokenData.current_token_ownerships_v2[0].token_data_id
	else throw Error("Get token ID Error")
}
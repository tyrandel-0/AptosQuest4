import * as fs from 'fs';
import { Provider } from 'aptos';
export function readFromFile(filePath) {
    const items = [];
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
    }
    catch (error) {
        throw Error("Canot read file");
    }
}
export function readConfig(configPath) {
    try {
        const data = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        throw Error("Canot read config");
    }
}
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function getRandomInRange(min, max) {
    let random = Math.random() * (max - min) + min;
    return random.toFixed(8);
}
export function getRandomDelayTime(range) {
    const { timeSecMin, timeSecMax } = range;
    const randomDelay = Math.floor(Math.random() * (timeSecMax - timeSecMin + 1)) + timeSecMin;
    return randomDelay;
}
export function convertToFloat(balance, decimal) {
    if (balance == "Error")
        return balance;
    return parseFloat((parseInt(balance) / 10 ** decimal).toFixed(6));
}
export async function getV2TokenID(aptosAccount) {
    const provider = new Provider("mainnet");
    const tokenData = await provider.getTokenOwnedFromCollectionAddress(aptosAccount.address(), "0x30e2f18b1f9c447e7dadd7a05966e721ab6512b81ee977cb053edb86cc1b1d65", { tokenStandard: "v2" });
    if (tokenData.current_token_ownerships_v2.length != 0)
        return tokenData.current_token_ownerships_v2[0].token_data_id;
    else
        throw Error("Get token ID Error");
}

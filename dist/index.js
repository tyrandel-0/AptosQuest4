import { pancakeSwap } from './pancakeSwap.js';
import inquirer from 'inquirer';
import { readConfig, readFromFile } from './utils.js';
import { AptosClient } from 'aptos';
import { vibrantX } from './vibrantX.js';
import { cellanaSwap } from './cellanaSwap.js';
import { cellanaLock } from './cellanaLock.js';
import { cellanaVote } from './cellanaVote.js';
const config = readConfig("./config.json");
const privateKeys = readFromFile("./private_keys.txt");
async function main() {
    let questions = [
        {
            type: 'list',
            name: 'menu',
            message: 'Выберите действие:',
            choices: [
                'Swap 0.001 APT to USDT (Pancakeswap)',
                'VibrantX supply',
                'Swap 0.001 APT to CELL (Cellana)',
                'Lock CELL on Cellana',
                'Vote Cellana',
                new inquirer.Separator(),
                'Выход'
            ]
        }
    ];
    const aptosClient = new AptosClient(config.Rpc);
    const answers = await inquirer.prompt(questions);
    switch (answers['menu']) {
        case 'Swap 0.001 APT to USDT (Pancakeswap)':
            await pancakeSwap(privateKeys, aptosClient, config.DelayTimeRange);
            break;
        case 'VibrantX supply':
            await vibrantX(privateKeys, aptosClient, config.DelayTimeRange);
            break;
        case 'Swap 0.001 APT to CELL (Cellana)':
            await cellanaSwap(privateKeys, aptosClient, config.DelayTimeRange);
            break;
        case 'Lock CELL on Cellana':
            await cellanaLock(privateKeys, aptosClient, config.DelayTimeRange);
            break;
        case 'Vote Cellana':
            await cellanaVote(privateKeys, aptosClient, config.DelayTimeRange);
            break;
    }
}
main();

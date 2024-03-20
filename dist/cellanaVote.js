import { AptosAccount, HexString } from 'aptos';
import { getRandomDelayTime, sleep, getV2TokenID } from './utils.js';
export async function cellanaVote(privateKeys, aptosClient, delay) {
    for (let i = 0; i < privateKeys.length; i++) {
        const aptosAccount = new AptosAccount(new HexString(privateKeys[i]).toUint8Array());
        data.push({ wallet: aptosAccount.address().hex(), status: "in progress" });
        vote(i, aptosAccount, aptosClient, getRandomDelayTime(delay));
    }
    setInterval(updateData, 100);
}
async function vote(walletIndex, aptosAccount, aptosClient, delay) {
    updateStatus(walletIndex, `waiting for ${delay} seconds before start`);
    await sleep(delay * 1000);
    try {
        const txPayload = {
            function: '0x4bf51972879e3b95c4781a5cdcb9e1ee24ef483e7d22f2d903626f126df62bd1::vote_manager::vote',
            type_arguments: [],
            arguments: [
                await getV2TokenID(aptosAccount),
                ['0x85d3337c4ca94612f278c5164d2b21d0d83354648bf9555272b5f9d8f1f33b2a'],
                ['100'],
            ]
        };
        let txHash;
        const max_gas_amount = await aptosClient.estimateMaxGasAmount(aptosAccount.address());
        const options = { max_gas_amount: max_gas_amount.toString() };
        const rawTX = await aptosClient.generateTransaction(aptosAccount.address(), txPayload, options);
        txHash = await aptosClient.signAndSubmitTransaction(aptosAccount, rawTX);
        const txResult = (await aptosClient.waitForTransactionWithResult(txHash)).success;
        if (txResult)
            updateStatus(walletIndex, 'Tx successful');
        else
            updateStatus(walletIndex, 'TX failed');
    }
    catch (error) {
        updateStatus(walletIndex, 'Sending tx error');
        errors.set(walletIndex, String(error));
    }
    endedWallets++;
}
let data = [];
let endedWallets = 0;
const errors = new Map();
function displayTable() {
    console.clear();
    console.table(data);
}
function updateData() {
    displayTable();
    if (data.length == endedWallets) {
        for (const [key, value] of errors) {
            console.log(key + " : " + value);
        }
        process.exit(0);
    }
}
function updateStatus(index, status) {
    data[index] = {
        wallet: data[index].wallet,
        status: status
    };
}

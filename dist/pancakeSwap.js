import { AptosAccount, HexString } from 'aptos';
import { getRandomDelayTime, sleep } from './utils.js';
export async function pancakeSwap(privateKeys, aptosClient, delay) {
    for (let i = 0; i < privateKeys.length; i++) {
        const aptosAccount = new AptosAccount(new HexString(privateKeys[i]).toUint8Array());
        data.push({ wallet: aptosAccount.address().hex(), status: "in progress" });
        swapToUSDT(i, aptosAccount, aptosClient, getRandomDelayTime(delay));
    }
    setInterval(updateData, 100);
}
async function swapToUSDT(walletIndex, aptosAccount, aptosClient, delay) {
    updateStatus(walletIndex, `waiting for ${delay} seconds before start`);
    await sleep(delay * 1000);
    const txPayload = {
        function: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::swap_exact_input',
        type_arguments: ['0x1::aptos_coin::AptosCoin', '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT'],
        arguments: ['100000', '10000']
    };
    let txHash;
    try {
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

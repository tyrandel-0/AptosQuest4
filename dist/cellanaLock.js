import { AptosAccount, HexString, Provider } from 'aptos';
import { getRandomDelayTime, sleep } from './utils.js';
export async function cellanaLock(privateKeys, aptosClient, delay) {
    for (let i = 0; i < privateKeys.length; i++) {
        const aptosAccount = new AptosAccount(new HexString(privateKeys[i]).toUint8Array());
        data.push({ wallet: aptosAccount.address().hex(), status: "in progress" });
        lockCELL(i, aptosAccount, aptosClient, getRandomDelayTime(delay));
    }
    setInterval(updateData, 100);
}
async function lockCELL(walletIndex, aptosAccount, aptosClient, delay) {
    updateStatus(walletIndex, `waiting for ${delay} seconds before start`);
    await sleep(delay * 1000);
    try {
        const txPayload = {
            function: '0x4bf51972879e3b95c4781a5cdcb9e1ee24ef483e7d22f2d903626f126df62bd1::voting_escrow::create_lock_entry',
            type_arguments: [],
            arguments: [
                await getCELLBalance(aptosAccount, aptosClient),
                '2'
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
async function getCELLBalance(aptosAccount, aptosClient) {
    try {
        const provider = new Provider("mainnet");
        const coins = await provider.getAccountCoinsData(aptosAccount.address());
        for (let coin of coins.current_fungible_asset_balances)
            if (coin.asset_type == '0x2ebb2ccac5e027a87fa0e2e5f656a3a4238d6a48d93ec9b610d570fc0aa0df12')
                return String(coin.amount);
    }
    catch (error) {
        throw Error('Error to get CELL balance');
    }
    throw Error('CELL token not foun on account');
}

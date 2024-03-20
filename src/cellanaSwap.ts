import { AptosAccount, AptosClient, HexString } from 'aptos';
import { getRandomDelayTime, sleep } from './utils.js';
import { DelayTimeRange } from './types.js';

export async function cellanaSwap(privateKeys: string[], aptosClient: AptosClient, delay: DelayTimeRange) {
	for (let i = 0; i < privateKeys.length; i++) {
		const aptosAccount = new AptosAccount(new HexString(privateKeys[i]).toUint8Array())
		data.push({ wallet: aptosAccount.address().hex(), status: "in progress" });
		swapToCELL(i, aptosAccount, aptosClient, getRandomDelayTime(delay));
	}

	setInterval(updateData, 100);
}

async function swapToCELL(walletIndex: number, aptosAccount: AptosAccount, aptosClient: AptosClient, delay: number) {
	updateStatus(walletIndex, `waiting for ${delay} seconds before start`);
    await sleep(delay * 1000);
	
	const txPayload = {
		function: '0x4bf51972879e3b95c4781a5cdcb9e1ee24ef483e7d22f2d903626f126df62bd1::router::swap_route_entry_from_coin', 
		type_arguments: ['0x1::aptos_coin::AptosCoin'], 
		arguments: [
            '100000',
            '0',
            ['0x2ebb2ccac5e027a87fa0e2e5f656a3a4238d6a48d93ec9b610d570fc0aa0df12'],
            ['false'],
            aptosAccount.address().hex(),
        ]
	}
	
	let txHash;
	
	try {
		const max_gas_amount = await aptosClient.estimateMaxGasAmount(aptosAccount.address())
		const options = { max_gas_amount: max_gas_amount.toString() }

		const rawTX = await aptosClient.generateTransaction(aptosAccount.address(), txPayload, options)
		txHash = await aptosClient.signAndSubmitTransaction(aptosAccount, rawTX)
		
		const txResult = (await aptosClient.waitForTransactionWithResult(txHash as string) as any).success
		
		if (txResult) updateStatus(walletIndex, 'Tx successful')
		else updateStatus(walletIndex, 'TX failed')

	} catch (error) {
		updateStatus(walletIndex, 'Sending tx error')
		errors.set(walletIndex, String(error))
	}

	endedWallets++;
}

let data: any[] = [];
let endedWallets = 0;
const errors = new Map<number, string>();

function displayTable() {
	console.clear();
	console.table(data);
}

function updateData() {
	displayTable();
	if (data.length == endedWallets) {
		for (const [key, value] of errors) {
			console.log(key + " : " + value)
		}
		process.exit(0);
	}
}

function updateStatus(index: number, status: string) {
	data[index] = {
		wallet: data[index].wallet,
		status: status
	}
}

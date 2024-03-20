import { AptosAccount, AptosClient, HexString } from 'aptos';
import { getRandomDelayTime, sleep } from './utils.js';
import { DelayTimeRange } from './types.js';

export async function vibrantX(privateKeys: string[], aptosClient: AptosClient, delay: DelayTimeRange) {
	for (let i = 0; i < privateKeys.length; i++) {
		const aptosAccount = new AptosAccount(new HexString(privateKeys[i]).toUint8Array())
		data.push({ wallet: aptosAccount.address().hex(), status: "in progress" });
		supply(i, aptosAccount, aptosClient, getRandomDelayTime(delay));
	}

	setInterval(updateData, 100);
}

async function supply(walletIndex: number, aptosAccount: AptosAccount, aptosClient: AptosClient, delay: number) {
	updateStatus(walletIndex, `waiting for ${delay} seconds before start`);
    await sleep(delay * 1000);
	
	const txPayload = {
		function: '0x17f1e926a81639e9557f4e4934df93452945ec30bc962e11351db59eb0d78c33::aries::lend', 
		type_arguments: ['0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT'], 
		arguments: ['10000']
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

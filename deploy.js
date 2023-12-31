import Irys from '@irys/sdk';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';

function getTotalSize(folderPath) {
	let totalSize = 0;
	function traverseDirectory(directoryPath) {
		const files = fs.readdirSync(directoryPath);

		files.forEach((file) => {
			const filePath = path.join(directoryPath, file);
			const stats = fs.statSync(filePath);

			if (stats.isFile()) {
				totalSize += stats.size;
			} else if (stats.isDirectory()) {
				traverseDirectory(filePath);
			}
		});
	}
	traverseDirectory(folderPath);
	return totalSize;
}

const deploy = async () => {
	const url = 'https://devnet.irys.xyz';
	const providerUrl = 'https://mumbai.rpc.thirdweb.com/';
	const token = 'matic';

	const irys = new Irys({
		url,
		token,
		key: process.env.PK,
		config: { providerUrl },
	});
	await irys.ready();
	const folderToUpload = './dist';
	const balance = irys.utils.fromAtomic(await irys.getLoadedBalance());
	console.log('Current Balance: ', balance);
	const cost = irys.utils.fromAtomic(
		await irys.getPrice(getTotalSize(folderToUpload))
	);
	console.log('Cost to Upload: ', cost);
	try {
		const receipt = await irys.uploadFolder(folderToUpload, {
			indexFile: 'index.html',
		});
		console.log(`Files uploaded. Manifest ID: ${receipt.id}`);
		const balanceAfterUpload = irys.utils.fromAtomic(
			await irys.getLoadedBalance()
		);
		console.log('Balance after upload: ', balanceAfterUpload);
	} catch (e) {
		console.log('Error uploading file ', e);
	}
};

deploy().catch((err) => {
	console.error(err);
	process.exit(1);
});

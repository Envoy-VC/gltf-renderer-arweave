interface Transaction {
	tags: {
		name: string;
		value: string;
	}[];
}

export const verifyTx = async (tx: string) => {
	try {
		const res = await fetch(`https://gateway.irys.xyz/tx/${tx}`);

		const json = (await res.json()) as Transaction;

		const requiredTags = [
			{
				name: 'Content-Type',
				value: 'model/gltf-binary',
			},
		];

		const hasTags = requiredTags.every((tag) =>
			json.tags.find((t) => t.name === tag.name && t.value === tag.value)
		);

		if (!hasTags) throw new Error('Content-Type not found');
		return json.tags;
	} catch (error: any) {
		if (error.message === 'Content-Type not found') throw error;
		else throw new Error('Invalid Transaction ID');
	}
};

interface DownloadProps {
	tx: string;
	onProgress: (progress: string) => void;
	setFile: (file: File) => void;
}

export const downloadFile = async ({
	tx,
	onProgress,
	setFile,
}: DownloadProps) => {
	const url = `https://gateway.irys.xyz/${tx}`;
	const res = await fetch(url).then((response) => {
		const total = parseInt(response.headers.get('content-length') ?? '0');
		let downloaded = 0;

		const reader = response.body!.getReader();
		const chunks = [] as BlobPart[];

		async function read(): Promise<File> {
			return reader.read().then(({ done, value }) => {
				if (done) {
					const blob = new Blob(chunks);
					const file = new File([blob], 'model.glb');
					setFile(file);
					return file;
				}
				downloaded += value.length;
				const progress = (downloaded / total) * 100;
				onProgress(progress.toFixed(2));
				chunks.push(value);
				return read();
			});
		}

		return read();
	});
	return res;
};

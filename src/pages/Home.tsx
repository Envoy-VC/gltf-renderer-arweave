import React, { lazy } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAsset } from '~/stores/use-asset';
import { Progress } from '~/components/ui/progress';

import { downloadFile, verifyTx } from '~/utils/helpers';

const Viewer = lazy(() => import('../components/viewer/index'));

const Home = () => {
	const { buffer, setBuffer, setFileName, reset } = useAsset();
	const [searchParams] = useSearchParams();
	const [, setFile] = React.useState<File | null>(null);
	const [progress, setProgress] = React.useState<string>('0');
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		const get = async () => {
			try {
				reset();
				setError(null);
				setProgress('0');
				const txId = searchParams.get('tx');
				if (!txId) return;
				setLoading(true);
				await verifyTx(txId);

				if (!txId) return;
				const file = await downloadFile({
					tx: txId,
					onProgress: (progress) => setProgress(progress),
					setFile,
				});

				const reader = new FileReader();
				reader.onabort = () => console.error('file reading was aborted');
				reader.onerror = () => console.error('file reading has failed');
				reader.onload = async () => {
					const data = reader.result as ArrayBuffer;
					setLoading(false);
					setBuffer(data);
					setFileName(file.name);
					setLoading(false);
				};
				reader.readAsArrayBuffer(file);
			} catch (error) {
				setBuffer(new ArrayBuffer(0));
				setError(String(error));
				setLoading(false);
				console.log(error);
			}
		};

		get();
	}, [searchParams]);

	return (
		<div className='flex h-screen w-full flex-col items-center justify-center'>
			{error && <div className='text-red-500'>{error}</div>}
			{!error && loading && (
				<div className='flex w-full max-w-sm flex-row items-center gap-2'>
					<Progress value={parseInt(progress)} />
					<span className='text-gray-400'>{progress}%</span>
				</div>
			)}
			{buffer && <Viewer />}
		</div>
	);
};

export default Home;

import React, { lazy } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAsset } from '~/stores/use-asset';
import { Progress } from '~/components/ui/progress';

import { downloadFile, verifyTx } from '~/utils/helpers';
import ModelDetails from '~/components/model-details';

const Viewer = lazy(() => import('../components/viewer/index'));

const Home = () => {
	const { buffer, setBuffer, setFileName, setTags, reset } = useAsset();
	const [searchParams] = useSearchParams();
	const [, setFile] = React.useState<File | null>(null);
	const [progress, setProgress] = React.useState<string>('0');
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<string | null>(null);
	const txId = searchParams.get('tx');

	React.useEffect(() => {
		const get = async () => {
			try {
				reset();
				setError(null);
				setProgress('0');

				if (!txId) return;
				setLoading(true);
				const tags = await verifyTx(txId);
				setTags(tags);

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
			} catch (error: any) {
				setBuffer(new ArrayBuffer(0));
				setError(String(error.message));
				setLoading(false);
				console.log(error);
			}
		};

		get();
	}, [searchParams]);

	return (
		<div className='flex h-screen w-full flex-col items-center justify-center'>
			{error && <div className='text-2xl text-red-500'>{error}</div>}
			{!txId && (
				<div className='items flex flex-col gap-2'>
					<div className='text-4xl font-medium'>GLTF Renderer</div>
					<div className='text-center font-bold text-gray-500'>
						Add{' '}
						<span className='rounded-md bg-gray-100 px-2 py-1 font-medium text-blue-400'>
							?tx=
						</span>{' '}
						to render 3d model
					</div>
				</div>
			)}
			{!error && loading && txId && (
				<div className='flex w-full max-w-sm flex-row items-center gap-2'>
					<Progress value={parseInt(progress)} />
					<span className='text-gray-400'>{progress}%</span>
				</div>
			)}
			{buffer && !loading && (
				<div className='relative flex h-full w-full flex-col'>
					<div className='min-h-[80vh] xl:h-full'>
						<Viewer />
					</div>
					<ModelDetails />
				</div>
			)}
		</div>
	);
};

export default Home;

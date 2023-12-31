import React from 'react';

import { useAsset } from '~/stores/use-asset';

const ModelDetails = () => {
	const { tags } = useAsset();
	const [showLicense, setShowLicense] = React.useState<boolean>(false);

	const content = tags.filter((tag) => contentTags.includes(tag.name));
	const license = tags.filter((tag) => licenseTags.includes(tag.name));
	if (content.length > 0)
		return (
			<div className='absolute bottom-0 m-8 max-w-md rounded-lg border-2 p-4'>
				<div className='flex flex-col'>
					{content.map((tag) => (
						<div key={tag.name}>
							<span className='font-bold'>{tag.name}: </span>
							<span className='ml-2'>{tag.value}</span>
						</div>
					))}
					{license.length > 0 && (
						<div className='mt-4'>
							<button
								className='text-blue-500'
								onClick={() => setShowLicense(!showLicense)}
							>
								{showLicense ? 'Hide' : 'Show'} License
							</button>
							{showLicense && (
								<div className='mt-2'>
									{license.map((tag) => (
										<div key={tag.name}>
											<span className='font-bold'>{tag.name}: </span>
											<span className='ml-2'>{tag.value}</span>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		);
};

const contentTags = ['Title', 'Description', 'Creator'];
const licenseTags = [
	'License',
	'License-Fee',
	'Derivation',
	'Payment-Mode',
	'Access',
	'Access-Fee',
	'Unknown-Usage-Rights',
	'Commercial Use',
	'Data-Model-Training',
	'Expiry',
	'Currency',
	'Payment-Address',
	'Payment-Mode',
];

export default ModelDetails;

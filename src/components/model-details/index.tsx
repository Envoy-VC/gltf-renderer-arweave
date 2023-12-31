import React from 'react';

interface Tag {
	name: string;
	value: string;
}

import { useAsset } from '~/stores/use-asset';

const ModelDetails = () => {
	const { tags } = useAsset();
	const [hideDetails, setHideDetails] = React.useState<boolean>(false);
	const [showLicense, setShowLicense] = React.useState<boolean>(false);

	const content = tags.filter((tag) => contentTags.includes(tag.name));
	const license = tags.filter((tag) => licenseTags.includes(tag.name));
	if (content.length > 0)
		return (
			<div className='bottom-0 m-2 mx-auto max-w-sm rounded-lg border-2 bg-white p-2 sm:max-w-md xl:absolute xl:m-8'>
				<div className='flex w-full flex-row justify-end'>
					<div
						className='cursor-pointer text-blue-500'
						onClick={() => {
							setHideDetails(!hideDetails);
						}}
					>
						{hideDetails ? 'Show' : 'Hide'} Details
					</div>
				</div>
				{!hideDetails && (
					<div className='flex flex-col'>
						{content.map((tag) => (
							<Field key={tag.name} {...tag} />
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
											<Field key={tag.name} {...tag} />
										))}
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		);
};

const Field = ({ name, value }: Tag) => {
	const [show, setShow] = React.useState<boolean>(false);

	return (
		<div className='flex flex-col items-start gap-1'>
			<div className='flex flex-row gap-2'>
				<span className='font-bold'>
					{name}:{' '}
					<p className='whitespace-pre-line text-pretty break-all font-normal'>
						{show ? value : value.length > 128 ? `${value.slice(0, 128)}...` : value}
					</p>
					{value.length > 128 && (
						<button
							className='font-normal text-blue-500'
							onClick={() => setShow(!show)}
						>
							{show ? 'Show less' : 'Show more'}
						</button>
					)}
				</span>
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

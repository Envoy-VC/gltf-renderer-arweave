import React, { startTransition, SuspenseProps } from 'react';
import { Suspense } from 'react';
import { Canvas, extend, Object3DNode } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';

extend({
	Suspense,
});

declare module '@react-three/fiber' {
	interface ThreeElements {
		customElement: Object3DNode<SuspenseProps, typeof Suspense>;
	}
}

import { useAsset } from '~/stores/use-asset';

function Fallback() {
	return (
		<h1 className='flex h-screen w-full flex-col items-center justify-center'>
			<div className='text-2xl font-bold'>Loading...</div>
		</h1>
	);
}

const Model = () => {
	const { scene } = useAsset();

	const ref = React.useRef();

	React.useLayoutEffect(() => {
		scene.traverse((obj: any) => {
			if (obj.isMesh) {
				obj.castShadow = obj.receiveShadow = true;
				obj.material.envMapIntensity = 0.8;
			}
		});
	}, [scene]);

	return (
		<Suspense fallback={<Fallback />}>
			<Canvas
				gl={{ preserveDrawingBuffer: true }}
				shadows
				dpr={[1, 1.5]}
				camera={{ position: [0, 0, 150], fov: 40 }}
			>
				<ambientLight intensity={0.25} />
				<Stage
					// @ts-ignore
					controls={ref}
					preset='rembrandt'
					intensity={1}
					contactShadow={true}
					shadows
					adjustCamera
					environment='city'
				>
					<primitive object={scene} />
				</Stage>

				<OrbitControls
					// @ts-ignore
					ref={ref}
					autoRotate={false}
				/>
			</Canvas>
		</Suspense>
	);
};

const Viewer = () => {
	const { generateScene, scene, buffer } = useAsset();

	React.useEffect(() => {
		startTransition(() => {
			generateScene().catch((error) =>
				console.error('Error generating scene', error)
			);
		});
	}, [buffer]);

	return <>{scene !== null && <Model />}</>;
};

export default Viewer;

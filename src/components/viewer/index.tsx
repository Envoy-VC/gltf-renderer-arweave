import React, { startTransition } from 'react';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';

import { useAsset } from '~/stores/use-asset';

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
		<Canvas
			gl={{ preserveDrawingBuffer: true }}
			shadows
			dpr={[1, 1.5]}
			camera={{ position: [0, 0, 150], fov: 50 }}
		>
			<ambientLight intensity={0.25} />
			<Suspense fallback={null}>
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
			</Suspense>
			<OrbitControls
				// @ts-ignore
				ref={ref}
				autoRotate={true}
			/>
		</Canvas>
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

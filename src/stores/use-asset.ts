import { create } from 'zustand';

// Loaders
import { REVISION } from 'three';
import { WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

let gltfLoader: GLTFLoader;
if (typeof window !== 'undefined') {
	const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`;
	// Use the same CDN as useGLTF for draco
	const dracoloader = new DRACOLoader().setDecoderPath(
		'https://www.gstatic.com/draco/versioned/decoders/1.5.5/'
	);
	const ktx2Loader = new KTX2Loader().setTranscoderPath(
		`${THREE_PATH}/examples/jsm/libs/basis/`
	);

	gltfLoader = new GLTFLoader()
		.setCrossOrigin('anonymous')
		.setDRACOLoader(dracoloader)
		.setKTX2Loader(ktx2Loader.detectSupport(new WebGLRenderer()))
		.setMeshoptDecoder(MeshoptDecoder);
}

interface Tag {
	name: string;
	value: string;
}

interface State {
	fileName: string;
	buffer: ArrayBuffer;
	animations: boolean;
	scene: any | null;
	tags: Tag[];
}

interface Actions {
	setFileName: (fileName: string) => void;
	setBuffer: (buffer: ArrayBuffer) => void;
	setAnimations: (animations: boolean) => void;
	setScene: (scene: any) => void;
	generateScene: () => Promise<void>;
	setTags: (tags: Tag[]) => void;
	reset: () => void;
}

export const useAsset = create<State & Actions>((set, get) => ({
	fileName: '',
	buffer: new ArrayBuffer(0),
	textFile: '',
	animations: false,
	scene: null,
	tags: [],
	setFileName: (fileName: string) => {
		set({ fileName });
	},
	setBuffer: (buffer: ArrayBuffer) => {
		set({ buffer });
	},
	setAnimations: (animations: boolean) => {
		set({ animations });
	},
	setScene: (scene: any) => {
		set({ scene });
	},
	generateScene: async () => {
		const { buffer } = get();
		const result: any = await new Promise((resolve, reject) =>
			gltfLoader.parse(buffer, '', resolve, reject)
		);

		set({
			animations: !!result.animations.length,
		});

		if (!get().scene) set({ scene: result.scene });
	},
	setTags: (tags: Tag[]) => {
		set({ tags });
	},
	reset: () => {
		set({
			fileName: '',
			buffer: new ArrayBuffer(0),
			animations: false,
			scene: null,
			tags: [],
		});
	},
}));

import { derived, get, writable, type Writable } from 'svelte/store';

import type { ICoordinates, TBoundings } from '$lib/types';
import type { IConnect, IFrameCreate } from '$lib/types/editing';

import { DEFAULT_FRAME_SIZE } from '$lib/constants';

export type IAction = 'connectTo' | 'dragImage' | 'movingArea' | 'movingFrame';
export type IMode = 'adding' | 'binding' | 'view';

interface IWorkspaceFrame extends TBoundings {
	frameId: number;
	hidden: boolean;
	title: string;
}

type IFramesCustomStore = Writable<Array<IFrameCreate>> & {
	init: (data: Array<IFrameCreate>) => void;
};

const framesCustomStore = () => {
	const { set, subscribe, update } = writable<Array<IFrameCreate>>([]);

	const init = (data: Array<IFrameCreate>) => {
		data.map((frame) => {
			const height = DEFAULT_FRAME_SIZE.height + 37 * frame.choices.length - 1;

			return Object.assign(frame, { height });
		});

		set(data);
	};

	return {
		init,
		set,
		subscribe,
		update
	};
};

export const selectedFrameStore = writable<number>();
export const movingFrameStore = writable<number>();

export const workspaceDataStore = writable<Array<IWorkspaceFrame>>([]);
export const framesDataStore: IFramesCustomStore = framesCustomStore();

export const addFrameOffsetStore = writable<ICoordinates>();

export const activeModeStore = writable<IMode>('view');
export const activeActionStore = writable<IAction>();

export const oneDirectionModeStore = writable<boolean>(false);
export const zoomStore = writable<number>(100);
export const offsetStore = writable<ICoordinates>({ x: 0, y: 0 });

export const zoomCorrect = (coordinates: ICoordinates) => {
	return get(
		derived([zoomStore, offsetStore], ([$zoomStore, $offsetStore]) => {
			return {
				x: (coordinates.x - $offsetStore.x) / ($zoomStore / 100),
				y: (coordinates.y - $offsetStore.y) / ($zoomStore / 100)
			};
		})
	);
};

export const connectionStore = writable<IConnect>();

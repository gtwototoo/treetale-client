import { DEFAULT_FRAME_SIZE } from '$lib/constants';
import type { ICoordinates, TBoundings } from '$lib/types';
import type { IFrameCreate } from '$lib/types/editing';
import { derived, get, writable, type Writable } from 'svelte/store';

type IAction = 'movingFrame' | 'view' | 'binding' | 'movingArea' | 'adding';

interface IWorkspaceFrame extends TBoundings {
	frameId: number;
	rotated: boolean;
	hidden: boolean;
	title: string;
}

const framesCustomStore = (): Writable<IFrameCreate[]> => {
	const { subscribe, set, update } = writable<IFrameCreate[]>([]);

	const setOverride = (data: IFrameCreate[]) => {
		data.map((frame) => {
			const width = DEFAULT_FRAME_SIZE.width;
			const height = DEFAULT_FRAME_SIZE.height + 37 * frame.choices.length - 1;

			return Object.assign(frame, { width, height });
		});

		set(data);
	};

	return {
		subscribe,
		set: setOverride,
		update
	};
};

export const selectedFrameStore = writable<number>();
export const movingFrameStore = writable<number>();
export const dragImageModeStore = writable<boolean>(false);

export const workspaceDataStore = writable<IWorkspaceFrame[]>([]);
export const framesDataStore = framesCustomStore();

export const addFrameOffsetStore = writable<ICoordinates>();

export const activeActionStore = writable<IAction>('view');
export const removeModeStore = writable<boolean>(false);
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

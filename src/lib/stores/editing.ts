import { updateFrames } from '$lib/requests/story';
import type { ICoordinates, IVariable } from '$lib/types';
import type { IConnect, IFrameCreate, IMove, IStoryCreate } from '$lib/types/editing';
import { serialize } from '$lib/utils';
import type { SvelteComponent } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';

type IOverrideFrames = Writable<IFrameCreate[]> & {
	init: (data: IFrameCreate[]) => void;
};

type IOverrideStoryInfo = Writable<IStoryCreate> & {
	saveArea: () => void;
	scaleCorrect: (coords: ICoordinates) => ICoordinates;
};

type IChange = {
	data?: IFrameCreate[];
	title: string;
	icon: typeof SvelteComponent<unknown>;
};

type IChanges = {
	stages: IChange[];
	currentStageId: number;
};

type IOverrideChanges = Writable<IChanges> & {
	add: (stage: IChange) => void;
	undo: () => void;
	redo: () => void;
	to: (stageId: number) => void;
};

const framesStore = () => {
	const { subscribe, set, update } = writable<IFrameCreate[]>([]);

	return {
		subscribe,
		set,
		update,
		init: (data: IFrameCreate[]) => {
			data.map((frame) => {
				const width = 256;
				const height = 144 + 37 * (frame.choices.length + 1) - 1;

				return Object.assign(frame, { width, height });
			});

			set(data);
		}
	};
};

const ChangeHistoryStore = () => {
	const { subscribe, set, update } = writable<IChanges>({
		stages: [],
		currentStageId: 0
	});

	return {
		subscribe,
		set,
		update,
		add: (stage: IChange) =>
			update((data: IChanges) => {
				data.stages = data.stages.slice(0, data.currentStageId + 1);

				data.stages.push({
					data: serialize(get(frames)),
					...stage
				});

				if (data.stages.length > 20) data.stages.shift();

				data.currentStageId = data.stages.length - 1;

				return data;
			}),
		to: (stageId: number) =>
			update((data: IChanges) => {
				if (stageId >= 0 && stageId < data.stages.length) {
					data.currentStageId = stageId;

					frames.set(serialize(data.stages[data.currentStageId].data));
				}

				return data;
			}),
		undo: () =>
			update((data: IChanges) => {
				if (!data.currentStageId) return data;

				data.currentStageId -= 1;
				frames.set(serialize(data.stages[data.currentStageId].data));

				return data;
			}),
		redo: () =>
			update((data: IChanges) => {
				if (data.currentStageId === 20 || data.currentStageId + 1 >= data.stages.length)
					return data;

				data.currentStageId += 1;
				frames.set(serialize(data.stages[data.currentStageId].data));

				return data;
			})
	};
};

const storyInfoStore = () => {
	const { subscribe, set, update } = writable<IStoryCreate>(undefined);

	return {
		subscribe,
		set,
		update,
		saveArea: () => {
			update((data: IStoryCreate) => {
				data.timer = window.setTimeout(async () => {
					const { offset, scale, storyId } = get(storyInfo);
					const framesList: IFrameCreate[] = get(frames);

					const { response } = await updateFrames(storyId, framesList, offset, scale);

					update((data: IStoryCreate) => {
						clearTimeout(data.timer);
						data.saved = !response.error;

						return data;
					});
				}, 3000);

				return data;
			});
		},
		scaleCorrect: (coords: ICoordinates) => {
			const { offset, scale } = get(storyInfo);

			return {
				x: (coords.x - offset.x) / (scale / 100),
				y: (coords.y - offset.y) / (scale / 100)
			};
		}
	};
};
export const connect = writable<IConnect>({
	active: false,
	connector: {
		from: null,
		prevOutput: null,
		to: null,
		mouseCoords: null
	}
});
export const moveMode = writable<IMove>({
	hovered: null,
	active: false,
	oneDirectionMode: false
});
export const frames: IOverrideFrames = framesStore();
export const changesHistory: IOverrideChanges = ChangeHistoryStore();
export const storyInfo: IOverrideStoryInfo = storyInfoStore();
export const vars = writable<IVariable[]>([]);

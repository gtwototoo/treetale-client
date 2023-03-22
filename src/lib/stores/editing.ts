import { framesCorrect, serialize } from '$lib/helpers';
import { updateFrames } from '$lib/requests/story';
import type { ICoordinates, IVariable } from '$lib/types';
import type {
	IConnect,
	IFrameCreate,
	IMove,
	IStoryCreate,
} from '$lib/types/editing';
import type { SvelteComponent } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';

type IOverrideStoryInfo = Writable<IStoryCreate> & {
	saveArea: () => void;
	scaleCorrect: (coords: ICoordinates) => ICoordinates;
};

type IChange = {
	data?: IFrameCreate[];
	title: string;
	icon: typeof SvelteComponent;
};

type IChanges = {
	stages: IChange[];
	stageId: number;
};

type IOverrideChanges = Writable<IChanges> & {
	add: (stage: IChange) => void;
	undo: () => void;
	redo: () => void;
	setStage: (stageId: number) => void;
};

type IOverrideFrames = Writable<IFrameCreate[]> & {
	init: (data: IFrameCreate[]) => void;
};

const framesStore = () => {
	const { subscribe, set, update } = writable([]);

	return {
		subscribe,
		set,
		update,
		init: (data: IFrameCreate[]) => {
			for (const i in frames) {
				Object.assign(frames[i], { width: 0, height: 0 });
			}
			set(data);
		},
	};
};

const ChangeHistoryStore = () => {
	const { subscribe, set, update }: Writable<IChanges> = writable({
		stages: [],
		stageId: 0,
	});

	return {
		subscribe,
		set,
		update,
		add: (stage: IChange) =>
			update((data: IChanges) => {
				data.stages = data.stages.slice(0, data.stageId + 1);

				data.stages.push({
					data: serialize(get(frames)),
					...stage,
				});

				if (data.stages.length > 20) data.stages.shift();

				data.stageId = data.stages.length - 1;

				return data;
			}),
		setStage: (stageId: number) =>
			update((data: IChanges) => {
				if (stageId >= 0 && stageId < data.stages.length) {
					data.stageId = stageId;

					frames.set(serialize(data.stages[data.stageId].data));
				}

				return data;
			}),
		undo: () =>
			update((data: IChanges) => {
				if (data.stageId > 0) {
					data.stageId = data.stageId - 1;

					frames.set(serialize(data.stages[data.stageId].data));
				}

				return data;
			}),
		redo: () =>
			update((data: IChanges) => {
				if (data.stageId < 20 && data.stageId + 1 < data.stages.length) {
					data.stageId = data.stageId + 1;

					frames.set(serialize(data.stages[data.stageId].data));
				}

				return data;
			}),
	};
};

const storyInfoStore = () => {
	const { subscribe, set, update } = writable(null);

	return {
		subscribe,
		set,
		update,
		saveArea: () => {
			update((data: IStoryCreate) => {
				data.timer = setTimeout(async () => {
					const { grabbingOffsets, grabbingScale, storyId } =
						get(storyInfo);
					const framesList: IFrameCreate[] = get(frames);

					const { response } = await updateFrames(
						storyId,
						framesCorrect(framesList),
						grabbingOffsets,
						grabbingScale
					);

					update((data: IStoryCreate) => {
						data.timer = undefined;
						data.saved = !response.error;

						return data;
					});
				}, 3000);

				return data;
			});
		},
		scaleCorrect: (coords: ICoordinates) => {
			const { grabbingOffsets, grabbingScale } = get(storyInfo);

			return {
				x: (coords.x - grabbingOffsets.x) / (grabbingScale / 100),
				y: (coords.y - grabbingOffsets.y) / (grabbingScale / 100),
			};
		},
	};
};

export const moveMode: Writable<IMove> = writable({
	hovered: null,
	active: false,
	oneDirectionMode: false,
});

export const connect: Writable<IConnect> = writable({
	active: false,
	connector: {
		from: null,
		prevOutput: null,
		to: null,
		mouseCoords: null,
	},
});

export const changesHistory: IOverrideChanges = ChangeHistoryStore();

export const vars: Writable<IVariable[]> = writable([]);

export const frames: IOverrideFrames = framesStore();

export const storyInfo: IOverrideStoryInfo = storyInfoStore();

export const activeActions = writable(false);

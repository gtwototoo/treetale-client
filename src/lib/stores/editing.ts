import type { IFrameCreate } from '$lib/types/editing';
import { serialize } from '$lib/utils';
import type { SvelteComponent } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';
import { framesDataStore } from './workspace';

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
	add: (title: string, icon: typeof SvelteComponent<unknown>) => void;
	undo: () => void;
	redo: () => void;
	to: (stageId: number) => void;
};

const ChangeHistoryStore = () => {
	const { subscribe, set, update } = writable<IChanges>({
		stages: [],
		currentStageId: 0
	});

	const add = (title: string, icon: typeof SvelteComponent<unknown>) =>
		update((data: IChanges) => {
			data.stages = data.stages.slice(0, data.currentStageId + 1);

			data.stages.push({
				data: serialize(get(framesDataStore)),
				title,
				icon
			});

			if (data.stages.length > 20) data.stages.shift();

			data.currentStageId = data.stages.length - 1;

			return data;
		});

	const to = (stageId: number) =>
		update((data: IChanges) => {
			if (stageId >= 0 && stageId < data.stages.length) {
				data.currentStageId = stageId;

				framesDataStore.set(serialize(data.stages[data.currentStageId].data));
			}

			return data;
		});

	const undo = () =>
		update((data: IChanges) => {
			if (!data.currentStageId) return data;

			data.currentStageId -= 1;
			framesDataStore.set(serialize(data.stages[data.currentStageId].data));

			return data;
		});

	const redo = () =>
		update((data: IChanges) => {
			if (data.currentStageId === 20 || data.currentStageId + 1 >= data.stages.length)
				return data;

			data.currentStageId += 1;
			framesDataStore.set(serialize(data.stages[data.currentStageId].data));

			return data;
		});

	return {
		subscribe,
		set,
		update,
		add,
		to,
		undo,
		redo
	};
};

export const changesHistory: IOverrideChanges = ChangeHistoryStore();

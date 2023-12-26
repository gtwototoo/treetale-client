import type { SvelteComponent } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';

import { framesDataStore } from './workspace';

import type { IFrameCreate } from '$lib/types/editing';

import { Play } from 'svelte-heros-v2';

import { serialize } from '$lib/utils';
import { applyDiff, type IDiff } from '$lib/utils/apply-diff';
import { diff } from 'deep-object-diff';

interface IChange {
	difference?: IDiff;
	icon: typeof SvelteComponent<unknown>;
	title: string;
}

interface IChanges {
	currentId: number;
	initial: Array<IFrameCreate>;
	stages: Array<IChange>;
}

type IOverrideChanges = Writable<IChanges> & {
	add: (title: string, icon: typeof SvelteComponent<unknown>) => void;
	undo: () => void;
	redo: () => void;
	init: (initialFrames: Array<IFrameCreate>) => void;
	to: (stageId: number) => void;
};

const STAGES_MAX_COUNT = 50;

const framesHistoryStore = () => {
	const { subscribe, set, update } = writable<IChanges>({
		initial: null,
		stages: [],
		currentId: 0
	});

	const init = (initialFrames: Array<IFrameCreate>) =>
		update((data: IChanges) => {
			data.initial = serialize(initialFrames);

			data.stages.push({
				difference: {},
				title: 'Начальное состояние',
				icon: Play
			});

			return data;
		});

	const add = (title: string, icon: typeof SvelteComponent<unknown>) =>
		update((data: IChanges) => {
			data.stages = data.stages.slice(0, data.currentId + 1);

			const difference = diff(data.initial, serialize(get(framesDataStore))) as IDiff;
			const hasChanges = Object.keys(
				diff(difference, data.stages[data.currentId].difference)
			).length;

			if (hasChanges) {
				data.stages.push({
					difference,
					title,
					icon
				});

				if (data.stages.length > STAGES_MAX_COUNT) data.stages.shift();

				data.currentId = data.stages.length - 1;
			}

			return data;
		});

	const to = (stageId: number) =>
		update((data: IChanges) => {
			if (stageId < 0 || stageId >= data.stages.length) {
				return;
			}

			const modifiedData = applyDiff(serialize(data.initial), data.stages[stageId].difference);

			data.currentId = stageId;

			framesDataStore.set(modifiedData);

			return data;
		});

	const undo = () =>
		update((data: IChanges) => {
			if (!data.currentId) {
				return data;
			}

			data.currentId -= 1;

			const modifiedData = applyDiff(
				serialize(data.initial),
				data.stages[data.currentId].difference
			);

			framesDataStore.set(modifiedData);

			return data;
		});

	const redo = () =>
		update((data: IChanges) => {
			if (data.currentId === STAGES_MAX_COUNT || data.currentId + 1 >= data.stages.length) {
				return data;
			}

			data.currentId += 1;

			const modifiedData = applyDiff(
				serialize(data.initial),
				data.stages[data.currentId].difference
			);

			framesDataStore.set(modifiedData);

			return data;
		});

	return {
		subscribe,
		set,
		update,
		init,
		add,
		to,
		undo,
		redo
	};
};

export const changesHistory: IOverrideChanges = framesHistoryStore();

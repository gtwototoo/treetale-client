import type { SvelteComponent } from 'svelte';
import { type Writable, get, writable } from 'svelte/store';

import { diff } from 'deep-object-diff';
import { Play } from 'svelte-heros-v2';

import type { IFrameCreate } from '$lib/types/editing';

import { serialize } from '$lib/utils';
import { type IDiff, applyDiff } from '$lib/utils/apply-diff';

import { framesDataStore } from './workspace';

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
	init: (initialFrames: Array<IFrameCreate>) => void;
	redo: () => void;
	to: (stageId: number) => void;
	undo: () => void;
};

const STAGES_MAX_COUNT = 50;

const framesHistoryCustomStore = () => {
	const { set, subscribe, update } = writable<IChanges>({
		currentId: 0,
		initial: null,
		stages: []
	});

	const init = (initialFrames: Array<IFrameCreate>) =>
		update((data: IChanges) => {
			data.initial = serialize(initialFrames);

			data.stages.push({
				difference: {},
				icon: Play,
				title: 'Начальное состояние'
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
					icon,
					title
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
		add,
		init,
		redo,
		set,
		subscribe,
		to,
		undo,
		update
	};
};

export const changesHistory: IOverrideChanges = framesHistoryCustomStore();

import { diff } from 'deep-object-diff';
import cloneDeep from 'lodash/cloneDeep';
import { Play } from 'svelte-heros-v2';
import type { HeroIconComponent } from 'treetale-ui';

import { HISTORY_STAGES_MAX_COUNT } from '$lib/constants';
import type { Frame } from '$lib/types';
import { type Diff, type Elem, applyDiff } from '$lib/utils/applyDiff';

import { boardFramesStore } from './frames.svelte';
import { boardEventsStore } from './index.svelte';

interface Change {
	difference: Diff;
	icon: HeroIconComponent;
	title: string;
}

const getChangesHistory = () => {
	let currentId = $state(0);
	let initial = $state<Frame[]>([]);
	let stages = $state<Change[]>([]);

	const init = (initialFrames: Frame[]) => {
		initial = cloneDeep(initialFrames);
		stages.push({
			difference: {},
			icon: Play,
			title: 'Начальное состояние'
		});
	};

	const add = (title: string, icon: HeroIconComponent) => {
		stages = stages.slice(0, currentId + 1);
		const difference = diff(initial, cloneDeep(boardFramesStore.frames)) as Diff;
		const hasChanges = Object.keys(diff(difference, stages[currentId].difference)).length;

		if (hasChanges) {
			stages.push({
				difference,
				icon,
				title
			});

			if (stages.length > HISTORY_STAGES_MAX_COUNT) stages.shift();

			currentId = stages.length - 1;
		}

		boardEventsStore.save();
	};

	const to = (toStageId: number) => {
		if (toStageId < 0 || toStageId >= stages.length) {
			return;
		}

		const modifiedData = applyDiff(
			cloneDeep(initial) as unknown as Elem[],
			stages[toStageId].difference
		) as unknown as Frame[];

		currentId = toStageId;

		boardFramesStore.frames = modifiedData;

		boardEventsStore.save();
	};

	const undo = () => {
		if (!currentId) return;

		currentId -= 1;

		const modifiedData = applyDiff(
			cloneDeep(initial) as unknown as Elem[],
			stages[currentId].difference
		) as unknown as Frame[];

		boardFramesStore.frames = modifiedData;

		boardEventsStore.save();
	};

	const redo = () => {
		if (currentId === HISTORY_STAGES_MAX_COUNT || currentId + 1 >= stages.length) return;

		currentId += 1;

		const modifiedData = applyDiff(
			cloneDeep(initial) as unknown as Elem[],
			stages[currentId].difference
		) as unknown as Frame[];

		boardFramesStore.frames = modifiedData;

		boardEventsStore.save();
	};

	return {
		add,
		get currentId() {
			return currentId;
		},
		init,
		redo,
		get stages() {
			return stages;
		},
		to,
		undo
	};
};

export const changesHistoryStore = getChangesHistory();

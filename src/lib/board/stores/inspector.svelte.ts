import type { Choice } from '$lib/types';

export interface SelectedChoices {
	choice: Choice;
	frameId: number;
}

const getInspectorData = () => {
	let selectedChoices = $state<SelectedChoices[]>([]);

	return {
		get selectedChoices() {
			return selectedChoices;
		},
		set selectedChoices(value) {
			selectedChoices = value;
		}
	};
};

export const inspectorStore = getInspectorData();

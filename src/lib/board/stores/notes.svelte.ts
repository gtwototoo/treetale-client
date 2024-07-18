import type { Note } from '$lib/types';

const getNotes = () => {
	let notes = $state<Note[]>([]);

	return {
		get notes() {
			return notes;
		},
		set notes(value) {
			notes = value;
		}
	};
};

export const notesStore = getNotes();

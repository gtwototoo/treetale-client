<script lang="ts">
	import { redBackgroundColorStore } from '$board/stores/colors.svelte';
	import { notesStore } from '$board/stores/notes.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { XMark } from 'svelte-heros-v2';
	import { Button, Contenteditable, FormSplit, Icon, InputTags } from 'treetale-ui';

	import { clm } from '$lib/utils/classMerge';

	export let noteKey: number;
	export let checkUpdates: () => void;

	const removeNote = () => {
		notesStore.notes.splice(noteKey, 1);

		checkUpdates();
	};
</script>

<FormSplit vertical>
	<Contenteditable
		bind:html={notesStore.notes[noteKey].text}
		oninput={checkUpdates}
		placeholder="Текст заметки"
		disabled={panelStatesStore.editMode}
	>
		{#snippet right()}
			{#if panelStatesStore.editMode}
				<Button
					class={clm('text-red-500', redBackgroundColorStore.color)}
					onclick={removeNote}
					size="sm"
				>
					<Icon this={XMark} class="size-4" />
				</Button>
			{/if}
		{/snippet}
	</Contenteditable>
	<InputTags
		bind:tags={notesStore.notes[noteKey].tags}
		onadd={checkUpdates}
		onremove={checkUpdates}
		placeholder="Ключевые слова"
		disabled={panelStatesStore.editMode}
	/>
</FormSplit>

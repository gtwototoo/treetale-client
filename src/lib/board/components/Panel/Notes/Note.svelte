<script lang="ts">
	import { XMark } from 'svelte-heros-v2';
	import { Button, Contenteditable, FormSplit, Icon, InputTags } from 'treetale-ui';

	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';

	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { notesStore } from '$board/stores/notes.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';

	const {
		noteKey,
		checkUpdates
	}: {
		noteKey: number;
		checkUpdates: () => void;
	} = $props();

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
		readonly={readonlyModeStore.isEnabled}
	>
		{#snippet right()}
			{#if panelStatesStore.editMode}
				<Button class={redBackgroundColorStore.color} onclick={removeNote} size="sm">
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
		readonly={readonlyModeStore.isEnabled}
	/>
</FormSplit>

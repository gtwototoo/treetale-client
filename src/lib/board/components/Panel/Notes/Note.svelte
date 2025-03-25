<script lang="ts">
	import { XMark } from 'svelte-heros-v2';

	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Contenteditable from '$lib/ui/Contenteditable.svelte';
	import FormSplit from '$lib/ui/FormSplit.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import InputTags from '$lib/ui/InputTags.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

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
		class={clm(button.size.base)}
		placeholder="Текст заметки"
		disabled={panelStatesStore.editMode}
		readonly={readonlyModeStore.isEnabled}
	>
		{#snippet right()}
			{#if panelStatesStore.editMode}
				<Button
					class={clm(button.size.sm, button.type.primary, redBackgroundColorStore.color, 'px-1.5')}
					onclick={removeNote}
				>
					<Icon this={XMark} class="size-5" />
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

<script lang="ts">
	import clsx from 'clsx';
	import { XMark } from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { notesStore } from '$lib/stores/editing';
	import { redColorStore } from '$lib/stores/main';
	import { panelEditMode } from '$lib/stores/panel';
	import { Button, Contenteditable, FormSplit, InputTags } from '$UI';

	export let noteKey: number;
	export let checkUpdates: () => void;

	const removeNote = () => {
		$notesStore.splice(noteKey, 1);

		$notesStore = [...$notesStore];

		checkUpdates();
	};
</script>

<FormSplit vertical>
	<Contenteditable
		bind:html={$notesStore[noteKey].text}
		on:input={checkUpdates}
		placeholder="Текст заметки"
	/>
	{#if $panelEditMode}
		<Button class={clsx('!text-red-500', $redColorStore)} on:click={removeNote} variant="main">
			<Icon type={XMark} />
		</Button>
	{:else}
		<InputTags
			bind:tags={$notesStore[noteKey].tags}
			on:add={checkUpdates}
			on:remove={checkUpdates}
			placeholder="Ключевые слова"
		/>
	{/if}
</FormSplit>

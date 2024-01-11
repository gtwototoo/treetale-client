<script lang="ts">
	import clsx from 'clsx';
	import { XMark } from 'svelte-heros-v2';

	import { Button, Contenteditable, FormSplit, InputTags } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { notesStore } from '$lib/stores/editing';
	import { currentPanelStore, redColorStore } from '$lib/stores/main';

	export let noteKey: number;
	export let checkUpdates: () => void;

	const removeVariable = () => {
		$notesStore.splice(noteKey, 1);

		$notesStore = [...$notesStore];

		checkUpdates();
	};

	const handleInput = () => {
		checkUpdates();
	};

	$: editMode = $currentPanelStore.editMode;
</script>

<FormSplit vertical>
	<Contenteditable
		placeholder="Текст заметки"
		bind:html={$notesStore[noteKey].text}
		on:input={handleInput}
	/>
	{#if editMode}
		<Button
			variant="main"
			on:click={removeVariable}
			class={clsx('!text-red-500', $redColorStore)}
		>
			<Icon type={XMark} />
		</Button>
	{:else}
		<InputTags
			placeholder="Ключевые слова"
			bind:tags={$notesStore[noteKey].tags}
			on:input={handleInput}
		/>
	{/if}
</FormSplit>

<script lang="ts">
	import { Cloud, DocumentText } from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { updateNotes } from '$lib/requests/story';
	import { informationDataStore, notesStore, readonlyStore } from '$lib/stores/editing';
	import { panelEditMode } from '$lib/stores/panel';
	import { Button } from '$UI';

	import Note from '../Note.svelte';
	import Panel from '../Panel.svelte';
	import NoteRow from './Note.svelte';

	let timer: number;
	let saving = false;
	let saveInfo = 'Ожидание изменений';

	const checkUpdates = () => {
		clearTimeout(timer);
		saving = true;

		timer = window.setTimeout(async () => {
			try {
				await updateNotes($informationDataStore.storyId, $notesStore);

				saveInfo = 'Изменения сохранены';
			} catch {
				saveInfo = 'Ошибка сохранения';
			}

			clearTimeout(timer);
			saving = false;
		}, 3000);
	};

	const addNote = () => {
		$notesStore = [
			...$notesStore,
			{
				tags: [],
				text: ''
			}
		];

		checkUpdates();
	};
</script>

<Panel title="Заметки">
	<Note
		icon={DocumentText}
		text="Тут можно сохранять определенные записи с ключевыми словами, что в свою очередь дает возможность подсветки этих ключевых слов в любом тексте, при наведении на которые эти заметки отобразятся"
	/>
	<div class="flex flex-col gap-2">
		{#each $notesStore.keys() as key}
			<NoteRow {checkUpdates} noteKey={key} />
		{/each}
		{#if !$panelEditMode && !$readonlyStore}
			<Button class="justify-center bg-contrast-9 text-text" on:click={addNote} variant="ghost">
				Добавить заметку
			</Button>
		{/if}
	</div>
	{#if !$readonlyStore}
		<div class="pointer-events-none flex select-none justify-center text-xs text-gray-500">
			{#if saving}
				<Icon class="h-4 animate-pulse text-gray-600" type={Cloud} />
			{:else}
				{saveInfo}
			{/if}
		</div>
	{/if}
</Panel>

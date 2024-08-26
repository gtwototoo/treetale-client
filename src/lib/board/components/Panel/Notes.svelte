<script lang="ts">
	import { updateNotes } from '$board/requests/story';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { storyInfoStore } from '$board/stores/info.svelte';
	import { notesStore } from '$board/stores/notes.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { Cloud, DocumentText } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import NoteRow from './Notes/Note.svelte';
	import ShortDescription from './ShortDescription.svelte';

	let timer = $state<number>();
	let saving = $state(false);
	let saveInfo = $state('Ожидание изменений');

	const checkUpdates = () => {
		clearTimeout(timer);
		saving = true;

		timer = window.setTimeout(async () => {
			try {
				await updateNotes(storyInfoStore.info!.storyId, notesStore.notes);

				saveInfo = 'Изменения сохранены';
			} catch (error) {
				console.error(error);

				saveInfo = 'Ошибка сохранения';
			}

			clearTimeout(timer);
			saving = false;
		}, 3000);
	};

	const addNote = () => {
		notesStore.notes = [
			...notesStore.notes,
			{
				tags: [],
				text: ''
			}
		];

		checkUpdates();
	};
</script>

<ShortDescription
	icon={DocumentText}
	text="Тут можно сохранять определенные записи с ключевыми словами, что в свою очередь дает возможность подсветки этих ключевых слов в любом тексте, при наведении на которые эти заметки отобразятся"
/>
<div class="flex flex-col gap-2">
	{#each notesStore.notes.keys() as key}
		<NoteRow {checkUpdates} noteKey={key} />
	{/each}
	{#if !panelStatesStore.editMode && !readonlyModeStore.isEnabled}
		<Button class="justify-center bg-contrast-9 text-text hover:bg-contrast-7" onclick={addNote}>
			Добавить заметку
		</Button>
	{/if}
</div>
{#if !readonlyModeStore.isEnabled}
	<div class="pointer-events-none flex select-none justify-center text-xs text-gray-500">
		{#if saving}
			<Icon class="h-4 animate-pulse text-gray-600" this={Cloud} />
		{:else}
			{saveInfo}
		{/if}
	</div>
{/if}

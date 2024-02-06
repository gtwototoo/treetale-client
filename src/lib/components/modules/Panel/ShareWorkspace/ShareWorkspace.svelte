<script lang="ts">
	import { Cloud, Link } from 'svelte-heros-v2';

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore } from '$lib/stores/editing';
	import { panelEditMode } from '$lib/stores/panel';

	import Note from '../Note.svelte';
	import Panel from '../Panel.svelte';

	let timer: number;
	let saving = false;
	let saveInfo = 'Ожидание изменений';

	const addSharedUser = () => {
		checkUpdates();
	};

	const checkUpdates = () => {
		clearTimeout(timer);
		saving = true;

		timer = window.setTimeout(async () => {
			try {
				// await updateSharedUsers($informationDataStore.storyId, $sharedUsers);

				saveInfo = 'Изменения сохранены';
			} catch {
				saveInfo = 'Ошибка сохранения';
			}

			clearTimeout(timer);
			saving = false;
		}, 3000);
	};
</script>

<Panel title="Совместный доступ">
	<Note
		icon={Link}
		text="Вы можете поделиться рабочей областью с другими пользователями с помощью специальной ссылки, либо пригласить их, добавив в список ниже"
	/>
	<Button class="justify-center bg-contrast-9 text-text" variant="ghost">
		Скопировать ссылку
	</Button>
	<div class="flex flex-col gap-2">
		{#if !$panelEditMode && !$readonlyStore}
			<Button
				class="justify-center bg-contrast-9 text-text"
				variant="ghost"
				on:click={addSharedUser}
			>
				Добавить пользователя
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

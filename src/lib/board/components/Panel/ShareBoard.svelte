<script lang="ts">
	import { redBackgroundColorStore } from '$board/stores/colors.svelte';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { Cloud, Link, XMark } from 'svelte-heros-v2';
	import { Button, Icon, Input, Listbox } from 'treetale-ui';

	import { clm } from '$lib/utils/classMerge';

	import ShortDescription from './ShortDescription.svelte';

	let timer = $state<number>();
	let saving = $state(false);
	let saveInfo = $state('Ожидание изменений');

	const addSharedUser = () => {
		users.push({
			email: '',
			role: 'Просмотр'
		});
	};

	const removeShareUser = (key: number) => {
		users.splice(key, 1);
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

	let users: {
		email: string;
		role: 'Просмотр' | 'Редактирование';
	}[] = $state([]);
</script>

<ShortDescription
	icon={Link}
	text="Вы можете поделиться рабочей областью с другими пользователями с помощью специальной ссылки, либо пригласить их, добавив в список ниже"
/>
<Button class="justify-center bg-contrast-9 text-text">Скопировать ссылку</Button>
<div class="flex flex-col gap-2">
	{#each users as user, key}
		<Input
			bind:value={user.email}
			disabled={panelStatesStore.editMode}
			maxlength={15}
			oninput={checkUpdates}
			placeholder="Почта"
			readonly={readonlyModeStore.isEnabled}
		>
			{#snippet right()}
				{#if panelStatesStore.editMode}
					<Button
						class={clm('text-red-500', redBackgroundColorStore.color)}
						onclick={() => removeShareUser(key)}
						size="sm"
					>
						<Icon this={XMark} class="size-4" />
					</Button>
				{:else}
					<Listbox
						size="sm"
						align="right"
						bind:value={user.role}
						list={['Просмотр', 'Редактирование']}
						onchange={checkUpdates}
						placeholder="Права"
						readonly={readonlyModeStore.isEnabled}
					/>
				{/if}
			{/snippet}
		</Input>
	{/each}
	{#if !panelStatesStore.editMode && !readonlyModeStore.isEnabled}
		<Button class="justify-center bg-contrast-9 text-text" onclick={addSharedUser}>
			Добавить пользователя
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

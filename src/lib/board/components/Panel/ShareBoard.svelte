<script lang="ts">
	import { Cloud, Link, XMark } from 'svelte-heros-v2';
	import { Button } from 'treetale-ui';

	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import Input from '$lib/ui/Input.svelte';
	import Listbox from '$lib/ui/Listbox.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';

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
<Button class="bg-main-300 text-text hover:bg-main-500 justify-center">Скопировать ссылку</Button>
<div class="flex flex-col gap-2">
	{#each users as user, index (index)}
		<Input
			bind:value={user.email}
			disabled={panelStatesStore.editMode}
			class={clm(button.size.base)}
			maxlength={15}
			oninput={checkUpdates}
			placeholder="Почта"
			readonly={readonlyModeStore.isEnabled}
		>
			{#snippet right()}
				{#if panelStatesStore.editMode}
					<Button
						class={redBackgroundColorStore.color}
						onclick={() => removeShareUser(index)}
						size="sm"
					>
						<Icon this={XMark} class="size-4" />
					</Button>
				{:else}
					<Listbox
						value={user.role}
						options={[{ value: 'Просмотр' }, { value: 'Редактирование' }]}
						onchange={checkUpdates}
						class="shrink-0"
						placeholder="Права"
						placement="bottom-end"
						readonly={readonlyModeStore.isEnabled}
						sameWidth={false}
					/>
				{/if}
			{/snippet}
		</Input>
	{/each}
	{#if !panelStatesStore.editMode && !readonlyModeStore.isEnabled}
		<Button class="bg-main-300 text-text hover:bg-main-500 justify-center" onclick={addSharedUser}>
			Добавить пользователя
		</Button>
	{/if}
</div>
{#if !readonlyModeStore.isEnabled}
	<div class="pointer-events-none flex justify-center text-xs text-gray-500 select-none">
		{#if saving}
			<Icon class="h-4 animate-pulse text-gray-600" this={Cloud} />
		{:else}
			{saveInfo}
		{/if}
	</div>
{/if}

<script lang="ts">
	import { Button, ColorPicker, FormSplit, Input, Textarea } from '$UI';
	import { page } from '$app/stores';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { updateProfile } from '$lib/requests/user';
	import { colorStore } from '$lib/stores/profile';
	import type { HttpError } from '@sveltejs/kit';
	import clsx from 'clsx';
	import { Cog6Tooth } from 'svelte-heros-v2';
	import Note from './Note.svelte';

	let light = 80;
	let saturate = 90;
	let saveInfo = 'Ожидание сохранения';
	let errored = false;
	let loading = false;

	let name = $page.data.session.name;
	let description = $page.data.session.description;

	$: $colorStore = $page.data.session.color;

	const setColor = ({ detail }: CustomEvent) => {
		$colorStore = detail.color;
	};

	const saveProfile = async () => {
		errored = false;
		loading = true;

		try {
			await updateProfile(name, description, $colorStore);

			saveInfo = 'Изменения сохранены';
		} catch (e) {
			const error = e as HttpError;

			errored = true;

			saveInfo = error.body.message || 'Ошибка сохранения';
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex flex-col items-stretch gap-4 p-6">
	<Note
		icon={Cog6Tooth}
		text="Тут вы можете указать свой псевдоним и описание для своего профиля"
	/>
	<FormSplit vertical>
		<Input placeholder="Псевдоним" class="w-full" bind:value={name} required>
			<ColorPicker
				lightRange={[10, 80]}
				saturateRange={[10, 90]}
				color={$colorStore || DEFAULT_COLOR}
				{saturate}
				{light}
				on:change={setColor}
			/>
		</Input>
		<Textarea placeholder="Описание" bind:value={description} />
	</FormSplit>
	<Button class="justify-center" on:click={saveProfile} {loading} disabled={!name}>
		Сохранить изменения
	</Button>
	{#if saveInfo}
		<div
			class={clsx(
				'pointer-events-none flex select-none justify-center text-xs',
				errored ? 'text-red-600' : 'text-gray-500'
			)}
		>
			{saveInfo}
		</div>
	{/if}
</div>

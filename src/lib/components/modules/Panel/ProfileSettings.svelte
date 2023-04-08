<script lang="ts">
	import { Textarea } from '$UI';
	import Button from '$UI/Button.svelte';
	import ColorPicker from '$UI/ColorPicker.svelte';
	import Input from '$UI/Input.svelte';

	import { page } from '$app/stores';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { updateProfile } from '$lib/requests/user';
	import { colorStore } from '$lib/stores/profile';
	import clsx from 'clsx';
	import { Cog6Tooth } from 'svelte-heros-v2';
	import Note from './Note.svelte';

	let light: number = 80;
	let saturate: number = 90;
	let saveInfo: string = 'Ожидание изменений';
	let errored = false;
	let loading = false;

	let name = $page.data.session.name;
	let description = $page.data.session.description;
	let color = $page.data.session.color;

	const setColor = ({ detail }: CustomEvent) => {
		$colorStore = detail.color;
	};

	const saveProfile = async () => {
		errored = false;
		loading = true;

		const { error, response } = await updateProfile(name, description, color);

		loading = false;
		errored = !!error;
		saveInfo = error
			? Object.hasOwn(response, 'message')
				? response.message
				: 'Ошибка сохранения'
			: 'Изменения сохранены';
	};
</script>

<div class="flex flex-col items-stretch gap-4 p-6">
	<Note
		icon={Cog6Tooth}
		text="Тут вы можете указать свой псевдоним и описание для своего профиля"
	/>
	<div class="flex gap-2">
		<Input placeholder="Псевдоним" class="w-full" bind:value={name} required>
			<ColorPicker
				lightRange={[10, 80]}
				saturateRange={[10, 90]}
				color={$colorStore || color || DEFAULT_COLOR}
				{saturate}
				{light}
				on:change={setColor}
			/>
		</Input>
	</div>
	<Textarea placeholder="Описание" bind:value={description} />
	<Button class="justify-center" on:click={saveProfile} {loading} disabled={!name}>
		<p>Сохранить изменения</p>
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

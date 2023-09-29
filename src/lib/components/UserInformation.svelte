<script lang="ts">
	import { Button, ColorPicker, Textarea } from '$UI';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import ProfileAvatar from '$lib/components/ProfileAvatar.svelte';
	import { signOutUser, updateProfile } from '$lib/requests/user';
	import { bodyColorStore } from '$lib/stores/main';
	import type { IUser } from '$lib/types';
	import clsx from 'clsx';

	import { Cog6Tooth, UserPlus } from 'svelte-heros-v2';

	export let user: IUser;
	export let me: boolean;
	export let statistic: string[][];

	let editMode = false;
	let light = 80;
	let saturate = 90;
	let loading = false;

	const handleSubscribe = () => {
		if ($page.data.session) {
			alert('Coming soon');
		} else {
			goto('/signin');
		}
	};

	const setColor = ({ detail }: CustomEvent) => {
		$bodyColorStore = detail.color;
	};

	const handleSignOut = async () => {
		try {
			await signOutUser();

			goto('/', {
				replaceState: true,
				invalidateAll: true
			});
		} catch (e) {
			console.error(e);
		}
	};

	const saveProfile = async () => {
		loading = true;

		try {
			await updateProfile(user.name, user.description, $bodyColorStore);
		} finally {
			loading = false;
			editMode = false;
		}
	};
</script>

<div
	class={clsx(
		'flex w-[36rem] sticky screen-md screen-xl screen-hd screen-sm top-8 flex-col gap-12 items-center shrink-0 rounded-3xl transition-colors p-9',
		editMode ? 'bg-white' : 'bg-transparent'
	)}
>
	<div class="flex flex-col gap-2 items-center bg-transparent">
		<div class="p-6">
			<ProfileAvatar {user} {editMode} />
		</div>
		<div class="flex gap-4">
			{#each statistic as [count, title]}
				<div
					class={clsx(
						'items-center flex flex-col px-4 py-2 childs:bg-transparent rounded-xl',
						editMode ? 'bg-main/30' : 'bg-contrast/20 text-text'
					)}
				>
					<p class="text-3xl font-bold leading-8">
						{count}
					</p>
					<p>{title}</p>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex flex-col items-center text-center w-full bg-transparent">
		<Textarea
			placeholder={user.name}
			readonly={!editMode}
			class={clsx('!text-4xl font-bold !bg-transparent', !editMode && '!opacity-100 !text-text')}
			value={user.name}
		/>
		<Textarea
			placeholder="Добавьте описание"
			value={!editMode && !user.description ? 'Описание отсутствует' : user.description}
			class={clsx('w-full !text-lg !bg-transparent', !editMode && '!opacity-100 !text-text')}
			readonly={!editMode}
		/>
	</div>
	<div class="flex gap-2 bg-transparent">
		{#if me}
			{#if editMode}
				<ColorPicker
					popoverAlign="left"
					lightRange={[10, 80]}
					saturateRange={[10, 90]}
					color={$bodyColorStore}
					{saturate}
					{light}
					on:change={setColor}
					let:click
				>
					<Button size="lg" variant="main" on:click={click} class="bg-main !text-text">
						Цвет
					</Button>
				</ColorPicker>
				<Button size="lg" variant="secondary" on:click={saveProfile} {loading}>
					Сохранить
				</Button>
				<Button
					class="!text-red-500"
					size="lg"
					variant="secondary"
					on:click={() => (editMode = false)}
				>
					Отмена
				</Button>
			{:else}
				<Button
					size="lg"
					class="gap-3 bg-contrast text-text"
					variant="ghost"
					on:click={() => (editMode = true)}
				>
					<Icon type={Cog6Tooth} class="w-6 h-6" />
					<p class="mr-1">Настройки профиля</p>
				</Button>
				<Button
					class="text-red-500 bg-contrast"
					size="lg"
					variant="ghost"
					on:click={handleSignOut}
				>
					Выйти
				</Button>
			{/if}
		{:else}
			<Button size="lg" variant="ghost" class="gap-3 bg-white" on:click={handleSubscribe}>
				<Icon type={UserPlus} class="w-6 h-6" />
				<p class="mr-1">Подписаться</p>
			</Button>
		{/if}
	</div>
</div>

<style lang="postcss">
	.screen-hd {
		@apply max-hd:w-[30rem];
	}
	.screen-xl {
		@apply max-hd:gap-10 max-xl:w-[24rem] max-xl:p-6;
	}
	.screen-md {
		@apply max-md:static max-md:w-full max-md:gap-8;
	}
</style>

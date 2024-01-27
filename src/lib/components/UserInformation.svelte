<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import clsx from 'clsx';
	import { Cog6Tooth, UserMinus, UserPlus } from 'svelte-heros-v2';

	import type { IUser } from '$lib/types';

	import Icon from '$lib/components/Icon.svelte';
	import ProfileAvatar from '$lib/components/ProfileAvatar.svelte';
	import {
		signOutUser,
		subscribeProfile,
		unsubscribeProfile,
		updateProfile
	} from '$lib/requests/user';
	import { bodyColorStore } from '$lib/stores/main';
	import { Button, ColorPicker, Contenteditable } from '$UI';

	export let user: IUser;
	export let me: boolean;
	export let statistic: Array<Array<string>>;

	let editMode = false;
	let light = 80;
	let saturate = 90;
	let loading = false;

	const handleUnsubscribe = async () => {
		loading = true;

		try {
			await unsubscribeProfile(user.userId);
			await invalidateAll();
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	};
	const handleSubscribe = async () => {
		if ($page.data.session && $page.data.session.userId !== user.userId) {
			loading = true;

			try {
				await subscribeProfile(user.userId);
				await invalidateAll();
			} catch (e) {
				console.error(e);
			} finally {
				loading = false;
			}
		} else {
			goto('/signin');
		}
	};

	const setColor = ({ detail }: CustomEvent) => {
		$bodyColorStore = detail.color;
	};

	const cancelEdit = () => {
		$bodyColorStore = user.color;
		editMode = false;
	};

	const handleSignOut = async () => {
		try {
			await signOutUser();

			goto('/', {
				invalidateAll: true,
				replaceState: true
			});
		} catch (e) {
			console.error(e);
		}
	};

	const saveProfile = async () => {
		loading = true;

		try {
			await updateProfile(user.name, user.description, $bodyColorStore);
			await invalidateAll();
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
			editMode = false;
		}
	};
</script>

<div
	class={clsx(
		'screen-md screen-xl screen-hd screen-sm sticky top-8 flex w-[36rem] shrink-0 select-none flex-col items-center gap-12 rounded-3xl p-9 transition-colors',
		editMode ? 'bg-main-20' : 'bg-transparent'
	)}
>
	<div class="flex flex-col items-center gap-2 bg-transparent">
		<div class="p-6">
			<ProfileAvatar color={$bodyColorStore} {editMode} {user} />
		</div>
		<div
			class={clsx(
				'flex w-full gap-2 rounded-xl p-4 text-text childs:bg-transparent',
				!editMode && 'bg-contrast/10'
			)}
		>
			{#each statistic as [count, title]}
				<div class="flex w-24 flex-col items-center">
					<p class="text-3xl font-bold">
						{count === '0' ? 'Нет' : count}
					</p>
					<p>{title}</p>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex w-full flex-col items-center bg-transparent">
		<Contenteditable
			bind:html={user.name}
			class="!bg-transparent !text-center !text-4xl font-bold text-text"
			placeholder="Никнейм"
			readonly={!editMode}
		/>
		{#if editMode || user.description}
			<Contenteditable
				bind:html={user.description}
				class="w-full !bg-transparent !text-center !text-lg text-text"
				placeholder="Добавьте описание"
				readonly={!editMode}
			/>
		{:else}
			<p class="px-4 py-2 text-lg text-text/50">Описание отсутствует</p>
		{/if}
	</div>
	<div class="flex gap-2 bg-transparent">
		{#if me}
			{#if editMode}
				<ColorPicker
					color={$bodyColorStore}
					let:click
					{light}
					lightRange={[20, 80]}
					on:change={setColor}
					popoverAlign="left"
					{saturate}
					saturateRange={[10, 90]}
				>
					<Button class="bg-main !text-text" on:click={click} size="lg" variant="main">
						Цвет
					</Button>
				</ColorPicker>
				<Button
					class="bg-main text-text"
					{loading}
					on:click={saveProfile}
					size="lg"
					variant="ghost"
				>
					Сохранить
				</Button>
				<Button class="bg-main !text-red-500" on:click={cancelEdit} size="lg" variant="ghost">
					Отмена
				</Button>
			{:else}
				<Button
					class="gap-3 bg-contrast text-text"
					on:click={() => (editMode = true)}
					size="lg"
					variant="ghost"
				>
					<Icon class="h-6 w-6" type={Cog6Tooth} />
					<p class="mr-1">Настройки профиля</p>
				</Button>
				<Button
					class="bg-contrast text-red-500"
					on:click={handleSignOut}
					size="lg"
					variant="ghost"
				>
					Выйти
				</Button>
			{/if}
		{:else if $page.data.session && $page.data.session.subscriptions.includes(user.userId)}
			<Button
				class="gap-3 bg-white"
				{loading}
				on:click={handleUnsubscribe}
				size="lg"
				variant="ghost"
			>
				<Icon class="h-6 w-6" type={UserMinus} />
				<p class="mr-1">Отписаться</p>
			</Button>
		{:else}
			<Button
				class="gap-3 bg-white"
				{loading}
				on:click={handleSubscribe}
				size="lg"
				variant="ghost"
			>
				<Icon class="h-6 w-6" type={UserPlus} />
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

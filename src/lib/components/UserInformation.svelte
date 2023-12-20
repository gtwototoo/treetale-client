<script lang="ts">
	import clsx from 'clsx';
	import { Cog6Tooth, UserMinus, UserPlus } from 'svelte-heros-v2';

	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import ProfileAvatar from '$lib/components/ProfileAvatar.svelte';
	import {
		signOutUser,
		subscribeProfile,
		unsubscribeProfile,
		updateProfile
	} from '$lib/requests/user';
	import { bodyColorStore } from '$lib/stores/main';
	import type { IUser } from '$lib/types';
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
			<ProfileAvatar {user} {editMode} color={$bodyColorStore} />
		</div>
		<div class="flex gap-4">
			{#each statistic as [count, title]}
				<div
					class={clsx(
						'flex flex-col items-center rounded-xl px-4 py-2 text-text childs:bg-transparent',
						editMode ? 'bg-main/50' : 'bg-contrast/20'
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
	<div class="flex w-full flex-col items-center bg-transparent">
		<Contenteditable
			bind:html={user.name}
			placeholder="Добавьте описание"
			class="!bg-transparent !text-center !text-4xl font-bold text-text"
			readonly={!editMode}
		/>
		{#if editMode || user.description}
			<Contenteditable
				bind:html={user.description}
				placeholder="Добавьте описание"
				class="w-full !bg-transparent !text-center !text-lg text-text"
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
					popoverAlign="left"
					lightRange={[20, 80]}
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
				<Button
					size="lg"
					variant="ghost"
					class="bg-main text-text"
					on:click={saveProfile}
					{loading}
				>
					Сохранить
				</Button>
				<Button class="bg-main !text-red-500" size="lg" variant="ghost" on:click={cancelEdit}>
					Отмена
				</Button>
			{:else}
				<Button
					size="lg"
					class="gap-3 bg-contrast text-text"
					variant="ghost"
					on:click={() => (editMode = true)}
				>
					<Icon type={Cog6Tooth} class="h-6 w-6" />
					<p class="mr-1">Настройки профиля</p>
				</Button>
				<Button
					class="bg-contrast text-red-500"
					size="lg"
					variant="ghost"
					on:click={handleSignOut}
				>
					Выйти
				</Button>
			{/if}
		{:else if $page.data.session && $page.data.session.subscriptions.includes(user.userId)}
			<Button
				size="lg"
				variant="ghost"
				{loading}
				class="gap-3 bg-white"
				on:click={handleUnsubscribe}
			>
				<Icon type={UserMinus} class="h-6 w-6" />
				<p class="mr-1">Отписаться</p>
			</Button>
		{:else}
			<Button
				size="lg"
				variant="ghost"
				{loading}
				class="gap-3 bg-white"
				on:click={handleSubscribe}
			>
				<Icon type={UserPlus} class="h-6 w-6" />
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

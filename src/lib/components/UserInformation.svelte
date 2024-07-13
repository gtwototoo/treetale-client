<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import clsx from 'clsx';
	import { Cog6Tooth, UserMinus, UserPlus } from 'svelte-heros-v2';

	import type { RGB, User } from '$lib/types';

	import ProfileAvatar from '$lib/components/ProfileAvatar.svelte';
	import {
		signOutUser,
		subscribeProfile,
		unsubscribeProfile,
		updateProfile
	} from '$lib/requests/user';
	import { bodyColorStore } from '$lib/stores/main';
	import { Button, ColorPicker, Contenteditable, Icon } from 'treetale-ui';

	import InvisibleDrop from './InvisibleDrop.svelte';

	let {
		user,
		me,
		statistic
	}: {
		user: User;
		me: boolean;
		statistic: string[][];
	} = $props();

	let editMode = $state(false);
	let light = $state(80);
	let saturate = $state(90);
	let loading = $state(false);

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

	const setColor = (color: RGB) => {
		$bodyColorStore = color;
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
		'screen-lg screen-xl screen-hd screen-sm sticky top-8 flex w-[36rem] shrink-0 select-none flex-col items-center gap-12 rounded-3xl p-9 transition-colors',
		editMode ? 'bg-main-20' : 'bg-transparent'
	)}
>
	{#if editMode}
		<InvisibleDrop>Перетащите сюда изображение, чтобы заменить текущую аватарку</InvisibleDrop>
	{/if}
	<div class="flex flex-col items-center gap-2 bg-transparent">
		<div class="p-6">
			<ProfileAvatar color={$bodyColorStore} {editMode} {user} />
		</div>
		<div
			class={clsx(
				'flex w-full gap-2 rounded-xl p-4 text-text *:bg-transparent',
				!editMode && 'bg-contrast/10'
			)}
		>
			{#each statistic as [count, title] (title)}
				<div class="flex w-24 flex-col items-center">
					<p class="text-3xl font-bold">
						{count === '0' ? 'Нет' : count}
					</p>
					<p class="text-sm">{title}</p>
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
					{light}
					onchange={setColor}
					align="left"
					{saturate}
				>
					{#snippet children({ onclick })}
						<Button class="bg-main !text-text" {onclick} size="lg">Цвет</Button>
					{/snippet}
				</ColorPicker>
				<Button class="bg-main text-text" {loading} onclick={saveProfile} size="lg">
					Сохранить
				</Button>
				<Button class="bg-main text-red-500" onclick={cancelEdit} size="lg">Отмена</Button>
			{:else}
				<Button class="gap-3 bg-contrast text-text" onclick={() => (editMode = true)} size="lg">
					<Icon class="size-6" this={Cog6Tooth} />
					<p class="mr-1">Настройки профиля</p>
				</Button>
				<Button class="bg-contrast text-red-500" onclick={handleSignOut} size="lg">
					Выйти
				</Button>
			{/if}
		{:else if $page.data.session && $page.data.session.subscriptions.includes(user.userId)}
			<Button class="gap-3 bg-white" {loading} onclick={handleUnsubscribe} size="lg">
				<Icon class="size-6" this={UserMinus} />
				<p class="mr-1">Отписаться</p>
			</Button>
		{:else}
			<Button class="gap-3 bg-white" {loading} onclick={handleSubscribe} size="lg">
				<Icon class="size-6" this={UserPlus} />
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
	.screen-lg {
		@apply max-lg:static max-lg:w-full max-lg:gap-8;
	}
</style>

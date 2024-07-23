<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import clsx from 'clsx';
	import { Cog6Tooth, UserMinus, UserPlus } from 'svelte-heros-v2';
	import { Button, ColorPicker, Contenteditable, Icon } from 'treetale-ui';

	import type { RGB, User } from '$lib/types';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import {
		signOutUser,
		subscribeProfile,
		unsubscribeProfile,
		updateProfile
	} from '$lib/requests/user';
	import { bodyBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

	import InvisibleDrop from './InvisibleDrop.svelte';
	import ProfileAvatar from './ProfileAvatar.svelte';

	let {
		me,
		statistic,
		user
	}: {
		me: boolean;
		statistic: string[][];
		user: User;
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
		bodyBackgroundColorStore.color = color;
	};

	const cancelEdit = () => {
		bodyBackgroundColorStore.color = user.color || DEFAULT_COLOR;
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
			await updateProfile(user.name, user.description, bodyBackgroundColorStore.color);
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
	<div class="flex flex-col items-center gap-2">
		<div class="p-6">
			<ProfileAvatar
				color={bodyBackgroundColorStore.color}
				{editMode}
				size="lg"
				src={user.imageUrl}
				alt={user.name}
			/>
		</div>
		<div
			class={clsx('flex w-full gap-2 rounded-xl p-4 text-text', !editMode && 'bg-contrast/10')}
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
	<div class="flex w-full flex-col items-center">
		<Contenteditable
			bind:html={user.name}
			class={clm(
				'bg-transparent text-center text-4xl font-bold text-text',
				!editMode && 'pointer-events-none'
			)}
			placeholder="Никнейм"
			readonly={!editMode}
		/>
		{#if editMode || user.description}
			<Contenteditable
				bind:html={user.description}
				class={clm(
					'w-full bg-transparent text-center text-lg text-text',
					!editMode && 'pointer-events-none'
				)}
				placeholder="Добавьте описание"
				readonly={!editMode}
			/>
		{:else}
			<p class="px-4 text-lg/10 text-text/50">Описание отсутствует</p>
		{/if}
	</div>
	<div class="flex gap-2">
		{#if me}
			{#if editMode}
				<ColorPicker
					color={bodyBackgroundColorStore.color}
					{light}
					onchange={setColor}
					align="left"
					{saturate}
				>
					{#snippet children({ onclick })}
						<Button class="bg-main-70 text-text hover:bg-main" {onclick} size="lg">
							Цвет
						</Button>
					{/snippet}
				</ColorPicker>
				<Button
					class="bg-main-70 text-text hover:bg-main"
					{loading}
					onclick={saveProfile}
					size="lg"
				>
					Сохранить
				</Button>
				<Button class="bg-main-70 text-red-500 hover:bg-main" onclick={cancelEdit} size="lg">
					Отмена
				</Button>
			{:else}
				<Button
					class="gap-3 bg-main-40 text-text hover:bg-contrast"
					onclick={() => (editMode = true)}
					size="lg"
				>
					<Icon class="size-6" this={Cog6Tooth} />
					<p class="mr-1">Настройки профиля</p>
				</Button>
				<Button
					class="bg-main-40 text-red-500 hover:bg-contrast"
					onclick={handleSignOut}
					size="lg"
				>
					Выйти
				</Button>
			{/if}
		{:else if $page.data.session && $page.data.session.subscriptions.includes(user.userId)}
			<Button
				class="gap-3 bg-main-40 text-text hover:bg-contrast"
				{loading}
				onclick={handleUnsubscribe}
				size="lg"
			>
				<Icon class="size-6" this={UserMinus} />
				<p class="mr-1">Отписаться</p>
			</Button>
		{:else}
			<Button
				class="gap-3 bg-main-40 text-text hover:bg-contrast"
				{loading}
				onclick={handleSubscribe}
				size="lg"
			>
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

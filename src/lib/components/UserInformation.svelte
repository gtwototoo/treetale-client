<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';

	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import clsx from 'clsx';
	import { User, UserMinus, UserPlus } from 'svelte-heros-v2';
	import { Button, ColorPicker, Contenteditable, Icon } from 'treetale-ui';

	import type { RGB } from '$lib/types';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { AVATARS_FOLDER } from '$lib/constants/s3forders';
	import { saveImage } from '$lib/requests/files';
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
	let base64src = $state<null | string>(null);
	let addLoading = $state(false);

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

	const preSaveImage = async (file: File): Promise<void> => {
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onloadend = () => {
			if (!reader.result) return;

			base64src = reader.result.toString();
		};

		try {
			const { fileUrl } = await saveImage(file, AVATARS_FOLDER);

			user.imageUrl = fileUrl;
		} catch (e) {
			console.error(e);
		}
	};

	const handleDrop = (files: File[]) => {
		const file = files[0];

		preSaveImage(file);
	};

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		if (!(e.target instanceof HTMLInputElement) || !e.target.files) {
			return;
		}

		const file = e.target.files[0];

		preSaveImage(file);
	};
</script>

<div
	class={clsx(
		'screen-lg screen-xl screen-hd screen-sm sticky top-8 flex w-[36rem] shrink-0 select-none flex-col items-center gap-12 rounded-3xl p-9 transition-colors',
		editMode ? 'bg-main-20' : 'bg-transparent'
	)}
>
	{#if editMode}
		<InvisibleDrop onchange={handleDrop}>
			<Icon class="h-24 w-auto *:fill-gradient" this={User} variation="solid" />
			<p>Перетащите сюда изображение, чтобы заменить текущую аватарку</p>
		</InvisibleDrop>
	{/if}
	<div class="flex flex-col items-center gap-2">
		<div class="p-6">
			<ProfileAvatar
				onchange={handleChange}
				color={bodyBackgroundColorStore.color}
				{editMode}
				bind:addLoading
				bind:base64src
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
					Редактировать
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
		@apply max-lg:relative max-lg:top-0 max-lg:w-full max-lg:gap-8;
	}
</style>

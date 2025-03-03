<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import type { ChangeEventHandler } from 'svelte/elements';

	import { User as UserIcon, UserMinus, UserPlus } from 'svelte-heros-v2';
	import { Button, ColorPicker, Contenteditable, Icon, Input, Modal } from 'treetale-ui';

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
	import type { RGB, User } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';

	import InvisibleDrop from './InvisibleDrop.svelte';
	import ProfileAvatar from './ProfileAvatar.svelte';

	const {
		me,
		statistic,
		user
	}: {
		me: boolean;
		statistic: string[][];
		user: User;
	} = $props();

	let userState = $state(user);
	let exitModal = $state(false);
	let editMode = $state(false);
	let light = $state(80);
	let saturate = $state(90);
	let loading = $state(false);
	let base64src = $state<string>('');
	let addLoading = $state(false);

	const handleUnsubscribe = async () => {
		loading = true;

		try {
			await unsubscribeProfile(userState.userId);
			await invalidateAll();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	};
	const handleSubscribe = async () => {
		if (page.data.session && page.data.session.userId !== userState.userId) {
			loading = true;

			try {
				await subscribeProfile(userState.userId);
				await invalidateAll();
			} catch (error) {
				console.error(error);
			} finally {
				loading = false;
			}
		} else {
			await goto('/signin');
		}
	};

	const setColor = (color: RGB) => {
		bodyBackgroundColorStore.color = color;
	};

	const cancelEdit = () => {
		bodyBackgroundColorStore.color = userState.color || DEFAULT_COLOR;
		editMode = false;
	};

	const handleSignOut = async () => {
		try {
			await signOutUser();

			await goto('/', {
				invalidateAll: true,
				replaceState: true
			});
		} catch (error) {
			console.error(error);
		}
	};

	const saveProfile = async () => {
		loading = true;

		try {
			await updateProfile(
				userState.linkName,
				userState.name,
				userState.description,
				bodyBackgroundColorStore.color
			);
			await invalidateAll();
		} catch (error) {
			console.error(error);
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
			const { message } = await saveImage(file, AVATARS_FOLDER);

			userState.imageUrl = message.fileUrl;
		} catch (error) {
			console.error(error);
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
	class={clm(
		'screen-lg screen-xl screen-hd screen-sm sticky top-8 z-10 flex w-[36rem] shrink-0 flex-col items-center gap-12 rounded-3xl p-9 select-none',
		editMode ? 'bg-contrast' : 'bg-transparent'
	)}
>
	{#if editMode}
		<InvisibleDrop onchange={handleDrop}>
			<Icon class="*:fill-gradient h-24 w-auto" this={UserIcon} variation="solid" />
			<p>Перетащите сюда изображение, чтобы заменить текущую аватарку</p>
		</InvisibleDrop>
	{/if}
	<div class="flex w-full max-w-96 flex-col items-center justify-center gap-2">
		<div class="p-6">
			<ProfileAvatar
				onchange={handleChange}
				color={bodyBackgroundColorStore.color}
				{editMode}
				bind:addLoading
				bind:base64src
				size="lg"
				src={userState.imageUrl}
				alt={userState.name}
			/>
		</div>
		{#if editMode}
			<div class="flex gap-3 py-5 lg:w-full">
				<Input
					placeholder="Короткая ссылка"
					maxlength={20}
					size="lg"
					bind:value={userState.linkName}
					class="w-full"
				/>
				<ColorPicker
					color={bodyBackgroundColorStore.color}
					{light}
					onchange={setColor}
					align="right"
					{saturate}
				>
					{#snippet children({ onclick })}
						<Button class="bg-main-700 text-text hover:bg-main" {onclick} size="lg">
							Цвет
						</Button>
					{/snippet}
				</ColorPicker>
			</div>
		{:else}
			<div class="bg-main-300 text-text flex gap-2 rounded-xl p-4">
				{#each statistic as [count, title] (title)}
					<div class="flex w-24 flex-col items-center">
						<p class="text-3xl font-bold">
							{count === '0' ? 'Нет' : count}
						</p>
						<p class="text-sm">{title}</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
	<div class="flex w-full max-w-96 flex-col items-center gap-2">
		<Contenteditable
			bind:html={userState.name}
			size="lg"
			class={clm(
				'text-text w-full bg-transparent text-center text-4xl font-bold',
				!editMode && 'pointer-events-none ring-0'
			)}
			placeholder="Псевдоним"
			readonly={!editMode}
		/>
		{#if editMode || userState.description}
			<Contenteditable
				size="lg"
				bind:html={userState.description}
				class={clm(
					'text-text w-full bg-transparent text-center text-lg',
					!editMode && 'pointer-events-none ring-0'
				)}
				placeholder="Добавьте описание"
				readonly={!editMode}
			/>
		{:else}
			<p class="text-text/50 px-4 text-lg leading-[3.25rem]">Описание отсутствует</p>
		{/if}
	</div>
	<div class="flex gap-2">
		{#if me}
			{#if editMode}
				<Button
					class="bg-main-500 text-text hover:bg-main-700"
					{loading}
					onclick={saveProfile}
					size="lg"
				>
					Сохранить
				</Button>
				<Button class="bg-main-500 hover:bg-main-700 text-red-500" onclick={cancelEdit} size="lg">
					Отмена
				</Button>
			{:else}
				<Button
					class="bg-main-500 text-text hover:bg-main-700"
					onclick={() => (editMode = true)}
					size="lg"
				>
					Редактировать
				</Button>
				<Button
					class="bg-main-500 hover:bg-main-700 text-red-500"
					onclick={() => (exitModal = true)}
					size="lg"
				>
					Выйти
				</Button>
				<Modal
					bind:active={exitModal}
					class="bg-main-300 text-text flex flex-col items-center gap-8 p-8"
				>
					<p>Вы действительно хотите выйти из профиля?</p>
					<div class="flex gap-2">
						<Button
							class="bg-main-500 text-text hover:bg-main-700 justify-center"
							size="lg"
							onclick={() => (exitModal = false)}
						>
							Отмена
						</Button>
						<Button
							class="bg-main-500 hover:bg-main-700 justify-center text-red-500"
							size="lg"
							onclick={handleSignOut}
						>
							Выйти
						</Button>
					</div>
				</Modal>
			{/if}
		{:else if page.data.session && page.data.session.subscriptions.includes(userState.userId)}
			<Button
				class="bg-main-500 text-text hover:bg-main-700 gap-3"
				{loading}
				onclick={handleUnsubscribe}
				size="lg"
			>
				<Icon class="size-6" this={UserMinus} />
				<p class="mr-1">Отписаться</p>
			</Button>
		{:else}
			<Button
				class="bg-main-500 text-text hover:bg-main-700 gap-3"
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
	@reference "../../app.css";
	
	.screen-hd {
		@apply max-2xl:w-[30rem];
	}
	.screen-xl {
		@apply max-2xl:gap-10 max-xl:w-[24rem] max-xl:p-6;
	}
	.screen-lg {
		@apply max-lg:relative max-lg:top-0 max-lg:w-full max-lg:gap-8;
	}
</style>

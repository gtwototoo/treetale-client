<script lang="ts">
	import { Button } from '$UI';
	import Textarea from '$UI/Textarea.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import ProfileAvatar from '$lib/components/ProfileAvatar.svelte';
	import { signOutUser } from '$lib/requests/user';
	import type { IUser } from '$lib/types';
	import clsx from 'clsx';

	import { Cog6Tooth, UserPlus } from 'svelte-heros-v2';

	export let user: IUser;
	export let me: boolean;
	export let statistic: string[][];

	let editMode = false;

	const handleSubscribe = () => {
		if ($page.data.session) {
			alert('Coming soon');
		} else {
			goto('/signin');
		}
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
						editMode ? 'bg-main/30' : 'bg-white/20'
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
			class={clsx('!text-4xl font-bold !bg-transparent', !editMode && '!opacity-100')}
			value={user.name}
		/>
		<Textarea
			placeholder="Добавьте описание"
			value={!editMode && !user.description ? 'Описание отсутствует' : user.description}
			class={clsx('w-full !text-lg !bg-transparent', !editMode && '!opacity-100')}
			readonly={!editMode}
		/>
	</div>
	<div class="flex gap-2">
		{#if me}
			{#if editMode}
				<Button size="lg" variant="secondary" on:click={() => (editMode = false)}>
					Сохранить изменения
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
					class="gap-3 bg-white"
					variant="ghost"
					on:click={() => (editMode = true)}
				>
					<Icon type={Cog6Tooth} class="w-6 h-6" />
					<p class="mr-1">Настройки профиля</p>
				</Button>
				<Button
					class="text-red-500 bg-white"
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

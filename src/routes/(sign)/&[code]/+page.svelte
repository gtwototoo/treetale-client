<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { signUpUser } from '$lib/requests/user';
	import { bodyColorStore } from '$lib/stores/main';
	import type { IResponseResult } from '$lib/types';
	import { rootStyle } from '$lib/utils';
	import { Button, Input } from '$UI';
	import type { HttpError } from '@sveltejs/kit';
	import clsx from 'clsx';
	import { Check, XMark } from 'svelte-heros-v2';
	import { fade } from 'svelte/transition';

	let name = '';
	let loading = false;
	let result: IResponseResult = null;

	const handleSignUp = async () => {
		if (disabled || loading) {
			return;
		}

		loading = true;

		try {
			await signUpUser(name, $page.params.code);

			goto('/profile', {
				replaceState: true,
				invalidateAll: true
			});
		} catch (e) {
			const error = e as HttpError;

			console.error(error);

			result = {
				error: true,
				text: error.body.message
			};
		} finally {
			loading = false;
		}
	};

	$: disabled = !name;

	$bodyColorStore = DEFAULT_COLOR;
</script>

<svelte:head>
	<title>Завершение регистрации</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<div class="flex h-full w-full items-start justify-center">
	<div class="flex min-h-full items-center p-4 max-sm:p-3">
		<ReadCard
			src="/img/auth.png"
			alt="Завершение регистрации"
			text="Для завершения регистрации введите свой псевдоним, под которым вы будете отображаться в проекте"
		>
			<form
				class="flex w-full flex-col gap-3"
				method="POST"
				on:submit|preventDefault={handleSignUp}
			>
				<Input
					placeholder="Псевдоним"
					class="adaptive-font adaptive-padding w-full"
					bind:value={name}
				/>
				{#if result !== null}
					<div
						in:fade
						class={clsx(
							'adaptive-font adaptive-padding flex w-full select-none items-center gap-3 rounded-lg',
							result.error ? 'bg-red-200 text-red-500' : 'bg-emerald-200 text-emerald-500'
						)}
					>
						<Icon type={result.error ? XMark : Check} class="h-6 w-6" />
						{result.error ? result.text : 'Регистрация завершена'}
					</div>
				{:else}
					<Button
						variant="main"
						type="submit"
						class="adaptive-font adaptive-padding w-full bg-main text-text"
						{disabled}
						{loading}
					>
						Завершить регистрацию
					</Button>
				{/if}
			</form>
		</ReadCard>
	</div>
</div>

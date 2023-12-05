<script lang="ts">
	import type { HttpError } from '@sveltejs/kit';
	import clsx from 'clsx';

	import { Button, Input } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { DEFAULT_COLOR, NOT_FOUND_VARIANTS } from '$lib/constants';
	import { signInUser } from '$lib/requests/user';
	import { bodyColorStore } from '$lib/stores/main';
	import type { IResponseResult } from '$lib/types';
	import { rootStyle } from '$lib/utils';
	import { Check, XMark } from 'svelte-heros-v2';
	import { fade } from 'svelte/transition';

	let value = '';
	let loading = false;
	let result: IResponseResult = null;

	const { img: contentCardImage } = NOT_FOUND_VARIANTS[0];

	const handleSignIn = async () => {
		if (disabled || loading) {
			return;
		}

		loading = true;

		try {
			const response = await signInUser(value);

			if (response) {
				result = {
					error: false,
					text: response.message
				};
			} else {
				location.reload();
			}
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

	$bodyColorStore = DEFAULT_COLOR;

	$: disabled = !value;
</script>

<svelte:head>
	<title>Авторизация</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<div class="flex h-full w-full items-start justify-center">
	<div class="flex min-h-full items-center p-4 max-sm:p-2">
		<ReadCard
			src={contentCardImage}
			alt="Авторизация"
			text="Войдите или зарегистрируйтесь - к вам на почту придет письмо с подтверждением"
		>
			<form
				method="POST"
				on:submit|preventDefault={handleSignIn}
				class="flex w-full flex-col gap-3"
			>
				<Input
					placeholder="Почта или логин"
					class="adaptive-font adaptive-padding w-full"
					bind:value
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
						{result.error ? result.text : 'Письмо успешно отправлено'}
					</div>
				{:else}
					<Button
						variant="ghost"
						type="submit"
						class="adaptive-font adaptive-padding w-full bg-main text-text"
						{disabled}
						{loading}
					>
						Войти по ссылке
					</Button>
				{/if}
			</form>
		</ReadCard>
	</div>
</div>

<style lang="postcss">
	.message {
		@apply pointer-events-none absolute top-full mt-8 w-full select-none text-center text-xs;
	}
</style>

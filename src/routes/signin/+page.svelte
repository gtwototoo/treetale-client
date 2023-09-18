<script lang="ts">
	import { Button, Input } from '$UI';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { DEFAULT_COLOR, NOT_FOUND_VARIANTS } from '$lib/constants';
	import { signInUser } from '$lib/requests/user';
	import { bodyColorStore } from '$lib/stores/main';
	import { rootStyle } from '$lib/utils';
	import type { HttpError } from '@sveltejs/kit';
	import clsx from 'clsx';
	import { fade } from 'svelte/transition';

	let value = '';
	let loading = false;
	let message: { error: boolean; text: string } | null = null;

	const { img: contentCardImage } = NOT_FOUND_VARIANTS[0];

	const handleSignIn = async () => {
		if (disabled || loading) {
			return;
		}

		loading = true;

		try {
			const response = await signInUser(value);

			if (response) {
				message = {
					error: false,
					text: response.message
				};
			} else {
				location.reload();
			}
		} catch (e) {
			const error = e as HttpError;

			message = {
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

<div class="flex w-full h-full justify-center items-start px-12">
	<div class="flex min-h-full items-center py-12">
		<ReadCard
			src={contentCardImage}
			alt="Авторизация"
			text="Войдите или зарегистрируйтесь - к вам на почту придет письмо с подтверждением"
		>
			<form
				method="POST"
				on:submit|preventDefault={handleSignIn}
				class="flex flex-col gap-3 w-full"
			>
				<Input
					placeholder="Почта или логин"
					class={clsx('w-full adaptive-font adaptive-padding')}
					bind:value
				/>
				<Button
					variant="main"
					type="submit"
					class={clsx('w-full bg-emerald-300 adaptive-font adaptive-padding')}
					{disabled}
					{loading}
				>
					Войти по ссылке
				</Button>
				{#if message && message.text}
					<div
						in:fade
						class={clsx('message', message.error ? 'text-red-600' : 'text-emerald-600')}
					>
						{message.text}
					</div>
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

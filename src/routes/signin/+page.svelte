<script lang="ts">
	import { Button, Input } from '$UI';
	import { PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { DEFAULT_COLOR, NOT_FOUND_VARIANTS } from '$lib/constants';
	import { signInUser } from '$lib/requests/user';
	import { bodyColorStore } from '$lib/stores/main';
	import { rootStyle } from '$lib/utils';
	import type { HttpError } from '@sveltejs/kit';
	import clsx from 'clsx';
	import { onMount } from 'svelte';
	import { Turnstile } from 'svelte-turnstile';
	import { fade } from 'svelte/transition';

	const { img: contentCardImage } = NOT_FOUND_VARIANTS[0];

	let value = '';
	let loading = false;
	let message: { error: boolean; text: string } | null = null;

	let reset: () => void | undefined;
	let turnstileToken: string | undefined = undefined;

	$: disabled = !value;

	const handleCallback = ({ detail }: CustomEvent<{ token: string }>) => {
		turnstileToken = detail.token;
		message = null;
	};

	const handleSignIn = async () => {
		if (!turnstileToken || disabled || loading) {
			return;
		}

		loading = true;

		try {
			const response = await signInUser(value, turnstileToken);

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

			if (error.status === 422) {
				turnstileToken = undefined;
				reset();
			}

			message = {
				error: true,
				text: error.body.message
			};
		} finally {
			loading = false;
		}
	};

	onMount(() => {
		message = {
			error: true,
			text: 'Проверяем, что вы человек'
		};
	});

	$bodyColorStore = DEFAULT_COLOR;
</script>

<svelte:head>
	<title>Авторизация</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<ReadCard
	src={contentCardImage}
	alt="Авторизация"
	text="Если вы новый пользователь, введите свою почту, чтобы получить ссылку на регистрацию. Если вы уже зарегистированы, можете ввести как почту, так и свой псевдоним и к вам на почту придет ссылка на вход."
>
	<form class="cardButtons relative" method="POST" on:submit|preventDefault={handleSignIn}>
		<Input placeholder="Псевдоним или почта" class="w-full text-center" size="lg" bind:value />
		<Turnstile
			siteKey={PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
			on:turnstile-callback={handleCallback}
			bind:reset
		/>
		<Button
			variant="main"
			type="submit"
			class="w-full justify-center gap-4 bg-emerald-500"
			size="xl"
			{disabled}
			{loading}
		>
			Войти по ссылке
		</Button>
		{#if message && message.text}
			<div in:fade class={clsx('message', message.error ? 'text-red-600' : 'text-emerald-600')}>
				{message.text}
			</div>
		{/if}
	</form>
</ReadCard>

<style lang="postcss">
	.message {
		@apply pointer-events-none absolute top-full mt-8 w-full select-none text-center text-xs;
	}
</style>

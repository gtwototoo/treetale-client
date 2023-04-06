<script lang="ts">
	import { browser } from '$app/environment';
	import { PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { DEFAULT_COLOR, NOT_FOUND_VARIANTS } from '$lib/constants';
	import { signInUser } from '$lib/requests/user';
	import { rootStyle } from '$lib/utils';
	import { Button, Input } from '$UI';
	import clsx from 'clsx';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const [{ img: contentCardImage }] = NOT_FOUND_VARIANTS;

	let value: string = '';
	let loading: boolean = false;
	let message: { error: boolean; text: string } | null = null;

	let turnstileLoaded = browser ? Object.hasOwn(window, 'turnstile') : false;
	let turnstileElement: HTMLDivElement | undefined = undefined;
	let turnstileWidgetId: string | undefined = undefined;
	let turnstileToken: string | undefined = undefined;
	let mounted = false;

	$: disabled = !value;

	const handleSignIn = async () => {
		if (!turnstileToken || disabled || loading) {
			return;
		}

		try {
			loading = true;

			const { error, response, status } = await signInUser(value, turnstileToken);

			if (status === 422) {
				turnstileToken = undefined;

				window.turnstile.reset(turnstileWidgetId);
			}

			if (error) throw error;
			if (response)
				message = {
					error: response.error,
					text: response.message
				};
			else {
				location.reload();
			}
		} catch ({ body }) {
			message = {
				error: body.error,
				text: body.message
			};
		} finally {
			loading = false;
		}
	};

	const onTurnstileReset = () => {
		turnstileToken = undefined;
		window.turnstile.reset(turnstileWidgetId);
	};

	const onTurnstileLoaded = () => {
		turnstileWidgetId = window.turnstile.render(turnstileElement, {
			sitekey: PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
			callback(token: string) {
				turnstileToken = token;
				message = null;
			},
			'expired-callback': onTurnstileReset,
			'error-callback': onTurnstileReset
		});

		message = {
			error: true,
			text: 'Проверяем, что вы человек'
		};
	};

	onMount(() => {
		mounted = true;

		if (turnstileLoaded) {
			onTurnstileLoaded();
		}
	});
</script>

<svelte:head>
	<title>Авторизация</title>
	{#if !turnstileLoaded && mounted}
		<script
			src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
			on:load={onTurnstileLoaded}
			async
		></script>
	{/if}
	{@html rootStyle(DEFAULT_COLOR)}
</svelte:head>

<ReadCard
	src={contentCardImage}
	alt="Авторизация"
	text="Если вы новый пользователь, введите свою почту, чтобы получить ссылку на регистрацию. Если вы уже зарегистированы, можете ввести как почту, так и свой псевдоним и к вам на почту придет ссылка на вход."
>
	<form class="cardButtons relative" method="POST" on:submit|preventDefault={handleSignIn}>
		<Input placeholder="Псевдоним или почта" class="w-full text-center" size="big" bind:value />
		<div bind:this={turnstileElement} />
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

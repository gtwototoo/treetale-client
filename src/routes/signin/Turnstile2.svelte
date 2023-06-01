<script context="module" lang="ts">
	interface TurnstileOptions {
		sitekey: string;
		action?: string;
		cData?: string;
		callback?: (token: string) => void;
		'error-callback'?: () => void;
		'expired-callback'?: () => void;
		theme?: 'light' | 'dark' | 'auto';
		tabindex?: number;
	}

	export interface Turnstile {
		render: (idOrContainer: string | HTMLElement, options: TurnstileOptions) => string;
		reset: (widgetIdOrContainer: string | HTMLElement) => void;
		getResponse: (widgetIdOrContainer: string | HTMLElement) => string | undefined;
		remove: (widgetIdOrContainer: string | HTMLElement) => void;
	}
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount } from 'svelte';

	export let turnstileToken: string | undefined = undefined;
	export let turnstileWidgetId: string | undefined = undefined;
	export let sitekey: string;

	const dispatch = createEventDispatcher();
	const src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

	let mounted = false;
	let turnstileLoaded = browser ? Object.hasOwn(window, 'turnstile') : false;
	let turnstileElement: HTMLDivElement | undefined = undefined;

	const onTurnstileReset = () => {
		turnstileToken = undefined;
		window.turnstile.reset(turnstileWidgetId);

		dispatch('change', 'error');
	};

	const onTurnstileLoaded = () => {
		turnstileWidgetId = window.turnstile.render(turnstileElement, {
			sitekey,
			callback(token: string) {
				turnstileToken = token;

				dispatch('change', 'success');
			},
			'expired-callback': onTurnstileReset,
			'error-callback': onTurnstileReset
		});

		dispatch('change', 'loaded');
	};

	onMount(() => {
		mounted = true;

		if (turnstileLoaded) onTurnstileLoaded();
	});
</script>

<svelte:head>
	{#if !turnstileLoaded && mounted}
		<script {src} on:load={onTurnstileLoaded} async></script>
	{/if}
</svelte:head>

<div bind:this={turnstileElement} />

<script lang="ts">
	import type { HttpError } from '@sveltejs/kit';
	import { fade } from 'svelte/transition';

	import clsx from 'clsx';
	import { Check, XMark } from 'svelte-heros-v2';
	import { MetaTags } from 'svelte-meta-tags';

	import type { IResponseResult } from '$lib/types';

	import { Button, Input } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { signInUser } from '$lib/requests/user';
	import { bodyColorStore } from '$lib/stores/main';
	import { rootStyle } from '$lib/utils';

	let value = '';
	let loading = false;
	let result: IResponseResult = null;

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
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<MetaTags title="Авторизация" />

<div class="flex size-full items-start justify-center">
	<div class="flex min-h-full items-center p-4 max-sm:p-3">
		<ReadCard
			alt="Авторизация"
			src="/img/writer.png"
			text={'Войдите или зарегистрируйтесь - к вам на почту придет письмо с подтверждением (Возможно в "Спам")'}
		>
			<form
				class="flex w-full flex-col gap-3"
				method="POST"
				on:submit|preventDefault={handleSignIn}
			>
				<Input
					bind:value
					class="adaptive-font adaptive-padding w-full"
					placeholder="Почта или логин"
				/>
				{#if result !== null}
					<div
						class={clsx(
							'adaptive-font adaptive-padding flex w-full select-none items-center gap-3 rounded-lg',
							result.error ? 'bg-red-200 text-red-500' : 'bg-emerald-200 text-emerald-500'
						)}
						in:fade
					>
						<Icon class="size-6" type={result.error ? XMark : Check} />
						{result.error ? result.text : 'Письмо успешно отправлено'}
					</div>
				{:else}
					<Button
						class="adaptive-font adaptive-padding w-full bg-main text-text"
						{disabled}
						{loading}
						type="submit"
						variant="ghost"
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

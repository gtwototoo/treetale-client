<script lang="ts">
	import type { HttpError } from '@sveltejs/kit';
	import { fade } from 'svelte/transition';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import clsx from 'clsx';
	import { Check, XMark } from 'svelte-heros-v2';

	import type { ResponseResult } from '$lib/types/response';

	import ReadCard from '$lib/components/ReadCard.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { signUpUser } from '$lib/requests/user';
	import { bodyColorStore } from '$lib/stores/main';
	import type { FormEventHandler } from 'svelte/elements';
	import { Button, Icon, Input } from 'treetale-ui';

	let name = $state('');
	let loading = $state(false);
	let result = $state<ResponseResult | null>(null);

	const handleSignUp: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		if (disabled || loading) {
			return;
		}

		loading = true;

		try {
			await signUpUser(name, $page.params.code);

			goto('/profile', {
				invalidateAll: true,
				replaceState: true
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

	let disabled = $derived(!name);

	$bodyColorStore = DEFAULT_COLOR;
</script>

<svelte:head>
	<title>Завершение регистрации</title>
</svelte:head>

<div class="flex size-full items-start justify-center">
	<div class="flex min-h-full items-center p-4 max-sm:p-3">
		<ReadCard
			alt="Завершение регистрации"
			src="/img/writer.png"
			text="Для завершения регистрации введите свой псевдоним, под которым вы будете отображаться в проекте"
		>
			<form class="flex w-full flex-col gap-3" method="POST" onsubmit={handleSignUp}>
				<Input
					bind:value={name}
					class="adaptive-font adaptive-padding w-full"
					placeholder="Псевдоним"
				/>
				{#if result !== null}
					<div
						class={clsx(
							'adaptive-font adaptive-padding flex w-full select-none items-center gap-3 rounded-lg',
							result.error ? 'bg-red-200 text-red-500' : 'bg-emerald-200 text-emerald-500'
						)}
						in:fade
					>
						<Icon class="size-6" this={result.error ? XMark : Check} />
						{result.error ? result.text : 'Регистрация завершена'}
					</div>
				{:else}
					<Button
						class="adaptive-font adaptive-padding w-full bg-main-70 text-text hover:bg-main"
						{disabled}
						{loading}
						type="submit"
					>
						Завершить регистрацию
					</Button>
				{/if}
			</form>
		</ReadCard>
	</div>
</div>

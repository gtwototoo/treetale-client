<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { HttpError } from '@sveltejs/kit';
	import type { FormEventHandler } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	import { Check, XMark } from 'svelte-heros-v2';
	import { MetaTags } from 'svelte-meta-tags';
	import { Button, Icon, Input } from 'treetale-ui';

	import ReadCard from '$lib/components/ReadCard.svelte';
	import RootStyles from '$lib/components/RootStyles.svelte';
	import { signUpUser } from '$lib/requests/user';
	import type { FetchResponse } from '$lib/types/response';
	import { clm } from '$lib/utils/classMerge';

	let name = $state('');
	let loading = $state(false);
	let result = $state<FetchResponse<string> | null>(null);

	const handleSignUp: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		if (disabled || loading) {
			return;
		}

		loading = true;

		try {
			await signUpUser(name, page.params.code);

			await goto('/profile', {
				invalidateAll: true,
				replaceState: true
			});
		} catch (error) {
			const httpError = error as HttpError;

			console.error(httpError);

			result = {
				error: true,
				message: httpError.body.message
			};
		} finally {
			loading = false;
		}
	};

	let disabled = $derived(!name);
</script>

<RootStyles />
<MetaTags title="Завершение регистрации" />

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
						class={clm(
							'adaptive-font adaptive-padding flex w-full items-center gap-3 rounded-lg select-none',
							result.error ? 'bg-red-200 text-red-500' : 'bg-emerald-200 text-emerald-500'
						)}
						in:fade
					>
						<Icon class="size-6" this={result.error ? XMark : Check} />
						{result.error ? result.message : 'Регистрация завершена'}
					</div>
				{:else}
					<Button
						class="adaptive-font adaptive-padding bg-main-70 text-text hover:bg-main w-full"
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

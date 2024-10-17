<script lang="ts">
	import type { HttpError } from '@sveltejs/kit';
	import type { FormEventHandler } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	import { Button, Input } from 'treetale-ui';

	import ReadCard from '$lib/components/ReadCard.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { signInUser } from '$lib/requests/user';
	import { bodyBackgroundColorStore } from '$lib/stores/colors.svelte';
	import type { FetchResponse } from '$lib/types/response';
	import { clm } from '$lib/utils/classMerge';
	import { rootStyle } from '$lib/utils/customColors';

	let value = $state('');
	let loading = $state(false);
	let result = $state<FetchResponse<string> | null>(null);

	const handleSignIn: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		if (disabled || loading) {
			return;
		}

		loading = true;

		try {
			const { message } = await signInUser(value);

			result = {
				error: false,
				message
			};
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

	bodyBackgroundColorStore.color = DEFAULT_COLOR;

	let disabled = $derived(!value);
</script>

<svelte:head>
	{@html rootStyle(bodyBackgroundColorStore.color)}
	<title>Авторизация</title>
</svelte:head>

<div class="flex size-full items-start justify-center">
	<div class="flex min-h-full items-center p-4 max-sm:p-3">
		<ReadCard
			alt="Авторизация"
			src="/img/writer.png"
			text={'Войдите или зарегистрируйтесь - к вам на почту придет письмо с подтверждением (Возможно в "Спам")'}
		>
			<form class="flex w-full flex-col gap-3" method="POST" onsubmit={handleSignIn}>
				<Input
					bind:value
					oninput={() => (result = null)}
					class="adaptive-font adaptive-padding w-full bg-contrast hover:bg-main-10"
					focusClass="bg-main-10"
					type="email"
					placeholder="Почта или логин"
				/>
				{#if result !== null}
					<div
						class={clm(
							'adaptive-font adaptive-padding flex w-full select-none items-center gap-3 rounded-lg',
							result.error ? 'bg-red-200 text-red-500' : 'bg-emerald-200 text-emerald-500'
						)}
						in:fade
					>
						{result.error ? result.message : 'Письмо успешно отправлено'}
					</div>
				{:else}
					<Button
						class="adaptive-font adaptive-padding w-full bg-main-70 text-text hover:bg-main"
						{disabled}
						{loading}
						type="submit"
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

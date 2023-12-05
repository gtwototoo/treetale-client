<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { DEFAULT_COLOR, NOT_FOUND_VARIANTS } from '$lib/constants';
	import { signUpUser } from '$lib/requests/user';
	import { bodyColorStore } from '$lib/stores/main';
	import { rootStyle } from '$lib/utils';
	import { Button, Input } from '$UI';

	const [{ img: contentCardImage }] = NOT_FOUND_VARIANTS;

	let name = '';
	let loading = false;
	// let message: { error: boolean; text: string } | null = null;

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
			// const error = e as HttpError;
			// message = {
			// 	error: true,
			// 	text: error.body.message
			// };
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
	<div class="flex min-h-full items-center p-4 max-sm:p-2">
		<ReadCard
			src={contentCardImage}
			alt="Завершение регистрации"
			text="Для завершения регистрации введите свой псевдоним, под которым вы будете отображаться в проекте"
		>
			<form class="flex w-full flex-col" method="POST" on:submit|preventDefault={handleSignUp}>
				<Input
					placeholder="Псевдоним"
					class="adaptive-font adaptive-padding w-full"
					bind:value={name}
				/>
				<Button
					variant="main"
					type="submit"
					class="adaptive-font adaptive-padding w-full bg-main !text-text"
					{disabled}
					{loading}
				>
					Завершить регистрацию
				</Button>
			</form>
		</ReadCard>
	</div>
</div>

<style lang="postcss">
	.message {
		@apply pointer-events-none absolute top-full mt-8 w-full select-none text-center text-xs;
	}
</style>

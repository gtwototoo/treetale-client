<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { notFoundVariants } from '$lib/constants';
	import { signUpUser } from '$lib/requests/user';
	import { Button, Input } from '$UI';
	import clsx from 'clsx';
	import { UserPlus } from 'svelte-heros-v2';
	import { fade } from 'svelte/transition';

	const { img: contentCardImage } = notFoundVariants.at(-2);

	let name: string = '';
	let loading: boolean = false;
	let message: { error: boolean; text: string } | null = null;

	const handleSignUp = async () => {
		try {
			loading = true;

			const { error, response } = await signUpUser(name, $page.params.code);

			if (error) throw error;
			if (response) {
				if (!response.error) {
					goto('/profile', {
						replaceState: true,
						invalidateAll: true
					});

					return;
				}

				message = {
					error: response.error,
					text: response.message
				};
			} else {
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

	$: disabled = !name;
</script>

<svelte:head>
	<title>Завершение регистрации</title>
</svelte:head>

<ReadCard
	src={contentCardImage}
	alt="Завершение регистрации"
	text="Для завершения регистрации введите свой псевдоним, под которым вы будете отображаться в проекте."
>
	<form
		class="cardButtons relative"
		method="POST"
		on:submit|preventDefault={() => !(disabled || loading) && handleSignUp()}
	>
		<Input placeholder="Псевдоним" class="w-full text-center" size="big" bind:value={name} />
		<Button
			variant="main"
			type="submit"
			class="w-full justify-center gap-4 bg-green-500"
			size="xl"
			{disabled}
			{loading}
		>
			<Icon type={UserPlus} />
			<p>Завершить регистрацию</p>
		</Button>
		{#if message && message.text}
			<div
				in:fade
				out:fade
				class={clsx('message', message.error ? 'text-red' : 'text-green-600')}
			>
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

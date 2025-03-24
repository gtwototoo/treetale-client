<script lang="ts">
	import type { HttpError } from '@sveltejs/kit';
	import type { FormEventHandler } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	import { Envelope } from 'svelte-heros-v2';

	import { signInUser } from '$lib/requests/user';
	import type { FetchResponse } from '$lib/types/response';
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import Image from '$lib/ui/Image.svelte';
	import Input from '$lib/ui/Input.svelte';
	import Modal from '$lib/ui/Modal.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	let {
		active = $bindable()
	}: {
		active: boolean;
	} = $props();

	let value = $state('');
	let loading = $state(false);
	let result = $state<FetchResponse<string> | null>(null);
	let timer = $state<number>();

	const handleSignIn: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		if (disabled || loading) return;

		loading = true;

		try {
			const { message } = await signInUser(value);

			result = {
				error: false,
				message
			};

			timer = window.setTimeout(() => {
				clearTimeout(timer);
			}, 60000);
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

	let disabled = $derived(!value || !!timer);
</script>

<Modal
	bind:active
	class="flex w-full max-w-screen-lg flex-row gap-8 p-8 max-md:m-0 max-md:mt-20 max-md:flex-col max-md:items-center max-md:rounded-b-none max-md:p-6"
>
	<Image
		alt="Авторизация"
		class="bg-main-400 h-[32rem] w-[22rem] rounded-2xl object-cover"
		cover
		src="/img/writer.png"
	/>
	<div class="flex flex-col justify-between gap-4">
		<p class="text-4xl font-medium">Авторизация</p>
		<p>
			Войдите или зарегистрируйтесь - к вам на почту придет письмо с подтверждением (Возможно в
			&quot;Спам&quot;)
		</p>
		<form class="flex w-full flex-col gap-3" method="POST" onsubmit={handleSignIn}>
			<Input
				bind:value
				oninput={() => (result = null)}
				class="adaptive-font adaptive-padding w-full rounded-xl !px-5"
				type="email"
				placeholder="Почта или логин"
			/>
			{#if result !== null}
				<div
					class={clm(
						'adaptive-font adaptive-padding flex w-full items-center gap-3 rounded-lg select-none',
						result.error ? 'bg-red-200 text-red-500' : 'bg-emerald-200 text-emerald-500'
					)}
					in:fade
				>
					{result.error ? result.message : 'Письмо успешно отправлено'}
				</div>
			{:else}
				<Button
					class={clm(
						button.type.primary,
						'adaptive-font adaptive-padding w-full gap-4 rounded-xl !pl-4'
					)}
					{disabled}
					{loading}
					type="submit"
				>
					<Icon class="size-8" this={Envelope} />
					<p>Войти по ссылке</p>
				</Button>
			{/if}
		</form>
	</div>
</Modal>

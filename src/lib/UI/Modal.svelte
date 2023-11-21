<script lang="ts">
	import { clsx } from 'clsx';
	import { createEventDispatcher, onMount } from 'svelte';
	import { XMark } from 'svelte-heros-v2';
	import { fly } from 'svelte/transition';

	import Icon from '$lib/components/Icon.svelte';
	import { createPortal } from '$lib/hooks';
	import { Button } from '$UI';

	let className = '';
	export { className as class };

	export let title = '';
	export let active: boolean;

	let isMounted = false;
	let previouslyFocused: Element | null;
	let innerHeight: number;
	let offsetHeight: number;
	const dispatch = createEventDispatcher();

	onMount(() => (isMounted = true));

	const handleClick = (e: CustomEvent) => {
		active = false;

		dispatch('click', e);
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key !== 'Escape' || !active) return;

		active = false;
	};

	const fixContent = (active: boolean) => {
		if (!isMounted) return;

		const body = document.body;

		if (active) {
			body.classList.add('overflow-y-hidden');
			body.setAttribute('aria-hidden', 'true');
			previouslyFocused = document.activeElement;
		} else {
			body.classList.remove('overflow-y-hidden');
			body.removeAttribute('aria-hidden');
			if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
		}
	};

	$: fixContent(active);
</script>

<svelte:window bind:innerHeight on:keydown={handleKeydown} />

{#if active}
	<div use:createPortal class="modal">
		<div
			class={clsx(
				'flex h-full w-full justify-center overflow-auto bg-transparent',
				innerHeight < offsetHeight ? 'items-start' : 'items-center'
			)}
			in:fly={{ y: 100 }}
		>
			<div class="window" bind:offsetHeight>
				<div class="header">
					<p class="title px-20">{title}</p>
					<Button
						size="lg"
						variant="ghost"
						class="absolute !p-2 hover:!text-red-600"
						on:click={handleClick}
					>
						<Icon type={XMark} />
					</Button>
				</div>
				<div class={clsx('flex p-4', className)}>
					<slot />
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.modal {
		@apply fixed left-0 top-0 z-[1000] flex h-full w-full select-none items-center justify-center bg-black bg-opacity-50;
	}
	.window {
		@apply m-4 flex flex-col rounded-2xl bg-white p-2 childs:w-full;
	}
	.window > .header {
		@apply flex items-center justify-end p-4 childs:flex;
	}
	.header > .title {
		@apply min-h-[2.5rem] w-full items-center justify-center text-center text-xl;
	}
</style>

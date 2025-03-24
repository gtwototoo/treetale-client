<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { fly } from 'svelte/transition';

	import { createPortal } from '$lib/hooks/portal';
	import { clm } from '$lib/utils/classMerge';

	type EventHandler = MouseEventHandler<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement>;

	let {
		active = $bindable(),
		class: classname,
		children,
		onclick,
		customRootStyle
	}: {
		active: boolean;
		class?: string;
		children?: Snippet<[{ onclick: EventHandler }]>;
		onclick?: EventHandler;
		customRootStyle?: string;
	} = $props();

	let previouslyFocused = $state<Element | null>(null);
	let offsetHeight = $state(0);
	let innerHeight = $state(0);

	const handleClose: EventHandler = (e) => {
		active = false;

		onclick?.(e);
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key !== 'Escape' || !active) return;

		active = false;
	};

	const switchBodyOverflow = (active: boolean) => {
		const body = document.body;

		if (active) {
			body.classList.add('!overflow-hidden');

			previouslyFocused = document.activeElement;
		} else {
			body.classList.remove('!overflow-hidden');

			if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
		}
	};

	$effect(() => {
		switchBodyOverflow(active);
	});
</script>

<svelte:window on:keydown={handleKeydown} bind:innerHeight />

{#if active}
	<div class="modal" use:createPortal>
		<div
			class={clm(
				'flex size-full justify-center overflow-auto bg-transparent',
				innerHeight < offsetHeight ? 'items-start' : 'items-center'
			)}
			in:fly={{ y: 100 }}
		>
			<button class="fixed size-full" aria-label="Закрыть" onclick={handleClose}></button>
			<div class="contents" style={customRootStyle}>
				<div
					bind:offsetHeight
					class={clm('bg-main-100 text-text relative z-10 m-4 rounded-2xl', classname)}
				>
					{@render children?.({ onclick: handleClose })}
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "../../app.css";

	.modal {
		@apply fixed top-0 left-0 z-[1000] flex size-full items-center justify-center bg-black/50 select-none;
	}
</style>

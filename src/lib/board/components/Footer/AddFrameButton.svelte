<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	import { addFrameOffsetStore } from '$board/stores/frames.svelte';
	import { boardStateStore, isAdding, zoomCorrect } from '$board/stores/index.svelte';
	import { Plus, XMark } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import { currentThemeClass, redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

	const disableAddFrameMode = () => {
		boardStateStore.mode = 'view';
	};

	const enableAddFrameMode: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> = (e) => {
		const { x, y } = e;

		addFrameOffsetStore.set(zoomCorrect({ x, y }));

		boardStateStore.mode = 'adding';
	};

	let greenBackgroundColor = $derived(
		currentThemeClass(
			clm('bg-emerald-900 hover:bg-emerald-800'),
			clm('bg-emerald-100 hover:bg-emerald-200')
		)
	);

	let redHoverBackgroundColor = $derived(
		currentThemeClass(clm('hover:bg-red-800'), clm('hover:bg-red-200'))
	);
</script>

{#if isAdding()}
	<Button
		class={clm(
			'w-64 justify-center max-sm:w-24',
			redBackgroundColorStore.color,
			redHoverBackgroundColor
		)}
		onclick={disableAddFrameMode}
		size="lg"
	>
		<Icon class="size-6 sm:hidden" this={XMark} />
		<p class="max-sm:hidden">Отмена</p>
	</Button>
{:else}
	<Button
		class={clm('w-64 justify-center text-emerald-500 max-sm:w-24', greenBackgroundColor)}
		onclick={enableAddFrameMode}
		size="lg"
	>
		<Icon class="size-6 sm:hidden" this={Plus} />
		<p class="max-sm:hidden">Новый блок</p>
	</Button>
{/if}

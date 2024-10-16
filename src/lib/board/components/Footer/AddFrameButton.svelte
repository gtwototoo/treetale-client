<script lang="ts">
	import { ChatBubbleBottomCenter, RectangleStack, XMark } from 'svelte-heros-v2';
	import { Button, FormSplit, Icon } from 'treetale-ui';

	import { addBlockOffsetStore } from '$board/stores/blocks.svelte';
	import { boardStateStore, isAddingMode, zoomCorrect } from '$board/stores/index.svelte';
	import { currentThemeClass, redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import type { Coordinates } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';

	const disableAddFrameMode = () => {
		boardStateStore.mode = 'view';
	};

	const enableAddMode = (coords: Coordinates, type: 'comment' | 'frame') => {
		addBlockOffsetStore.set(zoomCorrect(coords));

		boardStateStore.mode = type === 'frame' ? 'addingFrame' : 'addingComment';
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

{#if isAddingMode()}
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
	<FormSplit>
		<Button
			class={clm(
				'w-32 justify-center text-emerald-500 max-sm:w-24 max-xs:w-16',
				greenBackgroundColor
			)}
			onclick={({ x, y }) => enableAddMode({ x, y }, 'frame')}
			size="lg"
		>
			<Icon class="size-6 sm:hidden" this={RectangleStack} />
			<p class="max-sm:hidden">Блок</p>
		</Button>
		<Button
			class={clm(
				'w-32 justify-center text-emerald-500 max-sm:w-24 max-xs:w-16',
				greenBackgroundColor
			)}
			onclick={({ x, y }) => enableAddMode({ x, y }, 'comment')}
			size="lg"
		>
			<Icon class="size-6 sm:hidden" this={ChatBubbleBottomCenter} />
			<p class="max-sm:hidden">Заметка</p>
		</Button>
	</FormSplit>
{/if}

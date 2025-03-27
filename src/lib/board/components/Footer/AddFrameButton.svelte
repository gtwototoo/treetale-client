<script lang="ts">
	import { ChatBubbleBottomCenter, RectangleStack, XMark } from 'svelte-heros-v2';

	import { currentThemeClass, redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import type { Coordinates } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import FormSplit from '$lib/ui/FormSplit.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	import { addBlockOffsetStore } from '$board/stores/blocks.svelte';
	import { boardStateStore, isAddingMode, zoomCorrect } from '$board/stores/index.svelte';

	const disableAddFrameMode = () => {
		boardStateStore.mode = 'view';
	};

	const enableAddMode = (coords: Coordinates, type: 'comment' | 'frame') => {
		addBlockOffsetStore.set(zoomCorrect(coords));

		boardStateStore.mode = type === 'frame' ? 'addingFrame' : 'addingComment';
	};

	let greenBackgroundColor = $derived(
		currentThemeClass(
			clm('bg-emerald-900 hover:bg-emerald-800 ring-emerald-700'),
			clm('bg-emerald-100 hover:bg-emerald-200 ring-emerald-300')
		)
	);
</script>

{#if isAddingMode()}
	<Button
		class={clm(
			button.type.primary,
			button.size.lg,
			'w-64 justify-center max-sm:w-24',
			redBackgroundColorStore.color
		)}
		onclick={disableAddFrameMode}
	>
		<Icon class="size-6 sm:hidden" this={XMark} />
		<p class="max-sm:hidden">Отмена</p>
	</Button>
{:else}
	<FormSplit>
		<Button
			class={clm(
				button.type.primary,
				button.size.lg,
				'max-fd:w-16 w-32 justify-center text-emerald-500 max-sm:w-24',
				greenBackgroundColor
			)}
			onclick={({ x, y }) => enableAddMode({ x, y }, 'frame')}
		>
			<Icon class="size-6 sm:hidden" this={RectangleStack} />
			<p class="max-sm:hidden">Блок</p>
		</Button>
		<Button
			class={clm(
				button.type.primary,
				button.size.lg,
				'max-fd:w-16 w-32 justify-center text-emerald-500 max-sm:w-24',
				greenBackgroundColor
			)}
			onclick={({ x, y }) => enableAddMode({ x, y }, 'comment')}
		>
			<Icon class="size-6 sm:hidden" this={ChatBubbleBottomCenter} />
			<p class="max-sm:hidden">Заметка</p>
		</Button>
	</FormSplit>
{/if}

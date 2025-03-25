<script lang="ts">
	import find from 'lodash/find';
	import { XMark } from 'svelte-heros-v2';

	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { isBindingMode } from '$board/stores/index.svelte';
	import { transform } from '$board/utils/coordinatesToCss';
	import { createLineRemoveButtons } from '$board/utils/editing';

	const removeConnection = (frameId: number, choiceId: number) => {
		const frame = find(boardFramesStore.frames, { frameId })!;
		const choice = find(frame.choices, { choiceId })!;

		choice.frameId = null;

		changesHistoryStore.add('Удаление связи', XMark);
	};
</script>

{#if isBindingMode()}
	<div>
		{#each createLineRemoveButtons(boardFramesStore.frames) as { fromChoiceId, fromFrameId, x, y } (`${fromFrameId}-${x}:${y}`)}
			<div class="absolute flex size-0 items-center justify-center" style={transform({ x, y })}>
				<Button
					class={clm(
						button.type.primary,
						redBackgroundColorStore.color,
						'min-h-0 rounded-full p-1.5'
					)}
					onclick={() => removeConnection(fromFrameId, fromChoiceId)}
				>
					<Icon class="size-5" this={XMark} />
				</Button>
			</div>
		{/each}
	</div>
{/if}

<script lang="ts">
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { boardStateStore } from '$board/stores/index.svelte';
	import { transform } from '$board/utils/coordinatesToCss';
	import { createLineRemoveButtons } from '$board/utils/editing';
	import find from 'lodash/find';
	import { XMark } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

	const removeConnection = (frameId: number, choiceId: number) => {
		const frame = find(boardFramesStore.frames, { frameId })!;
		const choice = find(frame.choices, { choiceId })!;

		choice.frameId = null;

		changesHistoryStore.add('Удаление связи', XMark);
	};
</script>

{#if boardStateStore.mode === 'binding'}
	<div>
		{#each createLineRemoveButtons(boardFramesStore.frames) as { fromChoiceId, fromFrameId, x, y }}
			<div class="absolute flex size-0 items-center justify-center" style={transform({ x, y })}>
				<Button
					class={clm(redBackgroundColorStore.color, 'min-h-0 rounded-full p-2')}
					onclick={() => removeConnection(fromFrameId, fromChoiceId)}
				>
					<Icon class="size-4" this={XMark} />
				</Button>
			</div>
		{/each}
	</div>
{/if}

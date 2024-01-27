<script lang="ts">
	import clsx from 'clsx';
	import { XMark } from 'svelte-heros-v2';

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { changesHistory } from '$lib/stores/history';
	import { redColorStore } from '$lib/stores/main';
	import { activeModeStore, framesDataStore } from '$lib/stores/workspace';
	import { createLineRemoveButtons, transform } from '$lib/utils';

	const removeConnection = (frameId: number, choiceId: number) => {
		const fromFrameKey = $framesDataStore.findIndex((frame) => frame.frameId === frameId);
		const fromChoiceKey = $framesDataStore[fromFrameKey].choices.findIndex(
			(choice) => choice.choiceId === choiceId
		);

		$framesDataStore[fromFrameKey].choices[fromChoiceKey].frameId = null;

		changesHistory.add('Удаление связи', XMark);
	};
</script>

{#if $activeModeStore === 'binding'}
	<div>
		{#each createLineRemoveButtons($framesDataStore) as { fromChoiceId, fromFrameId, x, y }}
			<div class="absolute flex h-0 w-0 items-center justify-center" style={transform({ x, y })}>
				<Button
					class={clsx($redColorStore, '!min-h-0 !rounded-full !p-2 text-red-500')}
					on:click={() => removeConnection(fromFrameId, fromChoiceId)}
					variant="main"
				>
					<Icon class="h-4 w-4" type={XMark} />
				</Button>
			</div>
		{/each}
	</div>
{/if}

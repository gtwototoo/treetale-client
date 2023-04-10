<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { changesHistory, frames } from '$lib/stores/editing';
	import { removeMode } from '$lib/stores/newediting';
	import type { IFrame } from '$lib/types';
	import type { IFrameCreate } from '$lib/types/editing';
	import { Button } from '$UI';
	import { ChevronDown, ChevronUp, Trash } from 'svelte-heros-v2';

	export let data: IFrameCreate;

	const outputCorrect = (frame: IFrame) => {
		const outputOnFirstOrRemovedFrame = frame.choices.find(
			({ frameId }) => frameId === $frames[0].frameId || frameId === data.frameId
		);

		if (outputOnFirstOrRemovedFrame) {
			outputOnFirstOrRemovedFrame.frameId = null;
		}
	};
	const removeFrame = () => {
		$frames = $frames.filter(({ frameId }) => frameId !== data.frameId);

		for (const frame of $frames) {
			outputCorrect(frame);
		}

		changesHistory.add({
			title: 'Удаление фрейма',
			icon: Trash
		});
	};

	const minimizeFrame = () => {
		data.hidden = !data.hidden;
	};
</script>

<div class="flex items-center justify-between gap-4">
	<slot />
	<div class="flex gap-2 text-black">
		{#if $removeMode}
			{#if $frames.length !== 1}
				<Button size="sm" on:click={removeFrame}>
					<Icon type={Trash} class="text-red-600 h-4 w-4" />
				</Button>
			{/if}
		{:else}
			<Button size="sm" on:click={minimizeFrame}>
				<Icon type={data.hidden ? ChevronUp : ChevronDown} class="h-4 w-4" />
			</Button>
		{/if}
	</div>
</div>

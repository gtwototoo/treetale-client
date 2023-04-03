<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { changesHistory, connect, frames } from '$lib/stores/editing';
	import type { IFrame } from '$lib/types';
	import type { IFrameCreate } from '$lib/types/editing';
	import { Button } from '$UI';
	import clsx from 'clsx';
	import { ChevronDown, ChevronUp, Trash } from 'svelte-heros-v2';

	export let first: boolean;
	export let data: IFrameCreate;
	export let updateData: () => void;
	let styles: string = '';
	export { styles as class };

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
		updateData();
	};
</script>

<div class={clsx('header', { 'text-emerald-600': first }, styles)}>
	<p>{first ? 'Начало' : data.title}</p>
	<div class="pointer-events-auto flex gap-2 text-black">
		{#if $connect.active}
			{#if $frames.length !== 1}
				<Button size="sm" on:click={removeFrame}>
					<Icon type={Trash} class="text-red h-3 w-3" />
				</Button>
			{/if}
		{:else}
			<Button size="sm" on:click={minimizeFrame}>
				<Icon type={data.hidden ? ChevronUp : ChevronDown} class="h-3 w-3" />
			</Button>
		{/if}
	</div>
</div>

<style lang="postcss">
	.header {
		@apply flex min-h-[1.75rem] items-center justify-between gap-4;
	}
</style>

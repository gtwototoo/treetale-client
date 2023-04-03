<script lang="ts">
	import Rivet from '$lib/editing/Rivet.svelte';
	import { connect, frames, moveMode } from '$lib/stores/editing';
	import type { IFrameCreate } from '$lib/types/editing';
	import { transform } from '$lib/utils';
	import clsx from 'clsx';
	import Body from './Body.svelte';
	import Choices from './Choices.svelte';
	import Header from './Header.svelte';

	export let data: IFrameCreate;
	export let key: number;
	export let clientHeight = undefined;
	export let clientWidth = undefined;

	let hover: boolean = false;

	const startMove = (active: boolean) => {
		hover = active;

		if ($moveMode.active) return;

		$moveMode.hovered = active ? data.frameId : null;
	};

	const updateData = () => {
		$frames = $frames;
	};
</script>

<div
	class={clsx('frame', { 'shadow-lg': hover })}
	style="{transform({ x: data.x, y: data.y })}; z-index: {data.frameId}"
	bind:clientHeight
	bind:clientWidth
>
	<div
		class="moveArea"
		on:mouseenter={() => startMove(true)}
		on:mouseleave={() => startMove(false)}
	/>
	<div
		class={clsx('content childs:w-64 childs:max-w-[16rem] childs:p-4', {
			'flex-col': !data.rotated
		})}
	>
		<div
			class={clsx(data.hidden ? 'rounded-lg' : data.rotated ? 'rounded-l-lg' : 'rounded-t-lg')}
		>
			<div class="pointer-events-none flex flex-col gap-4">
				<Header {data} first={!key} {updateData} />
				{#if !data.hidden}
					<Body {data} />
				{/if}
			</div>
		</div>
		{#if !data.hidden}
			<Choices {data} {updateData} />
		{/if}
	</div>
	<div class="rivets">
		{#if key}
			<Rivet active={$connect.connector.to === data.frameId} />
		{/if}
	</div>
	<div class="rivets right-0">
		{#if data.choices.length && data.hidden}
			<Rivet
				class={clsx({
					'connect after:!cursor-default after:!bg-white': data.choices.length > 1
				})}
			>
				{#if data.choices.length > 1}
					<p class="absolute z-[1] text-xs">{data.choices.length}</p>
				{/if}
			</Rivet>
		{/if}
	</div>
</div>

<style lang="postcss">
	.frame {
		@apply absolute w-max select-none rounded-lg bg-white text-sm transition-shadow;
	}
	.content {
		@apply pointer-events-none z-[2] flex rounded-lg transition-opacity;
	}
	.moveArea {
		@apply absolute h-full w-full cursor-move bg-transparent;
	}
	.rivets {
		@apply absolute top-0 flex h-full items-center;
	}
</style>

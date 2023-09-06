<script lang="ts">
	import { connect, storyInfo } from '$lib/stores/editing';
	import type { IFrameCreate } from '$lib/types/editing';
	import clsx from 'clsx';

	let className = '';
	export { className as class };
	export let active = false;
	export let style: string | undefined = undefined;
	export let frame: IFrameCreate | undefined = undefined;
	export let choiceId: number;

	const setRivetY = (node: HTMLDivElement, frame: IFrameCreate) => {
		if (!frame) return;

		const choice = frame.choices.find((choice) => choice.choiceId === choiceId);

		const setY = () => {
			const { y } = storyInfo.scaleCorrect(node.getBoundingClientRect());

			choice.y = y - frame.y;
		};

		setY();

		return {
			update() {
				setY();
			}
		};
	};
</script>

<div
	use:setRivetY={frame}
	class={clsx('rivet', className, {
		connect: $connect.active,
		'after:!bg-emerald-500': active
	})}
	{style}
	on:mousedown
>
	<slot />
</div>

<style lang="postcss">
	.rivet {
		@apply absolute flex items-center justify-center after:absolute after:h-3 after:w-3 after:rounded-full after:bg-inherit after:transition-[width,height,background];
	}
	.rivet.connect {
		@apply z-[3] after:h-6 after:w-6 after:cursor-pointer after:bg-orange-400;
	}
</style>

<script lang="ts">
	import find from 'lodash/find';

	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { inspectorStore } from '$board/stores/inspector.svelte';
	import { createConnections } from '$board/utils/editing';
	import { clm } from '$lib/utils/classMerge';

	const checkInspectorConnections = (connectId: string) => {
		const regex = /(\d+):(\d+)-(\d+)/;
		const [, fromFrameId, fromChoiceId] = connectId.match(regex) as string[];
		const fromInspectorChoice = find(inspectorStore.selectedChoices, {
			choice: {
				choiceId: +fromChoiceId
			},
			frameId: +fromFrameId
		});

		return fromInspectorChoice;
	};

	let { paths, ...svgData } = $derived(createConnections(boardFramesStore.frames));
</script>

<svg
	class="absolute h-auto w-auto select-none bg-transparent fill-none stroke-text stroke-2"
	{...svgData}
>
	{#each paths as path (path.connectId)}
		<path
			d={path.line}
			class={clm(
				inspectorStore.selectedChoices.length &&
					checkInspectorConnections(path.connectId) &&
					'stroke-yellow-300'
			)}
		/>
	{/each}
</svg>

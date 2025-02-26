<script lang="ts">
	import find from 'lodash/find';

	import { clm } from '$lib/utils/classMerge';

	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { inspectorStore } from '$board/stores/inspector.svelte';
	import { createConnections } from '$board/utils/editing';

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
	class="stroke-text absolute h-auto w-auto bg-transparent fill-none stroke-2 select-none"
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

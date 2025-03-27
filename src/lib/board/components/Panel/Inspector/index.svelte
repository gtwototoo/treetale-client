<script lang="ts">
	import cloneDeep from 'lodash/cloneDeep';
	import find from 'lodash/find';
	import { Tv } from 'svelte-heros-v2';

	import Button from '$lib/ui/Button.svelte';
	import Image from '$lib/ui/Image.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';
	import { correctVariableReplace } from '$lib/utils/text';

	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { type SelectedChoices, inspectorStore } from '$board/stores/inspector.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';

	import ShortDescription from '../ShortDescription.svelte';

	import Choice from './Choice.svelte';

	let inspectorVariables = $state(cloneDeep(variablesStore.variables));

	const clearChoices = () => {
		inspectorStore.selectedChoices = [];
		inspectorVariables = cloneDeep(variablesStore.variables);
	};

	const displayedFramesList = (selectedChoices: SelectedChoices[]) => {
		const firstFrame = boardFramesStore.frames[0];

		if (!firstFrame) {
			return [];
		}

		const displayedFrames = [firstFrame];

		for (const selectedStage of selectedChoices) {
			const addingFrame = find(boardFramesStore.frames, {
				frameId: selectedStage.choice.frameId!
			});

			if (!addingFrame) {
				return [];
			}

			displayedFrames.push(addingFrame);
		}

		return displayedFrames;
	};

	let frames = $derived(displayedFramesList(inspectorStore.selectedChoices));
</script>

<ShortDescription
	icon={Tv}
	text="Просмотр истории со стороны читателя, а также отладка связей, модификаторов и вариантов выбора"
/>
<div class="bg-contrast-200 flex flex-col gap-2 rounded-lg p-2 text-center text-sm select-none">
	<p class="py-2">Переменные</p>
	<div class="flex flex-col gap-2">
		{#if inspectorVariables.length}
			{#each inspectorVariables as variable, key (key)}
				{#if variable.name}
					<div class="flex justify-between gap-4 *:text-left *:break-all">
						<p class="px-2 py-1">{variable.name}</p>
						<div class="bg-main-700 rounded-lg px-2 py-1">
							{variable.value || '-'}
						</div>
					</div>
				{/if}
			{/each}
		{:else}
			<p class="text-gray-500">Отсутсвуют</p>
		{/if}
	</div>
</div>
<Button onclick={clearChoices} class={clm(button.type.primary, button.size.base, 'justify-center')}>
	Сбросить все выборы
</Button>
<div class="flex flex-col gap-3 text-sm">
	{#each frames as frame, index (frame.frameId)}
		{@const text = correctVariableReplace(frame.text, inspectorVariables)}
		<div class="bg-contrast-300 relative flex flex-col items-center gap-2 rounded-xl p-2">
			{#if frame.imageUrl}
				<Image
					alt="Изображение блока"
					class="!bg-main/30 text-text h-48 w-full rounded-lg"
					cover
					src={frame.imageUrl}
				/>
			{/if}
			<p class={clm('px-3 py-1 break-all', !text && 'text-gray-400')}>
				{@html text || 'Описание блока'}
			</p>
			{#if frame.choices.length}
				<div class="flex w-full flex-col gap-2 text-base">
					{#each frame.choices as choice (choice.choiceId)}
						<Choice {choice} {frame} frameIndex={index} bind:inspectorVariables />
					{/each}
				</div>
			{:else}
				<p class="p-2 text-gray-400">Варианты выбора отсутствуют</p>
			{/if}
			{#if index !== frames.length - 1}
				<div class="absolute top-full h-3 w-0.5 bg-yellow-300"></div>
			{/if}
		</div>
	{/each}
</div>

<script lang="ts">
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { type SelectedChoices, inspectorStore } from '$board/stores/inspector.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import cloneDeep from 'lodash/cloneDeep';
	import find from 'lodash/find';
	import { Tv } from 'svelte-heros-v2';
	import { Button, FormSplit, Image } from 'treetale-ui';

	import { clm } from '$lib/utils/classMerge';
	import { correctVariableReplace } from '$lib/utils/text';

	import Choice from './Inspector/Choice.svelte';
	import ShortDescription from './ShortDescription.svelte';

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
<div class="flex select-none flex-col gap-2 rounded-lg bg-contrast-2 p-2 text-center text-sm">
	<p class="py-2">Переменные</p>
	<div class="flex flex-col gap-2">
		{#if inspectorVariables.length}
			{#each inspectorVariables as variable}
				{#if variable.name}
					<div class="flex justify-between gap-4 *:break-all *:text-left">
						<p class="px-2 py-1">{variable.name}</p>
						<div class="rounded-lg bg-main-70 px-2 py-1">
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
<Button onclick={clearChoices} class="justify-center bg-contrast-9 hover:bg-contrast-7">
	Сбросить все выборы
</Button>
<div class="flex flex-col gap-3 text-sm">
	{#each frames as frame, index}
		{@const text = correctVariableReplace(frame.text, inspectorVariables)}
		<div class="relative flex flex-col items-center gap-2 rounded-xl bg-contrast-3 p-2">
			{#if frame.imageUrl}
				<Image
					alt="Изображение блока"
					class="h-48 w-full rounded-lg !bg-main/30 text-text"
					cover
					src={frame.imageUrl}
				/>
			{/if}
			<p class={clm('px-3 py-1', !text && 'text-gray-400')}>
				{@html text || 'Описание блока'}
			</p>
			{#if frame.choices.length}
				<FormSplit vertical class="w-full">
					{#each frame.choices as choice (choice.choiceId)}
						<Choice {choice} {frame} frameIndex={index} bind:inspectorVariables />
					{/each}
				</FormSplit>
			{:else}
				<p class="p-2 text-gray-400">Варианты выбора отсутствуют</p>
			{/if}
			{#if index !== frames.length - 1}
				<div class="absolute top-full h-3 w-0.5 bg-yellow-300"></div>
			{/if}
		</div>
	{/each}
</div>

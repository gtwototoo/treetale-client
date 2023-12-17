<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Photo, Plus, RectangleStack, Trash } from 'svelte-heros-v2';

	import Choice from './Choice.svelte';

	import { Button, Contenteditable, FormSplit, Input } from '$UI';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import { removeImage, saveImage } from '$lib/requests/image';
	import { informationDataStore, readonlyStore, variablesStore } from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { currentPanelStore, redColorStore } from '$lib/stores/main';
	import { framesDataStore, selectedFrameStore } from '$lib/stores/workspace';
	import type { IFrame } from '$lib/types';
	import { last, variablesHighlight } from '$lib/utils';
	import clsx from 'clsx';

	const imageFolder = 'frames';

	$: frameKey = $framesDataStore.findIndex(({ frameId }) => frameId === $selectedFrameStore);
	$: ({ x, y, choices, imageUrl } = $framesDataStore[frameKey]);
	$: editMode = $currentPanelStore.editMode;

	const preSaveImage = async (file: File): Promise<void> => {
		try {
			const { imageUrl } = await saveImage(file, imageFolder, {
				storyId: $informationDataStore.storyId,
				frameId: $selectedFrameStore
			});

			$framesDataStore[frameKey].imageUrl = imageUrl;

			changesHistory.add('Добавление изображения фрейма', Photo);
		} catch (e) {
			console.error(e);
		}
	};

	const preRemoveImage = async () => {
		if (!$framesDataStore[frameKey].imageUrl) return;

		try {
			await removeImage(imageFolder, {
				storyId: $informationDataStore.storyId,
				frameId: $selectedFrameStore
			});

			$framesDataStore[frameKey].imageUrl = null;

			changesHistory.add('Удаление изображения фрейма', Trash);
		} catch (e) {
			console.error(e);
		}
	};

	const setFile = (e: CustomEvent<File>) => {
		const file = e.detail;

		preSaveImage(file);
	};

	const outputCorrect = (frame: IFrame) => {
		const outputOnFirstOrRemovedFrame = $framesDataStore[frameKey].choices.find(
			({ frameId }) => frameId === $framesDataStore[0].frameId || frameId === frame.frameId
		);

		if (outputOnFirstOrRemovedFrame) {
			outputOnFirstOrRemovedFrame.frameId = null;
		}
	};

	const removeFrame = () => {
		currentPanelStore.clear();

		$framesDataStore = $framesDataStore.filter(({ frameId }) => frameId !== $selectedFrameStore);

		for (const frame of $framesDataStore) {
			outputCorrect(frame);
		}

		changesHistory.add('Удаление фрейма', Trash);
	};

	const setX = (e: CustomEvent<Event & { currentTarget: EventTarget & HTMLInputElement }>) => {
		$framesDataStore[frameKey].x = +(e.detail.target as HTMLInputElement).value;
	};

	const setY = (e: CustomEvent<Event & { currentTarget: EventTarget & HTMLInputElement }>) => {
		$framesDataStore[frameKey].y = +(e.detail.target as HTMLInputElement).value;
	};

	const addChoice = () => {
		const choiceId = choices.length ? last(choices).choiceId + 1 : 0;

		$framesDataStore[frameKey].choices = [
			...choices,
			{
				text: null,
				frameId: null,
				choiceId,
				mathOperations: [],
				logicOperations: []
			}
		];

		changesHistory.add('Добавление выбора', Plus);
	};

	onDestroy(() => {
		$selectedFrameStore = null;
	});
</script>

<FormSplit class="w-full divide-contrast">
	<Input
		value={`${Math.round(x)}`}
		on:input={setX}
		placeholder="x"
		readonly={$readonlyStore}
		class="flex-1 !text-center"
		number
	/>
	<Input
		value={`${Math.round(y)}`}
		placeholder="y"
		readonly={$readonlyStore}
		on:input={setY}
		class="flex-1 !text-center"
		number
	/>
</FormSplit>
<ImageUploader
	disabled={editMode}
	readonly={$readonlyStore}
	icon={RectangleStack}
	on:loadstart={setFile}
	on:remove={preRemoveImage}
	src={imageUrl}
	alt="Иллюстрация текста"
/>
<Contenteditable
	pattern={(html) => variablesHighlight(html, $variablesStore)}
	readonly={$readonlyStore}
	maxlength={1500}
	disabled={editMode}
	placeholder="Описание фрейма"
	bind:html={$framesDataStore[frameKey].text}
/>
<div class="flex flex-col gap-2" id="choices">
	{#each choices as { choiceId } (choiceId)}
		<Choice {choiceId} {frameKey} />
	{/each}
	{#if !$readonlyStore}
		{#if editMode}
			<Button
				variant="main"
				class={clsx('justify-center !text-red-500', $redColorStore)}
				on:click={removeFrame}
			>
				Удалить фрейм
			</Button>
		{:else}
			<Button variant="ghost" on:click={addChoice} class="justify-center bg-main text-text">
				Добавить вариант
			</Button>
		{/if}
	{/if}
</div>

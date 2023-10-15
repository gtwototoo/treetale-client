<script lang="ts">
	import { Button, FormSplit, Input } from '$UI';
	import Contenteditable from '$UI/Contenteditable.svelte';
	import DropBlock from '$lib/components/DropBlock.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { saveImage } from '$lib/requests/image';
	import { changesHistory } from '$lib/stores/editing';
	import { currentPanelStore } from '$lib/stores/main';
	import { informationDataStore } from '$lib/stores/newediting';
	import { framesDataStore, selectedFrameStore } from '$lib/stores/workspace';
	import type { IFrame } from '$lib/types';
	import { last } from '$lib/utils';
	import { onDestroy } from 'svelte';
	import { Photo, Plus, RectangleStack, Trash } from 'svelte-heros-v2';
	import Choice from './Choice.svelte';

	const action = 'storyFrameImageId';

	$: frameKey = $framesDataStore.findIndex(({ frameId }) => frameId === $selectedFrameStore);
	$: ({ x, y, choices, imageId } = $framesDataStore[frameKey]);
	$: editMode = $currentPanelStore.editMode;

	let imageLoading = false;
	let avatarId = imageId;

	const preSaveImage = async (file: File): Promise<void> => {
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onloadend = () => {
			avatarId = reader.result.toString();
		};

		reader.onloadstart = () => {
			imageLoading = true;
		};

		try {
			const response = await saveImage(
				file,
				action,
				`&storyId=${$informationDataStore.storyId}&frameId=${$selectedFrameStore}`
			);

			avatarId = response.imageId;
			imageLoading = false;

			changesHistory.add('Добавление изображения', Photo);
		} catch (e) {
			console.error(e);
		}
	};

	const setFile = (e: CustomEvent<{ files: FileList }>) => {
		const { files } = e.detail;

		preSaveImage(files[0]);
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

		console.log($selectedFrameStore);

		$framesDataStore = $framesDataStore.filter(({ frameId }) => frameId !== $selectedFrameStore);
		// console.log($framesDataStore);
		// for (const frame of $framesDataStore) {
		// 	outputCorrect(frame);
		// }

		changesHistory.add('Удаление фрейма', Trash);
	};

	const setX = (e: Event) => {
		$framesDataStore[frameKey].x = +(e.target as HTMLInputElement).value;
	};

	const setY = (e: Event) => {
		$framesDataStore[frameKey].y = +(e.target as HTMLInputElement).value;
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

<FormSplit class="w-full">
	<Input
		value={`${Math.round(x)}`}
		on:input={setX}
		placeholder="x"
		class="flex-1 !text-center"
		number
	/>
	<Input
		value={`${Math.round(y)}`}
		placeholder="y"
		on:input={setY}
		class="flex-1 !text-center"
		number
	/>
</FormSplit>
<DropBlock on:change={setFile} class="h-48 gap-2">
	<Icon type={RectangleStack} class="h-24 w-auto childs:fill-gradient" variation="solid" />
</DropBlock>
<Contenteditable
	disabled={editMode}
	placeholder="Описание фрейма"
	bind:html={$framesDataStore[frameKey].text}
/>
<div class="flex flex-col gap-2">
	{#each choices as { choiceId } (choiceId)}
		<Choice {choiceId} {frameKey} />
	{/each}
	{#if editMode}
		<Button
			variant="main"
			class="justify-center !text-red-500 !bg-red-100"
			on:click={removeFrame}
		>
			Удалить фрейм
		</Button>
	{:else}
		<Button on:click={addChoice} class="justify-center">Добавить вариант</Button>
	{/if}
</div>

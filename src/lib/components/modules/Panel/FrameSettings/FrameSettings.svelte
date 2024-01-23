<script lang="ts">
	import { onDestroy } from 'svelte';
	import { ArrowLeft, Photo, Plus, RectangleStack, Trash } from 'svelte-heros-v2';

	import Choice from './Choice.svelte';

	import { Button, Contenteditable, FormSplit, Input } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import { removeImage, saveImage } from '$lib/requests/image';
	import {
		informationDataStore,
		notesStore,
		readonlyStore,
		variablesStore
	} from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { currentPanelStore, redColorStore } from '$lib/stores/main';
	import { framesDataStore, selectedFrameStore } from '$lib/stores/workspace';
	import type { IFrame } from '$lib/types';
	import type { IFrameCreate } from '$lib/types/editing';
	import { last, notesHighlight, variablesHighlight } from '$lib/utils';
	import clsx from 'clsx';
	import Panel from '../Panel.svelte';

	const imageFolder = 'frames';

	$: frameKey = $framesDataStore.findIndex(({ frameId }) => frameId === $selectedFrameStore);
	$: ({ x, y, choices, imageUrl, frameId } = $framesDataStore[frameKey] || ({} as IFrameCreate));
	$: editMode = $currentPanelStore.editMode;

	const preSaveImage = async (file: File): Promise<void> => {
		try {
			const { imageUrl } = await saveImage(file, imageFolder, {
				storyId: $informationDataStore.storyId,
				frameId: $selectedFrameStore
			});

			$framesDataStore[frameKey].imageUrl = imageUrl;

			changesHistory.add('Добавление изображения блока', Photo);
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

			changesHistory.add('Удаление изображения блока', Trash);
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

		changesHistory.add('Удаление блока', Trash);
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

	const findPrevFrame = (frames: Array<IFrameCreate>) => {
		const prevFrames: Array<IFrameCreate> = [];

		for (const frame of frames) {
			const isPrevFrame = frame.choices.some((choice) => choice.frameId === frameId);

			if (isPrevFrame) {
				prevFrames.push(frame);
			}
		}

		if (prevFrames.length === 1) {
			return prevFrames[0];
		}

		return null;
	};

	const gotoPrevFrame = () => {
		$selectedFrameStore = onePrevFrame.frameId;
	};

	const addPrevImage = () => {
		$framesDataStore[frameKey].imageUrl = onePrevFrame.imageUrl;
	};

	onDestroy(() => {
		$selectedFrameStore = null;
	});

	$: onePrevFrame = findPrevFrame($framesDataStore);

	$: if (!$framesDataStore[frameKey]) {
		currentPanelStore.clear();
	}
</script>

{#if $framesDataStore[frameKey]}
	<Panel title={$framesDataStore[frameKey].title}>
		<FormSplit class="w-full">
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
		<FormSplit vertical class="h-48">
			<ImageUploader
				disabled={editMode}
				readonly={$readonlyStore}
				icon={RectangleStack}
				on:loadstart={setFile}
				on:remove={preRemoveImage}
				src={imageUrl}
				alt="Иллюстрация текста"
			/>
			{#if !imageUrl && onePrevFrame !== null && onePrevFrame.imageUrl}
				<Button
					variant="ghost"
					on:click={addPrevImage}
					class="bg-contrast-9 justify-center text-text"
				>
					Вставить с предыдущего блока
				</Button>
			{/if}
		</FormSplit>
		<FormSplit vertical>
			<Input
				placeholder="Название блока"
				disabled={editMode}
				readonly={$readonlyStore}
				bind:value={$framesDataStore[frameKey].title}
				maxlength={25}
			/>
			<Contenteditable
				id="description"
				pattern={(html) => {
					const varFormattedHtml = variablesHighlight(html, $variablesStore);
					const notesFormattedHtml = notesHighlight(varFormattedHtml, $notesStore);

					return notesFormattedHtml;
				}}
				readonly={$readonlyStore}
				maxlength={1500}
				disabled={editMode}
				placeholder="Описание блока"
				bind:html={$framesDataStore[frameKey].text}
			/>
		</FormSplit>
		{#if onePrevFrame !== null}
			<Button variant="ghost" on:click={gotoPrevFrame} class="bg-contrast-9 gap-3 text-text">
				<Icon type={ArrowLeft} class="h-5 w-5" />
				<p>К предыдущему блоку</p>
			</Button>
		{/if}
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
						Удалить блок
					</Button>
				{:else}
					<Button
						variant="ghost"
						on:click={addChoice}
						class="bg-contrast-9 justify-center text-text"
					>
						Добавить вариант
					</Button>
				{/if}
			{/if}
		</div>
	</Panel>
{/if}

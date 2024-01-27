<script lang="ts">
	import { onDestroy } from 'svelte';

	import clsx from 'clsx';
	import { ArrowLeft, MusicalNote, Photo, Plus, RectangleStack, Trash } from 'svelte-heros-v2';

	import type { IFrame } from '$lib/types';
	import type { IFrameCreate } from '$lib/types/editing';

	import { Button, Contenteditable, FormSplit, Input, Sound } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import { removeImage, removeSound, saveImage, saveSound } from '$lib/requests/files';
	import {
		informationDataStore,
		notesStore,
		readonlyStore,
		variablesStore
	} from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { redColorStore } from '$lib/stores/main';
	import { panelEditMode, panelStore } from '$lib/stores/panel';
	import { framesDataStore, selectedFrameStore } from '$lib/stores/workspace';
	import { last, notesHighlight, variablesHighlight } from '$lib/utils';

	import Panel from '../Panel.svelte';
	import Choice from './Choice.svelte';

	const imageFolder = 'frames';

	$: frameKey = $framesDataStore.findIndex(({ frameId }) => frameId === $selectedFrameStore);
	$: ({ choices, frameId, imageUrl, soundUrl, x, y } =
		$framesDataStore[frameKey] || ({} as IFrameCreate));

	const preSaveImage = async (file: File): Promise<void> => {
		try {
			const { fileUrl } = await saveImage(file, imageFolder, {
				frameId: $selectedFrameStore,
				storyId: $informationDataStore.storyId
			});

			$framesDataStore[frameKey].imageUrl = fileUrl;

			changesHistory.add('Добавление изображения блока', Photo);
		} catch (e) {
			console.error(e);
		}
	};

	const preSaveSound = async (file: File): Promise<void> => {
		try {
			const { fileUrl } = await saveSound(file, {
				frameId: $selectedFrameStore,
				storyId: $informationDataStore.storyId
			});

			$framesDataStore[frameKey].soundUrl = fileUrl;

			changesHistory.add('Добавление звука', MusicalNote);
		} catch (e) {
			console.error(e);
		}
	};

	const preRemoveSound = async () => {
		if (!$framesDataStore[frameKey].soundUrl) return;

		try {
			await removeSound({
				frameId: $selectedFrameStore,
				storyId: $informationDataStore.storyId
			});

			$framesDataStore[frameKey].soundUrl = null;

			changesHistory.add('Удаление звука', Trash);
		} catch (e) {
			console.error(e);
		}
	};

	const preRemoveImage = async () => {
		if (!$framesDataStore[frameKey].imageUrl) return;

		try {
			await removeImage(imageFolder, {
				frameId: $selectedFrameStore,
				storyId: $informationDataStore.storyId
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
		panelStore.clear();

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
				choiceId,
				frameId: null,
				logicOperations: [],
				mathOperations: [],
				text: null
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

	const handleAddSound = (e: CustomEvent<FileList>) => {
		const file = e.detail[0];

		preSaveSound(file);
	};

	onDestroy(() => {
		$selectedFrameStore = null;
	});

	$: onePrevFrame = findPrevFrame($framesDataStore);

	$: if (!$framesDataStore[frameKey]) {
		panelStore.clear();
	}
</script>

{#if $framesDataStore[frameKey]}
	<Panel title={$framesDataStore[frameKey].title}>
		<FormSplit class="w-full">
			<Input
				class="flex-1 !text-center"
				number
				on:input={setX}
				placeholder="x"
				readonly={$readonlyStore}
				value={`${Math.round(x)}`}
			/>
			<Input
				class="flex-1 !text-center"
				number
				on:input={setY}
				placeholder="y"
				readonly={$readonlyStore}
				value={`${Math.round(y)}`}
			/>
		</FormSplit>
		<FormSplit class="h-48" vertical>
			<ImageUploader
				alt="Иллюстрация текста"
				disabled={$panelEditMode}
				icon={RectangleStack}
				on:loadstart={setFile}
				on:remove={preRemoveImage}
				readonly={$readonlyStore}
				src={imageUrl}
			/>
			{#if !imageUrl && onePrevFrame !== null && onePrevFrame.imageUrl && !$readonlyStore}
				<Button
					class="justify-center bg-contrast-9 text-text"
					disabled={$panelEditMode}
					on:click={addPrevImage}
					variant="ghost"
				>
					Вставить с предыдущего блока
				</Button>
			{/if}
		</FormSplit>
		<Sound on:change={handleAddSound} on:remove={preRemoveSound} src={soundUrl} />
		<FormSplit vertical>
			<Input
				bind:value={$framesDataStore[frameKey].title}
				disabled={$panelEditMode}
				maxlength={25}
				placeholder="Название блока"
				readonly={$readonlyStore}
			/>
			<Contenteditable
				bind:html={$framesDataStore[frameKey].text}
				disabled={$panelEditMode}
				id="description"
				maxlength={1500}
				pattern={(html) => {
					const varFormattedHtml = variablesHighlight(html, $variablesStore);
					const notesFormattedHtml = notesHighlight(varFormattedHtml, $notesStore);

					return notesFormattedHtml;
				}}
				placeholder="Описание блока"
				readonly={$readonlyStore}
			/>
		</FormSplit>
		{#if onePrevFrame !== null}
			<Button class="gap-3 bg-contrast-9 text-text" on:click={gotoPrevFrame} variant="ghost">
				<Icon class="h-5 w-5" type={ArrowLeft} />
				<p>К предыдущему блоку</p>
			</Button>
		{/if}
		<div class="flex flex-col gap-2" id="choices">
			{#each choices as { choiceId } (choiceId)}
				<Choice {choiceId} {frameKey} />
			{/each}
			{#if !$readonlyStore}
				{#if $panelEditMode}
					<Button
						class={clsx('justify-center !text-red-500', $redColorStore)}
						on:click={removeFrame}
						variant="main"
					>
						Удалить блок
					</Button>
				{:else}
					<Button
						class="justify-center bg-contrast-9 text-text"
						on:click={addChoice}
						variant="ghost"
					>
						Добавить вариант
					</Button>
				{/if}
			{/if}
		</div>
	</Panel>
{/if}

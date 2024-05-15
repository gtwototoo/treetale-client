<script lang="ts">
	import { onDestroy } from 'svelte';

	import clsx from 'clsx';
	import findIndex from 'lodash/findIndex';
	import last from 'lodash/last';
	import reject from 'lodash/reject';
	import { ArrowLeft, MusicalNote, Photo, Plus, RectangleStack, Trash } from 'svelte-heros-v2';

	import type { IFrameCreate } from '$lib/types/editing';

	import { Button, Contenteditable, FormSplit, Input, Popover } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import InvisibleDrop from '$lib/components/InvisibleDrop.svelte';
	import SoundUploader from '$lib/components/SoundUploader.svelte';
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
	import { findPrevFrames, notesHighlight, variablesHighlight } from '$lib/utils';

	import IllustrationPopover from '../../IllustrationPopover.svelte';
	import Panel from '../Panel.svelte';
	import Choice from './Choice.svelte';

	const imageFolder = 'frames';

	let draggedFileType = '';
	let onePrevFrame: IFrameCreate | null = null;

	$: frameKey = findIndex($framesDataStore, { frameId: $selectedFrameStore });
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

	const removeFromChoicesDeletedFrameId = (removedFrameId: number) => {
		for (const frameKey in $framesDataStore) {
			for (const choiceKey in $framesDataStore[frameKey].choices) {
				if ($framesDataStore[frameKey].choices[choiceKey].frameId !== removedFrameId) {
					continue;
				}

				$framesDataStore[frameKey].choices[choiceKey].frameId = null;
			}
		}
	};

	const removeFrame = () => {
		panelStore.clear();

		$framesDataStore = reject($framesDataStore, { frameId: $selectedFrameStore });

		removeFromChoicesDeletedFrameId(frameId);

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

	const gotoPrevFrame = () => {
		$selectedFrameStore = onePrevFrame.frameId;
	};

	const addPrevImage = () => {
		$framesDataStore[frameKey].imageUrl = onePrevFrame.imageUrl;
	};

	const handleAddSound = (e: CustomEvent<File>) => {
		const file = e.detail;

		preSaveSound(file);
	};

	const handleDragStart = (e: CustomEvent<DragEvent>) => {
		const file = e.detail.dataTransfer.items[0];

		draggedFileType = file.type.split('/')[0];
	};

	const handleDrop = (e: CustomEvent<Array<File>>) => {
		if (!e.detail.length) {
			return;
		}

		const file = e.detail[0];

		if (file.type.includes('image')) {
			preSaveImage(file);
		} else {
			preSaveSound(file);
		}
	};

	onDestroy(() => {
		$selectedFrameStore = null;
	});

	$: {
		const prevFrames = findPrevFrames($framesDataStore, frameId);

		if (prevFrames.length === 1) {
			onePrevFrame = prevFrames[0];
		}
	}

	$: if (!$framesDataStore[frameKey]) {
		panelStore.clear();
	}
</script>

{#if $framesDataStore[frameKey]}
	<Panel title={$framesDataStore[frameKey].title}>
		<InvisibleDrop accept="image/*,audio/*" on:dragstart={handleDragStart} on:change={handleDrop}>
			<Icon
				class="h-24 w-auto *:fill-gradient"
				type={draggedFileType === 'image' ? RectangleStack : MusicalNote}
				variation="solid"
			/>
			<p>
				Перетащите сюда {draggedFileType === 'image' ? 'изображение' : 'звук'}, чтобы заменить
				его или добавить
			</p>
		</InvisibleDrop>
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
		<div class="flex gap-2 *:min-w-0 *:flex-1">
			<IllustrationPopover {imageUrl}>
				<ImageUploader
					alt="Иллюстрация блока"
					class="h-48"
					disabled={$panelEditMode}
					icon={RectangleStack}
					on:loadstart={setFile}
					on:remove={preRemoveImage}
					readonly={$readonlyStore}
					src={imageUrl}
				/>
				{#if !imageUrl && onePrevFrame !== null && onePrevFrame.imageUrl && !$readonlyStore}
					<Button
						class="justify-center bg-contrast-9 !text-text"
						disabled={$panelEditMode}
						on:click={addPrevImage}
						variant="ghost"
					>
						Вставить с предыдущего блока
					</Button>
				{/if}
			</IllustrationPopover>
			<Popover align="left">
				<svelte:fragment let:click slot="button">
					<Button
						class={clsx(
							'w-full flex-col gap-1 bg-contrast-9 !text-text',
							soundUrl && '!text-emerald-500'
						)}
						on:click={click}
						size="lg"
						variant="ghost"
					>
						<Icon class="size-8" type={MusicalNote} variation="solid" />
						<p class="text-xs">{soundUrl ? `Звук ${frameId}` : 'Звук'}</p>
					</Button>
				</svelte:fragment>
				<div class="flex w-96 flex-col gap-3 bg-transparent p-4">
					<SoundUploader
						class="h-48"
						on:loadstart={handleAddSound}
						on:remove={preRemoveSound}
						src={soundUrl}
					/>
				</div>
			</Popover>
		</div>
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
				<Icon class="size-5" type={ArrowLeft} />
				<p>К предыдущему блоку</p>
			</Button>
		{/if}
		<div class="flex flex-col gap-2" id="choices">
			{#each choices as { choiceId } (choiceId)}
				<Choice {choiceId} {frameKey} />
			{/each}
			{#if !$readonlyStore}
				{#if $panelEditMode && frameId !== 1}
					<Button
						class={clsx('justify-center !text-red-500', $redColorStore)}
						on:click={removeFrame}
						variant="main"
					>
						Удалить блок
					</Button>
				{/if}
				{#if !$panelEditMode}
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

<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { DragEventHandler, FormEventHandler } from 'svelte/elements';

	import { removeImage, removeSound, saveImage, saveSound } from '$board/requests/files';
	import { boardFramesStore, selectedFrameStore } from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { boardEventsStore, readonlyModeStore } from '$board/stores/index.svelte';
	import { storyInfoStore } from '$board/stores/info.svelte';
	import { notesStore } from '$board/stores/notes.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import { findPrevFrames, notesHighlight, variablesHighlight } from '$board/utils/editing';
	import find from 'lodash/find';
	import last from 'lodash/last';
	import reject from 'lodash/reject';
	import { ArrowLeft, MusicalNote, Photo, Plus, RectangleStack, Trash } from 'svelte-heros-v2';
	import { Button, Contenteditable, FormSplit, Icon, Input, Popover } from 'treetale-ui';

	import type { Frame } from '$lib/types';

	import InvisibleDrop from '$lib/components/InvisibleDrop.svelte';
	import { FRAMES_FOLDER } from '$lib/constants/s3forders';
	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

	import ImageUploader from '../ImageUploader.svelte';
	import SoundUploader from '../SoundUploader.svelte';
	import { setSelectedFrame } from '../methods.svelte';
	import Choice from './FrameSettings/Choice.svelte';
	import IllustrationPopover from './IllustrationPopover.svelte';

	let draggedFileType = $state<string>();
	let onePrevFrame = $state<Frame | null>(null);
	let frame = $derived(find(boardFramesStore.frames, { frameId: selectedFrameStore.frameId! })!);
	let { choices, frameId, imageUrl, soundUrl, x, y } = $derived(frame || {});
	let descriptionElement = $state<HTMLDivElement>();

	const preSaveImage = async (file: File): Promise<void> => {
		try {
			const { fileUrl } = await saveImage(file, FRAMES_FOLDER, {
				frameId,
				storyId: storyInfoStore.info!.storyId
			});

			frame.imageUrl = fileUrl;

			changesHistoryStore.add('Добавление изображения блока', Photo);
		} catch (e) {
			console.error(e);
		}
	};

	const preSaveSound = async (file: File): Promise<void> => {
		try {
			const { fileUrl } = await saveSound(file, {
				frameId,
				storyId: storyInfoStore.info!.storyId
			});

			frame.soundUrl = fileUrl;

			changesHistoryStore.add('Добавление звука', MusicalNote);
		} catch (e) {
			console.error(e);
		}
	};

	const preRemoveSound = async () => {
		if (!frame.soundUrl) return;

		try {
			await removeSound({
				frameId,
				storyId: storyInfoStore.info!.storyId
			});

			frame.soundUrl = null;

			changesHistoryStore.add('Удаление звука', Trash);
		} catch (e) {
			console.error(e);
		}
	};

	const preRemoveImage = async () => {
		if (!frame.imageUrl) return;

		try {
			await removeImage(FRAMES_FOLDER, {
				frameId,
				storyId: storyInfoStore.info!.storyId
			});

			frame.imageUrl = null;

			changesHistoryStore.add('Удаление изображения блока', Trash);
		} catch (e) {
			console.error(e);
		}
	};

	const setFile = (file: File) => {
		preSaveImage(file);
	};

	const removeFromChoicesDeletedFrameId = (removedFrameId: number) => {
		for (const frame of boardFramesStore.frames) {
			for (const choice of frame.choices) {
				if (choice.frameId !== removedFrameId) {
					continue;
				}

				choice.frameId = null;
			}
		}
	};

	const removeFrame = () => {
		panelStatesStore.clear();

		boardFramesStore.frames = reject(boardFramesStore.frames, {
			frameId: selectedFrameStore.frameId!
		});

		removeFromChoicesDeletedFrameId(selectedFrameStore.frameId!);

		changesHistoryStore.add('Удаление блока', Trash);
	};

	const setX: FormEventHandler<HTMLInputElement> = (e) => {
		frame.x = +(e.target as HTMLInputElement).value;
	};

	const setY: FormEventHandler<HTMLInputElement> = (e) => {
		frame.y = +(e.target as HTMLInputElement).value;
	};

	const addChoice = () => {
		const lastChoiceId = last(frame.choices)?.choiceId || 0;

		frame.choices.push({
			asInput: false,
			choiceId: lastChoiceId + 1,
			frameId: null,
			text: ''
		});

		changesHistoryStore.add('Добавление выбора', Plus);
	};

	const gotoPrevFrame = () => {
		setSelectedFrame(onePrevFrame!);
	};

	const addPrevImage = () => {
		frame.imageUrl = onePrevFrame!.imageUrl;
	};

	const handleAddSound = (file: File) => {
		preSaveSound(file);
	};

	const handleDragStart: DragEventHandler<Window> = (e) => {
		const file = e.dataTransfer?.items[0];

		draggedFileType = file?.type.split('/')[0];
	};

	const updatePattern = (html: string) => {
		const varFormattedHtml = variablesHighlight(html, variablesStore.variables);
		const notesFormattedHtml = notesHighlight(varFormattedHtml, notesStore.notes);

		return notesFormattedHtml;
	};

	const handleDrop = (files: File[]) => {
		if (!files.length) {
			return;
		}

		const file = files[0];

		if (file.type.includes('image')) {
			preSaveImage(file);
		} else {
			preSaveSound(file);
		}
	};

	$effect(() => {
		const prevFrames = findPrevFrames(boardFramesStore.frames, frameId);

		onePrevFrame = prevFrames.length === 1 ? prevFrames[0] : null;
	});

	$effect(() => {
		if (!frame) {
			panelStatesStore.clear();
		}
	});

	$effect.pre(() => {
		if (!selectedFrameStore.frameId) {
			selectedFrameStore.frameId = boardFramesStore.frames[0].frameId;
		}
	});

	onDestroy(() => {
		selectedFrameStore.frameId = null;
	});
</script>

{#if frame}
	<InvisibleDrop accept="image/*,audio/*" ondragstart={handleDragStart} onchange={handleDrop}>
		<Icon
			class="h-24 w-auto *:fill-gradient"
			this={draggedFileType === 'image' ? RectangleStack : MusicalNote}
			variation="solid"
		/>
		<p>
			Перетащите сюда {draggedFileType === 'image' ? 'изображение' : 'звук'}, чтобы заменить его
			или добавить
		</p>
	</InvisibleDrop>
	<FormSplit class="w-full">
		<Input
			class="flex-1 !text-center"
			number
			oninput={setX}
			placeholder="x"
			readonly={readonlyModeStore.isEnabled}
			value={`${Math.round(x)}`}
		/>
		<Input
			class="flex-1 !text-center"
			number
			oninput={setY}
			placeholder="y"
			readonly={readonlyModeStore.isEnabled}
			value={`${Math.round(y)}`}
		/>
	</FormSplit>
	<div class="flex gap-2 *:min-w-0 *:flex-1">
		<IllustrationPopover {imageUrl}>
			<ImageUploader
				alt="Иллюстрация блока"
				class="h-48"
				disabled={panelStatesStore.editMode}
				icon={RectangleStack}
				onloadstart={setFile}
				onremove={preRemoveImage}
				readonly={readonlyModeStore.isEnabled}
				src={imageUrl}
			/>
			{#if !imageUrl && onePrevFrame?.imageUrl && !readonlyModeStore.isEnabled}
				<Button
					class="justify-center bg-contrast-9 text-text hover:bg-contrast-7"
					disabled={panelStatesStore.editMode}
					onclick={addPrevImage}
				>
					Вставить с предыдущего блока
				</Button>
			{/if}
		</IllustrationPopover>
		<Popover align="left">
			{#snippet button({ onclick })}
				<Button
					class={clm(
						'w-full flex-col justify-center gap-1 bg-contrast-9 text-text hover:bg-contrast-7',
						soundUrl && 'text-emerald-500'
					)}
					size="lg"
					{onclick}
				>
					<Icon class="size-8" this={MusicalNote} variation="solid" />
					<p class="text-xs">{soundUrl ? `Звук ${frameId}` : 'Звук'}</p>
				</Button>
			{/snippet}
			<div class="flex w-96 flex-col p-4">
				<SoundUploader
					disabled={panelStatesStore.editMode}
					readonly={readonlyModeStore.isEnabled}
					class="h-48"
					onloadstart={handleAddSound}
					onremove={preRemoveSound}
					src={soundUrl}
				/>
			</div>
		</Popover>
	</div>
	<FormSplit vertical>
		<Input
			bind:value={frame.title}
			disabled={panelStatesStore.editMode}
			maxlength={25}
			oninput={boardEventsStore.save}
			placeholder="Название блока"
			readonly={readonlyModeStore.isEnabled}
		/>
		<Contenteditable
			bind:html={frame.text!}
			disabled={panelStatesStore.editMode}
			bind:ref={descriptionElement}
			oninput={boardEventsStore.save}
			maxlength={1500}
			pattern={updatePattern}
			placeholder="Описание блока"
			readonly={readonlyModeStore.isEnabled}
		/>
	</FormSplit>
	{#if onePrevFrame !== null}
		<Button
			class="justify-center gap-4 bg-contrast-9 pl-3 text-text hover:bg-contrast-7"
			onclick={gotoPrevFrame}
		>
			<Icon class="absolute left-3 size-5" this={ArrowLeft} />
			К предыдущему блоку
		</Button>
	{/if}
	<div class="flex flex-col gap-2" id="choices">
		{#each choices as choice (choice.choiceId)}
			<Choice {choice} {frame} />
		{/each}
		{#if !readonlyModeStore.isEnabled}
			{#if panelStatesStore.editMode && frameId !== 1}
				<Button
					class={clm('justify-center text-red-500', redBackgroundColorStore.color)}
					onclick={removeFrame}
				>
					Удалить блок
				</Button>
			{/if}
			{#if !panelStatesStore.editMode}
				<Button
					class="justify-center bg-contrast-9 text-text hover:bg-contrast-7"
					onclick={addChoice}
				>
					Добавить вариант
				</Button>
			{/if}
		{/if}
	</div>
{/if}

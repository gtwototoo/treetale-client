<script lang="ts">
	import type { DragEventHandler, FormEventHandler } from 'svelte/elements';

	import find from 'lodash/find';
	import reject from 'lodash/reject';
	import {
		ArrowLeft,
		CursorArrowRipple,
		MusicalNote,
		Photo,
		RectangleStack,
		Trash
	} from 'svelte-heros-v2';
	import { Button, Contenteditable, FormSplit, Icon, Input, Popover } from 'treetale-ui';

	import ImageUploader from '../ImageUploader.svelte';
	import { addChoice, setSelectedFrame } from '../methods.svelte';
	import SoundUploader from '../SoundUploader.svelte';

	import Choice from './FrameSettings/Choice.svelte';
	import IllustrationPopover from './IllustrationPopover.svelte';

	import { removeImage, removeSound, saveImage, saveSound } from '$board/requests/files';
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import {
		boardEventsStore,
		boardParamsStore,
		boardStateStore,
		readonlyModeStore
	} from '$board/stores/index.svelte';
	import { storyInfoStore } from '$board/stores/info.svelte';
	import { notesStore } from '$board/stores/notes.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import { findPrevFrames, notesHighlight, variablesHighlight } from '$board/utils/editing';
	import InvisibleDrop from '$lib/components/InvisibleDrop.svelte';
	import { DEFAULT_BLOCK_WIDTH } from '$lib/constants';
	import { FRAMES_FOLDER } from '$lib/constants/s3forders';
	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import type { Frame } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';

	let draggedFileType = $state<string>();
	let onePrevFrame = $state<Frame | null>(null);
	let frame = $derived(
		find(boardFramesStore.frames, { frameId: panelStatesStore.props!.frameId as number })!
	);
	let { choices, frameId, imageUrl, soundUrl, x, y } = $derived(frame || {});
	let descriptionElement = $state<HTMLDivElement>();

	const preSaveImage = async (file: File): Promise<void> => {
		try {
			const { message } = await saveImage(file, FRAMES_FOLDER, {
				frameId,
				storyId: storyInfoStore.info!.storyId
			});

			frame.imageUrl = message.fileUrl;

			changesHistoryStore.add('Добавление изображения блока', Photo);
		} catch (error) {
			console.error(error);
		}
	};

	const preSaveSound = async (file: File): Promise<void> => {
		try {
			const { message } = await saveSound(file, {
				frameId,
				storyId: storyInfoStore.info!.storyId
			});

			frame.soundUrl = message.fileUrl;

			changesHistoryStore.add('Добавление звука', MusicalNote);
		} catch (error) {
			console.error(error);
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
		} catch (error) {
			console.error(error);
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
		} catch (error) {
			console.error(error);
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
			frameId: frame.frameId!
		});

		removeFromChoicesDeletedFrameId(frame.frameId!);

		changesHistoryStore.add('Удаление блока', Trash);
	};

	const setX: FormEventHandler<HTMLInputElement> = (e) => {
		frame.x = +(e.target as HTMLInputElement).value;
	};

	const setY: FormEventHandler<HTMLInputElement> = (e) => {
		frame.y = +(e.target as HTMLInputElement).value;
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

	const setToCoordinates = () => {
		boardStateStore.offset.x =
			boardParamsStore.width / 2 -
			(frame.x + DEFAULT_BLOCK_WIDTH / 2) * (boardStateStore.zoom / 100);
		boardStateStore.offset.y =
			boardParamsStore.height / 2 - (frame.y + frame.height / 2) * (boardStateStore.zoom / 100);
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
		if (!frame.frameId) {
			frame.frameId = boardFramesStore.frames[0].frameId;
		}
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
	<div class="flex gap-2">
		<FormSplit class="w-full">
			<Input
				class="flex-1 !text-center"
				number
				oninput={setX}
				max={10000}
				min={-10000}
				placeholder="x"
				readonly={readonlyModeStore.isEnabled}
				value={`${Math.round(x)}`}
			/>
			<Input
				class="flex-1 !text-center"
				number
				oninput={setY}
				max={10000}
				min={-10000}
				placeholder="y"
				readonly={readonlyModeStore.isEnabled}
				value={`${Math.round(y)}`}
			/>
		</FormSplit>
		<Button onclick={setToCoordinates} class="p-2 text-text hover:bg-contrast-7">
			<Icon this={CursorArrowRipple} class="size-6" />
		</Button>
	</div>
	<table class="-ml-1 w-[calc(100%+0.5rem)] table-fixed border-separate border-spacing-x-1">
		<tbody>
			<tr>
				<td>
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
				</td>
				<td>
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
				</td>
			</tr>
		</tbody>
	</table>
	<FormSplit vertical>
		<Input
			bind:value={frame.title}
			disabled={panelStatesStore.editMode}
			maxlength={200}
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
					class={clm('justify-center', redBackgroundColorStore.color)}
					onclick={removeFrame}
				>
					Удалить блок
				</Button>
			{/if}
			{#if !panelStatesStore.editMode}
				<Button
					class="justify-center bg-contrast-9 text-text hover:bg-contrast-7"
					onclick={() => addChoice(frame)}
				>
					Добавить вариант
				</Button>
			{/if}
		{/if}
	</div>
{/if}

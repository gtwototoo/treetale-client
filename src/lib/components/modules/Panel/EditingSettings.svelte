<script lang="ts">
	import {
		Button,
		ColorPicker,
		Input,
		InputTags,
		Photo,
		Selector,
		SelectorItem,
		Textarea
	} from '$UI';
	import FormSplit from '$UI/FormSplit.svelte';
	import DropBlock from '$lib/components/DropBlock.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { removeImage, saveImage } from '$lib/requests/image';
	import { deleteStory, updateInfo } from '$lib/requests/story';
	import { changesHistory, connect, storyInfo } from '$lib/stores/editing';
	import clsx from 'clsx';
	import { onDestroy } from 'svelte';
	import { BookOpen, Cloud, Photo as PhotoIcon, Trash, XMark } from 'svelte-heros-v2';

	let light: number = 80;
	let saturate: number = 90;
	let timer: number;
	let saveInfo: string = 'Ожидание изменений';

	const setColor = ({ detail }: CustomEvent) => {
		$storyInfo.color = detail.color;

		checkUpdates();
	};

	const checkUpdates = () => {
		clearTimeout(timer);

		timer = window.setTimeout(async () => {
			const { title, tags, color, description, storyId, draft } = $storyInfo;
			const { error } = await updateInfo(storyId, {
				title,
				tags,
				color,
				description,
				draft
			});

			saveInfo = error ? 'Ошибка сохранения' : 'Изменения сохранены';
			clearTimeout(timer);
		}, 500);
	};

	let imageLoading = false;
	let tempAvatarURL = '';

	const action = 'storyImageId';

	$: avatar = $storyInfo.imageId || tempAvatarURL;

	const preRemoveImage = async () => {
		if (tempAvatarURL || !$storyInfo.imageId) {
			return;
		}

		imageLoading = true;

		const request = await removeImage($storyInfo.imageId, action, $storyInfo.storyId);

		if (request.ok) {
			imageLoading = false;
			$storyInfo.imageId = null;

			changesHistory.add({
				title: 'Удаление изображения',
				icon: XMark
			});
		}
	};

	const preSaveImage = async (file: File): Promise<void> => {
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onloadend = () => {
			if (!reader.result) return;

			tempAvatarURL = reader.result.toString();
		};

		reader.onloadstart = () => {
			imageLoading = true;
		};

		const request = await saveImage(file, action, `&storyId=${$storyInfo.storyId}`);

		if (request.ok) {
			const data = await request.json();

			imageLoading = false;
			tempAvatarURL = '';
			$storyInfo.imageId = data.imageId;

			changesHistory.add({
				title: 'Добавление изображения',
				icon: PhotoIcon
			});
		}
	};

	const setFile = (e: CustomEvent<{ files: FileList }>) => {
		const { files } = e.detail;

		preSaveImage(files[0]);
	};

	const switchDraft = () => {
		$storyInfo.draft = !$storyInfo.draft;
		checkUpdates();
	};

	export { styles as class };

	onDestroy(() => {
		if (timer) {
			clearTimeout(timer);
		}
	});
</script>

<div
	class="flex flex-col items-stretch gap-4 p-3"
	style="--fill-main: url(#light-gradient-{$storyInfo.storyId})"
>
	{#if avatar}
		<div class="relative">
			<Button size="sm" on:click={preRemoveImage} class="!absolute right-1.5 top-1.5 z-[2]">
				<Icon type={Trash} class="h-4 w-4 !text-red-600" />
			</Button>
			<Photo
				cover
				class={clsx('rounded-lg', {
					blind: $connect.active
				})}
				src={avatar}
				alt="Иллюстрация текста"
				width={360}
				height={192}
			/>
		</div>
	{:else}
		<DropBlock on:change={setFile} class="h-48 gap-2">
			<Icon type={BookOpen} class="h-24 w-auto childs:fill-[--fill-main]" variation="solid" />
		</DropBlock>
	{/if}

	<FormSplit vertical>
		<Input
			placeholder="Название"
			class="w-full"
			bind:value={$storyInfo.title}
			on:input={checkUpdates}
		>
			<ColorPicker
				lightRange={[10, 80]}
				saturateRange={[10, 90]}
				color={$storyInfo.color.length ? $storyInfo.color : DEFAULT_COLOR}
				{saturate}
				{light}
				on:change={setColor}
			/>
		</Input>
		<Textarea
			placeholder="Описание"
			bind:value={$storyInfo.description}
			on:input={checkUpdates}
		/>
		<InputTags
			placeholder={$storyInfo.tags.length ? '' : 'Теги'}
			bind:tags={$storyInfo.tags}
			on:add={checkUpdates}
			on:remove={checkUpdates}
		/>
	</FormSplit>
	<Selector on:change={checkUpdates}>
		<SelectorItem class="grow justify-center" active={$storyInfo.draft} on:click={switchDraft}>
			Черновик
		</SelectorItem>
		<SelectorItem
			class={clsx('grow justify-center', {
				'!bg-emerald-500': !$storyInfo.draft
			})}
			active={!$storyInfo.draft}
			on:click={switchDraft}
		>
			Публичный
		</SelectorItem>
	</Selector>
	<Button
		class="mt-4 justify-center gap-4 !text-red-600"
		on:click={() => deleteStory($storyInfo.storyId)}
	>
		Удалить историю
	</Button>
	<div class="pointer-events-none flex select-none justify-center text-xs text-gray-500">
		{#if timer}
			<Icon type={Cloud} class="h-4 w-4 animate-pulse text-gray-600" />
		{:else}
			{saveInfo}
		{/if}
	</div>
</div>

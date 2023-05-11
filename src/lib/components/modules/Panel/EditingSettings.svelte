<script lang="ts">
	import { Button, ColorPicker, Input, InputTags, Selector, SelectorItem, Textarea } from '$UI';
	import FormSplit from '$UI/FormSplit.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Image from '$lib/components/Image.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { removeImage, saveImage } from '$lib/requests/image';
	import { deleteStory, updateInfo } from '$lib/requests/story';
	import { changesHistory, storyInfo } from '$lib/stores/editing';
	import clsx from 'clsx';
	import { onDestroy } from 'svelte';
	import { Cloud, Photo as PhotoIcon, XMark } from 'svelte-heros-v2';

	let light: number = 80;
	let saturate: number = 90;
	let timer: number;
	let saveInfo: string = 'Ожидание изменений';
	let state: 'loaded' | 'error' | 'loading' | undefined = undefined;

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

	const action = 'storyImageId';

	const preRemoveImage = async () => {
		if (!$storyInfo.imageId) return;

		const request = await removeImage($storyInfo.imageId, action, $storyInfo.storyId);

		if (request.ok) {
			$storyInfo.imageId = null;

			state = undefined;

			changesHistory.add({
				title: 'Удаление изображения',
				icon: XMark
			});
		}
	};

	const preSaveImage = async (file: File): Promise<void> => {
		const request = await saveImage(file, action, `&storyId=${$storyInfo.storyId}`);

		if (request.ok) {
			const data = await request.json();

			$storyInfo.imageId = data.imageId;

			state = undefined;

			changesHistory.add({
				title: 'Добавление изображения',
				icon: PhotoIcon
			});
		}
	};

	const setFile = (e: CustomEvent<{ file: File }>) => {
		const { file } = e.detail;

		preSaveImage(file);
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
	<Image
		src={$storyInfo.imageId}
		height={192}
		width={360}
		bind:state
		class="h-48"
		alt="Иллюстрация текста"
		on:loading={setFile}
		on:remove={preRemoveImage}
	/>
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

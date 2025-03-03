<script lang="ts">
	import type { Howl } from 'howler';
	import { MusicalNote, Pause, Play, Stop } from 'svelte-heros-v2';
	import { Button, Icon, Loading } from 'treetale-ui';

	import { soundStore } from '$lib/stores/sound.svelte';

	import FileUploader from './FileUploader.svelte';

	const {
		class: classname,
		disabled = false,
		onloadstart,
		onremove,
		readonly = false,
		src
	}: {
		class?: string;
		disabled?: boolean;
		onloadstart?: (file: File) => void;
		onremove?: () => void;
		readonly?: boolean;
		src?: null | string;
	} = $props();

	const handleRemove = () => {
		soundStore.clear();

		onremove?.();
	};

	const preload = (sound: Howl) => {
		return new Promise((resolve, reject) => {
			if (sound.state() === 'loaded') {
				resolve(true);
			}
			sound.once('load', () => {
				resolve(true);
			});
			sound.once('loaderror', () => {
				reject();
			});
		});
	};

	const handlePlay = () => {
		soundStore.sound?.play();
	};

	const handlePause = () => {
		soundStore.sound?.pause();
	};

	const handleStop = () => {
		soundStore.sound?.stop();
	};

	const handleLoadEnd = (base64src: string) => {
		soundStore.set(base64src);
	};

	let base64src = $state<string>('');
</script>

<FileUploader
	icon={MusicalNote}
	mediaType="audio"
	{onloadstart}
	onloadend={handleLoadEnd}
	onremove={handleRemove}
	{readonly}
	{disabled}
	{src}
	bind:base64src
	class={classname}
>
	{#if soundStore.sound}
		<div
			class="bg-contrast-300 flex size-full items-center justify-center rounded-lg text-sm/6 select-none"
		>
			{#await preload(soundStore.sound)}
				<Icon class="size-5" this={Loading} />
			{:then}
				{#if soundStore.playing}
					<Button
						class="bg-contrast-900 text-text hover:bg-contrast-700 w-20 flex-col gap-1"
						onclick={handlePlay}
					>
						<Icon class="size-8" variation="solid" this={Play} />
						<p class="text-xs">Играть</p>
					</Button>
				{:else}
					<div class="flex gap-2">
						<Button
							class="bg-contrast-900 text-text hover:bg-contrast-700 w-20 flex-col gap-1"
							onclick={handlePause}
						>
							<Icon class="size-8" variation="solid" this={Pause} />
							<p class="text-xs">Пауза</p>
						</Button>
						<Button
							class="bg-contrast-900 text-text hover:bg-contrast-700 w-20 flex-col gap-1"
							onclick={handleStop}
						>
							<Icon class="size-8" variation="solid" this={Stop} />
							<p class="text-xs">Стоп</p>
						</Button>
					</div>
				{/if}
				<div class="absolute right-3 bottom-3 left-3 flex items-center gap-2">
					<p class="w-5 shrink-0 text-center">{Math.round(soundStore.seek)}</p>
					<div class="bg-contrast h-2 w-full overflow-hidden rounded-full">
						<div
							class="bg-main h-full"
							style={`width: ${soundStore.seek / (soundStore.sound.duration() / 100)}%`}
						></div>
					</div>
					<p class="w-5 shrink-0 text-center">{soundStore.sound.duration()}</p>
				</div>
			{:catch}
				<Icon class="size-5 text-red-500" this={MusicalNote} />
				<p class="w-full">Ошибка загрузки</p>
			{/await}
		</div>
	{/if}
</FileUploader>

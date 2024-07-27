<script lang="ts">
	import type { Howl } from 'howler';

	import { MusicalNote, Play, Stop } from 'svelte-heros-v2';
	import { Button, Icon, Loading } from 'treetale-ui';

	import { soundStore } from '$lib/stores/sound.svelte';

	import FileUploader from './FileUploader.svelte';

	let {
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

	const handleClick = () => {
		soundStore.sound?.[soundStore.playing ? 'stop' : 'play']();
	};

	const handleLoadEnd = (base64src: string) => {
		soundStore.set(base64src);
	};

	let base64src = $state<null | string>(null);
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
			class="flex size-full select-none items-center justify-center rounded-lg bg-contrast-3 text-sm/6"
		>
			{#await preload(soundStore.sound)}
				<Icon class="size-5" this={Loading} />
			{:then}
				<Button
					class="w-20 flex-col gap-1 bg-contrast-9 text-text hover:bg-contrast-7"
					onclick={handleClick}
				>
					<Icon class="size-8" variation="solid" this={soundStore.playing ? Stop : Play} />
					<p class="text-xs">{soundStore.playing ? 'Стоп' : 'Играть'}</p>
				</Button>
				<div class="absolute bottom-3 left-3 right-3 flex items-center gap-2">
					<p class="w-5 shrink-0 text-center">{Math.round(soundStore.seek)}</p>
					<div class="h-2 w-full overflow-hidden rounded-full bg-contrast">
						<div
							class="h-full bg-main"
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

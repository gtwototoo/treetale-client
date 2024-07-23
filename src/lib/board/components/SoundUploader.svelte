<script lang="ts">
	import type { Howl } from 'howler';

	import { MusicalNote, Play, Stop, Trash } from 'svelte-heros-v2';
	import { Button, Icon, Loading } from 'treetale-ui';

	import DropArea from '$lib/components/DropArea.svelte';
	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { soundStore } from '$lib/stores/sound.svelte';
	import { clm } from '$lib/utils/classMerge';

	let {
		class: classname,
		onloadstart,
		onremove,
		src
	}: {
		class?: string;
		onloadstart?: (file: File) => void;
		onremove?: () => void;
		src?: null | string;
	} = $props();

	const handleChange = (files: File[]) => {
		const file = files[0];

		onloadstart?.(file);
	};

	const handleRemove = () => {
		soundStore.set('');

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

	$effect(() => {
		soundStore.set(src);
	});
</script>

<div class={clm('relative h-full min-h-0 rounded-lg', classname)}>
	{#if soundStore.sound}
		<div
			class="flex size-full select-none flex-col items-center justify-center gap-3 rounded-lg bg-contrast-3 p-2 text-sm/6"
		>
			{#await preload(soundStore.sound)}
				<Icon class="size-5" this={Loading} />
			{:then}
				<Button class="w-20 flex-col gap-1 bg-contrast-9 text-text" onclick={handleClick}>
					<Icon class="size-8" variation="solid" this={soundStore.playing ? Stop : Play} />
					<p class="text-xs">{soundStore.playing ? 'Стоп' : 'Играть'}</p>
				</Button>
				<p>Длительность: {soundStore.sound.duration()}</p>
				<Button
					class={clm(
						'!absolute right-2 top-2 z-10 !text-red-500',
						redBackgroundColorStore.color
					)}
					onclick={handleRemove}
				>
					<Icon class="size-4" this={Trash} />
				</Button>
			{:catch}
				<Icon class="size-5 text-red-500" this={MusicalNote} />
				<p class="w-full">Ошибка загрузки</p>
			{/await}
		</div>
	{:else}
		<DropArea
			onchange={handleChange}
			class="relative rounded-inherit bg-main-20"
			accept="audio/*"
		>
			<Icon class="h-20 w-auto *:fill-gradient" this={MusicalNote} variation="solid" />
			<p>Нажмите тут или перетащите сюда звук</p>
		</DropArea>
	{/if}
</div>

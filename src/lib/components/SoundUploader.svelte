<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import clsx from 'clsx';
	import { Howl } from 'howler';
	import { MusicalNote, Play, Stop, Trash } from 'svelte-heros-v2';

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { Loading } from '$lib/components/icons';
	import { soundStore } from '$lib/stores/editing';
	import { redColorStore } from '$lib/stores/main';
	import { clm } from '$lib/utils';

	import DropArea from './DropArea.svelte';

	const dispatch = createEventDispatcher<{
		loadstart: File;
		remove: null;
	}>();

	let className = '';
	export { className as class };

	export let src: string | undefined = undefined;

	const handleChange = (e: CustomEvent<Array<File>>) => {
		const file = e.detail[0];

		dispatch('loadstart', file);
	};

	const handleRemove = () => {
		soundStore.setSrc('');

		dispatch('remove');
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

	$: soundStore.setSrc(src);
</script>

<div class={clm('relative h-full min-h-0 rounded-lg', className)}>
	{#if $soundStore.sound}
		<div
			class="flex size-full select-none flex-col items-center justify-center gap-3 rounded-lg bg-contrast-3 p-2 text-sm/6"
		>
			{#await preload($soundStore.sound)}
				<Icon class="size-5" type={Loading} />
			{:then}
				<Button
					class="w-20 flex-col gap-1 bg-contrast-9 text-text"
					on:click={() => $soundStore.sound[$soundStore.playing ? 'stop' : 'play']()}
					size="lg"
					variant="ghost"
				>
					<Icon class="size-8" variation="solid" type={$soundStore.playing ? Stop : Play} />
					<p class="text-xs">{$soundStore.playing ? 'Стоп' : 'Играть'}</p>
				</Button>
				<p>Длительность: {$soundStore.sound.duration()}</p>
				<Button
					class={clsx('!absolute right-2 top-2 z-10 !text-red-500', $redColorStore)}
					on:click={handleRemove}
					size="sm"
					variant="main"
				>
					<Icon class="size-4" type={Trash} />
				</Button>
			{:catch}
				<Icon class="size-5 text-red-500" type={MusicalNote} />
				<p class="w-full">Ошибка загрузки</p>
			{/await}
		</div>
	{:else}
		<DropArea
			on:change={handleChange}
			class="relative rounded-inherit bg-main-20"
			accept="audio/*"
		>
			<Icon class="h-20 w-auto *:fill-gradient" type={MusicalNote} variation="solid" />
			<p>Нажмите тут или перетащите сюда звук</p>
		</DropArea>
	{/if}
</div>

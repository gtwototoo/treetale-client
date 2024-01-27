<script lang="ts">
	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { Loading } from '$lib/components/icons';
	import { redColorStore } from '$lib/stores/main';
	import clsx from 'clsx';
	import { Howl } from 'howler';
	import { createEventDispatcher } from 'svelte';
	import { MusicalNote, Play, Stop, Trash } from 'svelte-heros-v2';
	import InputFile from './InputFile.svelte';

	const dispatch = createEventDispatcher<{
		change: FileList;
		remove: CustomEvent;
	}>();

	let sound: Howl | null = null;

	export let src: string | undefined = undefined;

	let playing = false;

	const handleChange = (e: Event) => {
		const files = (e.target as HTMLInputElement).files;

		dispatch('change', files);
	};

	const handleRemove = (e: CustomEvent) => {
		sound.unload();

		dispatch('remove', e);
	};

	const preload = (sound: Howl) => {
		return new Promise((resolve, reject) => {
			sound.once('load', () => {
				resolve(true);
			});
			sound.once('loaderror', () => {
				reject();
			});
		});
	};

	// onDestroy(() => {
	// 	sound.off();
	// 	sound.unload();
	// 	sound.stop();
	// });

	$: {
		src;

		if (sound) {
			sound.off();
			sound.stop();

			playing = false;
			sound = null;
		}

		if (src) {
			sound = new Howl({
				src,
				loop: true,
				onplay: () => (playing = true),
				onstop: () => (playing = false)
			});
		}
	}

	// $: {
	// 	src;

	// 	if (sound) {
	// 		console.log('ggg');
	// 		sound.off();
	// 		sound.unload();
	// 		Howler.unload();
	// 		sound.stop();
	// 	}
	// }

	// $: sound = src
	// 	? new Howl({
	// 			src,
	// 			loop: true,
	// 			onplay: () => (playing = true),
	// 			onstop: () => (playing = false)
	// 	  })
	// 	: null;

	// $: if (!src && sound) {
	// 	sound.off();
	// 	sound.unload();
	// 	sound.stop();
	// }
</script>

{#if sound}
	<div class="bg-contrast-3 flex select-none items-center gap-3 rounded-lg p-2 text-sm/6">
		{#await preload(sound)}
			<Icon type={Loading} class="h-5 w-5" />
			<p>Загрузка</p>
		{:then}
			<Button
				size="sm"
				variant="ghost"
				on:click={() => sound[playing ? 'stop' : 'play']()}
				class="bg-contrast-9 gap-1 !p-1 text-text"
			>
				<Icon class="h-4 w-4" type={playing ? Stop : Play} />
			</Button>
			<p class="w-full">Длительность: {sound.duration()}</p>
			<Button
				size="sm"
				variant="ghost"
				on:click={handleRemove}
				class={clsx('gap-1 !p-1 text-red-500', $redColorStore)}
			>
				<Icon class="h-4 w-4" type={Trash} />
			</Button>
		{:catch}
			<Icon class="h-5 w-5 text-red-500" type={MusicalNote} />
			<p class="w-full">Ошибка загрузки</p>
		{/await}
	</div>
{:else}
	<InputFile
		on:change={handleChange}
		variant="ghost"
		class="bg-contrast-9 gap-3 text-text"
		accept="audio/*"
	>
		<Icon type={MusicalNote} class="h-5 w-5" />
		<p>Добавить звук</p>
	</InputFile>
{/if}

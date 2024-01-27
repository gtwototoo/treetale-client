<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import clsx from 'clsx';
	import { Howl } from 'howler';
	import { MusicalNote, Play, Stop, Trash } from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { Loading } from '$lib/components/icons';
	import { redColorStore } from '$lib/stores/main';
	import { Button } from '$UI';

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
				loop: true,
				onplay: () => (playing = true),
				onstop: () => (playing = false),
				src
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
	<div class="flex select-none items-center gap-3 rounded-lg bg-contrast-3 p-2 text-sm/6">
		{#await preload(sound)}
			<Icon class="h-5 w-5" type={Loading} />
			<p>Загрузка</p>
		{:then}
			<Button
				class="gap-1 bg-contrast-9 !p-1 text-text"
				on:click={() => sound[playing ? 'stop' : 'play']()}
				size="sm"
				variant="ghost"
			>
				<Icon class="h-4 w-4" type={playing ? Stop : Play} />
			</Button>
			<p class="w-full">Длительность: {sound.duration()}</p>
			<Button
				class={clsx('gap-1 !p-1 text-red-500', $redColorStore)}
				on:click={handleRemove}
				size="sm"
				variant="ghost"
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
		accept="audio/*"
		class="gap-3 bg-contrast-9 text-text"
		on:change={handleChange}
		variant="ghost"
	>
		<Icon class="h-5 w-5" type={MusicalNote} />
		<p>Добавить звук</p>
	</InputFile>
{/if}

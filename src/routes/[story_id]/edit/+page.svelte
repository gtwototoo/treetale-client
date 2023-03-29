<script lang="ts">
	import { defaultColor } from '$lib/constants';
	import { activeActions, storyInfo } from '$lib/stores/editing';
	import { mainColor } from '$lib/stores/story';

	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import Connector from '$lib/editing/Connector.svelte';
	import Cords from '$lib/editing/Cords.svelte';
	import CreateText from '$lib/editing/CreateText.svelte';
	import Footer from '$lib/editing/Footer.svelte';
	import Frame from '$lib/editing/Frame/index.svelte';
	import NewFrame from '$lib/editing/NewFrame.svelte';
	import Workspace from '$lib/editing/Workspace/index.svelte';
	import { translate } from '$lib/helpers';
	import {
		changesHistory,
		connect,
		frames,
		moveMode,
	} from '$lib/stores/editing';
	import { onMount } from 'svelte';
	import { Play } from 'svelte-heros-v2';

	let mounted: boolean = false;
	let ready: boolean = false;
	let innerHeight: number;
	let innerWidth: number;
	let workspace: HTMLDivElement;

	const handleKeydown = (e: KeyboardEvent) => {
		switch (e.key.toLowerCase()) {
			case 'control':
				e.preventDefault();
				$storyInfo.addFrameMode = true;
				break;
			case 'shift':
				e.preventDefault();
				$moveMode.oneDirectionMode = true;
				$connect.active = false;
				break;
			case !e.shiftKey && 'alt':
				e.preventDefault();
				$connect.active = true;
				break;
			case 'z':
				if ($storyInfo.addFrameMode)
					changesHistory[e.shiftKey ? 'redo' : 'undo']();
				break;
			case 'escape':
				e.preventDefault();
				if ($storyInfo.dragImageMode) {
					$storyInfo.dragImageMode = false;
				}
		}
	};

	const handleKeyup = (e: KeyboardEvent) => {
		switch (e.key.toLowerCase()) {
			case 'control':
				$storyInfo.addFrameMode = false;
				$storyInfo.addFrameOffset = null;
				$activeActions = false;
				break;
			case 'shift':
				$moveMode.oneDirectionMode = false;
				break;
			case 'alt':
				$connect = {
					active: false,
					connector: {
						from: null,
						to: null,
						prevOutput: null,
						mouseCoords: null,
					},
				};
				break;
		}
	};

	const disableDragMode = () => {
		$storyInfo.dragImageMode = false;
	};

	const enableDragMode = () => {
		$storyInfo.dragImageMode = true;
	};

	onMount(() => {
		storyInfo.update((i) => {
			i.saved = null;

			return i;
		});

		if ($frames.length === 1 && $frames[0].x === 0 && $frames[0].y === 0) {
			$frames[0].x = window.innerWidth / 2 - $frames[0].width / 2;
			$frames[0].y = window.innerHeight / 2 - $frames[0].height / 2;
		}
		mounted = true;
		changesHistory.add({
			title: 'Начальное состояние',
			icon: Play,
		});

		return () => {
			mainColor.set(defaultColor);
		};
	});
</script>

<svelte:head>
	<title>
		{`Редактирование "${$storyInfo.title || 'Без названия'}"`}
	</title>
</svelte:head>

<svelte:window
	bind:innerHeight
	bind:innerWidth
	on:keydown={handleKeydown}
	on:keyup|preventDefault={handleKeyup}
	on:drop|preventDefault|stopPropagation={disableDragMode}
	on:dragover|preventDefault
	on:dragend|preventDefault={disableDragMode}
	on:dragenter|preventDefault={enableDragMode}
	on:dragleave|preventDefault={(e) => {
		if (e.relatedTarget === workspace) {
			disableDragMode();
		}
	}}
/>
{#if !ready}
	<LoadingScreen />
{/if}
<Workspace {ready} bind:element={workspace}>
	{#if $frames.length === 1}
		<CreateText />
	{/if}
	<div
		class="absolute"
		style={translate(
			$storyInfo.grabbingOffsets,
			$storyInfo.grabbingScale / 100
		)}
	>
		{#if $storyInfo.addFrameMode && !$moveMode.active && !$storyInfo.grabbing}
			<NewFrame position={$storyInfo.addFrameOffset} />
		{/if}
		{#if $connect.connector.from !== null}
			<Connector />
		{/if}
		<div class="absolute z-[1]">
			{#each $frames as data, key (data.frameId)}
				<Frame
					{key}
					{data}
					bind:clientHeight={data.height}
					bind:clientWidth={data.width}
				/>
			{/each}
		</div>
		{#if mounted}
			<Cords on:mounted={() => (ready = true)} data={$frames} />
		{/if}
	</div>
</Workspace>
<Footer />

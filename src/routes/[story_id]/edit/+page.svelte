<script lang="ts">
	import { DEFAULT_COLOR } from '$lib/constants';
	import { connect, offset, storyInfo, zoom } from '$lib/stores/editing';

	import EditingFooter from '$lib/components/modules/EditingFooter/EditingFooter.svelte';
	import FrameSettings from '$lib/components/modules/Panel/FrameSettings.svelte';
	import SvgGradient from '$lib/components/modules/StoriesList/SvgGradient.svelte';
	import CreateText from '$lib/components/modules/Workspace/CreateText.svelte';
	import Frame from '$lib/components/modules/Workspace/Frame/Frame.svelte';
	import Workspace from '$lib/components/modules/Workspace/Workspace.svelte';
	import {
		addFrame,
		connectorLogic,
		cursorFollow,
		grabbingArea,
		moveRivet,
		movingFrame,
		startGrab,
		startMoveFrame
	} from '$lib/components/modules/Workspace/methods.js';
	import { changesHistory, frames } from '$lib/stores/editing';
	import { bodyColorStore, currentPanelStore } from '$lib/stores/main';
	import {
		activeActionStore,
		movingFrameStore,
		selectedFrameStore
	} from '$lib/stores/newediting.js';
	import type { IStartMove } from '$lib/types/editing.js';
	import type { ICoordinates } from '$lib/types/index.js';
	import { getFrameFromId, rootStyle } from '$lib/utils';
	import { onMount } from 'svelte';
	import { Play, Square2Stack } from 'svelte-heros-v2';

	export let data;

	let workspace: HTMLDivElement;
	let startOffset: ICoordinates = { x: 0, y: 0 };
	let startMoveData: IStartMove = {
		startMoveCoords: { x: 0, y: 0 },
		moveFrameOffset: { x: 0, y: 0 },
		moveXDirection: null
	};

	frames.init(data.frames);
	storyInfo.set({
		...data.info,
		dragImageMode: false,
		addFrameMode: false,
		addFrameOffset: null,
		timer: null,
		saved: true
	});

	const handleMouseMove = (e: CustomEvent<ICoordinates>) => {
		const { x, y } = e.detail;

		if ($activeActionStore === 'movingFrame') {
			startMoveData.moveXDirection = movingFrame({ x, y }, startMoveData);
		}
		if ($activeActionStore === 'movingArea') grabbingArea({ x, y }, startOffset);
		if ($connect.connector.from !== null) moveRivet({ x, y });
		if ($storyInfo.addFrameMode) cursorFollow({ x, y });
	};

	const handleMouseDown = (
		e: CustomEvent<{ doubleClick: boolean; button: number; isMouse: boolean } & ICoordinates>
	) => {
		const { x, y, isMouse, button, doubleClick } = e.detail;

		if (!isMouse || button === 1 || doubleClick) startOffset = startGrab({ x, y });

		if (isMouse && button === 0 && $movingFrameStore) {
			startMoveData = startMoveFrame({ x, y });

			const frame = getFrameFromId($frames, $movingFrameStore);

			if ($currentPanelStore.id === `frame-${frame.frameId}`) return;

			$selectedFrameStore = frame.frameId;

			$currentPanelStore = {
				id: `frame-${frame.frameId}`,
				title: frame.title,
				component: FrameSettings
			};
		}
	};

	const handleClick = (e: CustomEvent) => {
		const { x, y } = e.detail;

		if ($storyInfo.addFrameMode && $storyInfo.addFrameOffset) {
			const addCoords = storyInfo.scaleCorrect({ x, y });

			addFrame({ x: addCoords.x - 128, y: addCoords.y - 112 });
		}
	};

	const handleMouseUp = () => {
		if ($activeActionStore === 'movingFrame') {
			changesHistory.add('Перемещение фрейма', Square2Stack);
		}

		$movingFrameStore = null;
		$activeActionStore = 'view';

		connectorLogic();
		// storyInfo.saveArea();
	};

	onMount(() => {
		setTimeout(() => {
			if ($frames.length === 1 && $frames[0].x === 0 && $frames[0].y === 0) {
				$frames[0].x = workspace.clientWidth / 2 - $frames[0].width / 2;
				$frames[0].y = workspace.clientHeight / 2 - $frames[0].height / 2;
			}
			changesHistory.add('Начальное состояние', Play);
		}, 0);
	});

	$: $bodyColorStore = $storyInfo.color.length ? $storyInfo.color : DEFAULT_COLOR;
</script>

<svelte:head>
	<title>
		Редактирование "{$storyInfo.title || 'Без названия'}"
	</title>
	{@html rootStyle($bodyColorStore, {
		'fill-gradient': `url(#light-gradient-${$storyInfo.storyId})`
	})}
</svelte:head>

<SvgGradient id={$storyInfo.storyId} />
<div class="absolute h-full w-full">
	{#if $frames.length === 1}
		<CreateText />
	{/if}
	<Workspace
		{zoom}
		{offset}
		bind:workspace
		on:mousedown={handleMouseDown}
		on:mouseup={handleMouseUp}
		on:mousemove={handleMouseMove}
		on:click={handleClick}
	>
		{#each $frames as data, key (data.frameId)}
			<Frame {key} {data} bind:clientHeight={data.height} bind:clientWidth={data.width} />
		{/each}
	</Workspace>
</div>
<EditingFooter viewArea={workspace} />

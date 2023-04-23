<script lang="ts">
	import { DEFAULT_COLOR } from '$lib/constants';
	import { storyInfo } from '$lib/stores/editing';

	import EditingFooter from '$lib/components/modules/EditingFooter/EditingFooter.svelte';
	import SvgGradient from '$lib/components/modules/StoriesList/SvgGradient.svelte';
	import Workspace from '$lib/components/modules/Workspace/Workspace.svelte';
	import { changesHistory, frames } from '$lib/stores/editing';
	import { bodyColor } from '$lib/stores/story.js';
	import { rootStyle } from '$lib/utils';
	import { onMount } from 'svelte';
	import { Play } from 'svelte-heros-v2';

	export let data;

	frames.init(data.frames);
	storyInfo.set({
		...data.info,
		dragImageMode: false,
		addFrameMode: false,
		addFrameOffset: null,
		timer: null,
		saved: true
	});

	onMount(() => {
		if ($frames.length === 1 && $frames[0].x === 0 && $frames[0].y === 0) {
			$frames[0].x = window.innerWidth / 2 - $frames[0].width / 2;
			$frames[0].y = window.innerHeight / 2 - $frames[0].height / 2;
		}
		changesHistory.add({
			title: 'Начальное состояние',
			icon: Play
		});
	});

	$: $bodyColor = $storyInfo.color.length ? $storyInfo.color : DEFAULT_COLOR;
</script>

<svelte:head>
	<title>
		Редактирование "{$storyInfo.title || 'Без названия'}"
	</title>
	{@html rootStyle($bodyColor)}
</svelte:head>

<SvgGradient id={$storyInfo.storyId} />
<Workspace />
<EditingFooter />

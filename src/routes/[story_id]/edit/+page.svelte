<script lang="ts">
	import { DEFAULT_COLOR } from '$lib/constants';
	import { storyInfo } from '$lib/stores/editing';

	import EditingFooter from '$lib/components/modules/EditingFooter/EditingFooter.svelte';
	import Editing from '$lib/components/modules/Header/Editing.svelte';
	import Workspace from '$lib/components/modules/Workspace/Workspace.svelte';
	import { changesHistory, frames } from '$lib/stores/editing';
	import { currentHeader } from '$lib/stores/main';
	import { rootStyle } from '$lib/utils';
	import { onMount } from 'svelte';
	import { Play } from 'svelte-heros-v2';

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

	$currentHeader = Editing;
</script>

<svelte:head>
	<title>
		Редактирование "{$storyInfo.title || 'Без названия'}"
	</title>
	{@html rootStyle($storyInfo.color || DEFAULT_COLOR)}
</svelte:head>

<Workspace />
<EditingFooter />

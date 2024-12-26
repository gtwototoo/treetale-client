<script lang="ts">
	import { onMount } from 'svelte';
	import { on } from 'svelte/events';

	import cloneDeep from 'lodash/cloneDeep';
	import { MetaTags } from 'svelte-meta-tags';

	import RootStyles from '$lib/components/RootStyles.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors.js';

	import Board from '$board/components/Board/index.svelte';
	import Footer from '$board/components/Footer/index.svelte';
	import Header from '$board/components/Header.svelte';
	import Panel from '$board/components/Panel/index.svelte';
	import { boardCommentsStore } from '$board/stores/comments.svelte.js';
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { boardParamsStore, boardStateStore } from '$board/stores/index.svelte';
	import { storyInfoStore } from '$board/stores/info.svelte';
	import { notesStore } from '$board/stores/notes.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';

	const { data } = $props();

	let clonedData = cloneDeep(data);

	variablesStore.variables = clonedData.vars;
	notesStore.notes = clonedData.notes;
	boardFramesStore.frames = clonedData.frames;
	boardCommentsStore.comments = clonedData.comments;
	storyInfoStore.info = clonedData;
	boardStateStore.zoom = clonedData.zoom;
	boardStateStore.offset = clonedData.offset;

	let viewportHeight = $state(0);

	$effect(() => {
		if (!viewportHeight) return;

		document.documentElement.style.setProperty('height', `${viewportHeight}px`);
		document.body.style.setProperty('height', `${viewportHeight}px`);
	});

	onMount(() => {
		const viewport = window.visualViewport || window;

		viewportHeight = window.innerHeight;

		viewport.addEventListener('resize', (e) => {
			viewportHeight = (e.target as VisualViewport).height;
			document.body.classList.add('fixed');
			document.documentElement.classList.add('fixed', 'overflow-auto');
		});

		on(window, 'touchend', () => {
			window.scrollTo(0, 0);
		});

		viewport.addEventListener('scroll', () => {
			window.scrollTo(0, 0);
		});
	});
</script>

<MetaTags title="Редактирование истории" />
<RootStyles init={storyInfoStore.info?.color || DEFAULT_COLOR} />

<Board />
{#if boardParamsStore.width}
	<Panel />
	<Header />
	<Footer />
{/if}

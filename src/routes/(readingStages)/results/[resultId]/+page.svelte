<script lang="ts">
	import { onMount } from 'svelte';

	import cloneDeep from 'lodash/cloneDeep';
	import { MetaTags } from 'svelte-meta-tags';

	import InterfaceViewButton from '$lib/components/FormatView/InterfaceViewButton.svelte';
	import EndResults from '$lib/components/StoryStage/EndResults.svelte';
	import LeftSide from '$lib/components/StoryStage/LeftSide.svelte';
	import SvgGradient from '$lib/components/SvgGradient.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors.js';
	import { bodyBackgroundColorStore } from '$lib/stores/colors.svelte.js';
	import { interfaceStore } from '$lib/stores/reading.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { rootStyle } from '$lib/utils/customColors.js';

	const { data } = $props();

	const clonedData = $derived(cloneDeep(data));
	const { author, progress, story } = $derived(clonedData);
	const { description, color } = $derived(story);

	onMount(() => {
		bodyBackgroundColorStore.color = color.length ? color : DEFAULT_COLOR;
	});
</script>

<svelte:head>
	{@html rootStyle(bodyBackgroundColorStore.color)}
</svelte:head>

<MetaTags title="Результаты истории" {description} />

<SvgGradient />

<div
	class={clm(
		'pointer-events-none relative flex min-h-full w-full items-center justify-center px-4 py-20 transition-[padding]',
		!interfaceStore.show && 'py-8'
	)}
>
	<InterfaceViewButton />
	<div
		class="flex w-full max-w-screen-lg select-none flex-row items-start gap-2 max-md:flex-col max-md:items-center"
	>
		<LeftSide {story} {author} title="Результаты" />
		<div
			class="flex h-auto w-full flex-col items-start gap-6 text-text max-md:items-center xs:px-6"
		>
			<EndResults {story} {progress} />
		</div>
	</div>
</div>

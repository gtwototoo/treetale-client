<script lang="ts">
	import cloneDeep from 'lodash/cloneDeep';
	import { MetaTags } from 'svelte-meta-tags';

	import InterfaceViewButton from '$lib/components/FormatView/InterfaceViewButton.svelte';
	import LeftSide from '$lib/components/LeftSide/index.svelte';
	import RootStyles from '$lib/components/RootStyles.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors.js';
	import { interfaceStore } from '$lib/stores/reading.svelte';
	import { clm } from '$lib/utils/classMerge';

	import EndResults from './EndResults.svelte';

	const { data } = $props();

	const clonedData = $derived(cloneDeep(data));
	const { author, progress, story } = $derived(clonedData);
	const { description, color } = $derived(story);
</script>

<MetaTags title="Результаты истории" {description} />
<RootStyles init={color || DEFAULT_COLOR} />

<div
	class={clm(
		'pointer-events-none relative flex min-h-full w-full items-center justify-center px-4 py-20 transition-[padding]',
		!interfaceStore.show && 'py-8'
	)}
>
	<InterfaceViewButton />
	<div
		class="flex w-full max-w-screen-lg flex-row items-start gap-2 select-none max-md:flex-col max-md:items-center"
	>
		<LeftSide {story} {author} title="Результаты" />
		<div
			class="text-text fd:px-6 flex h-auto w-full flex-col items-start gap-6 max-md:items-center"
		>
			<EndResults {story} {progress} />
		</div>
	</div>
</div>

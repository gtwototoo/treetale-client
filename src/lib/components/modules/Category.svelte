<script lang="ts">
	import StoriesList from '$lib/components/modules/StoriesList/index.svelte';
	import type { IStoryFull } from '$lib/types/reading';
	import emblaCarouselSvelte, {
		type EmblaOptionsType,
		type EmblaPluginType
	} from 'embla-carousel-svelte';
	import type { SvelteComponent } from 'svelte';
	import Icon from '../Icon.svelte';

	export let title: string;
	export let stories: Array<IStoryFull>;
	export let icon: typeof SvelteComponent<unknown>;

	let options: EmblaOptionsType = {
		align: 'start',
		dragFree: true
	};

	let plugins: Array<EmblaPluginType> = [];
</script>

<div>
	<div class="flex select-none items-center gap-4 py-3 pl-12">
		<Icon type={icon} class="h-8 w-8" />
		<h2 class="text-2xl">{title}</h2>
	</div>

	<div use:emblaCarouselSvelte={{ options, plugins }}>
		<StoriesList {stories} />
	</div>
</div>

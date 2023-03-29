<script lang="ts">
	import { clm } from '$lib/utils';
	import { Photo } from '$UI';

	let classes: string = '';

	export { classes as class };
	export let alt: string;
	export let src: string | undefined | null = undefined;
	export let width: number;
	export let height = width;

	const split = alt.split(' ');
	const short = `${split[0][0]}${split.length > 1 ? split.at(-1)?.[0] : ''}`;
</script>

<div
	class={clm(
		'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
		classes
	)}
>
	{#if src}
		<Photo class="h-full w-full rounded-full" cover {src} {alt} {width} {height} />
	{:else}
		{short}
	{/if}
	<slot />
</div>

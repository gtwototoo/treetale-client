<svelte:options namespace="svg" />

<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	import { bodyBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { contrastText } from '$lib/utils/contrast';

	let {
		maskId = 'short-logo-mask',
		...props
	}: SVGAttributes<SVGElement> & {
		maskId?: string;
	} = $props();

	let gradientColors = $derived(
		contrastText(bodyBackgroundColorStore.color) ? ['#5A00EC', '#AF00A9'] : ['#FF6C15', '#FDBA74']
	);
</script>

<svg {...props} fill="none" viewBox="0 0 556 442" xmlns="http://www.w3.org/2000/svg">
	<mask
		id={maskId}
		width="556"
		height="442"
		x="0"
		y="0"
		maskUnits="userSpaceOnUse"
		style="mask-type:alpha"
	>
		<path
			fill="#fff"
			d="M162 304c-14 78-10 138-10 138H54s-18-73 16-186C97 168 57 127 0 98L40 0s97 100 234 100v100s-94 3-112 104Zm232 0c14 78 10 138 10 138h98s18-73-16-186c-27-88 13-129 70-158L516 0s-97 100-234 100v100s94 3 112 104Z"
		/>
	</mask>
	<g mask="url(#{maskId})">
		<path fill={gradientColors[0]} d="m-172-61 674-187 129 464-674 187z" />
		<path fill={gradientColors[1]} d="m-41 380 730-203 129 465L88 845z" />
	</g>
</svg>

<svelte:options namespace="svg" />

<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	import { bodyBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { contrastText } from '$lib/utils/contrast';

	let {
		maskId = 'logo-mask',
		...props
	}: SVGAttributes<SVGElement> & {
		maskId?: string;
	} = $props();

	let gradientColors = $derived(
		contrastText(bodyBackgroundColorStore.color) ? ['#5A00EC', '#AF00A9'] : ['#FF6C15', '#FDBA74']
	);
</script>

<svg {...props} fill="none" viewBox="0 0 2148 442" xmlns="http://www.w3.org/2000/svg">
	<mask
		id={maskId}
		width="2148"
		height="442"
		x="0"
		y="0"
		maskUnits="userSpaceOnUse"
		style="mask-type:alpha"
	>
		<path
			fill="#fff"
			d="M152 442s-4-60 10-138c18-101 112-104 112-104V100C137 100 40 0 40 0L0 98c57 29 97 70 70 158-34 113-16 186-16 186h98Zm1000 0s4-60-10-138c-18-101-112-104-112-104V100c137 0 234-100 234-100l40 98c-57 29-97 70-70 158 34 113 16 186 16 186h-98ZM519 100v342h246v-86H612v-38h141v-78H612v-40h153V100H519Z"
		/>
		<path
			fill="#fff"
			d="M330 329h-32v113H198s0-94 7-128c7-33 34-57 69-57h57c10 0 20-1 27-4 8-2 14-7 18-13s4-16 0-22c-4-7-10-11-18-14-7-3-29-4-40-4V100c65 0 82 5 101 14 19 10 34 23 45 40 10 18 15 38 15 63a99 99 0 0 1-58 98l70 127H390l-60-113Zm481 113V100h155v100h-62v40h104c61-3 73 78 73 78H904v38h179c7 36 6 86 6 86H811Z"
		/>
		<path
			fill="#fff"
			fill-rule="evenodd"
			d="M1342 442s-45-101-50-191c-4-91 100-151 100-151h90l113 342h-101l-19-65h-113l-20 65Zm78-248 34 113h-71l34-113h3Z"
			clip-rule="evenodd"
		/>
		<path
			fill="#fff"
			d="M1627 442V100h93v256h138v86h-231Zm274-342v342h246v-86h-153v-38h141v-78h-141v-40h153V100h-246Z"
		/>
	</mask>
	<g mask="url(#{maskId})">
		<path fill={gradientColors[0]} d="m-25 0 2115-369 83 475L58 475z" />
		<path fill={gradientColors[1]} d="M141 460 2256 91l83 475L224 935z" />
	</g>
</svg>

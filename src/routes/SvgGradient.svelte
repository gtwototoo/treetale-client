<script>
	import { rootStyle } from '$lib/utils/customColors';
</script>

<svelte:head>
	{@html rootStyle(undefined, {
		'fill-gradient': 'url(#light-gradient)'
	})}
</svelte:head>

<svg aria-hidden="true" class="invisible absolute bg-transparent" height="0" width="0">
	<defs>
		<linearGradient id="light-gradient" x1="0" x2="0" y1="0" y2="1">
			<stop class="stop-main" stop-opacity="60%" />
			<stop class="stop-main" offset="80%" />
		</linearGradient>
	</defs>
</svg>

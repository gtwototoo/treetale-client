<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import { bodyColor } from '$lib/stores/story';
	import { contrastText } from '$lib/utils';
	import clsx from 'clsx';

	$: textColor = contrastText($bodyColor) ? 'childs:from-[#FDBA74]' : 'childs:from-[#753F00]';
</script>

<Link
	href="/"
	class={clsx(
		'select-none px-2 text-2xl/9 font-extrabold uppercase text-transparent childs:bg-gradient-to-br childs:bg-clip-text md:px-4',
		textColor
	)}
>
	<p class="hidden sm:block">Treestory</p>
	<p class="sm:hidden">TS</p>
</Link>

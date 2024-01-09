<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import Treetale from '$lib/components/icons/Treetale.svelte';
</script>

<Link href="/" class="select-none px-2 md:px-4">
	<p
		class="hidden bg-gradient-to-b from-[#FDBA74] to-[#FC8E4D] bg-clip-text text-3xl font-extrabold uppercase text-transparent sm:block"
	>
		treetale
	</p>
	<Treetale class="h-10 w-10 sm:hidden" />
</Link>

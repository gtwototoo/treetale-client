<script lang="ts">
	import Link from '$lib/ui/Link.svelte';

	import Treetale from '../Icons/Treetale.svelte';
	import TreetaleShort from '../Icons/TreetaleShort.svelte';
</script>

<Link class="pointer-events-auto px-2 select-none md:px-4" href="/">
	<Treetale class="h-7 w-auto max-sm:hidden" />
	<TreetaleShort class="h-8 w-auto sm:hidden" />
</Link>

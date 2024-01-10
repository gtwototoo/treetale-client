<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import { TreetaleShort } from '$lib/components/icons';
	import Treetale from '$lib/components/icons/Treetale.svelte';
</script>

<Link href="/" class="select-none px-2 md:px-4">
	<Treetale class="h-8 w-auto max-sm:hidden" />
	<TreetaleShort class="hidden h-9 w-auto max-sm:block" />
</Link>

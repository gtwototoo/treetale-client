<script lang="ts">
	import { Link } from 'treetale-ui';

	import Treetale from '../Icons/Treetale.svelte';
	import TreetaleShort from '../Icons/TreetaleShort.svelte';
</script>

<Link class="pointer-events-auto px-2 select-none md:px-4" href="/">
	<Treetale class="h-7 w-auto max-sm:hidden" />
	<TreetaleShort class="h-8 w-auto sm:hidden" />
</Link>

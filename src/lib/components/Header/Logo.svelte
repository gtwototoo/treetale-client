<script lang="ts">
	import Treetale from '../icons/Treetale.svelte';
	import TreetaleShort from '../icons/TreetaleShort.svelte';

	import { Link } from 'treetale-ui';
</script>

<Link class="select-none px-2 md:px-4" href="/">
	<Treetale class="h-7 w-auto max-sm:hidden" />
	<TreetaleShort class="h-8 w-auto sm:hidden" />
</Link>

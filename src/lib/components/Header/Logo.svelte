<script lang="ts">
	import { Link } from 'treetale-ui';

	import Treetale from '../icons/Treetale.svelte';
	import TreetaleShort from '../icons/TreetaleShort.svelte';
</script>

<Link class="select-none px-2 md:px-4" href="/">
	<Treetale class="h-7 w-auto max-sm:hidden" />
	<TreetaleShort class="h-8 w-auto sm:hidden" />
</Link>

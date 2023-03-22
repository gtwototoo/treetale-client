<script lang="ts">
	import { page } from '$app/stores';
	import Edit from './Edit.svelte';
	import Logo from './Logo.svelte';

	$: ({ error, url } = $page);
</script>

<div>
	<Logo />
	<Edit />
</div>

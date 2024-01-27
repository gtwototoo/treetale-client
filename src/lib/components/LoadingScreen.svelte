<script lang="ts">
	import { Loading } from '$lib/components/icons';

	import Icon from './Icon.svelte';
</script>

<div class="fixed top-0 flex h-full w-full items-center justify-center">
	<Icon class="h-8 w-8" type={Loading} />
</div>

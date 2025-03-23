<script lang="ts">
	import type { Component } from 'svelte';

	import { clm } from '$lib/utils/classMerge';

	import type { IconProps } from './types';

	const {
		class: classname,
		this: Icon,
		variation = 'outline'
	}: {
		this: Component;
	} & IconProps = $props();
</script>

<Icon class={clm('shrink-0', classname)} {variation} />

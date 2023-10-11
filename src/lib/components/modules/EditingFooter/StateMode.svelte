<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { ICON_TYPE } from '$lib/constants';
	import { stateAreaStore } from '$lib/stores/newediting';
	import { activeActionStore } from '$lib/stores/workspace';
	import { Tag } from '$UI';
	import clsx from 'clsx';
	import { Cloud } from 'svelte-heros-v2';
</script>

<Tag
	class={clsx(
		'flex gap-2 bg-contrast',
		$stateAreaStore === 'saving'
			? 'animate-pulse text-gray-400'
			: $stateAreaStore === 'saved'
			? 'text-emerald-500'
			: $stateAreaStore === 'error'
			? 'text-red-500'
			: 'text-gray-400'
	)}
>
	<Icon
		type={Cloud}
		variation={$stateAreaStore === 'saving' ? ICON_TYPE : 'solid'}
		class={clsx('h-4 w-4')}
	/>
	{$activeActionStore || 'Просмотр'}
</Tag>

<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { ICON_TYPE } from '$lib/constants';
	import { activeAction, storyInfo } from '$lib/stores/editing';
	import { Tag } from '$UI';
	import clsx from 'clsx';
	import { Cloud } from 'svelte-heros-v2';
</script>

<Tag
	class={clsx(
		'flex gap-2 bg-contrast',
		$storyInfo.timer
			? 'animate-pulse text-gray-400'
			: $storyInfo.saved === true
			? 'text-emerald-600'
			: $storyInfo.saved === false
			? 'text-red'
			: 'text-gray-400'
	)}
>
	<Icon type={Cloud} variation={$storyInfo.timer ? ICON_TYPE : 'solid'} class={clsx('h-4 w-4')} />
	{$activeAction || 'Просмотр'}
</Tag>

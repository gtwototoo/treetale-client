<script lang="ts">
	import { clm } from '$lib/utils/classMerge';
	import { versionCompare } from '$lib/utils/versionCompare';

	import { Tag } from 'treetale-ui';

	let {
		currentVersion,
		progressVersion,
		displayVersion = 'current'
	}: {
		currentVersion: string;
		progressVersion?: string;
		displayVersion?: 'current' | 'progress';
	} = $props();

	const progressOrCurrentVersion = $derived(progressVersion || currentVersion);
	const visibleVersion = $derived(
		displayVersion === 'progress' ? progressOrCurrentVersion : currentVersion
	);
</script>

<Tag
	class={clm(
		'whitespace-nowrap bg-opacity-30',
		{
			breaking: 'bg-red-100 text-red-500',
			current: 'bg-green-100 text-green-500',
			minor: 'bg-yellow-100 text-yellow-500',
			archived: 'bg-gray-100 text-gray-500'
		}[versionCompare(currentVersion, progressOrCurrentVersion)]
	)}
>
	{visibleVersion === 'Архив' ? visibleVersion : `Версия ${visibleVersion}`}
</Tag>

<script lang="ts">
	import { clm } from '$lib/utils/classMerge';
	import { versionCompare } from '$lib/utils/versionCompare';

	const {
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
	const versionColor = $derived(
		{
			breaking: 'bg-red-500/30 text-red-500',
			current: 'bg-emerald-500/30 text-emerald-500',
			minor: 'bg-yellow-500/30 text-yellow-500',
			archived: 'bg-gray-500/30 text-gray-500'
		}[versionCompare(currentVersion, progressOrCurrentVersion)]
	);
</script>

<div class={clm('rounded-lg px-3 py-1.5 text-sm whitespace-nowrap select-none', versionColor)}>
	{visibleVersion === 'Архив' ? visibleVersion : `Версия ${visibleVersion}`}
</div>

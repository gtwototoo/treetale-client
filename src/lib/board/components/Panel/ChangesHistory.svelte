<script lang="ts">
	import { Clock } from 'svelte-heros-v2';
	import { Button, FormSplit, Icon } from 'treetale-ui';

	import { clm } from '$lib/utils/classMerge';

	import { changesHistoryStore } from '$board/stores/history.svelte';

	import ShortDescription from './ShortDescription.svelte';
</script>

<ShortDescription
	icon={Clock}
	text="Тут отображаются последние 20 изменений сделанных вами, вы можете отменить и вернуть любые из них"
/>
<FormSplit vertical>
	{#each changesHistoryStore.stages as { icon, title }, index (index)}
		<Button
			class={clm('bg-main-30 text-text hover:bg-main-50 gap-4', {
				'opacity-60': index > changesHistoryStore.currentId
			})}
			onclick={() => changesHistoryStore.to(index)}
		>
			<Icon this={icon} />
			<p>{title}</p>
		</Button>
	{/each}
</FormSplit>

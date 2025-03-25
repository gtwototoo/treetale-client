<script lang="ts">
	import { Clock } from 'svelte-heros-v2';
	import { Button } from 'treetale-ui';

	import FormSplit from '$lib/ui/FormSplit.svelte';
	import Icon from '$lib/ui/Icon.svelte';
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
			class={clm('bg-main-300 text-text hover:bg-main-500 gap-4', {
				'opacity-60': index > changesHistoryStore.currentId
			})}
			onclick={() => changesHistoryStore.to(index)}
		>
			<Icon this={icon} />
			<p>{title}</p>
		</Button>
	{/each}
</FormSplit>

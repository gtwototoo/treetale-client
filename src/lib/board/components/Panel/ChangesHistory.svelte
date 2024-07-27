<script lang="ts">
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import clsx from 'clsx';
	import { Clock } from 'svelte-heros-v2';
	import { Button, FormSplit, Icon } from 'treetale-ui';

	import ShortDescription from './ShortDescription.svelte';
</script>

<ShortDescription
	icon={Clock}
	text="Тут отображаются последние 20 изменений сделанных вами, вы можете отменить и вернуть любые из них"
/>
<FormSplit vertical>
	{#each changesHistoryStore.stages as { icon, title }, key}
		<Button
			class={clsx('gap-4 bg-contrast-9 text-text hover:bg-contrast-7', {
				'opacity-60': key > changesHistoryStore.currentId
			})}
			onclick={() => changesHistoryStore.to(key)}
		>
			<Icon this={icon} />
			<p>{title}</p>
		</Button>
	{/each}
</FormSplit>

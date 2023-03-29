<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { changesHistory } from '$lib/stores/editing';
	import { correctWhitespace } from '$lib/utils';
	import { Button, ButtonSplit } from '$UI';
	import clsx from 'clsx';
	import { Clock } from 'svelte-heros-v2';
</script>

<div class="flex w-full justify-center">
	<Icon type={Clock} class="h-9 w-9 text-gray-300" />
</div>
<p class="text-center text-sm text-gray-500">
	{correctWhitespace(
		'Тут отображаются последние 20 изменений сделанных вами, вы можете отменить и вернуть любые из них'
	)}
</p>
<div class="flex flex-col gap-2">
	<ButtonSplit vertical>
		{#each $changesHistory.stages as { title, icon }, key}
			<Button
				on:click={() => changesHistory.to(key)}
				class={clsx('gap-4', {
					'opacity-60': key > $changesHistory.currentStageId
				})}
			>
				<Icon type={icon} />
				<p>{title}</p>
			</Button>
		{/each}
	</ButtonSplit>
</div>

<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { changesHistory } from '$lib/stores/editing';
	import { Button, ButtonSplit } from '$UI';
	import clsx from 'clsx';
	import { Clock } from 'svelte-heros-v2';
	import Note from './Note.svelte';
</script>

<div class="flex flex-col items-stretch gap-4 p-6">
	<Note
		icon={Clock}
		text="Тут отображаются последние 20 изменений сделанных вами, вы можете отменить и вернуть любые из них"
	/>
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

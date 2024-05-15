<script lang="ts">
	import clsx from 'clsx';
	import { ArrowUturnLeft, ArrowUturnRight, ChevronLeft } from 'svelte-heros-v2';

	import { Button, FormSplit } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore } from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { panelShow, panelStore } from '$lib/stores/panel';
	import { activeActionStore } from '$lib/stores/workspace';

	import { Changes } from '../Panel';
	import Header from './Header.svelte';

	const historySwitch = () => {
		$panelStore = {
			component: Changes,
			id: 'history'
		};
	};
</script>

<Header class={clsx('pointer-events-none', $activeActionStore ? 'blind' : '*:pointer-events-auto')}>
	{#if $readonlyStore}
		<div class="select-none rounded-xl bg-contrast/10 px-6 py-3 text-base text-text">
			Режим просмотра
		</div>
	{:else}
		<FormSplit>
			<Button
				class="header-button bg-contrast text-text"
				disabled={$changesHistory.currentId === 0}
				on:click={changesHistory.undo}
				on:holdclick={historySwitch}
				size="lg"
				variant="ghost"
			>
				<Icon type={ArrowUturnLeft} />
			</Button>
			<Button
				class="header-button bg-contrast text-text"
				disabled={$changesHistory.currentId + 1 >= $changesHistory.stages.length}
				on:click={changesHistory.redo}
				on:holdclick={historySwitch}
				size="lg"
				variant="ghost"
			>
				<Icon type={ArrowUturnRight} />
			</Button>
		</FormSplit>
	{/if}
	<svelte:fragment slot="right">
		<Button
			class="header-button -mr-4 !hidden !rounded-r-none bg-contrast text-text max-lg:!block max-sm:-mr-3 max-xs:!hidden"
			on:click={() => ($panelShow = !$panelShow)}
			size="lg"
			variant="ghost"
		>
			<Icon class="size-6" type={ChevronLeft} />
		</Button>
	</svelte:fragment>
</Header>

<script lang="ts">
	import clsx from 'clsx';
	import {
		ArrowUturnLeft,
		ArrowUturnRight,
		ChevronLeft,
		Cog6Tooth,
		Variable
	} from 'svelte-heros-v2';

	import { Changes, Variables } from '../Panel';

	import Header from './Header.svelte';

	import { Button, FormSplit } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore } from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { currentPanelStore } from '$lib/stores/main';
	import { activeActionStore } from '$lib/stores/workspace';

	const variablesSwitch = () => {
		$currentPanelStore = {
			title: 'Переменные',
			id: 'variables',
			component: Variables
		};
	};

	const settingsSwitch = () => {
		currentPanelStore.clear();
	};

	const historySwitch = () => {
		$currentPanelStore = {
			title: 'История изменений',
			id: 'history',
			component: Changes,
			hasEditButton: false
		};
	};
</script>

<Header
	class={clsx('pointer-events-none', $activeActionStore ? 'blind' : 'childs:pointer-events-auto')}
>
	{#if !$readonlyStore}
		<FormSplit class="divide-main">
			<Button
				class="header-button bg-contrast text-text"
				variant="ghost"
				size="lg"
				on:click={changesHistory.undo}
				disabled={$changesHistory.currentStageId === 0}
				on:holdclick={historySwitch}
			>
				<Icon type={ArrowUturnLeft} />
			</Button>
			<Button
				class="header-button bg-contrast text-text"
				variant="ghost"
				size="lg"
				on:click={changesHistory.redo}
				disabled={$changesHistory.currentStageId + 1 >= $changesHistory.stages.length}
				on:holdclick={historySwitch}
			>
				<Icon type={ArrowUturnRight} />
			</Button>
		</FormSplit>
	{/if}
	<svelte:fragment slot="right">
		<Button
			class="header-button -mr-4 !hidden !rounded-r-none bg-contrast text-text max-lg:!block max-sm:-mr-3"
			variant="ghost"
			size="lg"
			on:click={currentPanelStore.switchVisible}
		>
			<Icon type={ChevronLeft} class="h-6 w-6" />
		</Button>
	</svelte:fragment>
	<FormSplit
		class="absolute right-4 top-20 divide-main max-sm:right-3 max-sm:top-[4.5rem]"
		vertical
	>
		<Button
			class="header-button bg-contrast !px-3 text-text"
			variant="ghost"
			size="lg"
			on:click={variablesSwitch}
		>
			<Icon type={Variable} class="h-6 w-6" />
		</Button>
		<Button
			class="header-button bg-contrast !px-3 text-text"
			variant="ghost"
			size="lg"
			on:click={settingsSwitch}
		>
			<Icon type={Cog6Tooth} class="h-6 w-6" />
		</Button>
	</FormSplit>
</Header>

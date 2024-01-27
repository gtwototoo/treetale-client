<script lang="ts">
	import clsx from 'clsx';
	import {
		ArrowUturnLeft,
		ArrowUturnRight,
		ChevronLeft,
		Cog6Tooth,
		DocumentText,
		Variable
	} from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore } from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { panelShow, panelStore } from '$lib/stores/panel';
	import { activeActionStore } from '$lib/stores/workspace';
	import { Button, FormSplit } from '$UI';

	import { Changes, Variables } from '../Panel';
	import Notes from '../Panel/Notes/Notes.svelte';
	import Header from './Header.svelte';

	const variablesSwitch = () => {
		$panelStore = {
			component: Variables,
			id: 'variables'
		};
	};

	const notesSwitch = () => {
		$panelStore = {
			component: Notes,
			id: 'notes'
		};
	};

	const settingsSwitch = () => {
		panelStore.clear();
	};

	const historySwitch = () => {
		$panelStore = {
			component: Changes,
			id: 'history'
		};
	};
</script>

<Header
	class={clsx('pointer-events-none', $activeActionStore ? 'blind' : 'childs:pointer-events-auto')}
>
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
			class="header-button -mr-4 !hidden !rounded-r-none bg-contrast text-text max-lg:!block max-sm:-mr-3"
			on:click={() => ($panelShow = !$panelShow)}
			size="lg"
			variant="ghost"
		>
			<Icon class="h-6 w-6" type={ChevronLeft} />
		</Button>
	</svelte:fragment>
	<FormSplit class="absolute right-4 top-20 max-sm:right-3 max-sm:top-[4.5rem]" vertical>
		<Button
			class="header-button bg-contrast !px-3 text-text"
			on:click={settingsSwitch}
			size="lg"
			variant="ghost"
		>
			<Icon class="h-6 w-6" type={Cog6Tooth} />
		</Button>
		<Button
			class="header-button bg-contrast !px-3 text-text"
			on:click={variablesSwitch}
			size="lg"
			variant="ghost"
		>
			<Icon class="h-6 w-6" type={Variable} />
		</Button>
		<Button
			class="header-button bg-contrast !px-3 text-text"
			on:click={notesSwitch}
			size="lg"
			variant="ghost"
		>
			<Icon class="h-6 w-6" type={DocumentText} />
		</Button>
	</FormSplit>
</Header>

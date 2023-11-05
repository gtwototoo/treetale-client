<script lang="ts">
	import clsx from 'clsx';
	import { ArrowUturnLeft, ArrowUturnRight, Variable } from 'svelte-heros-v2';

	import { Changes, Variables } from '../Panel';

	import Header from './Header.svelte';

	import Icon from '$lib/components/Icon.svelte';
	import { changesHistory } from '$lib/stores/editing';
	import { currentPanelStore } from '$lib/stores/main';
	import { activeActionStore } from '$lib/stores/workspace';
	import { Button, FormSplit } from '$UI';

	const variablesSwitch = () =>
		($currentPanelStore = {
			id: 'Переменные',
			component: Variables
		});

	const historySwitch = () =>
		($currentPanelStore = {
			id: 'История изменений',
			component: Changes,
			hasEditButton: false
		});
</script>

<Header
	class={clsx('pointer-events-none', $activeActionStore ? 'blind' : 'childs:pointer-events-auto')}
>
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
	<Button
		class="header-button bg-contrast text-text"
		variant="ghost"
		size="lg"
		on:click={variablesSwitch}
	>
		<Icon type={Variable} class="w-6 h-6" />
		<p class="mr-1">Переменные</p>
	</Button>
</Header>

<script lang="ts">
	import { Button, FormSplit } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { changesHistory } from '$lib/stores/editing';
	import { currentPanelStore } from '$lib/stores/main';
	import { ArrowUturnLeft, ArrowUturnRight, Cog6Tooth, Variable } from 'svelte-heros-v2';
	import { Changes, EditingSettings, Variables } from '../Panel';

	const variablesSwitch = () =>
		($currentPanelStore = {
			id: 'Переменные',
			component: Variables
		});
	const settingsSwitch = () =>
		($currentPanelStore = {
			id: 'Настройки',
			component: EditingSettings
		});
	const historySwitch = () =>
		($currentPanelStore = {
			id: 'История изменений',
			component: Changes
		});
</script>

<FormSplit>
	<Button
		class="headerButton"
		on:click={changesHistory.undo}
		disabled={$changesHistory.currentStageId === 0}
		on:holdclick={historySwitch}
	>
		<Icon type={ArrowUturnLeft} />
	</Button>
	<Button
		class="headerButton"
		on:click={changesHistory.redo}
		disabled={$changesHistory.currentStageId + 1 >= $changesHistory.stages.length}
		on:holdclick={historySwitch}
	>
		<Icon type={ArrowUturnRight} />
	</Button>
</FormSplit>
<Button class="headerButton bg-contrast text-text" variant="ghost" on:click={settingsSwitch}>
	<Icon type={Cog6Tooth} />
	<p>Настройки</p>
</Button>
<Button class="headerButton bg-contrast text-text" variant="ghost" on:click={variablesSwitch}>
	<Icon type={Variable} />
	<p>Переменные</p>
</Button>

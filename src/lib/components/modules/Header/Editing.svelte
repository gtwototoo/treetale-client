<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { changesHistory } from '$lib/stores/editing';
	import { currentPanel } from '$lib/stores/main';
	import { Button, ButtonSplit } from '$UI';
	import { ArrowUturnLeft, ArrowUturnRight, Cog6Tooth, Variable } from 'svelte-heros-v2';
	import { Changes, EditingSettings, Variables } from '../Panel';

	const variablesSwitch = () =>
		($currentPanel = {
			id: 'Переменные',
			component: Variables
		});
	const settingsSwitch = () =>
		($currentPanel = {
			id: 'Настройки',
			component: EditingSettings
		});
	const historySwitch = () =>
		($currentPanel = {
			id: 'История изменений',
			component: Changes
		});
</script>

<ButtonSplit>
	<Button
		on:click={changesHistory.undo}
		disabled={$changesHistory.currentStageId === 0}
		on:holdclick={historySwitch}
	>
		<Icon type={ArrowUturnLeft} />
	</Button>
	<Button
		on:click={changesHistory.redo}
		disabled={$changesHistory.currentStageId + 1 >= $changesHistory.stages.length}
		on:holdclick={historySwitch}
	>
		<Icon type={ArrowUturnRight} />
	</Button>
</ButtonSplit>
<Button class="gap-3 bg-contrast text-text" variant="ghost" on:click={settingsSwitch}>
	<Icon type={Cog6Tooth} />
	<p>Настройки</p>
</Button>
<Button class="gap-3 bg-contrast text-text" variant="ghost" on:click={variablesSwitch}>
	<Icon type={Variable} />
	<p>Переменные</p>
</Button>

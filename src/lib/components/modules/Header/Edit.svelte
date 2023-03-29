<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { currentPanel } from '$lib/stores/main';
	import { Button, ButtonSplit } from '$UI';
	import { ArrowUturnLeft, ArrowUturnRight, InformationCircle, Variable } from 'svelte-heros-v2';
	import { Variables } from '../Panel';
	import EditingSettings from '../Panel/EditingSettings.svelte';
	import ModeSelector from './ModeSelector.svelte';

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
</script>

<ButtonSplit>
	<Button>
		<Icon type={ArrowUturnLeft} />
	</Button>
	<Button>
		<Icon type={ArrowUturnRight} />
	</Button>
</ButtonSplit>
<Button class="bg-blue-500" variant="main" on:click={settingsSwitch}>
	<Icon type={InformationCircle} />
	<p>Настройки</p>
</Button>
<Button class="bg-violet-500" variant="main" on:click={variablesSwitch}>
	<Icon type={Variable} />
	<p>Переменные</p>
</Button>
<ModeSelector />

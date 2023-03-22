<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { currentPanel } from '$lib/stores/header';
	import { Button, ButtonSplit } from '$UI';
	import { ArrowUturnLeft, ArrowUturnRight, InformationCircle, Variable } from 'svelte-heros-v2';
	import ModeSelector from './ModeSelector.svelte';

	const variablesSwitch = () => {
		$currentPanel = 'Variables';
	};
	const settingsSwitch = () => {
		$currentPanel = 'Settings';
	};
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
<div class="vl" />

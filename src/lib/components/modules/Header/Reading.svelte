<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { currentPanel } from '$lib/stores/main';
	import { Button } from '$UI';
	import { BookOpen, Star } from 'svelte-heros-v2';
	import { Description, Donut } from '../Panel';

	const descriptionSwitch = () =>
		($currentPanel = {
			id: 'Описание',
			title: '',
			component: Description
		});
	const donutSwitch = () =>
		($currentPanel = {
			id: 'Поддержка',
			component: Donut
		});
</script>

<Button class="bg-blue-500" variant="main" on:click={descriptionSwitch}>
	<Icon type={BookOpen} />
	<p>Описание</p>
</Button>
<Button class="bg-yellow-500" variant="main" on:click={donutSwitch}>
	<Icon type={Star} />
	<p>Поддержать</p>
</Button>

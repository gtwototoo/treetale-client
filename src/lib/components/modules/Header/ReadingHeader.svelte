<script lang="ts">
	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { bodyColorStore, currentPanelStore } from '$lib/stores/main';
	import { contrastText } from '$lib/utils';
	import clsx from 'clsx';
	import { BookOpen, Star } from 'svelte-heros-v2';
	import { Description, Donut } from '../Panel';
	import Header from './Header.svelte';

	const descriptionSwitch = () =>
		($currentPanelStore = {
			id: 'Описание',
			title: '',
			component: Description
		});
	const donutSwitch = () =>
		($currentPanelStore = {
			id: 'Поддержка',
			component: Donut
		});
</script>

<Header>
	<Button
		class={clsx(
			'headerButton text-text',
			contrastText($bodyColorStore) ? 'bg-yellow-600' : 'bg-yellow-300'
		)}
		variant="ghost"
		on:click={donutSwitch}
	>
		<Icon type={Star} />
		<p>Поддержка</p>
	</Button>
	<Button class="headerButton bg-contrast text-text" variant="ghost" on:click={descriptionSwitch}>
		<Icon type={BookOpen} />
		<p>Описание</p>
	</Button>
</Header>

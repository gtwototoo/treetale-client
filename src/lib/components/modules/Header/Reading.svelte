<script lang="ts">
	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { currentPanel } from '$lib/stores/main';
	import { bodyColor } from '$lib/stores/story';
	import { contrastText } from '$lib/utils';
	import clsx from 'clsx';
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

<Button
	class={clsx(
		'headerButton text-text',
		contrastText($bodyColor) ? 'bg-yellow-600' : 'bg-yellow-300'
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

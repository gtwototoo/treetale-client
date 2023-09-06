<script lang="ts">
	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { createStory } from '$lib/requests/story';
	import { currentPanelStore } from '$lib/stores/main';
	import { Pencil, Plus } from 'svelte-heros-v2';
	import { ProfileSettings } from '../Panel';
	import Header from './Header.svelte';

	let loading = false;

	const settingsSwitch = () =>
		($currentPanelStore = {
			id: 'Настройки профиля',
			component: ProfileSettings
		});

	const handleClick = async () => {
		loading = true;

		await createStory();

		loading = false;
	};
</script>

<Header>
	<Button class="headerButton bg-contrast text-text" variant="ghost" on:click={settingsSwitch}>
		<Icon type={Pencil} />
		<p>Настройка профиля</p>
	</Button>

	<Button
		class="headerButton bg-emerald-400 text-text"
		variant="ghost"
		on:click={handleClick}
		{loading}
		size="lg"
	>
		<Icon type={Plus} class="w-6 h-6" />
		<p>Добавить историю</p>
	</Button>
</Header>

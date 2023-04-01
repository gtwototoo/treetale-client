<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { createStory } from '$lib/requests/story';
	import { currentPanel } from '$lib/stores/main';
	import { Button } from '$UI';
	import { Pencil, Plus } from 'svelte-heros-v2';
	import { ProfileSettings } from '../Panel';

	let loading = false;

	const settingsSwitch = () =>
		($currentPanel = {
			id: 'Настройки профиля',
			component: ProfileSettings
		});

	const handleClick = async () => {
		loading = true;

		await createStory();

		loading = false;
	};
</script>

<Button class="gap-3 bg-contrast text-text" variant="ghost" on:click={settingsSwitch}>
	<Icon type={Pencil} />
	<p>Настройка профиля</p>
</Button>

<Button class="gap-3 bg-emerald-400 text-text" variant="ghost" on:click={handleClick} {loading}>
	<Icon type={Plus} />
	<p>Добавить историю</p>
</Button>

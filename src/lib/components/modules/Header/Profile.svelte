<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
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

		if ($page.data.session) {
			await createStory();
		} else {
			await goto('/signin');
		}

		loading = false;
	};
</script>

<Button class="bg-blue-500" variant="main" on:click={settingsSwitch}>
	<Icon type={Pencil} />
	<p>Настройка профиля</p>
</Button>
<Button class="bg-emerald-500" variant="main" on:click={handleClick} {loading}>
	<Icon type={Plus} />
	<p>Добавить историю</p>
</Button>

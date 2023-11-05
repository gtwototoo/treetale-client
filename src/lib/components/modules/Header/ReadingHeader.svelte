<script lang="ts">
	import clsx from 'clsx';
	import { Star } from 'svelte-heros-v2';

	import Header from './Header.svelte';

	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import { bodyColorStore } from '$lib/stores/main';
	import { contrastText, getPageType } from '$lib/utils';
	import { Button } from '$UI';

	$: pageType = getPageType($page.url.pathname);
</script>

<Header class={clsx(pageType === 'reading' && 'fixed')}>
	<Button
		class={clsx(
			'header-button text-text',
			contrastText($bodyColorStore) ? 'bg-yellow-600' : 'bg-yellow-300'
		)}
		variant="ghost"
		size="lg"
	>
		<Icon type={Star} class="w-6 h-6" />
		<p class="mr-1">Поддержать</p>
	</Button>
</Header>

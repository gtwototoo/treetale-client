<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { RGB } from '$lib/utils';
	import { Avatar, Button } from '$UI';
	import { ArrowLeftOnRectangle } from 'svelte-heros-v2';

	$: selectedColor = $page.data?.session?.color?.length ? $page.data.session.color : DEFAULT_COLOR;
</script>

{#if $page.data.session}
	<Link href="/profile" class="contents">
		<Avatar
			style="--color-main: {RGB(selectedColor)}"
			alt={$page.data.session.name}
			src={$page.data.session.avatarId}
			width={48}
			class="light-gradient-main"
		/>
	</Link>
{:else}
	<Link href="/signin">
		<Button class="gap-3 bg-contrast text-text" variant="ghost" size="lg">
			<Icon type={ArrowLeftOnRectangle} class="w-6 h-6" />
			<p>Войти</p>
		</Button>
	</Link>
{/if}

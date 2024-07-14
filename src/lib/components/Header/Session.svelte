<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeftOnRectangle } from 'svelte-heros-v2';

	import type { User } from '$lib/types';
	import { Button, Icon, Link } from 'treetale-ui';
	import ProfileAvatar from '../ProfileAvatar.svelte';

	let user: User = $derived($page.data.session);
</script>

{#if $page.data.session}
	<Link href="/profile">
		<ProfileAvatar alt={user.name} color={user.color} src={user.imageUrl} />
	</Link>
{:else}
	<Link href="/signin">
		<Button class="gap-3 bg-main-40 text-text hover:bg-contrast" size="lg">
			<Icon class="size-6" this={ArrowLeftOnRectangle} />
			<p>Войти</p>
		</Button>
	</Link>
{/if}

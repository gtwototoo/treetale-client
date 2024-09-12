<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeftOnRectangle } from 'svelte-heros-v2';
	import { Button, Icon, Link } from 'treetale-ui';

	import type { User } from '$lib/types';

	import ProfileAvatar from '../ProfileAvatar.svelte';

	let user: User = $derived($page.data.session);
	let addLoading = $state(false);
	let base64src = $state(null);
</script>

{#if $page.data.session}
	<Link href="/profile" class="pointer-events-auto">
		<ProfileAvatar
			bind:addLoading
			bind:base64src
			alt={user.name}
			color={user.color}
			src={user.imageUrl}
		/>
	</Link>
{:else}
	<Link href="/signin" class="pointer-events-auto">
		<Button class="gap-3 bg-main-40 text-text hover:bg-contrast" size="lg">
			<Icon class="size-6" this={ArrowLeftOnRectangle} />
			<p>Войти</p>
		</Button>
	</Link>
{/if}

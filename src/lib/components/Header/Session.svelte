<script lang="ts">
	import { page } from '$app/state';

	import { ArrowLeftOnRectangle } from 'svelte-heros-v2';
	import { Button, Icon, Link } from 'treetale-ui';

	import type { User } from '$lib/types';

	import ProfileAvatar from '../ProfileAvatar.svelte';

	let user = $derived(page.data.session as User);
	let addLoading = $state(false);
	let base64src = $state('');
</script>

{#if page.data.session}
	<Link href="/profile" class="pointer-events-auto">
		<ProfileAvatar
			bind:base64src
			bind:addLoading
			alt={user.name}
			color={user.color}
			src={user.imageUrl}
		/>
	</Link>
{:else}
	<Link href="/signin" class="pointer-events-auto">
		<Button class="bg-main-400 text-text hover:bg-contrast gap-3" size="lg">
			<Icon class="size-6" this={ArrowLeftOnRectangle} />
			<p>Войти</p>
		</Button>
	</Link>
{/if}

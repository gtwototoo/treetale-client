<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeftOnRectangle } from 'svelte-heros-v2';

	import ProfileAvatar from '$lib/components/ProfileAvatar.svelte';
	import { Button, Icon, Link } from 'treetale-ui';
</script>

{#if $page.data.session}
	<Link class="contents" href="/profile">
		<ProfileAvatar color={$page.data.session.color} size="base" user={$page.data.session} />
	</Link>
{:else}
	<Link href="/signin">
		<Button class="gap-3 bg-contrast text-text" size="lg">
			<Icon class="size-6" this={ArrowLeftOnRectangle} />
			<p>Войти</p>
		</Button>
	</Link>
{/if}

<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeftOnRectangle } from 'svelte-heros-v2';

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import ProfileAvatar from '$lib/components/ProfileAvatar.svelte';
</script>

{#if $page.data.session}
	<Link class="contents" href="/profile">
		<ProfileAvatar color={$page.data.session.color} size="base" user={$page.data.session} />
	</Link>
{:else}
	<Link href="/signin">
		<Button class="gap-3 bg-contrast text-text" size="lg" variant="ghost">
			<Icon class="h-6 w-6" type={ArrowLeftOnRectangle} />
			<p>Войти</p>
		</Button>
	</Link>
{/if}

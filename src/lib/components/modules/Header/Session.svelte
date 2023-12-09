<script lang="ts">
	import { ArrowLeftOnRectangle } from 'svelte-heros-v2';

	import { Button } from '$UI';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import ProfileAvatar from '$lib/components/ProfileAvatar.svelte';
</script>

{#if $page.data.session}
	<Link href="/profile" class="contents">
		<ProfileAvatar size="base" user={$page.data.session} color={$page.data.session.color} />
	</Link>
{:else}
	<Link href="/signin">
		<Button class="gap-3 bg-contrast text-text" variant="ghost" size="lg">
			<Icon type={ArrowLeftOnRectangle} class="h-6 w-6" />
			<p>Войти</p>
		</Button>
	</Link>
{/if}

<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import ProfileLink from '$lib/components/ProfileLink.svelte';
	import { Button } from '$UI';
	import { ArrowLeftOnRectangle } from 'svelte-heros-v2';
</script>

{#if $page.data.session}
	<ProfileLink data={$page.data.session} class="shrink-0" />
{:else}
	<Link href="/signin">
		<Button class="gap-3 bg-contrast text-text" variant="ghost">
			<Icon type={ArrowLeftOnRectangle} />
			<p>Войти</p>
		</Button>
	</Link>
{/if}

<script lang="ts">
	import { page } from '$app/state';

	import { UserCircle } from 'svelte-heros-v2';
	import { Icon, Link } from 'treetale-ui';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import type { User } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	import ProfileAvatar from '../ProfileAvatar.svelte';

	import AuthModal from './AuthModal.svelte';

	let user = $derived(page.data.session as User);
	let addLoading = $state(false);
	let base64src = $state('');
	let active = $state(false);

	const correctColor = $derived(user.color || DEFAULT_COLOR);
</script>

{#if page.data.session}
	<Link href="/profile" class="pointer-events-auto">
		<ProfileAvatar
			class="hover:bg-main-500 size-12 text-lg"
			bind:base64src
			bind:addLoading
			alt={user.name}
			color={correctColor}
			src={user.imageUrl}
		/>
	</Link>
{:else}
	<Button
		class={clm(button.size.lg, button.type.primary, 'gap-3 pl-4')}
		onclick={() => (active = true)}
	>
		<Icon class="size-6" this={UserCircle} />
		<p>Войти</p>
	</Button>
	<AuthModal bind:active />
{/if}

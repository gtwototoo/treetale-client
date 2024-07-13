<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import type { User } from '$lib/types';
	import { Button } from 'treetale-ui';

	import ProfileAvatar from './ProfileAvatar.svelte';

	let {
		author,
		created
	}: {
		author: User;
		created: number;
	} = $props();

	const handleClick = () => {
		goto($page.data.session?.userId === author.userId ? '/profile' : `@${author.name}`);
	};

	let date = $derived(new Date(created).toLocaleDateString('en-GB'));
</script>

<Button class="min-w-0 gap-2 p-0" onclick={handleClick}>
	<ProfileAvatar color={author.color} size="sm" user={author} />
	<div class="overflow-hidden text-left">
		<p class="truncate text-text max-xs:hidden">
			{author.name}
		</p>
		<p class="truncate text-xs text-gray-500">
			{date}
		</p>
	</div>
</Button>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import type { User } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';
	import { Button } from 'treetale-ui';
	import ProfileAvatar from '../ProfileAvatar.svelte';

	let {
		author,
		created,
		infoColor
	}: {
		author: User;
		created: number;
		infoColor: string;
	} = $props();

	const handleClick = () => {
		goto($page.data.session?.userId === author.userId ? '/profile' : `@${author.name}`);
	};

	let date = $derived(new Date(created).toLocaleDateString('en-GB'));
</script>

<Button class={clm('min-w-0 gap-2 rounded-full p-1', infoColor)} onclick={handleClick}>
	<ProfileAvatar color={author.color} size="sm" user={author} />
	<div class="overflow-hidden pr-4 text-left max-md:hidden">
		<p class="truncate text-text max-xs:hidden">
			{author.name}
		</p>
		<p class="truncate text-xs text-gray-500">
			{date}
		</p>
	</div>
</Button>

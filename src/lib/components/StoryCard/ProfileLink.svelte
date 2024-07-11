<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import clsx from 'clsx';

	import type { IUser } from '$lib/types';

	import { Button } from '$UI';

	import ProfileAvatar from '../ProfileAvatar.svelte';

	export let author: IUser;
	export let created: number;
	export let infoColor: string;

	const handleClick = () => {
		goto($page.data.session?.userId === author.userId ? '/profile' : `@${author.name}`);
	};

	$: date = new Date(created).toLocaleDateString('en-GB');
</script>

<Button
	class={clsx('min-w-0 gap-2 !rounded-full !p-1', infoColor)}
	on:click={handleClick}
	variant="main"
>
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

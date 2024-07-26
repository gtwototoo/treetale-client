<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { pluralize } from 'pluralize-ru-ts';
	import { Button } from 'treetale-ui';

	import type { User } from '$lib/types';

	import { clm } from '$lib/utils/classMerge';
	import { collapseValue } from '$lib/utils/number';

	import ProfileAvatar from '../ProfileAvatar.svelte';

	let {
		author,
		class: classname
	}: {
		author: {
			subscribersCount: number;
		} & User;
		class: string;
	} = $props();

	let subscribersPluralize = pluralize('читатель', 'читателя', 'читателей');

	const handleClick = () => {
		goto($page.data.session?.userId === author.userId ? '/profile' : `@${author.name}`);
	};
</script>

<Button class={clm('min-w-0 rounded-full rounded-br-none p-1', classname)} onclick={handleClick}>
	<ProfileAvatar
		color={author.color}
		size="sm"
		alt={author.name}
		src={author.imageUrl}
		class="max-sm:size-8"
	/>
	<div class="ml-2 mr-5 overflow-hidden text-left text-text max-md:hidden">
		<p class="truncate text-base/5 font-medium max-xs:hidden">
			{author.name}
		</p>
		<p class="truncate text-xs">
			{collapseValue(author.subscribersCount)}
			{subscribersPluralize(author.subscribersCount)}
		</p>
	</div>
</Button>

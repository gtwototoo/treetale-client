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
		class: classname,
		mobileView
	}: {
		author: {
			subscribersCount: number;
		} & User;
		class?: string;
		mobileView?: boolean;
	} = $props();

	let subscribersPluralize = pluralize('читатель', 'читателя', 'читателей');
	let base64src = $state('');
	let addLoading = $state(false);

	const handleClick = async () => {
		await goto($page.data.session?.userId === author.userId ? '/profile' : `@${author.name}`);
	};
</script>

<Button class={clm('min-w-0 rounded-full p-1', classname)} onclick={handleClick}>
	<ProfileAvatar
		bind:base64src
		bind:addLoading
		color={author.color}
		size="sm"
		alt={author.name}
		src={author.imageUrl}
		class={clm(mobileView && 'max-sm:size-8')}
	/>
	<div class={clm('ml-2 mr-5 overflow-hidden text-left text-text', mobileView && 'max-md:hidden')}>
		<p class="truncate text-base/5 font-medium">
			{author.name}
		</p>
		<p class="truncate text-xs">
			{collapseValue(author.subscribersCount)}
			{subscribersPluralize(author.subscribersCount)}
		</p>
	</div>
</Button>

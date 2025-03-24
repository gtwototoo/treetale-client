<script lang="ts">
	import { page } from '$app/state';

	import { pluralize } from 'pluralize-ru-ts';

	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import type { User } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';
	import { generateMainColors } from '$lib/utils/customColors';
	import { collapseValue } from '$lib/utils/number';

	import ProfileAvatar from '../ProfileAvatar.svelte';

	const {
		author,
		class: classname,
		mobileView,
		isButton = true
	}: {
		author: {
			subscribersCount: number;
		} & User;
		class?: string;
		mobileView?: boolean;
		isButton?: boolean;
	} = $props();

	const subscribersPluralize = pluralize('читатель', 'читателя', 'читателей');

	let base64src = $state('');
	let addLoading = $state(false);

	const correctColor = $derived(author.color || DEFAULT_COLOR);
	const href = $derived(
		page.data.session?.userId === author.userId ? '/profile' : `@${author.linkName}`
	);
</script>

{#snippet userInfo()}
	<ProfileAvatar
		bind:base64src
		bind:addLoading
		color={correctColor}
		alt={author.name}
		src={author.imageUrl}
		class={clm('size-10', mobileView && 'max-sm:size-8')}
	/>
	<div class={clm('mr-5 ml-2 overflow-hidden text-left', mobileView && 'max-md:hidden')}>
		<p class="truncate text-base/5 font-medium">
			{author.name}
		</p>
		<p class="truncate text-xs">
			{collapseValue(author.subscribersCount)}
			{subscribersPluralize(author.subscribersCount)}
		</p>
	</div>
{/snippet}

<div class="contents" style={generateMainColors(correctColor)}>
	{#if isButton}
		<Button
			class={clm(button.type.primary, button.size.lg, 'min-w-0 p-1', classname)}
			asLink
			{href}
		>
			{@render userInfo()}
		</Button>
	{:else}
		<div class={clm('flex min-w-0 items-center p-1 whitespace-nowrap', classname)}>
			{@render userInfo()}
		</div>
	{/if}
</div>

<script lang="ts">
	import { Selector, SelectorItem } from '$UI';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { bodyColorStore } from '$lib/stores/main';
	import type { IUser } from '$lib/types/index.js';
	import { findByPattern, rootStyle } from '$lib/utils';
	import { Eye, Heart, Pencil } from 'svelte-heros-v2';
	import UserInformation from '../../lib/components/UserInformation.svelte';

	export let data;

	const me = $page.data.session && $page.data.session.userId === data.user.userId;
	const user: IUser = me ? $page.data.session : data.user;

	const getPageType = (path: string): 'viewed' | 'liked' | 'main' => {
		return findByPattern(path, {
			main: /^\/profile$/,
			liked: /^\/profile\/liked$/,
			viewed: /^\/profile\/viewed$/
		}) as 'viewed' | 'liked' | 'main';
	};

	$: pageType = getPageType($page.url.pathname);
	$: ({ statistic } = data);
	$: $bodyColorStore = user.color.length ? user.color : DEFAULT_COLOR;
</script>

<svelte:head>
	<title>{me ? 'Профиль' : user.name}</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<div class="flex gap-8 screen-sm items-start screen-md p-16 screen-hd screen-xl grow">
	<UserInformation {user} {me} {statistic} />
	<div class="flex flex-col w-full items-center gap-8 min-h-full">
		{#if me}
			<Selector class="overflow-hidden">
				<Link href="/profile">
					<SelectorItem active={pageType === 'main'} class="w-20 justify-center xs:w-auto">
						<Icon type={Pencil} class="xs:hidden" />
						<p class="hidden xs:block">Созданные</p>
					</SelectorItem>
				</Link>
				<Link href="/profile/liked">
					<SelectorItem active={pageType === 'liked'} class="w-20 justify-center xs:w-auto">
						<Icon type={Heart} class="xs:hidden" />
						<p class="hidden xs:block">Понравившиеся</p>
					</SelectorItem>
				</Link>
				<Link href="/profile/viewed">
					<SelectorItem active={pageType === 'viewed'} class="w-20 justify-center xs:w-auto">
						<Icon type={Eye} class="xs:hidden" />
						<p class="hidden xs:block">Просмотренные</p>
					</SelectorItem>
				</Link>
			</Selector>
		{:else}
			<h1>Список историй</h1>
		{/if}
		<slot />
	</div>
</div>

<style lang="postcss">
	.screen-hd {
		@apply max-hd:p-12;
	}
	.screen-xl {
		@apply max-xl:gap-6 max-xl:p-10;
	}
	.screen-md {
		@apply max-md:flex-col max-md:items-center;
	}
	.screen-sm {
		@apply max-sm:p-2;
	}
</style>

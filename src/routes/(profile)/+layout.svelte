<script lang="ts">
	import { Button } from '$UI';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import UserInformation from '$lib/components/UserInformation.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { bodyColorStore } from '$lib/stores/main';
	import { findByPattern, rootStyle } from '$lib/utils';
	import clsx from 'clsx';
	import { Eye, Heart, Pencil } from 'svelte-heros-v2';

	export let data;

	const me = $page.data.session && $page.data.session.userId === data.user.userId;

	const getPageType = (path: string): 'viewed' | 'liked' | 'main' => {
		return findByPattern(path, {
			main: /^\/profile$/,
			liked: /^\/profile\/liked$/,
			viewed: /^\/profile\/viewed$/
		}) as 'viewed' | 'liked' | 'main';
	};

	$: user = me ? $page.data.session : data.user;
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
			<div class="flex gap-2">
				<Link href="/profile">
					<Button
						size="lg"
						variant="custom"
						class={clsx(
							'!text-text hover:bg-contrast !transition-colors',
							pageType === 'main' && 'bg-contrast/20'
						)}
					>
						<Icon type={Pencil} class="max-xs:block hidden" />
						<p class="max-xs:hidden">Созданные</p>
					</Button>
				</Link>
				<Link href="/profile/liked">
					<Button
						size="lg"
						variant="custom"
						class={clsx(
							'!text-text hover:bg-contrast transition-colors',
							pageType === 'liked' && 'bg-contrast/20'
						)}
					>
						<Icon type={Heart} class="max-xs:block hidden" />
						<p class="max-xs:hidden">Понравившиеся</p>
					</Button>
				</Link>
				<Link href="/profile/viewed">
					<Button
						size="lg"
						variant="custom"
						class={clsx(
							'!text-text hover:bg-contrast transition-colors',
							pageType === 'viewed' && 'bg-contrast/20'
						)}
					>
						<Icon type={Eye} class="max-xs:block hidden" />
						<p class="max-xs:hidden">Просмотренные</p>
					</Button>
				</Link>
			</div>
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

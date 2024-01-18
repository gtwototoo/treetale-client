<script lang="ts">
	import clsx from 'clsx';
	import { Clock, Eye, Heart, Pencil } from 'svelte-heros-v2';

	import { Button } from '$UI';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import UserInformation from '$lib/components/UserInformation.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { bodyColorStore } from '$lib/stores/main';
	import { getPageType, rootStyle } from '$lib/utils';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;

	const me = $page.data.session && $page.data.session.userId === data.user.userId;

	$: user = me ? $page.data.session : data.user;
	$: pageType = getPageType($page.url.pathname);
	$: ({ statistic } = data);
	$: $bodyColorStore = user.color.length ? user.color : DEFAULT_COLOR;
</script>

<svelte:head>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<MetaTags title={me ? 'Профиль' : user.name} description={user.description} />

<div class="screen-sm screen-md screen-hd screen-xl flex grow items-start gap-8 p-16">
	<UserInformation {user} {me} {statistic} />
	<div class="flex h-full w-full flex-col items-center gap-8">
		{#if me}
			<div class="flex flex-wrap justify-center gap-2">
				{#if $page.data.session.role === 'moderator' || $page.data.session.role === 'admin'}
					<Link href="/profile/moderated" class="w-44 max-sm:w-24">
						<Button
							size="lg"
							variant="custom"
							class={clsx(
								'w-full justify-center !text-text transition-colors hover:bg-contrast',
								pageType === 'moderated' && 'bg-contrast/20'
							)}
						>
							<Icon type={Clock} class="hidden h-6 w-6 max-sm:block" />
							<p class="max-sm:hidden">Модерируемые</p>
						</Button>
					</Link>
				{/if}
				<Link href="/profile" class="w-44 max-sm:w-24">
					<Button
						size="lg"
						variant="custom"
						class={clsx(
							'w-full justify-center !text-text !transition-colors hover:bg-contrast',
							pageType === 'profile' && 'bg-contrast/20'
						)}
					>
						<Icon type={Pencil} class="hidden h-6 w-6 max-sm:block" />
						<p class="max-sm:hidden">Созданные</p>
					</Button>
				</Link>
				<Link href="/profile/liked" class="w-44 max-sm:w-24">
					<Button
						size="lg"
						variant="custom"
						class={clsx(
							'w-full justify-center !text-text transition-colors hover:bg-contrast',
							pageType === 'liked' && 'bg-contrast/20'
						)}
					>
						<Icon type={Heart} class="hidden h-6 w-6 max-sm:block" />
						<p class="max-sm:hidden">Понравившиеся</p>
					</Button>
				</Link>
				<Link href="/profile/viewed" class="w-44 max-sm:w-24">
					<Button
						size="lg"
						variant="custom"
						class={clsx(
							'w-full justify-center !text-text transition-colors hover:bg-contrast',
							pageType === 'viewed' && 'bg-contrast/20'
						)}
					>
						<Icon type={Eye} class="hidden h-6 w-6 max-sm:block" />
						<p class="max-sm:hidden">Просмотренные</p>
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
		@apply max-sm:p-3;
	}
</style>

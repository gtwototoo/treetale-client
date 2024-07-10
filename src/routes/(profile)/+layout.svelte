<script lang="ts">
	import { page } from '$app/stores';
	import clsx from 'clsx';
	import { type Person } from 'schema-dts';
	import { Clock, Eye, Heart, Pencil } from 'svelte-heros-v2';
	import { JsonLd, MetaTags } from 'svelte-meta-tags';

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import UserInformation from '$lib/components/UserInformation.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { bodyColorStore } from '$lib/stores/main';
	import { getPageType, rootStyle } from '$lib/utils';

	export let data;

	const me = $page.data.session && $page.data.session.userId === data.user.userId;

	$: user = me ? $page.data.session : data.user;
	$: pageType = getPageType($page.url.pathname);
	$: ({ statistic } = data);
	$: $bodyColorStore = user.color.length ? user.color : DEFAULT_COLOR;

	$: userSchema = {
		'@type': 'Person',
		name: user.name
	} as Person;
</script>

<svelte:head>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<JsonLd schema={userSchema} />
<MetaTags description={user.description} title={me ? 'Профиль' : user.name} />

<div class="screen-sm screen-hd screen-lg screen-xl flex grow items-start gap-8 p-16">
	<UserInformation {me} {statistic} {user} />
	<div class="flex size-full flex-col items-center gap-8">
		{#if me}
			<div class="flex flex-wrap justify-center gap-2">
				{#if $page.data.session.role === 'moderator' || $page.data.session.role === 'admin'}
					<Link class="w-44 max-sm:w-24" href="/profile/moderated">
						<Button
							class={clsx(
								'w-full justify-center !text-text transition-colors hover:bg-contrast',
								pageType === 'moderated' && 'bg-contrast/20'
							)}
							size="lg"
							variant="custom"
						>
							<Icon class="hidden size-6 max-sm:block" type={Clock} />
							<p class="max-sm:hidden">Модерируемые</p>
						</Button>
					</Link>
				{/if}
				<Link class="w-44 max-sm:w-24" href="/profile">
					<Button
						class={clsx(
							'w-full justify-center !text-text !transition-colors hover:bg-contrast',
							pageType === 'profile' && 'bg-contrast/20'
						)}
						size="lg"
						variant="custom"
					>
						<Icon class="hidden size-6 max-sm:block" type={Pencil} />
						<p class="max-sm:hidden">Созданные</p>
					</Button>
				</Link>
				<Link class="w-44 max-sm:w-24" href="/profile/liked">
					<Button
						class={clsx(
							'w-full justify-center !text-text transition-colors hover:bg-contrast',
							pageType === 'liked' && 'bg-contrast/20'
						)}
						size="lg"
						variant="custom"
					>
						<Icon class="hidden size-6 max-sm:block" type={Heart} />
						<p class="max-sm:hidden">Понравившиеся</p>
					</Button>
				</Link>
				<Link class="w-44 max-sm:w-24" href="/profile/viewed">
					<Button
						class={clsx(
							'w-full justify-center !text-text transition-colors hover:bg-contrast',
							pageType === 'viewed' && 'bg-contrast/20'
						)}
						size="lg"
						variant="custom"
					>
						<Icon class="hidden size-6 max-sm:block" type={Eye} />
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
	.screen-lg {
		@apply max-lg:flex-col max-lg:items-center;
	}
	.screen-sm {
		@apply max-sm:p-3;
	}
</style>

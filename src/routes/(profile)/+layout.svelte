<script lang="ts">
	import { page } from '$app/stores';
	import { type Person } from 'schema-dts';
	import { Clock, Eye, Heart, Pencil } from 'svelte-heros-v2';
	import { JsonLd, MetaTags } from 'svelte-meta-tags';

	import UserInformation from '$lib/components/UserInformation.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { bodyColorStore } from '$lib/stores/main';
	import { clm } from '$lib/utils/classMerge';
	import { rootStyle } from '$lib/utils/customColors';
	import { getPageType } from '$lib/utils/page';
	import { Button, Icon, Link } from 'treetale-ui';

	let { data, children } = $props();

	const me = $page.data.session && $page.data.session.userId === data.user.userId;

	let user = $derived(me ? $page.data.session : data.user);
	let pageType = $derived(getPageType($page.url.pathname));
	let { statistic } = $derived(data);
	let userSchema = $derived({
		'@type': 'Person',
		name: user.name
	} as Person);

	$effect(() => {
		$bodyColorStore = user.color.length ? user.color : DEFAULT_COLOR;
	});
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
							class={clm(
								'w-full justify-center !text-text transition-colors hover:bg-contrast',
								pageType === 'moderated' && 'bg-contrast/20'
							)}
							size="lg"
						>
							<Icon class="hidden size-6 max-sm:block" this={Clock} />
							<p class="max-sm:hidden">Модерируемые</p>
						</Button>
					</Link>
				{/if}
				<Link class="w-44 max-sm:w-24" href="/profile">
					<Button
						class={clm(
							'w-full justify-center !text-text !transition-colors hover:bg-contrast',
							pageType === 'profile' && 'bg-contrast/20'
						)}
						size="lg"
					>
						<Icon class="hidden size-6 max-sm:block" this={Pencil} />
						<p class="max-sm:hidden">Созданные</p>
					</Button>
				</Link>
				<Link class="w-44 max-sm:w-24" href="/profile/liked">
					<Button
						class={clm(
							'w-full justify-center !text-text transition-colors hover:bg-contrast',
							pageType === 'liked' && 'bg-contrast/20'
						)}
						size="lg"
					>
						<Icon class="hidden size-6 max-sm:block" this={Heart} />
						<p class="max-sm:hidden">Понравившиеся</p>
					</Button>
				</Link>
				<Link class="w-44 max-sm:w-24" href="/profile/viewed">
					<Button
						class={clm(
							'w-full justify-center !text-text transition-colors hover:bg-contrast',
							pageType === 'viewed' && 'bg-contrast/20'
						)}
						size="lg"
					>
						<Icon class="hidden size-6 max-sm:block" this={Eye} />
						<p class="max-sm:hidden">Просмотренные</p>
					</Button>
				</Link>
			</div>
		{:else}
			<h1>Список историй</h1>
		{/if}
		{@render children()}
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

<script lang="ts">
	import { page } from '$app/stores';
	import { type Person } from 'schema-dts';
	import { Clock, Eye, Heart, Pencil } from 'svelte-heros-v2';

	import UserInformation from '$lib/components/UserInformation.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { bodyColorStore } from '$lib/stores/main';
	import { clm } from '$lib/utils/classMerge';
	import { rootStyle } from '$lib/utils/customColors';
	import { Button, Icon, Link } from 'treetale-ui';

	let { data, children } = $props();

	const me = $page.data.session && $page.data.session.userId === data.user.userId;

	let user = $derived(me ? $page.data.session : data.user);
	let { statistic } = $derived(data);
	let userSchema = $derived({
		'@type': 'Person',
		name: user.name
	} as Person);

	$effect(() => {
		$bodyColorStore = user.color.length ? user.color : DEFAULT_COLOR;
	});

	let tabs = [
		{
			name: 'Модерируемые',
			href: '/profile/moderated',
			icon: Clock
		},
		{
			name: 'Созданные',
			href: '/profile',
			icon: Pencil
		},
		{
			name: 'Понравившиеся',
			href: '/profile/liked',
			icon: Heart
		},
		{
			name: 'Просмотренные',
			href: '/profile/viewed',
			icon: Eye
		}
	];
</script>

<svelte:head>
	{@html rootStyle($bodyColorStore)}
	<title>{me ? 'Профиль' : user.name}</title>
	<meta name="description" content={user.description} />
</svelte:head>

<div class="screen-sm screen-hd screen-lg screen-xl flex grow items-start gap-8 p-16">
	<UserInformation {me} {statistic} {user} />
	<div class="flex size-full flex-col items-center gap-8">
		{#if me}
			<div class="flex flex-wrap justify-center gap-2">
				{#each tabs as { name, href, icon }}
					{#if href !== '/profile/moderated' || $page.data.session.role === 'moderator' || $page.data.session.role === 'admin'}
						<Link class="w-44 max-sm:w-24" {href}>
							<Button
								class={clm(
									'w-full justify-center text-text hover:bg-contrast',
									$page.url.pathname === href && 'bg-main-70'
								)}
								size="lg"
							>
								<Icon class="hidden size-6 max-sm:block" this={icon} />
								<p class="max-sm:hidden">{name}</p>
							</Button>
						</Link>
					{/if}
				{/each}
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

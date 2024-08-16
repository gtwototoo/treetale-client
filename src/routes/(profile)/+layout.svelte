<script lang="ts">
	import { page } from '$app/stores';
	import { Clock, Eye, Heart, Pencil } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import MainHeader from '$lib/components/Header/MainHeader.svelte';
	import SvgGradient from '$lib/components/SvgGradient.svelte';
	import UserInformation from '$lib/components/UserInformation.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { bodyBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { rootStyle } from '$lib/utils/customColors';

	let { children, data } = $props();

	const me = $page.data.session && $page.data.session.userId === data.user.userId;

	let user = $derived(me ? $page.data.session : data.user);
	let { statistic } = $derived(data);
	// let userSchema = $derived({
	// 	'@type': 'Person',
	// 	name: user.name
	// } as Person);

	$effect(() => {
		bodyBackgroundColorStore.color = user.color.length ? user.color : DEFAULT_COLOR;
	});

	let tabs = [
		{
			href: '/profile/moderated',
			icon: Clock,
			name: 'Модерируемые'
		},
		{
			href: '/profile',
			icon: Pencil,
			name: 'Созданные'
		},
		{
			href: '/profile/liked',
			icon: Heart,
			name: 'Понравившиеся'
		},
		{
			href: '/profile/viewed',
			icon: Eye,
			name: 'Просмотренные'
		}
	];
</script>

<svelte:head>
	{@html rootStyle(bodyBackgroundColorStore.color)}
	<title>{me ? 'Профиль' : user.name}</title>
	<meta name="description" content={user.description} />
</svelte:head>

<SvgGradient />

<div class="relative flex size-full flex-col">
	<MainHeader />
	<div class="screen-sm screen-hd screen-lg screen-xl flex grow items-start gap-6 p-16">
		<UserInformation {me} {statistic} {user} />
		<div class="flex size-full flex-col items-center gap-8">
			{#if me}
				<table
					class="-ml-1 w-[calc(100%+0.5rem)] table-fixed border-separate border-spacing-x-1"
				>
					<tbody>
						<tr>
							{#each tabs as { href, icon, name }}
								{#if href !== '/profile/moderated' || $page.data.session.role === 'moderator' || $page.data.session.role === 'admin'}
									<td>
										<Button
											asLink
											{href}
											class={clm(
												'justify-center text-text hover:bg-main-70',
												$page.url.pathname === href && 'bg-main-50'
											)}
											size="lg"
										>
											<Icon class="hidden size-6 max-sm:block" this={icon} />
											<p class="max-sm:hidden">{name}</p>
										</Button>
									</td>
								{/if}
							{/each}
						</tr>
					</tbody>
				</table>
			{:else}
				<h1>Список историй</h1>
			{/if}
			{@render children()}
		</div>
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

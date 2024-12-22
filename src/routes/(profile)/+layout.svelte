<script lang="ts">
	import { page } from '$app/state';

	import { type Person } from 'schema-dts';
	import { Clock, Eye, Heart, Pencil } from 'svelte-heros-v2';
	import { JsonLd, MetaTags } from 'svelte-meta-tags';
	import { Button, Icon } from 'treetale-ui';

	import MainHeader from '$lib/components/Header/MainHeader.svelte';
	import SvgGradient from '$lib/components/SvgGradient.svelte';
	import UserInformation from '$lib/components/UserInformation.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { bodyBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { rootStyle } from '$lib/utils/customColors';

	let { children, data } = $props();

	const me = page.data.session?.userId === data.user.userId;

	let user = $derived(me ? page.data.session : data.user);
	let { statistic } = $derived(data);
	let { role, name, description, color } = $derived(user);
	let adminUser = $derived(me && (role === 'moderator' || role === 'admin'));

	let userSchema = $derived({
		'@type': 'Person',
		name
	} as Person);

	$effect(() => {
		bodyBackgroundColorStore.color = color.length ? color : DEFAULT_COLOR;
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
			href: '/profile/saved',
			icon: Eye,
			name: 'Сохраненные'
		}
	];
</script>

<JsonLd schema={userSchema} />
<MetaTags {description} title={me ? 'Профиль' : name} />

<svelte:head>
	{@html rootStyle(bodyBackgroundColorStore.color)}
</svelte:head>

<SvgGradient />

<div class="relative flex size-full flex-col">
	<MainHeader />
	<div class="screen-sm screen-hd screen-lg screen-xl flex grow items-start gap-6 p-16">
		<UserInformation {me} {statistic} {user} />
		<div class="flex size-full flex-col items-center gap-5">
			{#if me}
				<table
					class="sticky top-0 z-10 -ml-1 w-[calc(100%+0.5rem)] table-fixed border-separate border-spacing-x-1 bg-main-20 py-3"
				>
					<tbody>
						<tr>
							{#each tabs as { href, icon, name }}
								{#if href !== '/profile/moderated' || adminUser}
									<td>
										<Button
											asLink
											{href}
											class={clm(
												'justify-center text-text hover:bg-main-70',
												page.url.pathname === href && 'bg-main-50'
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

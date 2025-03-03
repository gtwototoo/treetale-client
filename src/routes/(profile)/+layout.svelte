<script lang="ts">
	import { page } from '$app/state';

	import { type Person } from 'schema-dts';
	import { Clock, Eye, Heart, Pencil } from 'svelte-heros-v2';
	import { JsonLd, MetaTags } from 'svelte-meta-tags';
	import { Button, Icon } from 'treetale-ui';

	import MainHeader from '$lib/components/Header/MainHeader.svelte';
	import RootStyles from '$lib/components/RootStyles.svelte';
	import UserInformation from '$lib/components/UserInformation.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { clm } from '$lib/utils/classMerge';
	import ProfileHeader from '$lib/components/Header/ProfileHeader.svelte';

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
<RootStyles init={color || DEFAULT_COLOR} />

<div class="relative flex size-full flex-col">
	<ProfileHeader />
	<div class="screen-sm screen-hd screen-lg screen-xl flex grow items-start gap-6 p-16">
		<UserInformation {me} {statistic} {user} />
		<div class="flex size-full flex-col items-center gap-5">
			{#if me}
				<table
					class="bg-main-200 sticky top-0 z-10 -ml-1 w-[calc(100%+0.5rem)] table-fixed border-separate border-spacing-x-1 py-3"
				>
					<tbody>
						<tr>
							{#each tabs as { href, icon, name } (href)}
								{#if href !== '/profile/moderated' || adminUser}
									<td>
										<Button
											asLink
											{href}
											class={clm(
												'text-text hover:bg-main-700 justify-center',
												page.url.pathname === href && 'bg-main-500'
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
	@reference "../../app.css";

	.screen-hd {
		@apply max-2xl:p-12;
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

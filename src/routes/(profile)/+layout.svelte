<script lang="ts">
	import { page } from '$app/state';

	import { type Person } from 'schema-dts';
	import { Clock, Eye, Heart, Pencil } from 'svelte-heros-v2';
	import { JsonLd, MetaTags } from 'svelte-meta-tags';
	import { Icon } from 'treetale-ui';

	import ProfileHeader from '$lib/components/Header/ProfileHeader.svelte';
	import RootStyles from '$lib/components/RootStyles.svelte';
	import UserInformation from '$lib/components/UserInformation.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import Button from '$lib/ui/Button.svelte';
	import { button } from '$lib/ui/presets.js';
	import { clm } from '$lib/utils/classMerge';

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
	<div class="screen-sm screen-hd screen-lg screen-xl flex grow gap-4 p-4">
		<UserInformation {me} {statistic} {user} />
		<div
			class="ring-main-500 bg-contrast flex size-full h-auto flex-col items-center rounded-3xl p-2 ring-1"
		>
			{#if me}
				<table
					class="bg-contrast/90 sticky top-2 z-10 w-full table-fixed border-separate border-spacing-x-2 rounded-3xl py-2"
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
												button.type.primary,
												button.size.lg,
												page.url.pathname === href
													? 'bg-main-500'
													: 'bg-transparent ring-transparent',
												'justify-center'
											)}
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

	.screen-lg {
		@apply max-lg:flex-col max-lg:items-center;
	}
	.screen-sm {
		@apply max-sm:p-3;
	}
</style>

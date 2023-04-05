<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import Main from '$lib/components/modules/Header/Main.svelte';
	import ProfileAvatar from '$lib/components/ProfileAvatar.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { signOutUser } from '$lib/requests/user';
	import { currentHeader } from '$lib/stores/main';
	import { mainColor } from '$lib/stores/story';
	import { findByPattern } from '$lib/utils';
	import { Button, Selector, SelectorItem } from '$UI';
	import { onDestroy } from 'svelte';
	import {
		ArrowRightOnRectangle,
		Eye,
		Heart,
		InformationCircle,
		Pencil,
		UserPlus
	} from 'svelte-heros-v2';

	$currentHeader = Main;

	export let data;

	const me = $page.data.session && $page.data.session.userId === data.user.userId;
	const user = me ? $page.data.session : data.user;

	const pageType = (path: string): 'viewed' | 'liked' | 'main' => {
		return findByPattern(path, {
			main: /^\/profile$/,
			liked: /^\/profile\/liked$/,
			viewed: /^\/profile\/viewed$/
		}) as 'viewed' | 'liked' | 'main';
	};

	const handleSubscribe = () => {
		if ($page.data.session) {
			alert('Coming soon');
		} else {
			goto('/signin');
		}
	};

	const handleSignOut = async () => {
		const { response } = await signOutUser();

		if (!response.error) {
			goto('/', {
				replaceState: true,
				invalidateAll: true
			});
		}
	};

	$: ({ url } = $page);
	$: ({ statistic } = data);

	if (user && user.color && user.color.length) {
		mainColor.set(user.color);
	}

	onDestroy(() => {
		mainColor.set(DEFAULT_COLOR);
	});
</script>

<div class="profile">
	<div>
		<ProfileAvatar {user} {me} />
	</div>
	<div class="info">
		<div class="flex w-full flex-col justify-between gap-4 sm:flex-row">
			<div class="flex flex-col items-center gap-3 px-2 sm:items-start">
				<h1 class="leading-10">{user.name}</h1>
				<div class="statistic">
					{#each statistic as [count, title]}
						<div>
							<p class="text-3xl font-bold leading-8">
								{count}
							</p>
							<p>{title}</p>
						</div>
					{/each}
				</div>
			</div>
			<div
				class="flex min-w-0 flex-col items-center gap-3 whitespace-pre-line text-right sm:items-end"
			>
				<div class="hidden select-none items-center gap-2 sm:flex">
					<p class="font-bold">
						Дополнительная{''}
						информация
					</p>
					<Icon type={InformationCircle} class="h-10 w-10" />
				</div>
				<p class="w-full whitespace-pre-wrap break-words px-2 text-center sm:text-right">
					{user.description || 'Не указана'}
				</p>
			</div>
		</div>
		<div class="flex flex-col items-center gap-3 sm:flex-row">
			{#if me}
				<Selector class="overflow-hidden">
					<Link href="/profile">
						<SelectorItem
							active={pageType(url.pathname) === 'main'}
							class="w-20 justify-center xs:w-auto"
						>
							<Icon type={Pencil} class="xs:hidden" />
							<p class="hidden xs:block">Созданные</p>
						</SelectorItem>
					</Link>
					<Link href="/profile/liked">
						<SelectorItem
							active={pageType(url.pathname) === 'liked'}
							class="w-20 justify-center xs:w-auto"
						>
							<Icon type={Heart} class="xs:hidden" />
							<p class="hidden xs:block">Понравившиеся</p>
						</SelectorItem>
					</Link>
					<Link href="/profile/viewed">
						<SelectorItem
							active={pageType(url.pathname) === 'viewed'}
							class="w-20 justify-center xs:w-auto"
						>
							<Icon type={Eye} class="xs:hidden" />
							<p class="hidden xs:block">Просмотренные</p>
						</SelectorItem>
					</Link>
				</Selector>
				<Button
					class="ml-0 gap-2 !p-2 text-red-600 sm:ml-auto"
					variant="transparent"
					on:click={handleSignOut}
				>
					<Icon type={ArrowRightOnRectangle} class="xs:hidden" />
					<p class="sm:hidden">Выйти</p>
				</Button>
			{:else}
				<Button variant="main" class="gap-2 bg-emerald-500" on:click={handleSubscribe}>
					<Icon type={UserPlus} />
					<p>Читать</p>
				</Button>
			{/if}
		</div>
	</div>
</div>
<slot />

<style lang="postcss">
	.profile {
		@apply flex flex-col items-center justify-start gap-4 p-2 text-sm childs:p-6 sm:p-4 md:flex-row md:items-start;
	}
	.info {
		@apply flex w-full flex-col gap-4 rounded-2xl bg-white childs:bg-transparent sm:w-auto sm:min-w-[32rem] sm:max-w-full md:max-w-3xl md:p-6;
	}
	.info .statistic {
		@apply flex select-none gap-4 childs:flex childs:w-20 childs:flex-col childs:items-center sm:childs:w-auto;
	}
</style>

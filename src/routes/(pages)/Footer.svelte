<script lang="ts">
	import { DocumentText } from 'svelte-heros-v2';

	import Telegram from '$lib/components/Icons/Telegram.svelte';
	import TreetaleShort from '$lib/components/Icons/TreetaleShort.svelte';
	import Vk from '$lib/components/Icons/VK.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import Link from '$lib/ui/Link.svelte';

	const currentYear = new Date().getFullYear();
</script>

<div class="border-main-600 mx-6 flex justify-center border-t">
	<section
		class="flex w-full max-w-[120rem] items-center gap-6 px-0 py-6 text-sm select-none max-md:flex-col max-md:items-start max-md:gap-4"
	>
		<div class="flex items-center gap-4">
			<TreetaleShort class="size-10 max-lg:hidden max-md:block" maskId="footer-logo-mask" />
			<div class="flex flex-col">
				<p class="text-text font-bold uppercase">Treetale</p>
				<p class="text-contrast-700">© 2022 - {currentYear}. Все права защищены</p>
			</div>
		</div>
		<div class="max-fd:flex-col flex gap-6 max-md:gap-4">
			<div class="*:text-contrast-700 *:hover:text-text flex flex-col gap-2">
				<Link class="flex gap-2 transition-colors" href="/docs/privacy_policy.pdf" target="_blank">
					<Icon class="text-main size-5" this={DocumentText} />
					<p>Политика конфиденциальности</p>
				</Link>
				<Link class="flex gap-2 transition-colors" href="/docs/terms_of_use.pdf" target="_blank">
					<Icon class="text-main size-5" this={DocumentText} />
					<p>Пользовательское соглашение</p>
				</Link>
			</div>
			<div class="*:text-contrast-700 *:hover:text-text flex flex-col gap-2">
				<Link class="flex gap-2 transition-colors" href="https://t.me/treetale" target="_blank">
					<Telegram class="text-main size-5" />
					<p>Группа в Telegram</p>
				</Link>
				<Link class="flex gap-2 transition-colors" href="https://vk.com/treetale" target="_blank">
					<Vk class="text-main size-5" />
					<p>Группа ВКонтакте</p>
				</Link>
			</div>
		</div>
	</section>
</div>

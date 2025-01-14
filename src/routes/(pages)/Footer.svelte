<script lang="ts">
	import { DocumentText } from 'svelte-heros-v2';
	import { Icon, Link } from 'treetale-ui';

	import Telegram from '$lib/components/Icons/Telegram.svelte';
	import TreetaleShort from '$lib/components/Icons/TreetaleShort.svelte';
	import Vk from '$lib/components/Icons/VK.svelte';

	const currentYear = new Date().getFullYear();
</script>

<div class="mx-6 flex justify-center border-t border-main-60">
	<section
		class="flex w-full max-w-[120rem] select-none items-center gap-6 px-0 py-6 text-sm max-md:flex-col max-md:items-start max-md:gap-4"
	>
		<div class="flex items-center gap-4">
			<TreetaleShort class="size-10 max-lg:hidden max-md:block" maskId="footer-logo-mask" />
			<div class="flex flex-col">
				<p class="font-bold uppercase">Treetale</p>
				<p class="text-gray-700">© 2022 - {currentYear}. Все права защищены</p>
			</div>
		</div>
		<div class="flex gap-6 max-md:gap-4 max-xs:flex-col">
			<div class="flex flex-col gap-2">
				<Link
					class="flex gap-2 text-gray-600 transition-colors hover:text-black"
					href="/docs/privacy_policy.pdf"
					target="_blank"
				>
					<Icon class="size-5 text-main" this={DocumentText} />
					<p>Политика конфиденциальности</p>
				</Link>
				<Link
					class="flex gap-2 text-gray-600 transition-colors hover:text-black"
					href="/docs/terms_of_use.pdf"
					target="_blank"
				>
					<Icon class="size-5 text-main" this={DocumentText} />
					<p>Пользовательское соглашение</p>
				</Link>
			</div>
			<div class="flex flex-col gap-2">
				<Link
					class="flex gap-2 text-gray-600 transition-colors hover:text-black"
					href="https://t.me/treetale"
					target="_blank"
				>
					<Telegram class="size-5 text-main" />
					<p>Группа в Telegram</p>
				</Link>
				<Link
					class="flex gap-2 text-gray-600 transition-colors hover:text-black"
					href="https://vk.com/treetale"
					target="_blank"
				>
					<Vk class="size-5 text-main" />
					<p>Группа ВКонтакте</p>
				</Link>
			</div>
		</div>
	</section>
</div>

<script lang="ts">
	import { DocumentText } from 'svelte-heros-v2';
	import { Button, Icon, Link } from 'treetale-ui';

	import Mastercard from '$lib/components/Icons/Mastercard.svelte';
	import Mir from '$lib/components/Icons/Mir.svelte';
	import Telegram from '$lib/components/Icons/Telegram.svelte';
	import TreetaleShort from '$lib/components/Icons/TreetaleShort.svelte';
	import Visa from '$lib/components/Icons/Visa.svelte';

	const currentYear = new Date().getFullYear();
</script>

<div class="flex justify-center bg-white/80">
	<section
		class="flex w-full max-w-[120rem] select-none items-center justify-between gap-6 p-6 text-sm max-md:flex-col max-sm:gap-3"
	>
		<div class="flex items-center gap-6 max-md:gap-4 max-sm:flex-col">
			<div class="flex items-center gap-4">
				<TreetaleShort class="h-10 w-10 max-lg:hidden" maskId="footer-logo-mask" />
				<div class="flex flex-col gap-1 max-sm:text-center">
					<p class="font-bold uppercase">Treetale</p>
					<p class="text-gray-700">© 2022 - {currentYear}. Все права защищены</p>
				</div>
			</div>
			<div class="flex shrink-0 items-center gap-2">
				<Icon class="h-10 w-10 text-black/20 max-lg:hidden" this={DocumentText} />
				<div class="flex flex-col gap-1 max-sm:text-center">
					<Link
						class="transition-colors hover:text-main"
						href="/docs/privacy_policy.pdf"
						target="_blank"
					>
						Политика конфиденциальности
					</Link>
					<Link
						class="transition-colors hover:text-main"
						href="/docs/terms_of_use.pdf"
						target="_blank"
					>
						Пользовательское соглашение
					</Link>
				</div>
			</div>
		</div>
		<div class="flex items-center gap-6 max-sm:gap-4">
			<Button
				asLink
				href="tg://resolve?domain=treetale"
				target="_blank"
				class="gap-3 bg-gray-900 text-white hover:bg-gray-700"
				size="base"
			>
				<Telegram class="size-5" />
				<p class="mr-1 max-lg:hidden max-md:block max-sm:hidden">Telegram</p>
			</Button>
			<div class="flex">
				<Mir class="h-10 w-auto opacity-60 transition-opacity hover:opacity-100" />
				<Mastercard class="h-10 w-auto opacity-60 transition-opacity hover:opacity-100" />
				<Visa class="h-10 w-auto opacity-60 transition-opacity hover:opacity-100" />
			</div>
		</div>
	</section>
</div>

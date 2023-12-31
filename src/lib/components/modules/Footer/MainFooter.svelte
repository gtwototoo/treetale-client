<script lang="ts">
	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import { Mascot, Mastercard, Mir, Telegram, Visa } from '$lib/components/icons';
	import { DocumentText } from 'svelte-heros-v2';

	const currentYear = new Date().getFullYear();
</script>

<div
	class="flex select-none items-center justify-between gap-6 bg-white/80 p-6 text-sm childs:bg-transparent max-md:flex-col max-sm:flex-col max-sm:gap-3"
>
	<div class="flex items-center gap-6 max-md:gap-4 max-sm:flex-col">
		<div class="flex items-center gap-2">
			<Mascot class="h-12 w-12 text-main max-lg:hidden" />
			<div class="flex flex-col gap-1 max-sm:text-center">
				<p class="font-bold uppercase">Treetale</p>
				<p class="text-gray-700">© 2022 - {currentYear}. Все права защищены</p>
			</div>
		</div>
		<div class="flex shrink-0 items-center gap-2">
			<Icon type={DocumentText} class="h-10 w-10 text-black/20 max-lg:hidden" />
			<div class="flex flex-col gap-1 max-sm:text-center">
				<Link
					href="/docs/privacy_policy.pdf"
					target="_blank"
					class="transition-colors hover:text-main"
				>
					Политика конфиденциальности
				</Link>
				<Link
					href="/docs/terms_of_use.pdf"
					target="_blank"
					class="transition-colors hover:text-main"
				>
					Пользовательское соглашение
				</Link>
			</div>
		</div>
	</div>
	<div class="flex items-center gap-6 max-sm:gap-4">
		<Link href="tg://resolve?domain=treetale_news" target="_blank">
			<Button variant="ghost" size="lg" class="gap-3 bg-main max-sm:!p-2">
				<Telegram class="h-6 w-6" />
				<p class="mr-1 max-lg:hidden max-md:block max-sm:hidden">Telegram</p>
			</Button>
		</Link>
		<div class="flex">
			<Mir class="h-10 w-auto opacity-60 transition-opacity hover:opacity-100" />
			<Mastercard class="h-10 w-auto opacity-60 transition-opacity hover:opacity-100" />
			<Visa class="h-10 w-auto opacity-60 transition-opacity hover:opacity-100" />
		</div>
	</div>
</div>

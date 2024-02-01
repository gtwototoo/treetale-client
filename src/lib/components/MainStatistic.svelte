<script lang="ts">
	import { Bookmark, PaintBrush, Share, Star } from 'svelte-heros-v2';

	import Icon from './Icon.svelte';
	import { Treetale } from './icons';

	export let statistic: Array<Array<string>>;
</script>

<div class="flex gap-6 px-4 max-lg:flex-col-reverse max-md:gap-4">
	<div class="flex flex-col gap-[inherit] max-lg:flex-row max-sm:flex-col">
		<div
			class="flex select-none items-center justify-center gap-4 rounded-3xl bg-white/20 p-6 *:bg-transparent max-md:p-4"
		>
			{#each statistic as [count, title] (title)}
				<div class="flex w-28 flex-1 flex-col items-center gap-1 max-lg:w-auto">
					<p class="text-5xl font-black max-sm:text-4xl">{count}</p>
					<p class="text-base max-sm:text-xs">
						{title}
					</p>
				</div>
			{/each}
		</div>
		<div
			class="flex flex-1 select-none flex-col justify-center gap-4 whitespace-nowrap rounded-3xl bg-white/20 p-6 text-base font-medium *:bg-transparent max-lg:gap-2 max-lg:text-sm max-md:p-4"
		>
			<div class="flex items-center gap-3">
				<Icon class="size-7" type={Share} variation="outline" />
				<p>Собственный редактор историй</p>
			</div>
			<div class="flex items-center gap-3">
				<Icon class="size-7" type={Bookmark} variation="outline" />
				<p>Библиотека просмотренных историй</p>
			</div>
			<div class="flex items-center gap-3">
				<Icon class="size-7" type={PaintBrush} variation="outline" />
				<p>Кастомизация профилей и историй</p>
			</div>
			<div class="flex items-center gap-3">
				<Icon class="size-7" type={Star} variation="outline" />
				<p>Возможность поддержки авторов</p>
			</div>
		</div>
	</div>
	<div
		class="relative flex flex-1 flex-col items-start gap-8 overflow-hidden rounded-3xl bg-[url(/img/main-bg.png)] p-12 text-lg text-white *:bg-transparent max-lg:p-8 max-lg:text-base max-sm:gap-6 max-sm:p-6 max-sm:text-sm"
	>
		<Treetale class="z-[1] h-16 w-auto max-lg:h-12 max-sm:h-8" />
		<p class="z-[1] w-[32rem] max-w-full max-lg:w-full">
			Окунитесь в захватывающий мир разнообразных повествований, где каждый ваш выбор становится
			ключом к развитию сюжета по вашему велению. Перед вами раскрываются бескрайние переплетения
			жанров от серьезных и тяжелых до смешных и легких, среди которых вы сами формируете свой
			уникальный приключенческий опыт
		</p>
		<div class="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-black" />
	</div>
</div>

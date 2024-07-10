<script lang="ts">
	// import clsx from 'clsx';
	// import { BookOpen, Bookmark, Cube, Heart, PaintBrush, Star, Users } from 'svelte-heros-v2';

	export let statistic: Array<{ id: 'likes' | 'stories' | 'users'; title: string; value: string }>;

	// const features = [
	// 	{
	// 		className: clsx('right-[105%] top-[6%] w-[26.25rem]'),
	// 		icon: Cube,
	// 		text: 'Собственный редактор историй'
	// 	},
	// 	{
	// 		className: clsx('right-[104%] top-[40%] w-[26.25rem]'),
	// 		icon: Bookmark,
	// 		text: 'Библиотека просмотренных историй'
	// 	},
	// 	{
	// 		className: clsx('left-[105%] top-[6%] w-[26.25rem]'),
	// 		icon: Star,
	// 		text: 'Возможность поддержки авторов'
	// 	},
	// 	{
	// 		className: clsx('left-[104%] top-[40%] w-[26.25rem]'),
	// 		icon: PaintBrush,
	// 		text: 'Кастомизация профилей и историй'
	// 	},
	// 	{
	// 		className: clsx('left-[104%] top-[40%] w-[26.25rem]'),
	// 		icon: PuzzlePiece,
	// 		text: 'Частые обновления и модификации'
	// 	},
	// 	{
	// 		className: clsx('left-[104%] top-[40%] w-[26.25rem]'),
	// 		icon: Variable,
	// 		text: 'Наличие переменных и условий в истории'
	// 	}
	// ];
</script>

<div class="flex select-none justify-center">
	<div class="relative flex flex-col items-center gap-8 py-[calc(16px+2vw)] text-center">
		<h2
			class="text-gradient !bg-clip-text text-[calc(24px+4vw)] uppercase leading-none text-transparent"
		>
			<p>Бесконечный</p>
			<p>мир историй</p>
		</h2>
		<p
			class="w-[50vw] min-w-72 max-w-[40rem] text-[calc(12px+0.7vw)] leading-tight text-amber-900"
		>
			Окунитесь в захватывающий мир историй, где каждый ваш выбор влияет на развитие сюжета.
			Перед вами разнообразие жанров от серьезных и тяжелых до смешных и легких, среди которых вы
			формируете свой приключенческий опыт.
		</p>
		<div
			class="flex items-center justify-center gap-4 rounded-3xl bg-white/20 p-[calc(12px+1vw)] *:bg-transparent"
		>
			{#each statistic as { id, title, value } (id)}
				<div class="flex w-[calc(4.5rem+3vw)] flex-1 flex-col items-center">
					<p class="text-[calc(30px+1.5vw)] font-black leading-none">{value}</p>
					<p class="text-[calc(12px+0.5vw)]">
						{title}
					</p>
				</div>
			{/each}
		</div>
		<!-- {#each featuresAndStatistic as { className, icon, stat, text }}
			<div
				class={clsx(
					'absolute flex items-center gap-5 rounded-[2rem] bg-white/60 px-8 py-6 text-left text-amber-900 *:bg-transparent',
					className
				)}
			>
				<svelte:component
					this={icon}
					class="size-[3.5vw] shrink-0 text-main"
					variation="solid"
				/>
				<p class={clsx(stat ? 'text-6xl font-bold' : 'text-[calc(12px+0.7vw)]')}>
					{text}
				</p>
			</div>
		{/each} -->
	</div>
</div>

<!-- <div class="flex gap-6 px-4 max-lg:flex-col-reverse max-md:gap-4">
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
		<div class="absolute left-0 top-0 size-full bg-gradient-to-r from-black" />
	</div>
</div> -->

<style lang="postcss">
	.text-gradient {
		background: linear-gradient(to bottom, #fdba66, #fd6d71);
	}
</style>

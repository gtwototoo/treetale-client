<script lang="ts">
	const {
		statistic
	}: {
		statistic: { id: 'likes' | 'stories' | 'users'; title: string; value: string }[];
	} = $props();
</script>

<div class="flex justify-center select-none">
	<div class="relative flex flex-col items-center gap-8 py-[calc(16px+2vw)] text-center">
		<h2
			class="bg-gradient-to-b from-[#FDBA74] to-[#FF6C15] !bg-clip-text text-[calc(24px+4vw)] leading-none text-transparent uppercase"
		>
			<p>Бесконечный</p>
			<p>мир историй</p>
		</h2>
		<p
			class="w-[50vw] max-w-[40rem] min-w-72 text-[calc(12px+0.7vw)] leading-tight text-amber-900"
		>
			Окунитесь в захватывающий мир историй, где каждый ваш выбор влияет на развитие сюжета.
			Перед вами разнообразие жанров от серьезных и тяжелых до смешных и легких, среди которых вы
			формируете свой приключенческий опыт.
		</p>
		<div class="bg-main-400 flex items-center justify-center gap-4 rounded-3xl p-[calc(12px+1vw)]">
			{#each statistic as { id, title, value } (id)}
				<div class="flex w-[calc(4.5rem+3vw)] flex-1 flex-col items-center">
					<p class="text-[calc(30px+1.5vw)] leading-none font-black">{value}</p>
					<p class="text-[calc(12px+0.5vw)]">
						{title}
					</p>
				</div>
			{/each}
		</div>
	</div>
</div>

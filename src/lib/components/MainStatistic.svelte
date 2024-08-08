<script lang="ts">
	export let statistic: { id: 'likes' | 'stories' | 'users'; title: string; value: string }[];
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
		<div class="flex items-center justify-center gap-4 rounded-3xl bg-main-50 p-[calc(12px+1vw)]">
			{#each statistic as { id, title, value } (id)}
				<div class="flex w-[calc(4.5rem+3vw)] flex-1 flex-col items-center">
					<p class="text-[calc(30px+1.5vw)] font-black leading-none">{value}</p>
					<p class="text-[calc(12px+0.5vw)]">
						{title}
					</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="postcss">
	.text-gradient {
		background: linear-gradient(to bottom, #fdba66, #fd6d71);
	}
</style>

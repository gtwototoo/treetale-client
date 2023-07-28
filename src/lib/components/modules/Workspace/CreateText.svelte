<script lang="ts">
	import { correctWhitespace } from '$lib/utils';
	import { fade } from 'svelte/transition';
</script>

<div class="pointer-events-none absolute top-24 flex w-full justify-center" out:fade>
	<div class="plug gap-4">
		<h2>Начало</h2>
		<p>
			{correctWhitespace(
				'Начните свою историю с этого момента и развивайте её так, как вам угодно, создавайте свои условия для прохождения пути и непредсказуемого финала'
			)}
		</p>
	</div>
</div>

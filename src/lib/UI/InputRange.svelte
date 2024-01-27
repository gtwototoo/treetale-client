<script lang="ts">
	import { clsx } from 'clsx';

	let className = '';
	export { className as class };

	export let min: number;
	export let max: number;
	export let value = 0;
</script>

<input bind:value class={clsx('range', className)} {max} {min} type="range" />

<style lang="postcss">
	.range {
		@apply grow appearance-none rngthumb:h-4 rngthumb:w-4 rngthumb:appearance-none rngthumb:rounded-lg rngthumb:!bg-main rngthumb:transition-colors rngtrack:h-4 rngtrack:appearance-none rngtrack:rounded-lg rngtrack:bg-contrast rngtrack:ring-1 rngtrack:ring-main rngtrack:transition-[box-shadow] rngtrack:focus:ring-main;
	}
	input[type='range']::-webkit-slider-thumb:hover {
		@apply !bg-main;
	}
	input[type='range']::-moz-range-thumb:hover {
		@apply !bg-main;
	}
	input[type='range']::-ms-thumb:hover {
		@apply !bg-main;
	}

	input[type='range']::-webkit-slider-runnable-track:hover {
		@apply ring-main;
	}
	input[type='range']::-moz-range-track:hover {
		@apply ring-main;
	}
	input[type='range']::-ms-track:hover {
		@apply ring-main;
	}
</style>

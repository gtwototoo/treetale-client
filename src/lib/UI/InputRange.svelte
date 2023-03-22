<script lang="ts">
	import { clsx } from 'clsx';

	let classes = '';
	export { classes as class };
	export let min: number;
	export let max: number;
	export let value: number = 0;
</script>

<input class={clsx('range', classes)} type="range" {min} {max} bind:value />

<style lang="postcss">
	.range {
		@apply rngthumb:h-4 rngthumb:w-4 rngthumb:appearance-none rngthumb:rounded-lg rngthumb:!bg-gray-200 rngthumb:transition-colors rngtrack:h-4 rngtrack:appearance-none rngtrack:rounded-lg rngtrack:bg-white rngtrack:ring-1 rngtrack:ring-gray-200 rngtrack:transition-[box-shadow] rngtrack:focus:ring-blue-500 grow appearance-none;
	}
	input[type='range']::-webkit-slider-thumb:hover {
		@apply !bg-blue-500;
	}
	input[type='range']::-moz-range-thumb:hover {
		@apply !bg-blue-500;
	}
	input[type='range']::-ms-thumb:hover {
		@apply !bg-blue-500;
	}

	input[type='range']::-webkit-slider-runnable-track:hover {
		@apply ring-blue-500;
	}
	input[type='range']::-moz-range-track:hover {
		@apply ring-blue-500;
	}
	input[type='range']::-ms-track:hover {
		@apply ring-blue-500;
	}
</style>

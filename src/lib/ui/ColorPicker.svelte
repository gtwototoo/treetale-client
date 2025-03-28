<script lang="ts">
	import { type Snippet } from 'svelte';

	import range from 'lodash/range';

	import type { RGB } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';
	import { rgbToHsl, rgbToString, stringToRgb } from '$lib/utils/customColors';

	import Button from './Button.svelte';
	import Modal from './Modal.svelte';
	import { button as buttonPresets } from './presets';
	import Range from './Range.svelte';

	type ColorPickerProps = {
		button: Snippet<[{ color?: RGB }]>;
		class?: string;
		disabled?: boolean;
		onchange?: (color: RGB) => void;
		lightRange?: number[];
		saturateRange?: number[];
		color: RGB;
	};

	let {
		onchange,
		saturateRange = [0, 100],
		lightRange = [0, 100],
		color,
		disabled = false,
		class: classname,
		button
	}: ColorPickerProps = $props();

	const initColor = color;
	const initHsl = rgbToHsl(initColor);

	let [hue, saturate, light] = $state(initHsl);
	let active = $state(false);

	light = 50;
	saturate = 100;

	const handleClick = (e: MouseEvent, newHue: number) => {
		if (disabled || !(e.target instanceof HTMLButtonElement)) return;

		hue = newHue;

		const newColor = stringToRgb(e.target.style.background);

		onchange?.(newColor);
	};

	const handleReset = () => {
		const [newHue, newSaturate, newLight] = initHsl;
		hue = newHue;
		saturate = newSaturate;
		light = newLight;

		onchange?.(initColor);
	};
</script>

<Button onclick={() => (active = true)} class={classname} {disabled}>
	{@render button({ color })}
</Button>
<Modal bind:active>
	<p class="w-full pt-4 text-center text-lg">Выбор цветовой схемы</p>
	<div
		class="flex w-96 flex-col gap-4 bg-transparent p-4"
		style="--color-main: {rgbToString(color)}"
	>
		<div class="flex flex-col gap-2">
			<div class="flex min-w-0 items-center gap-2">
				<div class="size-4 rounded-full bg-gray-700 ring-1 ring-gray-900"></div>
				<Range
					value={light}
					onchange={(value) => (light = value)}
					class="min-w-0 grow"
					max={lightRange[1]}
					min={lightRange[0]}
				/>
				<div class="size-4 rounded-full bg-gray-100 ring-1 ring-gray-200"></div>
			</div>
			<div class="flex min-w-0 items-center gap-2">
				<div class="size-4 rounded-full bg-blue-100 ring-1 ring-blue-200"></div>
				<Range
					value={saturate}
					onchange={(value) => {
						saturate = value;
						light = value;
					}}
					class="min-w-0 grow"
					max={saturateRange[1]}
					min={saturateRange[0]}
				/>
				<div class="size-4 rounded-full bg-blue-700 ring-1 ring-blue-900"></div>
			</div>
		</div>
		<div class="flex shrink-0 flex-wrap justify-center gap-1">
			{#each range(36) as index (index)}
				{@const eachHue = index * 10 + 5}
				{@const color = `hsl(${eachHue} ${saturate}% ${light}%)`}
				<button
					class={clm(
						'border-main-100 size-6 cursor-pointer rounded-md border-2',
						eachHue === hue && 'ring-main ring-2'
					)}
					aria-label="Цвет {color}"
					onclick={(e) => handleClick(e, eachHue)}
					style:background={color}
				></button>
			{/each}
		</div>
		<Button
			class={clm(buttonPresets.size.base, buttonPresets.type.primary, 'justify-center')}
			onclick={handleReset}
		>
			Сбросить цвет
		</Button>
	</div>
</Modal>

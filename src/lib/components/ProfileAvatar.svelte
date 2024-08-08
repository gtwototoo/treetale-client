<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	import { PencilSquare, Trash } from 'svelte-heros-v2';
	import { Avatar, Button, Icon, InputFile } from 'treetale-ui';

	import type { RGB } from '$lib/types';

	import { BLACK_COLOR, DEFAULT_COLOR, WHITE_COLOR } from '$lib/constants/colors';
	import { AVATARS_FOLDER } from '$lib/constants/s3forders';
	import { removeImage } from '$lib/requests/files';
	import { contrastText } from '$lib/utils/contrast';
	import { toRGB } from '$lib/utils/customColors';

	let {
		addLoading = $bindable(),
		alt,
		base64src = $bindable(),
		class: classname,
		color,
		editMode = false,
		onchange,
		size = 'base',
		src
	}: {
		addLoading: boolean;
		alt: string;
		base64src: null | string;
		class?: string;
		color: RGB | null;
		editMode?: boolean;
		onchange?: ChangeEventHandler<HTMLInputElement>;
		size?: 'base' | 'lg' | 'sm';
		src: null | string;
	} = $props();

	let removeLoading = $state(false);

	const preRemoveImage = async () => {
		if (base64src || !src) {
			return;
		}

		removeLoading = true;

		try {
			await removeImage(AVATARS_FOLDER);

			src = null;
		} finally {
			removeLoading = false;
		}
	};

	const loadHandler = () => {
		base64src = null;
		addLoading = false;
	};

	let correctColor = $derived(color || DEFAULT_COLOR);
	let colorContrast = $derived(contrastText(correctColor) ? BLACK_COLOR : WHITE_COLOR);
</script>

<div
	class="contents"
	style="--color-contrast: {toRGB(colorContrast)}; --color-main: {toRGB(correctColor)}"
>
	<Avatar
		{alt}
		color={DEFAULT_COLOR}
		{base64src}
		onload={loadHandler}
		{size}
		{src}
		class={classname}
	>
		{#if editMode}
			<div
				class="absolute bottom-0 right-0 z-[3] rounded-full bg-contrast p-1"
				in:fade={{ duration: 150 }}
			>
				{#if src}
					<Button
						class="rounded-full bg-red-200 p-3 text-text"
						loading={removeLoading}
						onclick={preRemoveImage}
					>
						<Icon class="size-6 text-red-500" this={Trash} />
					</Button>
				{:else}
					<InputFile
						class="rounded-full bg-main-70 p-3 text-text hover:bg-main"
						disabled={addLoading}
						{onchange}
					>
						<Icon class="size-6" this={PencilSquare} />
					</InputFile>
				{/if}
			</div>
		{/if}
	</Avatar>
</div>

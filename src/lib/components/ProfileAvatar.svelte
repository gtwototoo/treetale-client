<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	import { PencilSquare, Trash } from 'svelte-heros-v2';
	import { InputFile } from 'treetale-ui';

	import { AVATARS_FOLDER } from '$lib/constants/s3forders';
	import { removeImage } from '$lib/requests/files';
	import type { RGB } from '$lib/types';
	import Avatar from '$lib/ui/Avatar.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';
	import { generateMainColors } from '$lib/utils/customColors';

	let {
		addLoading = $bindable(),
		alt,
		base64src = $bindable(),
		class: classname,
		color,
		editMode = false,
		onchange,
		src
	}: {
		addLoading: boolean;
		alt: string;
		base64src: string;
		class?: string;
		color: RGB;
		editMode?: boolean;
		onchange?: ChangeEventHandler<HTMLInputElement>;
		src?: null | string;
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
		base64src = '';
		addLoading = false;
	};
</script>

<div class="contents" style={generateMainColors(color)}>
	<Avatar {alt} {base64src} onload={loadHandler} {src} class={classname}>
		{#if editMode}
			<div
				class="bg-contrast absolute right-0 bottom-0 z-[3] rounded-full p-1"
				in:fade={{ duration: 150 }}
			>
				{#if src}
					<Button
						class="text-text rounded-full bg-red-200 p-3"
						loading={removeLoading}
						onclick={preRemoveImage}
					>
						<Icon class="size-6 text-red-500" this={Trash} />
					</Button>
				{:else}
					<InputFile
						class={clm(button.type.primary, 'rounded-full p-3')}
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

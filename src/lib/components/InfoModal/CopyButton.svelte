<script lang="ts">
	import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
	import { onDestroy } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	import { DocumentDuplicate } from 'svelte-heros-v2';

	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	type CopyState = 'error' | 'success' | null;

	const {
		storyId
	}: {
		storyId: number;
	} = $props();

	let copyState = $state<CopyState>(null);

	const copyText = async (value: string): Promise<boolean> => {
		let success = true;

		try {
			await window.navigator.clipboard.writeText(value);
		} catch (error) {
			console.error(error);
			success = false;
		}

		return success;
	};

	const handleCopyLink: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> = async (e) => {
		e.stopPropagation();

		copyState = (await copyText(textForCopy)) ? 'success' : 'error';
	};

	let textForCopy = $derived(`${PUBLIC_TREETALE_CLIENT_URL}/${storyId}`);

	$effect(() => {
		if (copyState) {
			const timeout = setTimeout(() => {
				copyState = null;
			}, 500);

			onDestroy(() => {
				clearTimeout(timeout);
			});
		}
	});
</script>

<Button onclick={handleCopyLink} class={clm(button.type.primary, button.size.sm, 'gap-1.5 pl-1.5')}>
	<Icon
		this={DocumentDuplicate}
		class={clm(
			'size-5 transition-colors',
			copyState === 'success' && 'text-green-500',
			copyState === 'error' && 'text-red-500'
		)}
	/>
	<p class="text-sm">Ссылка</p>
</Button>

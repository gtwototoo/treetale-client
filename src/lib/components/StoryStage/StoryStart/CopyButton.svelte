<script lang="ts">
	import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
	import { onDestroy } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	import { DocumentDuplicate } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import { clm } from '$lib/utils/classMerge';

	type CopyState = 'error' | 'success' | null;

	let {
		class: classname,
		storyId
	}: {
		class?: string;
		storyId: number;
	} = $props();

	let copyState = $state<CopyState>(null);

	const copyText = async (value: string): Promise<boolean> => {
		let success = true;

		try {
			await window.navigator.clipboard.writeText(value);
		} catch (error) {
			console.error(error);

			success = true;
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

<Button
	size="lg"
	onclick={handleCopyLink}
	class="pointer-events-auto gap-2 px-4 font-normal hover:bg-main-50"
>
	<Icon
		this={DocumentDuplicate}
		class={clm(
			'size-8 transition-colors',
			copyState === 'success' && 'text-green-500',
			copyState === 'error' && 'text-red-500'
		)}
	/>
	<div class={clm('flex flex-col items-start text-xs', classname)}>
		<p class="text-base leading-4">Ссылка</p>
		<p>на историю</p>
	</div>
</Button>

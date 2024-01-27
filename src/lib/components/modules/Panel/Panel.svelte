<script lang="ts">
	import clsx from 'clsx';
	import { ArrowsPointingIn, PencilSquare, XMark } from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore } from '$lib/stores/editing';
	import { panelEditMode, panelShow, panelStore } from '$lib/stores/panel';
	import { framesDataStore } from '$lib/stores/workspace';
	import { clm } from '$lib/utils';
	import { Button, Listbox } from '$UI';

	import { setSelectedFrame } from '../Workspace/methods';

	let className = '';
	export { className as class };

	export let title: string;
	export let nonClose = false;
	export let nonEdit = false;

	$: framePanel = $panelStore.id.includes('frame');
	$: framesList = $framesDataStore.map((frame) => {
		return {
			click: () => setSelectedFrame(frame),
			title: frame.title
		};
	});
</script>

<div
	class={clm(
		'relative ml-auto flex min-h-full w-96 max-w-full shrink-0 flex-col gap-4 bg-contrast px-4 py-4 text-text transition-transform max-sm:py-3 max-xs:px-3',
		className,
		!$panelShow && 'max-lg:translate-x-full'
	)}
>
	<div class="flex w-full gap-2">
		{#if !nonEdit && !$readonlyStore}
			<Button
				class={clsx('z-[2] bg-contrast-9 !p-3', $panelEditMode && 'text-red-500')}
				on:click={() => ($panelEditMode = !$panelEditMode)}
				size="lg"
				variant="ghost"
			>
				<Icon class="h-6 w-6" type={PencilSquare} />
			</Button>
		{:else}
			<div class="w-12" />
		{/if}
		<Listbox
			align="inset"
			class="w-full"
			let:click
			list={framesList}
			placeholder="Блок"
			size="lg"
		>
			<Button
				class={clsx(
					'w-full justify-center whitespace-normal bg-contrast-9 !px-2',
					(!framePanel || !framesList) && 'pointer-events-none !bg-opacity-20'
				)}
				on:click={click}
				size="lg"
				variant="ghost"
			>
				{title}
			</Button>
		</Listbox>
		{#if $panelStore.component && !nonClose}
			<Button
				class="bg-contrast-9 !p-3 max-lg:!hidden"
				on:click={panelStore.clear}
				size="lg"
				variant="ghost"
			>
				<Icon class="h-6 w-6" type={XMark} />
			</Button>
		{:else}
			<div class="w-12 max-lg:!hidden" />
		{/if}
		<Button
			class="!hidden bg-contrast-9 !p-3 max-lg:!block"
			on:click={() => ($panelShow = !$panelShow)}
			size="lg"
			variant="ghost"
		>
			<Icon class="h-6 w-6" type={ArrowsPointingIn} />
		</Button>
	</div>
	<slot />
</div>

<script lang="ts">
	import clsx from 'clsx';
	import {
		ChevronDown,
		ChevronRight,
		Cog6Tooth,
		DocumentText,
		Link,
		PencilSquare,
		RectangleStack,
		Variable,
		XMark
	} from 'svelte-heros-v2';

	import { Button, Listbox } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore } from '$lib/stores/editing';
	import { panelEditMode, panelShow, panelStore } from '$lib/stores/panel';
	import { framesDataStore, selectedFrameStore } from '$lib/stores/workspace';
	import { clm } from '$lib/utils';

	import { FrameSettings, Notes, ShareWorkspace, Variables } from '.';
	import { setSelectedFrame } from '../Workspace/methods';

	let className = '';
	export { className as class };

	export let title: string;
	export let nonClose = false;
	export let nonEdit = false;

	const variablesSwitch = () => {
		$panelStore = {
			component: Variables,
			id: 'variables'
		};
	};

	const notesSwitch = () => {
		$panelStore = {
			component: Notes,
			id: 'notes'
		};
	};

	const shareSwitch = () => {
		$panelStore = {
			component: ShareWorkspace,
			id: 'share'
		};
	};

	const frameSwitch = () => {
		const firstFrameId = $framesDataStore[0].frameId;

		$selectedFrameStore = firstFrameId;

		$panelStore = {
			component: FrameSettings,
			id: `frame-${firstFrameId}`
		};
	};

	const settingsSwitch = () => {
		panelStore.clear();
	};

	$: framePanel = $panelStore.id.includes('frame');
	$: framesList = $framesDataStore.map((frame) => {
		return {
			click: () => setSelectedFrame(frame),
			title: frame.title
		};
	});
</script>

<svelte:body class={clsx(!$panelShow && 'overflow-hidden')} />

<div
	class={clm(
		'relative ml-auto flex min-h-full w-96 max-w-full shrink-0 flex-col gap-4 bg-contrast px-4 py-4 text-text transition-transform max-sm:py-3 max-xs:ml-0 max-xs:w-full max-xs:px-3',
		className,
		!$panelShow &&
			'max-lg:translate-x-full max-sm:py-2 max-xs:-top-14 max-xs:h-14 max-xs:translate-x-0 max-xs:translate-y-full'
	)}
>
	<div class={clsx('flex gap-2 *:flex-1', !$panelShow && 'max-xs:hidden')}>
		<Button
			class={clm(
				'header-button justify-center !px-3 text-text',
				$panelStore.id === 'settings' && 'bg-main text-text'
			)}
			on:click={settingsSwitch}
			size="lg"
			variant="ghost"
		>
			<Icon class="size-6" type={Cog6Tooth} />
		</Button>
		<Button
			class={clm(
				'header-button justify-center !px-3 text-text',
				$panelStore.id === 'variables' && 'bg-main text-text'
			)}
			on:click={variablesSwitch}
			size="lg"
			variant="ghost"
		>
			<Icon class="size-6" type={Variable} />
		</Button>
		<Button
			class={clm(
				'header-button justify-center !px-3 text-text',
				$panelStore.id === 'notes' && 'bg-main text-text'
			)}
			on:click={notesSwitch}
			size="lg"
			variant="ghost"
		>
			<Icon class="size-6" type={DocumentText} />
		</Button>
		<Button
			class={clm(
				'header-button justify-center !px-3 text-text',
				$panelStore.id === 'share' && 'bg-main text-text'
			)}
			on:click={shareSwitch}
			size="lg"
			variant="ghost"
		>
			<Icon class="size-6" type={Link} />
		</Button>
		<Button
			class={clm(
				'header-button justify-center !px-3 text-text',
				$panelStore.id.includes('frame') && 'bg-main text-text'
			)}
			on:click={frameSwitch}
			size="lg"
			variant="ghost"
		>
			<Icon class="size-6" type={RectangleStack} />
		</Button>
	</div>
	<div class="flex w-full gap-2">
		{#if !nonEdit && !$readonlyStore}
			<Button
				class={clsx('z-[2] bg-contrast-9 !px-2.5 !py-2', $panelEditMode && 'text-red-500')}
				on:click={() => ($panelEditMode = !$panelEditMode)}
				size="base"
				variant="ghost"
			>
				<Icon class="size-5" type={PencilSquare} />
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
				size="base"
				variant="ghost"
			>
				{title}
			</Button>
		</Listbox>
		{#if $panelStore.component && !nonClose}
			<Button
				class="bg-contrast-9 !px-2.5 !py-2 max-lg:!hidden"
				on:click={panelStore.clear}
				size="base"
				variant="ghost"
			>
				<Icon class="size-5" type={XMark} />
			</Button>
		{:else}
			<div class="w-12 max-lg:!hidden" />
		{/if}
		<Button
			class="!hidden bg-contrast-9 !px-2.5 !py-2 max-lg:!block"
			on:click={() => ($panelShow = !$panelShow)}
			size="base"
			variant="ghost"
		>
			<Icon class="size-5 max-xs:hidden" type={ChevronRight} />
			<Icon
				class={clsx('hidden size-5 max-xs:block', !$panelShow && 'rotate-180')}
				type={ChevronDown}
			/>
		</Button>
	</div>
	<slot />
</div>

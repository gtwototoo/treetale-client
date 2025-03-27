<script lang="ts">
	import type { Component } from 'svelte';

	import { Cog6Tooth, DocumentText, RectangleStack, Tv, Variable } from 'svelte-heros-v2';

	import type { PanelProps } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';

	import FrameSettings from './FrameSettings/index.svelte';
	import InformationSettings from './InformationSettings/index.svelte';
	import Inspector from './Inspector/index.svelte';
	import Notes from './Notes/index.svelte';
	import Variables from './Variables/index.svelte';

	const tabs = [
		{
			component: InformationSettings,
			icon: Cog6Tooth,
			id: 'settings',
			props: { isEdit: true, title: 'Основная информация' }
		},
		{
			component: FrameSettings,
			icon: RectangleStack,
			id: `frame-${boardFramesStore.frames[0].frameId}`,
			props: {
				frameId: boardFramesStore.frames[0].frameId,
				isEdit: true,
				title: boardFramesStore.frames[0].title
			}
		},
		{
			component: Variables,
			icon: Variable,
			id: 'variables',
			props: { isEdit: true, title: 'Переменные' }
		},
		{
			component: Notes,
			icon: DocumentText,
			id: 'notes',
			props: { isEdit: true, title: 'Заметки' }
		},
		{
			component: Inspector,
			icon: Tv,
			id: 'inspector',
			props: { title: 'Инспектор' }
		}
	];

	const setPanel = (id: string, component: Component, props: PanelProps) => {
		panelStatesStore.set(id, component, props);
	};

	const isActive = (id: string) => {
		const panelId = panelStatesStore.prevPanel?.id || panelStatesStore.id;

		return id.startsWith('frame') ? panelId.startsWith('frame') : panelId === id;
	};
</script>

<div class={clm('flex gap-1 p-3 pb-0 *:flex-1', !panelStatesStore.show && 'max-fd:hidden')}>
	{#each tabs as { component, icon, id, props } (id)}
		<Button
			class={clm(
				button.size.lg,
				button.type.primary,
				'justify-center px-0',
				isActive(id) ? 'bg-main-500' : 'bg-transparent ring-transparent'
			)}
			onclick={() => setPanel(id, component, props)}
		>
			<Icon class="size-6" this={icon} />
		</Button>
	{/each}
</div>

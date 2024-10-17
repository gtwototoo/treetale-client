<script lang="ts">
	import type { Component } from 'svelte';

	import { Cog6Tooth, DocumentText, RectangleStack, Tv, Variable } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import type { PanelProps } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';

	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';

	import FrameSettings from './FrameSettings.svelte';
	import InformationSettings from './InformationSettings.svelte';
	import Inspector from './Inspector.svelte';
	import Notes from './Notes.svelte';
	import Variables from './Variables.svelte';

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

<div class={clm('flex gap-1 p-3 pb-0 *:flex-1', !panelStatesStore.show && 'max-xs:hidden')}>
	{#each tabs as { component, icon, id, props } (id)}
		<Button
			size="lg"
			class={clm('justify-center px-0 text-text hover:bg-main-70', isActive(id) && 'bg-main-50')}
			onclick={() => setPanel(id, component, props)}
		>
			<Icon class="size-6" this={icon} />
		</Button>
	{/each}
</div>

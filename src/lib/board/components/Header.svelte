<script lang="ts">
	import { ArrowUturnLeft, ArrowUturnRight, Cloud, Link as LinkIcon } from 'svelte-heros-v2';
	import { Button, FormSplit, Icon } from 'treetale-ui';

	import Logo from '$lib/components/Header/Logo.svelte';
	import Session from '$lib/components/Header/Session.svelte';
	import { ICON_TYPE } from '$lib/constants';
	import { clm } from '$lib/utils/classMerge';

	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { type StateType, boardStateStore, readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';

	import ChangesHistory from './Panel/ChangesHistory.svelte';
	import ShareBoard from './Panel/ShareBoard.svelte';

	const stateColors: Record<StateType, string> = {
		await: 'text-gray-400',
		error: 'text-red-500',
		saved: 'text-emerald-500',
		saving: 'animate-pulse text-gray-400'
	};

	const historySwitch = () => {
		panelStatesStore.set('history', ChangesHistory, {
			title: 'История изменений'
		});
	};

	const handleClick = () => {
		panelStatesStore.set('share', ShareBoard, { isEdit: true, title: 'Совместный доступ' });
	};
</script>

<div
	class="pointer-events-none fixed inset-x-0 top-0 flex items-center justify-between p-4 *:pointer-events-auto max-sm:p-3 lg:mr-[24.5rem]"
>
	<Logo />
	<div class="flex gap-3">
		{#if readonlyModeStore.isEnabled}
			<div class="bg-contrast/10 text-text rounded-xl px-6 py-3 text-base select-none">
				Режим просмотра
			</div>
		{:else}
			<Icon
				this={Cloud}
				class={clm('my-3 size-6', stateColors[boardStateStore.state])}
				variation={boardStateStore.state === 'saving' ? ICON_TYPE : 'solid'}
			/>
			<FormSplit>
				<Button
					class="header-button bg-contrast text-text"
					disabled={changesHistoryStore.currentId === 0}
					onclick={changesHistoryStore.undo}
					onholdclick={historySwitch}
					size="lg"
				>
					<Icon this={ArrowUturnLeft} />
				</Button>
				<Button
					class="header-button bg-contrast text-text"
					disabled={changesHistoryStore.currentId + 1 >= changesHistoryStore.stages.length}
					onclick={changesHistoryStore.redo}
					onholdclick={historySwitch}
					size="lg"
				>
					<Icon this={ArrowUturnRight} />
				</Button>
			</FormSplit>
			<Button
				size="lg"
				class={clm(
					'bg-contrast text-text -mr-6 rounded-full px-3',
					panelStatesStore.id === 'share' && 'bg-main-500'
				)}
				onclick={handleClick}
			>
				<Icon this={LinkIcon} class="size-6" />
			</Button>
		{/if}
		<Session />
	</div>
</div>

<script lang="ts">
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { ArrowUturnLeft, ArrowUturnRight, Link as LinkIcon } from 'svelte-heros-v2';
	import { Button, FormSplit, Icon } from 'treetale-ui';

	import Logo from '$lib/components/Header/Logo.svelte';
	import LogoLinearGradient from '$lib/components/Header/LogoLinearGradient.svelte';
	import Session from '$lib/components/Header/Session.svelte';
	import { clm } from '$lib/utils/classMerge';

	import ChangesHistory from './Panel/ChangesHistory.svelte';
	import ShareBoard from './Panel/ShareBoard.svelte';

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
	<LogoLinearGradient />
	<Logo />
	<div class="flex gap-3">
		{#if readonlyModeStore.isEnabled}
			<div class="select-none rounded-xl bg-contrast/10 px-6 py-3 text-base text-text">
				Режим просмотра
			</div>
		{:else}
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
					'-mr-6 rounded-full bg-contrast px-3 text-text',
					panelStatesStore.id === 'share' && 'bg-main-50'
				)}
				onclick={handleClick}
			>
				<Icon this={LinkIcon} class="size-6" />
			</Button>
		{/if}
		<Session />
	</div>
</div>

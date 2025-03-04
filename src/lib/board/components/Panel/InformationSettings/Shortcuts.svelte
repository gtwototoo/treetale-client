<script lang="ts">
	import { readonlyModeStore } from '$board/stores/index.svelte';

	interface Shortcut {
		keys: string[];
		readonly?: boolean;
		text: string;
	}

	const shortcuts: Shortcut[] = [
		{ keys: ['F'], text: 'Режим добавления блоков' },
		{ keys: ['C'], text: 'Режим добавления связей' },
		{ keys: ['E'], text: 'Редактирование в панели' },
		{ keys: ['⌘', 'Z'], text: 'Отменить действие' },
		{ keys: ['SHIFT', '⌘', 'Z'], text: 'Вернуть действие' },
		{ keys: ['Tab'], readonly: true, text: 'Переключить блок' },
		{ keys: ['ESC'], text: 'Режим просмотра' }
	];
</script>

<div
	class="bg-contrast-200 flex flex-col gap-2 rounded-lg p-2 pl-4 text-center text-sm select-none"
>
	<p class="py-2">Горячие клавиши</p>
	<div class="flex flex-col gap-2">
		{#each shortcuts as { keys, readonly, text }, index (index)}
			{#if !readonlyModeStore.isEnabled || readonly}
				<div class="flex items-center justify-between">
					<p>{text}</p>
					<div class="flex gap-1 font-bold">
						{#each keys as key (key)}
							<div class="bg-main-700 min-w-[1.75rem] rounded-lg px-2 py-1">{key}</div>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

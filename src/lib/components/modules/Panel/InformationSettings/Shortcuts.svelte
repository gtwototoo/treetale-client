<script lang="ts">
	import { readonlyStore } from '$lib/stores/editing';

	interface IShortcut {
		keys: Array<string>;
		readonly?: boolean;
		text: string;
	}

	const shortcuts: Array<IShortcut> = [
		{ keys: ['F'], text: 'Режим добавления блоков' },
		{ keys: ['C'], text: 'Режим добавления связей' },
		{ keys: ['⌘', 'Z'], text: 'Отменить действие' },
		{ keys: ['SHIFT', '⌘', 'Z'], text: 'Вернуть действие' },
		{ keys: ['Tab'], readonly: true, text: 'Переключить блок' },
		{ keys: ['ESC'], text: 'Режим просмотра' }
	];
</script>

<div
	class="flex select-none flex-col gap-4 rounded-lg bg-contrast-2 p-4 text-center text-sm *:bg-transparent"
>
	<p>Горячие клавиши</p>
	<div class="flex flex-col gap-2">
		{#each shortcuts as { keys, readonly, text }}
			{#if !$readonlyStore || readonly}
				<div class="flex items-center justify-between">
					<p>{text}</p>
					<div class="flex gap-1 font-bold">
						{#each keys as key}
							<div class="min-w-[1.75rem] rounded-lg bg-main-70 px-2 py-1">{key}</div>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

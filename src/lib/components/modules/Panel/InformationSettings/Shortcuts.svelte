<script lang="ts">
	import { readonlyStore } from '$lib/stores/editing';

	interface IShortcut {
		keys: Array<string>;
		readonly?: boolean;
		text: string;
	}

	const shortcuts: Array<IShortcut> = [
		{ text: 'Режим добавления блоков', keys: ['F'] },
		{ text: 'Режим добавления связей', keys: ['C'] },
		{ text: 'Отменить действие', keys: ['⌘', 'Z'] },
		{ text: 'Вернуть действие', keys: ['SHIFT', '⌘', 'Z'] },
		{ text: 'Переключить блок', keys: ['Tab'], readonly: true },
		{ text: 'Режим просмотра', keys: ['ESC'] }
	];
</script>

<div
	class="flex select-none flex-col gap-4 rounded-lg bg-main-30 p-4 text-center text-sm childs:bg-transparent"
>
	<p>Горячие клавиши</p>
	<div class="flex flex-col gap-2">
		{#each shortcuts as { keys, text, readonly }}
			{#if !$readonlyStore || readonly}
				<div class="flex items-center justify-between">
					<p>{text}</p>
					<div class="flex gap-1 font-bold">
						{#each keys as key}
							<div class="min-w-[1.75rem] rounded-lg bg-main px-2 py-1">{key}</div>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

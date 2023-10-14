<script lang="ts">
	interface IShortcut {
		text: string;
		keys: Array<string>;
	}

	const shortcuts: Array<IShortcut> = [
		{ text: 'Режим добавления фреймов', keys: ['F'] },
		{ text: 'Режим добавления связей', keys: ['C'] },
		{ text: 'Отменить действие', keys: ['⌘', 'Z'] },
		{ text: 'Вернуть действие', keys: ['SHIFT', '⌘', 'Z'] },
		{ text: 'Режим просмотра', keys: ['ESC'] }
	];
</script>

<div class="bg-gray-50 p-4 gap-4 text-sm flex flex-col text-center rounded-lg select-none">
	<p>Горячие клавиши</p>
	<div class="flex flex-col gap-2">
		{#each shortcuts as { text, keys }}
			<div class="flex justify-between items-center">
				<p>{text}</p>
				<div class="flex gap-1 font-bold">
					{#each keys as key}
						<div class="bg-gray-100 py-1 px-2 rounded-lg min-w-[1.75rem]">{key}</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

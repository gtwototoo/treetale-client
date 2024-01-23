<script lang="ts">
	import { Star } from 'svelte-heros-v2';

	import Note from './Note.svelte';

	import { Button, Input, Listbox } from '$UI';
	import Panel from './Panel.svelte';

	const payments = ['Банковская карта', 'СБП'];

	let value: string;
</script>

<Panel title="Поддержать автора">
	<Note
		icon={Star}
		text="Поддержите своего любимого автора, чтобы мотивировать его создавать новые интересные и захватывающие истории"
	/>
	<Input placeholder="Введите сумму" bind:value number />
	<Listbox list={payments} placeholder="Вариант оплаты" />
	<Button variant="main" class="justify-center bg-main">Внести вклад</Button>
</Panel>

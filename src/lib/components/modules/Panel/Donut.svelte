<script lang="ts">
	import { Star } from 'svelte-heros-v2';

	import { Button, Input, Listbox } from '$UI';

	import Note from './Note.svelte';
	import Panel from './Panel.svelte';

	const payments = ['Банковская карта', 'СБП'];

	let value: string;
</script>

<Panel title="Поддержать автора">
	<Note
		icon={Star}
		text="Поддержите своего любимого автора, чтобы мотивировать его создавать новые интересные и захватывающие истории"
	/>
	<Input bind:value number placeholder="Введите сумму" />
	<Listbox list={payments} placeholder="Вариант оплаты" />
	<Button class="justify-center bg-main" variant="main">Внести вклад</Button>
</Panel>

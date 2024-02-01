<script lang="ts">
	import { Star } from 'svelte-heros-v2';

	import { Button, Contenteditable, Input, Listbox } from '$UI';

	import Note from './Note.svelte';
	import Panel from './Panel.svelte';

	const payments = ['Банковская карта', 'СБП'];

	let value: string;
	let comment: string;
</script>

<Panel title="Поддержать автора" nonEdit>
	<Note
		icon={Star}
		text="Поддержите своего любимого автора, чтобы мотивировать его создавать новые интересные и захватывающие истории"
	/>
	<Input bind:value number placeholder="Сумма" />
	<Contenteditable placeholder="Комментарий" bind:html={comment} />
	<Listbox list={payments} align="inset" placeholder="Вариант оплаты" />
	<Button class="justify-center bg-main" variant="main">Внести вклад</Button>
</Panel>

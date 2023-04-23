<script lang="ts">
	import { Button, Input } from '$UI';
	import { Star } from 'svelte-heros-v2';
	import Note from './Note.svelte';

	let value: string;
</script>

<div class="flex flex-col items-stretch gap-4 p-3">
	<Note
		icon={Star}
		text="Поддержите своего любимого автора, чтобы мотивировать его создавать новые истории"
	/>
	<Input placeholder="Введите сумму" bind:value number />
	<Button class="justify-center">Поддержать</Button>
</div>

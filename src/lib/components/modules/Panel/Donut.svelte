<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { correctWhitespace } from '$lib/utils';
	import { Button, Input } from '$UI';
	import { Star } from 'svelte-heros-v2';

	let value: string;
</script>

<div class="flex flex-col items-stretch gap-4 p-4 text-center text-sm">
	<div class="flex flex-col items-center gap-2">
		<Icon type={Star} class="h-9 w-9" />
		{correctWhitespace(
			'Поддержите своего любимого автора, чтобы мотивировать его создавать новые истории'
		)}
	</div>
	<Input placeholder="Введите сумму" bind:value number />
	<Button class="justify-center">Поддержать</Button>
</div>

<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { correctWhitespace } from '$lib/utils';
	import { Star } from 'svelte-heros-v2';
</script>

<div class="flex w-full justify-center">
	<Icon type={Star} class="h-9 w-9 text-gray-300" />
</div>
<p class="text-center text-sm text-gray-500">
	{correctWhitespace(
		'Поддержите своего любимого автора, чтобы мотивировать его создавать новые истории'
	)}
</p>

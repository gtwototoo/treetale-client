<script lang="ts">
	import StoriesList from '$lib/components/StoriesList.svelte';
	import { correctWhitespace } from '$lib/utils/text.js';

	let { data } = $props();
</script>

<StoriesList authors={data.authors} stories={data.stories}>
	<p>
		{correctWhitespace('Истории, отправленные на проверку, отсутствуют')}
	</p>
</StoriesList>

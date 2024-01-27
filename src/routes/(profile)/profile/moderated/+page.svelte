<script lang="ts">
	import StoriesList from '$lib/components/modules/StoriesList/StoriesList.svelte';
	import { correctWhitespace } from '$lib/utils';

	export let data;
</script>

<StoriesList authors={data.authors} stories={data.stories}>
	<p>
		{correctWhitespace('Истории, отправленные на проверку, отсутствуют')}
	</p>
</StoriesList>

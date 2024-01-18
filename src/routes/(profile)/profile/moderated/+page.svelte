<script lang="ts">
	import StoriesList from '$lib/components/modules/StoriesList/StoriesList.svelte';
	import { correctWhitespace } from '$lib/utils';

	export let data;
</script>

<StoriesList stories={data.stories} authors={data.authors}>
	<p>
		{correctWhitespace('Истории, отправленные на проверку, отсутствуют')}
	</p>
</StoriesList>

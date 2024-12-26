<script lang="ts">
	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import { bodyBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { contrastText } from '$lib/utils/contrast';

	import Header from './index.svelte';

	let greenBackgroundColor = $derived(
		contrastText(bodyBackgroundColorStore.color)
			? clm('bg-emerald-800 hover:bg-emerald-700')
			: clm('bg-emerald-400 hover:bg-emerald-300')
	);
</script>

<Header>
	<AddStoryButton class={clm('header-button', greenBackgroundColor)} />
</Header>

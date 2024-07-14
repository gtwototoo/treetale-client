<script lang="ts">
	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { bodyColorStore } from '$lib/stores/main';
	import { clm } from '$lib/utils/classMerge';
	import { contrastText } from '$lib/utils/contrast';

	import Header from './Header.svelte';

	let greenBackgroundColor = $derived(
		contrastText($bodyColorStore || DEFAULT_COLOR)
			? clm('bg-emerald-800 hover:bg-emerald-700')
			: clm('bg-emerald-400 hover:bg-emerald-300')
	);
</script>

<Header>
	<AddStoryButton class={clm('header-button', greenBackgroundColor)} />
</Header>

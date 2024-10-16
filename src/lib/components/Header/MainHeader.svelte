<script lang="ts">
	import Header from './Header.svelte';

	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { bodyBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { contrastText } from '$lib/utils/contrast';

	let greenBackgroundColor = $derived(
		contrastText(bodyBackgroundColorStore.color || DEFAULT_COLOR)
			? clm('bg-emerald-800 hover:bg-emerald-700')
			: clm('bg-emerald-400 hover:bg-emerald-300')
	);
</script>

<Header>
	<AddStoryButton class={clm('header-button', greenBackgroundColor)} />
</Header>

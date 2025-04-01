<script lang="ts">
	import { theme } from '$lib/stores/colors.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	import Header from './index.svelte';
</script>

<Header>
	<Button
		class={clm(button.size.lg, button.type.primary, 'group size-12 justify-center')}
		onclick={() => (theme.type = theme.type === 'dark' ? 'light' : 'dark')}
	>
		<div
			class={clm(
				'ring-main-500 size-7 shrink-0 rounded-full ring-1 transition-[width,height] group-hover:size-8',
				theme.type === 'dark' ? 'bg-black' : 'bg-white'
			)}
		></div>
	</Button>
</Header>

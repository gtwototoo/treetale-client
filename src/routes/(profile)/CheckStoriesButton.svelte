<script>
	import Button from '$lib/ui/Button.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';
</script>

<Button asLink href="/" class={clm(button.type.primary, button.size.lg)}>
	Смотреть все истории
</Button>

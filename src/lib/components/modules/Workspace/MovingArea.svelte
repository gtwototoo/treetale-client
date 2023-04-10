<script lang="ts">
	import { storyInfo } from '$lib/stores/editing';
	import { transform } from '$lib/utils';
</script>

<div
	class="absolute transition-transform"
	style={transform($storyInfo.offset, $storyInfo.scale / 100)}
>
	<slot />
</div>

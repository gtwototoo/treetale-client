<script lang="ts">
	import { BookOpen } from 'svelte-heros-v2';

	import { Card } from '$UI';
</script>

<Card class="relative h-full items-center justify-center overflow-hidden bg-contrast/20">
	<BookOpen
		variation="solid"
		class="absolute h-44 w-auto bg-transparent text-main transition-colors max-hd:h-36 max-xl:h-28"
	/>
</Card>

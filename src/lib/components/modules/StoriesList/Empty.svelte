<script lang="ts">
	import { BookOpen } from 'svelte-heros-v2';

	import { Card } from '$UI';
</script>

<Card class="h-full items-center relative justify-center bg-contrast/20 overflow-hidden">
	<BookOpen
		variation="solid"
		class="h-44 absolute max-hd:h-36 max-xl:h-28 w-auto bg-transparent text-main transition-colors"
	/>
</Card>

<script lang="ts">
	import clsx from 'clsx';	import { BookOpen } from 'svelte-heros-v2';

	import { Card } from '$UI';

	let className = '';
	export { className as class };
</script>

<Card
	class={clsx(
		'relative h-[550px] items-center justify-center bg-contrast/20 max-2xl:h-[519px] max-xl:h-[487px] max-lg:h-[439px] max-md:h-[399px] max-sm:h-[359px] max-xs:h-[323px]',
		className
	)}
>
	<BookOpen
		class="absolute h-1/3 w-auto bg-transparent text-main transition-colors"
		variation="solid"
	/>
</Card>

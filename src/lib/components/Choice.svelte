<script lang="ts">
	import { Button } from '$UI';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ADAPTIVE_FONT, ADAPTIVE_PADDING } from '$lib/constants';
	import clsx from 'clsx';

	export let setChoice: (choiceId: number) => void;
	export let active: boolean;
	export let choiceId: number;

	const handleClick = () => {
		if ($page.data.session) {
			setChoice(choiceId);
		} else {
			goto('/signin');
		}
	};
</script>

<Button
	on:click={handleClick}
	variant={active ? 'main' : 'secondary'}
	class={clsx(
		'whitespace-normal text-left',
		active && 'bg-main text-text',
		ADAPTIVE_FONT,
		ADAPTIVE_PADDING
	)}
>
	<slot />
</Button>

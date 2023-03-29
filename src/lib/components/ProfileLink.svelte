<script lang="ts">
	import { page } from '$app/stores';
	import { DEFAULT_COLOR } from '$lib/constants';
	import type { IUser } from '$lib/types';
	import { Avatar, Button } from '$UI';
	import clsx from 'clsx';
	import Link from './Link.svelte';

	let classes: string = '';

	export { classes as class };
	export let data: IUser;
	export let classImage: string = '';
	export let align: 'left' | 'right' = 'left';

	const split = data.name.split(' ');
	const short = `${split[0][0]}${split.length > 1 ? split.at(-1)?.[0] : ''}`;

	$: selectedColor = data.color && data.color.length ? data.color : DEFAULT_COLOR;
</script>

<Link
	href={$page.data.session?.userId === data.userId ? '/profile' : `@${data.name}`}
	class="contents bg-transparent"
>
	<Button
		style="--color-main: {selectedColor.join(' ')}"
		class={clsx(classes, 'min-w-0 gap-2 !p-0', {
			'flex-row-reverse': align === 'right'
		})}
		variant="transparent"
	>
		<Avatar
			class={clsx('light-gradient-main', classImage)}
			width={36}
			src={data.avatarId}
			alt={data.name}
		/>
		<slot />
	</Button>
</Link>

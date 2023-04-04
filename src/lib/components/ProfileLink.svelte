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
	export let align: 'left' | 'right' = 'left';
	export let created: number;

	$: date = new Date(created).toLocaleDateString('en-GB');
	$: selectedColor = data.color && data.color.length ? data.color : DEFAULT_COLOR;
</script>

<Link
	href={$page.data.session?.userId === data.userId ? '/profile' : `@${data.name}`}
	class="contents bg-transparent"
>
	<Button
		class={clsx(classes, 'min-w-0 gap-2 !p-0', {
			'flex-row-reverse': align === 'right'
		})}
		variant="transparent"
	>
		<Avatar
			style="--color-main: {selectedColor.join(' ')}"
			class="light-gradient-main xs:!h-9 xs:!w-9 xs:!text-sm"
			size="sm"
			width={36}
			src={data.avatarId}
			alt={data.name}
		/>
		<div class="overflow-hidden text-left">
			<p class="hidden truncate xs:block">
				{data.name}
			</p>
			<div class="flex select-none gap-1 text-xs text-gray-500">
				<p class="hidden truncate xs:block">Опубликовано</p>
				<p>{date}</p>
			</div>
		</div>
	</Button>
</Link>

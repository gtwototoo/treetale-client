<script lang="ts">
	import Link from './Link.svelte';

	import { page } from '$app/stores';
	import { DEFAULT_COLOR } from '$lib/constants';
	import type { IUser } from '$lib/types';
	import { RGB } from '$lib/utils';
	import { Avatar, Button } from '$UI';

	export let author: IUser;
	export let created: number;

	$: date = new Date(created).toLocaleDateString('en-GB');
	$: selectedColor = author.color && author.color.length ? author.color : DEFAULT_COLOR;
</script>

<Link
	href={$page.data.session?.userId === author.userId ? '/profile' : `@${author.name}`}
	class="contents"
>
	<Button class="min-w-0 gap-2 !p-0" variant="main">
		<Avatar
			--color-main={RGB(selectedColor)}
			class="light-gradient-main xs:!h-9 xs:!w-9 xs:!text-sm"
			size="sm"
			width={36}
			src={author.avatarId}
			alt={author.name}
		/>
		<div class="overflow-hidden text-left">
			<p class="truncate max-xs:hidden text-text">
				{author.name}
			</p>
			<div class="flex select-none gap-1 text-xs text-gray-500">
				<p class="truncate max-xs:hidden">Опубликовано</p>
				<p>{date}</p>
			</div>
		</div>
	</Button>
</Link>

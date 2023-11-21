<script lang="ts">
	import { Avatar, Button } from '$UI';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { DEFAULT_COLOR } from '$lib/constants';
	import type { IUser } from '$lib/types';
	import { RGB } from '$lib/utils';

	export let author: IUser;
	export let created: number;

	const handleClick = () => {
		goto($page.data.session?.userId === author.userId ? '/profile' : `@${author.name}`);
	};

	$: date = new Date(created).toLocaleDateString('en-GB');
	$: selectedColor = author.color && author.color.length ? author.color : DEFAULT_COLOR;
</script>

<Button class="min-w-0 gap-2 !p-0" variant="main" on:click={handleClick}>
	<Avatar
		--color-main={RGB(selectedColor)}
		class="light-gradient-main xs:!h-9 xs:!w-9 xs:!text-sm"
		size="sm"
		width={36}
		src={author.avatarId}
		alt={author.name}
	/>
	<div class="overflow-hidden text-left">
		<p class="truncate text-text max-xs:hidden">
			{author.name}
		</p>
		<div class="flex select-none gap-1 text-xs text-gray-500">
			<p class="truncate max-xs:hidden">Опубликовано</p>
			<p>{date}</p>
		</div>
	</div>
</Button>

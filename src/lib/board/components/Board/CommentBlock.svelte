<script lang="ts">
	import reject from 'lodash/reject';
	import { Trash, XMark } from 'svelte-heros-v2';

	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import type { Comment } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import Contenteditable from '$lib/ui/Contenteditable.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	import { movingBlockStore } from '$board/stores/blocks.svelte';
	import { boardCommentsStore } from '$board/stores/comments.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { boardEventsStore, readonlyModeStore } from '$board/stores/index.svelte';
	import { transform } from '$board/utils/coordinatesToCss';

	const {
		comment
	}: {
		comment: Comment;
	} = $props();

	let hovered = $state(false);

	const handleMouseDown = () => {
		if (!comment) return;

		if (!readonlyModeStore.isEnabled) {
			movingBlockStore.id = comment.commentId;
			movingBlockStore.type = 'comment';
		}
	};

	const removeComment = () => {
		boardCommentsStore.comments = reject(boardCommentsStore.comments, {
			commentId: comment.commentId
		});

		changesHistoryStore.add('Удаление заметки', Trash);
	};

	let { x, y } = $derived(comment);
</script>

<div
	role="button"
	tabindex="0"
	bind:clientHeight={comment.height}
	style={transform({ x, y })}
	ontouchstart={handleMouseDown}
	onmousedown={handleMouseDown}
	class={clm(
		'bg-main-300 ring-main hover:ring-text absolute z-[100000] w-64 rounded-lg p-2 ring-2',
		!readonlyModeStore.isEnabled && 'cursor-move'
	)}
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
>
	<Contenteditable
		class={clm(button.size.base)}
		bind:html={comment.text}
		oninput={boardEventsStore.save}
		maxlength={1500}
		placeholder="Текст заметки"
	/>
	{#if hovered}
		<Button
			class={clm(
				button.type.primary,
				button.size.sm,
				'absolute -top-2.5 -right-2.5 rounded-full px-1.5',
				redBackgroundColorStore.color
			)}
			onclick={removeComment}
		>
			<Icon this={XMark} class="size-5" />
		</Button>
	{/if}
</div>

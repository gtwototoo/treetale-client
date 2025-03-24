<script lang="ts">
	import reject from 'lodash/reject';
	import { Trash, XMark } from 'svelte-heros-v2';
	import { Button, Contenteditable } from 'treetale-ui';

	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import type { Comment } from '$lib/types';
	import Icon from '$lib/ui/Icon.svelte';
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
		'bg-main-400 text-text absolute z-[100000] w-64 rounded-lg p-2',
		!readonlyModeStore.isEnabled && 'cursor-move'
	)}
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
>
	<Contenteditable
		bind:html={comment.text}
		oninput={boardEventsStore.save}
		maxlength={1500}
		class="!bg-transparent"
		placeholder="Текст заметки"
	/>
	{#if hovered}
		<Button
			class={clm(
				'absolute -top-2.5 -right-2.5 rounded-full p-2 text-red-500',
				redBackgroundColorStore.color
			)}
			size="sm"
			onclick={removeComment}
		>
			<Icon this={XMark} class="size-4" />
		</Button>
	{/if}
</div>

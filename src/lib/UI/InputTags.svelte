<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { autoWidth } from '$lib/hooks';

	import { Button, Tag } from '$UI';
	import { clsx } from 'clsx';
	import { createEventDispatcher } from 'svelte';
	import { XMark } from 'svelte-heros-v2';

	let classes = '';
	export { classes as class };
	export let placeholder: string;
	export let tags: string[] = [];
	export let disabled = false;
	export let value = '';
	export let maxLength = 20;

	let focused = false;

	const dispatch = createEventDispatcher();

	const removeTag = (name: string) => {
		tags = tags.filter((value) => value !== name);
		dispatch('remove', { name });
	};

	const addTag = (name: string) => {
		value = '';
		tags = [...tags, name];
		dispatch('add', { name });
	};

	const handlePaste = (e: ClipboardEvent) => {
		const data = e.clipboardData;

		if (!data) return;

		const text = data.getData('text/plain');

		const newTags = (value + text).match(new RegExp(`.{1,${maxLength}}`, 'g'));

		if (!newTags) return;

		for (const tag of newTags) {
			if (tag.length === maxLength) addTag(tag);
			else value = tag;
		}
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();

			if (value === '') return;

			addTag(value);
		}
		if (e.key === 'Backspace' && value === '') {
			e.preventDefault();

			const lastTagValue = tags.at(-1);

			if (!lastTagValue) return;

			value = lastTagValue;
			removeTag(lastTagValue);

			return;
		}
		if (e.key !== 'Backspace' && value.length >= maxLength) {
			e.preventDefault();

			addTag(value);
		}
	};
</script>

<button
	class={clsx('input', { disabled, 'p-1.5': tags.length, focused: 'bg-blue-50' }, classes)}
	on:keydown={handleKeydown}
>
	{#each tags as tag}
		<Tag class="inline-flex items-stretch p-0">
			<p class="pl-2 !leading-6">{tag}</p>
			<Button
				size="sm"
				variant="transparent"
				class="!py-1 hover:!text-red-600"
				on:click={() => removeTag(tag)}
			>
				<Icon type={XMark} class="h-3 max-h-full w-3" />
			</Button>
		</Tag>
	{/each}
	<input
		bind:value
		class={clsx({ '!p-0 !leading-6': tags.length })}
		{placeholder}
		on:paste|preventDefault={handlePaste}
		on:focus={() => (focused = true)}
		on:blur={() => (focused = false)}
		use:autoWidth={value}
	/>
</button>

<style lang="postcss">
	input {
		@apply w-full flex-grow bg-transparent px-4 py-2 text-sm text-black placeholder:select-none;
	}
	.input {
		@apply flex flex-wrap items-center gap-2 overflow-hidden rounded-lg bg-white transition-colors hover:bg-blue-50;
	}
	.disabled {
		@apply pointer-events-none cursor-default bg-gray-100 opacity-40;
	}
</style>

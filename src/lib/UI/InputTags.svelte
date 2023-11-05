<script lang="ts">
	import { clsx } from 'clsx';
	import { createEventDispatcher } from 'svelte';
	import { XMark } from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { autoWidth } from '$lib/hooks';
	import { last } from '$lib/utils';
	import { Button, Tag } from '$UI';

	let className = '';
	export { className as class };

	export let placeholder: string;
	export let tags: Array<string> = [];
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
		const { code } = e;

		const handleAddTag = () => {
			if (value === '') return;

			addTag(value);
		};

		const handleRemoveTag = () => {
			if (value) return;

			const lastTagValue = last(tags);

			if (!lastTagValue) return;

			value = lastTagValue;
			removeTag(lastTagValue);
		};

		if (code === 'Backspace' && !value) {
			e.preventDefault();
			handleRemoveTag();
		}

		if (
			code === 'Space' ||
			code === 'Enter' ||
			(code !== 'Backspace' && value.length >= maxLength)
		) {
			e.preventDefault();
			handleAddTag();
		}
	};
</script>

<button
	class={clsx(
		'input',
		focused && '!bg-main-30',
		tags.length ? 'px-2' : 'px-4',
		{ disabled },
		className
	)}
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
		{placeholder}
		on:paste|preventDefault={handlePaste}
		on:focus={() => (focused = true)}
		on:blur={() => (focused = false)}
		use:autoWidth={value}
	/>
</button>

<style lang="postcss">
	input {
		@apply w-full flex-grow bg-transparent text-sm leading-6 text-black placeholder:select-none;
	}
	.input {
		@apply flex min-h-[2.5rem] flex-wrap items-center gap-2 overflow-hidden rounded-lg bg-main-20 py-2 transition-colors hover:bg-main-30;
	}
	.disabled {
		@apply pointer-events-none cursor-default bg-gray-100 opacity-40;
	}
</style>

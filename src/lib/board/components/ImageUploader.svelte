<script lang="ts">
	import type { Component } from 'svelte';

	import { Image } from 'treetale-ui';

	import FileUploader from './FileUploader.svelte';

	const {
		alt,
		class: classname,
		disabled = false,
		icon,
		onloadstart,
		onremove,
		readonly = false,
		src
	}: {
		alt?: string;
		class?: string;
		disabled?: boolean;
		icon: Component;
		onloadstart?: (file: File) => void;
		onremove?: () => void;
		readonly?: boolean;
		src?: null | string;
	} = $props();

	let base64src = $state('');
</script>

<FileUploader
	{icon}
	mediaType="image"
	{onloadstart}
	{onremove}
	{readonly}
	{disabled}
	{src}
	bind:base64src
	class={classname}
>
	<Image
		{alt}
		{base64src}
		class="rounded-inherit bg-main/30 text-text size-full"
		cover
		onload={() => (base64src = '')}
		{src}
	/>
</FileUploader>

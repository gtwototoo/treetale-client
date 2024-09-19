<script lang="ts">
	import { type HeroIconComponent, Image } from 'treetale-ui';

	import FileUploader from './FileUploader.svelte';

	let {
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
		icon: HeroIconComponent;
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
		class="size-full rounded-inherit bg-main/30 text-text"
		cover
		onload={() => (base64src = '')}
		{src}
	/>
</FileUploader>

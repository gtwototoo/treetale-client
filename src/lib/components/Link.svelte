<script lang="ts">
	let className = '';
	export { className as class };

	export let href: string;
	export let target: '_blank' | '_parent' | '_self' | '_top' = '_self';
</script>

<a class={className} draggable="false" {href} {target}>
	<slot />
</a>

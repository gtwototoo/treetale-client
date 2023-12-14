<script lang="ts">
	let className = '';
	export { className as class };

	export let href: string;
	export let target: '_self' | '_blank' | '_parent' | '_top' = '_self';
</script>

<a {href} draggable="false" {target} class={className}>
	<slot />
</a>

<script lang="ts">
	let className = '';
	export { className as class };

	export let href: string;
</script>

<a {href} draggable="false" class={className}>
	<slot />
</a>

<script lang="ts">
	let className = '';
	export let href: string;
	export { className as class };
</script>

<a {href} draggable="false" class={className}>
	<slot />
</a>

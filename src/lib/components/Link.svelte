<script lang="ts">
	let classes = '';
	export let href: string;
	export { classes as class };
</script>

<a {href} draggable="false" class={classes}>
	<slot />
</a>

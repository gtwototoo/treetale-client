<script lang="ts">
	import '../app.css';
	import '../fonts/RobotoSlab.css';
	import SvgGradient from './SvgGradient.svelte';

	const { children } = $props();
</script>

<SvgGradient />

{@render children()}

<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { connect } from '$lib/stores/editing';
	import { Selector, SelectorItem } from '$UI';
	import { Share, Square2Stack } from 'svelte-heros-v2';

	const disableConnectMode = () => {
		$connect = {
			active: false,
			connector: {
				from: null,
				to: null,
				prevOutput: null,
				mouseCoords: null
			}
		};
	};

	const enableConnectMode = () => ($connect.active = true);
</script>

<Selector>
	<SelectorItem active={!$connect.active} on:click={disableConnectMode}>
		<Icon type={Square2Stack} />
		<p>Блоки</p>
	</SelectorItem>
	<SelectorItem active={$connect.active} on:click={enableConnectMode}>
		<Icon type={Share} />
		<p>Связи</p>
	</SelectorItem>
</Selector>

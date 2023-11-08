<script lang="ts">
	import { MagnifyingGlass } from 'svelte-heros-v2';

	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/index.svelte';
	import { DEFAULT_COLOR } from '$lib/constants.js';
	import { bodyColorStore } from '$lib/stores/main';
	import { correctWhitespace, rootStyle } from '$lib/utils';
	import { Input } from '$UI';

	export let data;

	$bodyColorStore = DEFAULT_COLOR;
</script>

<svelte:head>
	<title>TREETALE</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<div class="flex grow flex-col">
	{#if data.stories.length}
		<div class="flex flex-col gap-8 w-full items-center px-2">
			<h1 class="sticky top-0 z-[1] w-full select-none py-4 text-center leading-9 text-text">
				Список историй
			</h1>
			<Input placeholder="Поиск" size="lg" class="w-full max-w-lg">
				<svelte:fragment slot="left">
					<Icon
						type={MagnifyingGlass}
						class="w-6 h-6 mr-5 pointer-events-none text-gray-800"
					/>
				</svelte:fragment>
			</Input>
		</div>
	{/if}
	<StoriesList stories={data.stories}>
		<p>
			{correctWhitespace('Историй не найдено, но вы можете добавить свою уникальную историю')}
		</p>
		<AddStoryButton class="gap-3 bg-white" />
	</StoriesList>
</div>

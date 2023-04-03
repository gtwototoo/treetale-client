<script lang="ts">
	import className from '$lib/classnames';
	import { iconsType } from '$lib/constants';
	import Rivet from '$lib/editing/Rivet.svelte';
	import {
		activeActions,
		changesHistory,
		connect,
		storyInfo,
	} from '$lib/stores/editing';
	import type { IFrameCreate } from '$lib/types/editing';
	import { Button, Input } from '$UI';
	import { Plus, XMark } from 'svelte-heros-v2';

	export let updateData: () => void;
	export let data: IFrameCreate;

	const addChoice = () => {
		const choiceId = data.choices.length
			? data.choices.at(-1).choiceId + 1
			: 0;

		data.choices = [
			...data.choices,
			{
				text: null,
				frameId: null,
				choiceId,
			},
		];

		changesHistory.add({
			title: 'Добавление выбора',
			icon: Plus,
		});

		updateData();
	};

	const removeChoice = (choiceId: number) => {
		data.choices = data.choices.filter(
			(choice) => choice.choiceId !== choiceId
		);

		changesHistory.add({
			title: 'Удаление выбора',
			icon: XMark,
		});

		updateData();
	};

	const startConnection = ({ x, y }: MouseEvent, choiceId: number) => {
		if (!$connect.active) return;

		const choice = data.choices.find(
			(choice) => choice.choiceId === choiceId
		);
		const prevOutput = choice.frameId;

		choice.frameId = null;
		$connect.connector = {
			from: { frameId: data.frameId, choiceId },
			prevOutput,
			to: null,
			mouseCoords: storyInfo.scaleCorrect({ x, y }),
		};
		$activeActions = true;
	};
</script>

<div
	class={className(
		'bg-gray-50',
		data.rotated ? 'rounded-r-lg' : 'rounded-b-lg'
	)}
>
	<div
		class={className('pointer-events-auto flex flex-col gap-2', {
			'!pointer-events-none': $storyInfo.grabbingScale <= 20,
		})}
	>
		{#each data.choices as choice (choice.choiceId)}
			<div class="relative flex items-center">
				{#if $connect.active}
					<Button
						size="small"
						class="mr-2"
						on:click={() => removeChoice(choice.choiceId)}
					>
						<XMark variation={iconsType} class="h-3 w-3 text-red" />
					</Button>
				{/if}
				<Input
					class="w-full"
					disabled={$connect.active}
					placeholder="Вариант выбора"
					bind:value={choice.text}
				/>
				<Rivet
					class={className('-right-4', {
						'hover:after:bg-emerald-500': $connect.active,
					})}
					active={$connect.connector.from &&
						$connect.connector.from.frameId === data.frameId &&
						$connect.connector.from.choiceId === choice.choiceId &&
						$connect.connector.to !== null}
					frame={data}
					choiceId={choice.choiceId}
					on:mousedown={(e) => startConnection(e, choice.choiceId)}
				/>
			</div>
		{/each}
		<Button class="w-full gap-4" on:click={addChoice}>
			<Plus variation={iconsType} />
			<p>Вариант выбора</p>
		</Button>
	</div>
</div>

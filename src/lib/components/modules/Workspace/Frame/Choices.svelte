<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { activeAction, changesHistory, connect, storyInfo } from '$lib/stores/editing';
	import type { IFrameCreate } from '$lib/types/editing';
	import { Button, Input } from '$UI';
	import clsx from 'clsx';
	import { Plus, XMark } from 'svelte-heros-v2';
	import Rivet from '../Rivet.svelte';

	export let updateData: () => void;
	export let data: IFrameCreate;

	const addChoice = () => {
		const choiceId = data.choices.length ? data.choices.at(-1).choiceId + 1 : 0;

		data.choices = [
			...data.choices,
			{
				text: null,
				frameId: null,
				choiceId
			}
		];

		changesHistory.add({
			title: 'Добавление выбора',
			icon: Plus
		});

		updateData();
	};

	const removeChoice = (choiceId: number) => {
		data.choices = data.choices.filter((choice) => choice.choiceId !== choiceId);

		changesHistory.add({
			title: 'Удаление выбора',
			icon: XMark
		});

		updateData();
	};

	const startConnection = ({ x, y }: MouseEvent, choiceId: number) => {
		if (!$connect.active) return;

		const choice = data.choices.find((choice) => choice.choiceId === choiceId);
		const prevOutput = choice.frameId;

		choice.frameId = null;
		$connect.connector = {
			from: { frameId: data.frameId, choiceId },
			prevOutput,
			to: null,
			mouseCoords: storyInfo.scaleCorrect({ x, y })
		};
		$activeAction = 'Связывание';
	};
</script>

<div class={clsx('bg-gray-50', data.rotated ? 'rounded-r-lg' : 'rounded-b-lg')}>
	<div
		class={clsx('pointer-events-auto flex flex-col gap-2', {
			'!pointer-events-none': $storyInfo.grabbingScale <= 20
		})}
	>
		{#each data.choices as choice (choice.choiceId)}
			<div class="relative flex items-center">
				{#if $connect.active}
					<Button size="sm" class="mr-2" on:click={() => removeChoice(choice.choiceId)}>
						<Icon type={XMark} class="text-red h-3 w-3" />
					</Button>
				{/if}
				<Input
					class="w-full"
					disabled={$connect.active}
					placeholder="Вариант выбора"
					bind:value={choice.text}
				/>
				<Rivet
					class={clsx('-right-4', {
						'hover:after:bg-emerald-500': $connect.active
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
			<Icon type={Plus} />
			<p>Вариант выбора</p>
		</Button>
	</div>
</div>

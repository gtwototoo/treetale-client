import type { ActionReturn } from 'svelte/action';

interface IClickHold {
	'on:holdclick': (e: MouseEvent) => void;
}

export const clickHold = (node: HTMLElement): ActionReturn<null, IClickHold> => {
	const holdTime = 500;
	let mouseDown: boolean;
	let timer: number;

	const handleDown = (e: MouseEvent) => {
		mouseDown = true;

		timer = window.setTimeout(() => {
			if (mouseDown) {
				node.dispatchEvent(new CustomEvent('holdclick', e));
			}
		}, holdTime);
	};

	const handleUp = () => {
		mouseDown = false;

		clearTimeout(timer);
	};

	node.addEventListener('mousedown', handleDown, true);
	node.addEventListener('mouseup', handleUp, true);

	return {
		destroy() {
			node.removeEventListener('mousedown', handleDown, true);
			node.removeEventListener('mouseup', handleUp, true);
		}
	};
};

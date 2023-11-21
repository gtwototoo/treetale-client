import type { ActionReturn } from 'svelte/action';

interface IClickOutside {
	'on:outclick': (e: MouseEvent) => void;
}

export const clickOutside = (node: HTMLElement): ActionReturn<null, IClickOutside> => {
	const handleClick = (e: MouseEvent) => {
		if (
			e.target instanceof Element &&
			(node.contains(e.target) || node.contains((e.target as HTMLElement).offsetParent))
		) {
			return;
		}

		setTimeout(() => {
			node.dispatchEvent(new CustomEvent('outclick', e));
		});
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};

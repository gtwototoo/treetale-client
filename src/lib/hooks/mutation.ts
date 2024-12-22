import type { ActionReturn } from 'svelte/action';

interface IMutation {
	onmutation: (e: CustomEvent<{ detail: MutationRecord[] }>) => void;
}

export const mutationDetect = (node: HTMLElement): ActionReturn<null, IMutation> => {
	const config = { attributes: true, childList: true, subtree: true };
	const callback: MutationCallback = (mutationList) => {
		node.dispatchEvent(new CustomEvent('mutation', { detail: mutationList }));
	};
	const observer = new MutationObserver(callback);

	observer.observe(node, config);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};

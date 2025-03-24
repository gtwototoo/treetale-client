export const createPortal = (node: HTMLElement, parent?: HTMLElement) => {
	(parent || document.body).appendChild(node);

	return {
		destroy() {
			node.remove();
			document.body.classList.remove('!overflow-hidden');
		}
	};
};

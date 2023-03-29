export const createPortal = (node: HTMLElement, parent?: HTMLElement) => {
	(parent || document.body).appendChild(node);
};

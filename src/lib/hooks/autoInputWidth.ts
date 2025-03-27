export const autoWidth = (node: HTMLInputElement, overrideValue: string) => {
	const correctWidth = () => {
		if (!node.parentElement) return;

		const element: HTMLSpanElement = document.createElement('span');

		element.style.visibility = 'hidden';
		element.style.position = 'absolute';
		element.className = node.className;
		element.innerHTML = node.value;

		node.parentElement.insertBefore(element, node);

		node.style.width = `${element.offsetWidth}px`;

		element.remove();
	};

	correctWidth();

	if (overrideValue === undefined) node.addEventListener('input', correctWidth);

	return {
		destroy() {
			node.removeEventListener('input', correctWidth);
		},
		update() {
			correctWidth();
		}
	};
};

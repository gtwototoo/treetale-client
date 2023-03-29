export const onlyDigits = (node: HTMLInputElement) => {
	const formatted = () => {
		node.value = node.value.replace(/[^\d]/g, '');
	};

	node.addEventListener('input', formatted);

	return {
		destroy: () => node.removeEventListener('input', formatted)
	};
};

export const autoHeight = (node: HTMLTextAreaElement) => {
	const correctHeight = () => {
		node.value = node.value.replace(/ {2,}/, ' ');

		const { style, parentElement } = node;

		if (!parentElement) return;

		style.height = 'auto';
		style.height = `${node.scrollHeight}px`;

		parentElement.scrollTop = node.scrollHeight - parentElement.offsetHeight;
	};

	function dResize() {
		correctHeight();

		// после изменения текста (попробовать тик)
		setTimeout(correctHeight, 0);
	}

	dResize();

	node.addEventListener('input', dResize);
	document.addEventListener('resize', dResize);

	return {
		destroy() {
			node.removeEventListener('input', dResize);
			document.removeEventListener('resize', dResize);
		}
	};
};

export const autoWidth = (node: HTMLInputElement, overrideValue: string) => {
	const correctWidth = () => {
		const element: HTMLSpanElement = document.createElement('span');

		element.style.visibility = 'hidden';
		element.style.position = 'absolute';
		element.innerHTML = node.value;

		document.insertBefore(element, node);

		node.style.width = `${element.offsetWidth}px`;

		element.remove();
	};

	correctWidth();

	if (overrideValue === undefined) node.addEventListener('input', correctWidth);

	return {
		update() {
			correctWidth();
		},
		destroy() {
			node.removeEventListener('input', correctWidth);
		}
	};
};

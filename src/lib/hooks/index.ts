export const enableControl = <T>(
	node: T,
	{
		f,
		enabled
	}: {
		f: (node: T) => {
			destroy?: () => void;
		};
		enabled: boolean;
	}
) => {
	let activeFunction: {
		destroy?: () => void;
	} | null = null;

	if (enabled) activeFunction = f(node);

	return {
		update: ({ enabled }: { enabled: boolean }) => {
			if (enabled) activeFunction = f(node);
			else {
				if (!activeFunction) return;

				if (activeFunction.destroy) activeFunction.destroy();
				activeFunction = null;
			}
		},
		destroy: () => {
			if (!activeFunction) return;

			if (activeFunction.destroy) activeFunction.destroy();
		}
	};
};

export const onlyDigits = (node: HTMLInputElement) => {
	const formatted = () => {
		node.value = node.value.replace(/[^\d]/g, '');
	};

	node.addEventListener('input', formatted);

	return {
		destroy: () => node.removeEventListener('input', formatted)
	};
};

export const createPortal = (node: HTMLElement, parent?: HTMLElement) => {
	(parent || document.body).appendChild(node);
};

export const autoHeight = (node: HTMLTextAreaElement) => {
	const correctHeight = () => {
		node.value = node.value.replace(/\s{2,}/, ' ');

		const { style, parentElement } = node;

		if (!parentElement) return;

		style.height = 'auto';
		style.height = `${node.scrollHeight}px`;

		parentElement.scrollTop = node.scrollHeight - parentElement.offsetHeight;
	};

	function dResize() {
		correctHeight();

		// после изменения текста
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

export const correctPosition = (node: HTMLDivElement) => {
	const { bottom, top, height } = node.getBoundingClientRect();
	const toTop = bottom > window.innerHeight && top - height > 0;
	const correctClasses = toTop ? ['bottom-full', 'mb-1'] : ['top-full', 'mt-1'];

	node.classList.add(...correctClasses);

	return {
		destroy() {
			node.classList.remove('bottom-full', 'mb-1', 'top-full', 'mt-1');
		}
	};
};

export { clickHold } from './click_hold';
export { clickOutside } from './click_outside';
export { mutationDetect } from './mutation';

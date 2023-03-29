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

export const headerTransition = (node: HTMLDivElement, _: string) => {
	let oldWidth = node.clientWidth;

	const resize = () => {
		node.style.width = '';

		const newWidth = node.clientWidth;

		node.style.width = `${oldWidth}px`;

		setTimeout(() => {
			node.style.width = `${newWidth}px`;
			oldWidth = newWidth;
		}, 0);
	};

	window.addEventListener('resize', resize);

	return {
		update() {
			resize();
		},
		destroy() {
			window.removeEventListener('resize', resize);
		}
	};
};

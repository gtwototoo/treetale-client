import type { Coordinates } from '$lib/types';

export const transform = ({ x, y }: Coordinates = { x: 0, y: 0 }, zoom?: number): string => {
	const translate3d = `translate3d(${x}px,${y}px,0)`;
	const scale3d = zoom ? `scale3d(${zoom},${zoom},1)` : '';

	return 'transform:' + translate3d + scale3d;
};

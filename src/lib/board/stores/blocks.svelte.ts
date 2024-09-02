import type { Coordinates } from '$lib/types';

const getAddBlockOffset = () => {
	let x = $state<Coordinates['x']>(0);
	let y = $state<Coordinates['y']>(0);

	const set = (value: Coordinates) => {
		x = value.x;
		y = value.y;
	};

	const clear = () => {
		x = 0;
		y = 0;
	};

	return {
		clear,
		set,
		get x() {
			return x;
		},
		get y() {
			return y;
		}
	};
};

const getMovingBlock = () => {
	let type = $state<'comment' | 'frame' | null>(null);
	let id = $state<null | number>(null);

	return {
		get id() {
			return id;
		},
		set id(value) {
			id = value;
		},
		get type() {
			return type;
		},
		set type(value) {
			type = value;
		}
	};
};

export const movingBlockStore = getMovingBlock();
export const addBlockOffsetStore = getAddBlockOffset();

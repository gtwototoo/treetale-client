import type { ActionReturn } from 'svelte/action';

import type { Coordinates } from '$lib/types';

export type GestureReturnType<
	GestureParams,
	R extends ParametersSwitch<GestureParams> | undefined
> = R extends undefined
	? SvelteAction
	: R extends PartialParametersWithComposed<GestureParams>
		? SubGestureFunctions
		: R extends PartialParameters<GestureParams>
			? SvelteAction
			: never;
export type PointerEventCallback<T> =
	| ((activeEvents: PointerEvent[], event?: PointerEvent) => T)
	| null;
export type SubGestureFunctions = {
	onDown: PointerEventCallback<void>;
	onMove: PointerEventCallback<boolean>;
	onUp: PointerEventCallback<void>;
};
export type PinchEventHandler = (e: CustomEvent<{ center: Coordinates; scale: number }>) => void;

type PartialParameters<GestureParams> = Partial<GestureParams>;
type PartialParametersWithComposed<GestureParams> = Composed & PartialParameters<GestureParams>;
interface IPinch {
	onpinch: PinchEventHandler;
}

export type ParametersSwitch<GestureParams> =
	| PartialParameters<GestureParams>
	| PartialParametersWithComposed<GestureParams>
	| undefined;
export type SvelteAction = ActionReturn<null, IPinch>;
export const DEFAULT_TOUCH_ACTION = 'none';
export type PinchParameters = BaseParams;
export type Composed = { composed: boolean };
export type TouchAction =
	| 'auto'
	| 'inherit'
	| 'initial'
	| 'manipulation'
	| 'none'
	| 'pan-down'
	| 'pan-left'
	| 'pan-right'
	| 'pan-up'
	| 'pan-x'
	| 'pan-y'
	| 'pinch-zoom'
	| 'revert'
	| 'revert-layer'
	| 'unset';
export type BaseParams = {
	touchAction: TouchAction;
} & Composed;
type ActionType = 'down' | 'move' | 'up';

function removeEvent(event: PointerEvent, activeEvents: PointerEvent[]): PointerEvent[] {
	return activeEvents.filter((activeEvent: PointerEvent) => {
		return event.pointerId !== activeEvent.pointerId;
	});
}

function addEventListener<ET extends EventTarget, E extends Event>(
	node: ET,
	event: string,
	handler: (this: ET, evt: E) => void
): () => void {
	node.addEventListener(event, handler as (evt: Event) => void);
	return () => node.removeEventListener(event, handler as (evt: Event) => void);
}

function dispatch(
	node: HTMLElement,
	gestureName: string,
	event: PointerEvent,
	activeEvents: PointerEvent[],
	actionType: ActionType
) {
	node.dispatchEvent(
		new CustomEvent(`${gestureName}${actionType}`, {
			detail: {
				event,
				pointersCount: activeEvents.length,
				target: event.target
			}
		})
	);
}

function setPointerControls(
	gestureName: string,
	node: HTMLElement,
	onMoveCallback: PointerEventCallback<boolean>,
	onDownCallback: PointerEventCallback<void>,
	onUpCallback: PointerEventCallback<void>,
	touchAction: TouchAction = DEFAULT_TOUCH_ACTION
): {
	destroy: () => void;
} {
	node.style.touchAction = touchAction;
	let activeEvents: PointerEvent[] = [];

	function handlePointerdown(event: PointerEvent) {
		activeEvents.push(event);
		dispatch(node, gestureName, event, activeEvents, 'down');
		onDownCallback?.(activeEvents, event);
		const pointerId = event.pointerId;

		function onup(e: PointerEvent) {
			if (pointerId === e.pointerId) {
				activeEvents = removeEvent(e, activeEvents);

				if (!activeEvents.length) {
					removeEventHandlers();
				}

				dispatch(node, gestureName, e, activeEvents, 'up');
				onUpCallback?.(activeEvents, e);
			}
		}
		function removeEventHandlers() {
			removePointermoveHandler();
			removeLostpointercaptureHandler();
			removepointerupHandler();
			removepointerleaveHandler();
		}

		const removePointermoveHandler = addEventListener(node, 'pointermove', (e: PointerEvent) => {
			activeEvents = activeEvents.map((activeEvent: PointerEvent) => {
				return e.pointerId === activeEvent.pointerId ? e : activeEvent;
			});
			dispatch(node, gestureName, e, activeEvents, 'move');
			onMoveCallback?.(activeEvents, e);
		});

		const removeLostpointercaptureHandler = addEventListener(
			node,
			'lostpointercapture',
			(e: PointerEvent) => {
				onup(e);
			}
		);

		const removepointerupHandler = addEventListener(node, 'pointerup', (e: PointerEvent) => {
			onup(e);
		});
		const removepointerleaveHandler = addEventListener(
			node,
			'pointerleave',
			(e: PointerEvent) => {
				activeEvents = [];
				removeEventHandlers();
				dispatch(node, gestureName, e, activeEvents, 'up');
				onUpCallback?.(activeEvents, e);
			}
		);
	}

	const removePointerdownHandler = addEventListener(node, 'pointerdown', handlePointerdown);

	return {
		destroy: () => {
			removePointerdownHandler();
		}
	};
}

function getCenterOfTwoPoints(node: HTMLElement, activeEvents: PointerEvent[]) {
	const rect = node.getBoundingClientRect();
	const xDistance = Math.abs(activeEvents[0].clientX - activeEvents[1].clientX);
	const yDistance = Math.abs(activeEvents[0].clientY - activeEvents[1].clientY);
	const minX = Math.min(activeEvents[0].clientX, activeEvents[1].clientX);
	const minY = Math.min(activeEvents[0].clientY, activeEvents[1].clientY);
	const centerX = minX + xDistance / 2;
	const centerY = minY + yDistance / 2;

	const x = Math.round(centerX - rect.left);
	const y = Math.round(centerY - rect.top);

	return { x, y };
}

function getPointersDistance(activeEvents: PointerEvent[]) {
	return Math.hypot(
		activeEvents[0].clientX - activeEvents[1].clientX,
		activeEvents[0].clientY - activeEvents[1].clientY
	);
}

export function pinch<R extends ParametersSwitch<PinchParameters> = undefined>(
	node: HTMLElement,
	inputParameters?: R
): GestureReturnType<PinchParameters, R> {
	const parameters: PinchParameters = {
		composed: false,
		touchAction: DEFAULT_TOUCH_ACTION,
		...inputParameters
	};

	const gestureName = 'pinch';

	let prevDistance: number | undefined;
	let initDistance = 0;
	let pinchCenter: { x: number; y: number };

	function onUp(activeEvents: PointerEvent[]) {
		if (activeEvents.length === 1) {
			prevDistance = undefined;
		}
	}

	function onDown(activeEvents: PointerEvent[]) {
		if (activeEvents.length === 2) {
			initDistance = getPointersDistance(activeEvents);
			pinchCenter = getCenterOfTwoPoints(node, activeEvents);
		}
	}

	function onMove(activeEvents: PointerEvent[]) {
		if (activeEvents.length === 2) {
			const curDistance = getPointersDistance(activeEvents);

			if (prevDistance !== undefined && curDistance !== prevDistance) {
				const scale = curDistance / initDistance;
				node.dispatchEvent(
					new CustomEvent(gestureName, {
						detail: { center: pinchCenter, scale }
					})
				);
			}
			prevDistance = curDistance;
		}

		return false;
	}

	if (parameters.composed) {
		return { onDown, onMove, onUp: null } as GestureReturnType<PinchParameters, R>;
	}

	return setPointerControls(
		gestureName,
		node,
		onMove,
		onDown,
		onUp,
		parameters.touchAction
	) as GestureReturnType<PinchParameters, R>;
}

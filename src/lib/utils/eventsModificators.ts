export const preventDefault = (e: Event) => {
	e.preventDefault();
};

export const stopPropagation = (e: Event) => {
	e.stopPropagation();
};

// function once(fn) {
// 	return function (event: Event) {
// 		if (fn) fn.call(this, event);
// 		fn = null;
// 	};
// }

// function preventDefault(fn) {
// 	return function (event: Event) {
// 		event.preventDefault();
// 		fn.call(this, event);
// 	};
// }

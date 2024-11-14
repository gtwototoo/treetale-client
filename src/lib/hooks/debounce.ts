export class Debouncer {
	currentValue = $state();
	#nextValue = $state();
	timer: number = 0;
	delay;
	onchange = () => {};

	constructor(value: string, delay = 500) {
		this.currentValue = value;
		this.nextValue = value;
		this.delay = delay;
	}

	get nextValue() {
		return this.#nextValue;
	}
	set nextValue(value) {
		this.#nextValue = value;

		clearTimeout(this.timer);

		this.timer = window.setTimeout(() => {
			this.currentValue = this.nextValue;
			this.onchange();
		}, this.delay);
	}
}

import { UICollection, UINumber, UIRange } from '@b/oi';

// update obj/ref
export class UINumberRange extends UICollection {
	constructor(params) {
		super(params);

		this.callback = params.callback;

		this.numberInput = this.add(new UINumber({
			...params,
			callback: this.update.bind(this)
		}));

		this.range = this.add(new UIRange({
			...params,
			callback: this.update.bind(this)
		}));

		if (params.event === 'change') {
			this.range.el.addEventListener('input', ev => {
				this.numberInput.el.placeholder = ev.currentTarget.value;
			});
		}

		if (params.value !== undefined) this.value = params.value;
	}

	keyHandler(value) {
		this.update(+prompt(this.prompt));
	}

	update(value, uiOnly) {
		if (!uiOnly) this.callback(+value, ...this.args);
		this.value = value;
	}

	set value(value) {
		this.numberInput.value = value;
		this.range.value = value;
	}

	get value() {
		return +this.numberInput.value;
	}
}
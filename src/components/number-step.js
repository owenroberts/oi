import { assert } from '../../../cool/cool.js';
import { UICollection, UIDrag, UIButton, formatNumberInput } from '../oi.js';

export class UINumberStep extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('number-step');

		this.obj = params.obj;
		this.ref = params.ref;
		this.prompt = params.prompt;
		this.callback = params.callback;
		// this.onChange = params.onChange;
		this.value = params.value ?? this.obj[this.ref];

		const step = +(params.step ?? 1);

		if (params.hasOwnProperty('range')) {
			this.min = +params.range[0];
			this.max = +params.range[1];
		}

		if (params.hasOwnProperty('min')) {
			this.min = +(params.min);
		}

		if (params.hasOwnProperty('max')) {
			this.max = +(params.max);
		}
		
		// constrain range?
		
		this.numberInput = new UIDrag({
			...params,
			class: 'middle',
			onDrag: value => {
				this.update(this.value + step * value);
			},
			callback: value => {
				value = formatNumberInput(value);
				this.update(value);
			}
		});

		const stepDown = this.append(new UIButton({
			text: '◀',
			class: 'left-end',
			callback: () => {
				this.update(this.value - step);
			}
		}));

		// number in between step buttons
		this.append(this.numberInput);

		const stepUp = this.append(new UIButton({
			text: '▶',
			class: 'right-end',
			callback: () => {
				this.update(this.value + step);
			}
		}));
	}

	keyHandler() {
		this.update(prompt(this.prompt));
	}

	update(value, uiOnly) {
		if (value === undefined && this.prompt) {
			value = prompt(this.prompt);
		}

		if (value === undefined || value === null || value === '') {
			console.trace();
			assert(false, "no value entered");
		} else {
			value = +value;
		}

		if (value < this.min) value = this.min;
		if (value > this.max) value = this.max;
		
		this.value = formatNumberInput(value);
		this.numberInput.value = this.value;

		if (uiOnly) return;
		
		if (this.obj && this.ref) this.obj[this.ref] = this.value;
		if (this.callback) this.callback(this.value);
	}
}
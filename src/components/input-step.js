import { UICollection, UIDrag, UIButton } from '../oi.js';

export class UIInputStep extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('input-step');

		this.obj = params.obj;
		this.ref = params.ref;
		this.options = params.options ?? [];

		this.index = 0;
		
		if (this.obj && this.ref) {
			this.index = params.options.indexOf(this.obj[this.ref]);			
		} else if (params.value) {
			this.index = params.options.indexOf(params.value);			
		} 

		this.callback = params.callback;

		this.textInput = this.add(new UIDrag({
			value: this.options[this.index],
			class: 'left-end',
			onDrag: value => {
				if (this.index + value < 0) return;
				if (this.index + value > this.options.length) return;
				this.index += value;
				this.update();
			},
			callback: value => {
				this.update();
				// this.update(this.value); // handle mis types on app end
			}
		}));

		this.add(this.textInput);

		this.add(new UIButton({
			text: '▼',
			class: 'middle',
			callback: () => {
				if (this.index === 0) return; 
				this.index -= 1;
				this.update();
			}
		}));

		this.add(new UIButton({
			text: '▲',
			class: 'right-end',
			callback: () => {
				if (this.index === this.options.length - 1) return; 
				this.index += 1;
				this.update();
			}
		}));
	}

	get value() {
		return this.textInput.value;
	}

	set value(value) {
		this.textInput.value = value;
		if (this.obj && this.ref) this.obj[this.ref] = value;
		if (this.callback) this.callback(value);
	}

	update() {
		this.textInput.value = this.options[this.index];
		if (this.obj && this.ref) this.obj[this.ref] = this.options[this.index];
		if (this.callback) this.callback(this.value);
	}
}
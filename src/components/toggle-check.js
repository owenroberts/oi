import { UICollection, UIElement } from '../oi.js';

export class UIToggleCheck extends UICollection {
	constructor(params) {
		super(params);
		
		this.obj = params.obj;
		this.ref = params.ref;
		this.callback = params.callback;

		this.check = this.add(new UIElement({
			tag: 'input',
			class: 'toggle-check'
		}));

		this.check.el.type = 'checkbox';
		this.check.el.checked = params.isOn || params.value || false;
		this.check.el.addEventListener('change', ev => {
			this.update(ev.target.checked);
			this.check.el.blur();
		});
	}

	get value() {
		return this.check.el.checked;
	}

	set value(value) {
		this.check.el.checked = value;
	}

	keyHandler(value) {
		this.update(value !== undefined ? value : !this.value);
	}

	update(value) {
		if (value === undefined) value = !this.value; // it is a toggle ...
		this.value = value;
		if (this.obj && this.ref) this.obj[this.ref] = this.value;
		if (this.callback) this.callback(value);
	}
}
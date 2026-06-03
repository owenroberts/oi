import { UIElement } from '@b/oi';

export class UIInput extends UIElement {
	constructor(params) {
		super({ ...params, tag: 'input' });

		this.obj = params.obj;
		this.ref = params.ref;

		if (this.obj && this.ref) {
			this.value = this.value ?? this.obj[this.ref];
			this.id = params.id ?? this.ref;
			this.el.id = this.ref;
		} else {
			this.value = params.value;
		}

		this.callback = params.callback;
	}

	get value() {
		return this.el.value;
	}

	set value(value) {
		this.el.value = value;
	}
}
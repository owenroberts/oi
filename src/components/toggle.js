import { assert } from '@b/cool';
import { UIElement } from '@b/oi';

export class UIToggle extends UIElement {
	constructor(params) {
		super({ ...params, tag: "button" });
		this.addClass('toggle');
		if (params.buttonClass) this.addClass(params.buttonClass);

		this.obj = params.obj;
		this.ref = params.ref;
		this.callback = params.callback;
		this.onText = params.onText ?? params.text;
		this.offText = params.offText ?? params.text;
		this.value = params.value ?? false;

		this.display();
		this.el.addEventListener('click', () => {
			this.toggle();
		});
	}

	update(value, uiOnly) {
		assert(typeof value === "boolean", `UIToggle expects boolean value, got ${value}`);
		this.value = value ?? this.value;
		if (this.obj && this.ref) this.obj[this.ref] = this.value;
		if (this.callback) this.callback(this.value);
		this.display();
	}

	keyHandler() {
		this.toggle();
	}

	display() {
		if (this.value) {
			this.setText(this.onText);
			this.addClass('on');
		} else {
			this.setText(this.offText);
			this.removeClass('on');
		}
	}
	
	toggle() {
		this.update(!this.value);
	}

	off() {
		this.value = false;
		this.display();
	}

	on() {
		this.value = true;
		this.display();
	}
}
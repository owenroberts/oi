import { UICollection, UIElement } from '@b/oi';

export class UIToggleCheck extends UIElement {
	constructor(params) {
		super({ ...params, tag: "input" });
		this.addClass("toggle-check");
		this.el.type = 'checkbox';
		
		this.obj = params.obj;
		this.ref = params.ref;
		this.callback = params.callback;

		// this.check = this.add(new UIElement({
		// 	tag: 'input',
		// 	class: 'toggle-check'
		// }));

		if (this.obj && this.ref) {
			this.el.checked = this.obj[this.ref];
		}
		this.el.checked = params.isOn || params.value || false;

		this.el.addEventListener('change', ev => {
			this.update(ev.target.checked);
			this.el.blur();
		});
	}

	get value() {
		return this.el.checked;
	}

	set value(value) {
		this.el.checked = value;
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
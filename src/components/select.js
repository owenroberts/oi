import { UIElement } from '@b/oi';

export class UISelect extends UIElement {
	constructor(params) {
		super({ ...params, tag: 'select' });
		
		this.obj = params.obj;
		this.ref = params.ref;
		this.callback = params.callback;
		
		this.setOptions(params.options ?? []);

		this.value = params.value ?? this.obj?.[this.ref] ?? this.options[0] ?? "none";

		this.el.addEventListener('change', ev => {
			this.update(ev.target.value);
			ev.target.blur();
		});
	}

	get value() {
		return this.el.value;
	}

	set value(value) {
		this.el.value = value; /// wtf
		// this.el.selected = ""+value;
	}

	get options() {
		return Array.from(this.el.options).map(o => o.value);
	}

	update(value) {
		this.value = value;
		if (this.obj && this.ref) this.obj[this.ref] = this.value;
		if (this.callback) this.callback(this.value);
	}

	clearOptions() {
		for (let i = this.el.children.length - 1; i >= 0; i--) {
			this.el.children[i].remove();
		}
	}

	removeOption(value) {
		for (let i = 0; i < this.el.children.length; i++) {
			if (this.el.children[i].value == value){
				this.el.children[i].remove();
			}
		}
	}

	addOption(value, text) {
		const opt = document.createElement("option");
		opt.value = opt.textContent = value;
		if (text) opt.textContent = text;
		this.el.appendChild(opt);
	}

	setOptions(options) {
		if (typeof options === 'object') {
			for (const opt in options) {
				this.addOption(options[opt], opt);
			}
		} else {
			for (let i = 0; i < options.length; i++) {
				const { value, text } = typeof options[i] === 'object' ?
					options[i] : // wtf? -- this is confusing
					{ value: options[i] } ;
					// basically, if the optoins are all strings, make that into the value
				if (!this.options.includes(value)) {
					this.addOption(value, text);
				}
			}
		}
	}
}
import { UIInput } from '@b/oi';

export class UIText extends UIInput {
	constructor(params) {
		super(params);
		this.el.type = "text"; // set type?

		// prob simplify this
		this.placeholder = params.placeholder ?? params.text ?? params.value ?? '';
		this.el.placeholder = this.placeholder;

		this.el.addEventListener('focus', ev => {
			this.el.select();
		});

		/* have to hit enter to confirm value */
		this.el.addEventListener('keyup', ev => {
			if (ev.which == 13) {
				this.update(ev.target.value);
				this.el.blur();
			}
		});

		this.el.addEventListener('blur', ev => {
			if (this.value === undefined) {
				this.el.placeholder = this.placeholder;
				this.el.value = '';
			} else if (this.value != ev.target.value && ev.target.value) {
				this.update(ev.target.value);
			}
		});
	}

	keyHandler(value) {
		this.update(prompt(this.prompt));
	}

	update(value, uiOnly) {
		this.value = value; // always set value before callback
		if (this.obj && this.ref) this.obj[this.ref] = this.value;
		if (this.callback && !uiOnly) this.callback(value);
		
		// this.el.blur(); // keep going back and forth on this??
		// 11.27.2019 to prevent settings not saving when something focused
	}

	set value(value) {
		this.placeholder = value;
		this.el.placeholder = value;
		this.el.value = '';
	}

	get value() {
		return this.placeholder;
	}
}
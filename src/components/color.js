import { UIInput, UIButton, UICollection } from '../oi.js';

// needs update for obj/ref
export class UIColor extends UIInput {
	constructor(params) {
		super(params);
		
		this.el.type = "color";
		this.colors = [];
		this.args = params.args || [];

		this.el.addEventListener('input', ev => {
			this.setColor(ev.target.value);
		});

		this.el.addEventListener('focus', ev => {
			this.addColor(this.current);
		});

		this.palette = new UICollection();
	}

	addColor(color) {
		if (!this.colors) return; // called by value update before it exists
		if (!this.colors.includes(color) && color) {
			this.colors.push(color);
			this.palette.append(new UIButton({
				text: color,
				css: { "background": color },
				value: color,
				callback: () => {
					this.update(color);
				}
			}));
		}
	}

	/* to set color without constantly updating "current" */
	setColor(value) {
		this.current = value;
		this.callback(value, ...this.args);
	}

	/* update for loading */
	update(value, uiOnly) {
		if (!uiOnly) this.setColor(value);
		this.value = value;
	}
	
	get value() {
		return this.el.value;
	}

	set value(value) {
		this.addColor(value);
		this.current = value;
		super.value = value; // super again??
	}
}
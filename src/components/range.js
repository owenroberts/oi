import { UICollection, UIDrag, UILabel } from '@b/oi';

export class UIRange extends UICollection {
	constructor(params) {
		super(params);
		this.addClass("range-bg");

		this.obj = params.obj;
		this.ref = params.ref;
		this.callback = params.callback;
		this.value = params.value ?? this.obj?.[this.ref] ?? 0;

		this.min = params.min ?? params.range?.[0] ?? 0;
		this.max = params.max ?? params.range?.[1] ?? 1;
		this.step = params.step ?? (this.max > 1 ? 1 : 0.1);
		this.total = this.max - this.min;

		this.drag = this.append(new UIDrag({
			value: this.value,
			onDrag: change => {
				this.update(this.value + this.step * change);
			},
			callback: value => {
				if (!Number.isFinite(+value)) {
					this.update(this.value);
					return;
				}
				this.update(+value);
			}
		}));

		this.updateStyle();
	}

	updateStyle() {
		const pct = Math.round((this.value - this.min) / this.total * 100);
		this.setStyle('--value-percent', pct);
	}

	update(value, uiOnly) {
		if (value < this.min) value = this.min;
		if (value > this.max) value = this.max;
		this.value = +value.toFixed(3);
		this.drag.value = this.value;
		this.updateStyle();
		
		if (this.obj && this.ref) this.obj[this.ref] = this.value;
		if (this.callback) this.callback(value);
	}
}
import { UIElement } from '@b/oi';

export class UILabel extends UIElement {
	constructor(params) {
		super({ ...params, tag: "label" });
		this.setText(params.text);
	}
}
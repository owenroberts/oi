import { UIElement, UICollection } from '@b/oi';

export class UIRow extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('row');
	}
}
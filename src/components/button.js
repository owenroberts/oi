import { UIElement } from '@b/oi';

export class UIButton extends UIElement {
	constructor(params) {
		super({ ...params, tag: "button"});
		if (params.buttonClass) this.addClass(params.buttonClass);
		
		// this.callback = params.callback;
		// this.obj = params.obj;
		// this.ref = params.ref;

		const cb = () => {
			if (params.callback) params.callback();
			if (params.obj && params.ref) {
				params.obj[params.ref]();
			}
		};
		
		this.el.addEventListener('click', cb);
		
		if (params.key) {
			this.keyHandler = cb;
		}
	}
}
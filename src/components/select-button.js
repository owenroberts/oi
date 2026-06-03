import { UICollection, UISelect, UIButton } from '@b/oi';

export class UISelectButton extends UICollection {
	constructor(params) {
		super(params);
		
		const callback = params.callback;

		this.select = this.append(new UISelect({
			options: params.options,
			callback: () => {
				// do nothing ? to prevent error 
			}
		}));

		this.append(new UIButton({
			text: "+",
			css: { 'margin-left': '1px' },
			callback: () => {
				callback(this.select.value);
			}
		}));

		if (params.buttons) {
			params.button.forEach(button => {
				this.append(new UIButton({
					text: button.text,
					css: { 'margin-left': '1px' },
					callback: () => {
						button.callback(this.select.value);
					}
				}));
			});
		}
	}
}
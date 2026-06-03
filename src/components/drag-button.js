import { UIButton } from '@b/oi';

export class UIDragButton extends UIButton {
	constructor(params) {
		super(params);

		let x = 0, y = 0;
		let dragging = false;

		this.el.addEventListener('mousemove', ev => {
			if (x) dragging = true;
		});

		this.el.addEventListener('mousedown', ev => {
			x = ev.pageX;
		});

		// this is all fucked ...
		document.addEventListener('mouseup', ev => {
			if (this.dragging) {
				const delta = ev.pageX - down.x;
				if (Math.abs(delta) > 10) {
					this.callback(
						delta > 0 ? 1 : -1, 
						Math.abs(Math.ceil(delta / lns.timeline.frameWidth))
					);
				}
			}
			dragging = false;
			x = 0;
		});
	}
}
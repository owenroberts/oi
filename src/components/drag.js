import { UIText } from './text.js';

export class UIDrag extends UIText {
	constructor(params) {
		super(params);
		this.addClass('drag');

		let x = 0; // position when clicked
		let y = 0; 
		let timeout = 5; 
		let timer = 0; // timeout so it doesn't go nuts
		let prev = 0; // -1 or 1
		let active = false;

		function mouseDown(ev) {
			x = ev.pageX;
			y = ev.pageY;
			active = true;
			document.addEventListener('mousemove', mouseMove);
			document.addEventListener('mouseup', mouseUp);
		}

		function mouseMove(ev) {
			if (!active) return;

			const delta = { x: ev.pageX - x, y: ev.pageY - y };
			const dir = Math.abs(delta.x) > Math.abs(delta.y) ? 'x' : 'y';

			if (Math.abs(delta[dir]) > 10 && timer === 0) {
				const m = dir === 'x' ? 1 : -1; // multiplier for x/y
				params.onDrag(m * Math.sign(delta[dir]));
				timer = timeout;
				x = ev.pageX;
				y = ev.pageY;
			} else if (timer > 0) {
				timer--;
			}
		}

		function mouseUp(ev) {
			if (!active) return;
			active = false;
			x = 0;
			y = 0;
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
		}

		this.el.addEventListener('mousedown', mouseDown);

		if (params.value !== undefined) {
			this.value = params.value;
		}
	}
}
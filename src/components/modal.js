import { UIElement, UIButton, UILabel, UICollection } from '../oi.js';

export class UIModal extends UICollection {
	constructor(params) {
		super({});
		this.addClass('modal');
		this.ui = params.ui;

		if (this.ui.activeModal) {
			this.ui.activeModal.clear();
		}

		this.ui.activeModal = this;
		this.ui.container.append(this);
		
		this.label = this.append(new UILabel({ text: params.title }));
		this.break = this.append(new UIElement({ class: 'break' }));

		const submit = this.append(new UIButton({
			text: "Submit",
			key: "enter",
			callback: () => {
				if (params.callback) params.callback();
				this.clear();
			}
		}));

		params.ui.addKey("enter", { text: "modal submit" }, submit);

		const cancel = this.append(new UIButton({
			text: "x",
			key: "escape", // have to add keyHandler ... 
			title: "close modal",
			callback: ev => {
				if (params.onClear) params.onClear();
				this.clear();
			}
		}));

		params.ui.addKey("escape", { text: "modal escape" }, cancel);
		
		this.addBreak();

		this.setPosition();

		// drag
		let isDragging = false;
		this.el.addEventListener('mousedown', ev => {
			if (ev.target === this.label.el || this.el) {
				isDragging = true;
			}
		});

		this.el.addEventListener('mousemove', ev => {
			if (isDragging) this.setPosition();
		});

		this.el.addEventListener('mouseup', ev => {
			isDragging = false;
		});

		this.el.addEventListener('mouseleave', ev => {
			isDragging = false;
		});
	}

	setPosition() {
		let x = Math.max(16, this.ui.mousePosition.x - 100);
		let y = Math.max(16, this.ui.mousePosition.y - 24);

		this.setStyle('left', `${x}px`);
		this.setStyle('top', `${y}px`);
	}

	adjustPosition() {
		let x = parseInt(this.el.style.left);
		let y = parseInt(this.el.style.top);
		let w = parseInt(this.el.clientWidth);
		let h = parseInt(this.el.clientHeight);

		if (x + w > window.innerWidth) {
			this.setStyle('left', `${window.innerWidth - w - 20}px`);
		}

		if (y + h > window.innerHeight) {
			this.setStyle('top', `${window.innerHeight - h - 20}px`);
		}
	}

	add(child) {
		this.insert(child, this.break);
		this.adjustPosition();
		return child;
	}

	addBreak(label) {
		this.add(new UIElement({ class: "break" }));
		if (label) this.addLabel(label);
		this.adjustPosition();
	}

	addLabel(labelText) {
		this.add(new UILabel({ text: labelText }));
		this.adjustPosition();
	}

	clear() {
		this.ui.activeModal = undefined;
		this.el.remove();
	}
}
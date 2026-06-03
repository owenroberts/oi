import { UIElement, UILabel } from '@b/oi';

export class UICollection extends UIElement {
	constructor(params) {
		super(params);
		this.addClass('ui-collection');
		this.children = {};
		this.childList = [];
		this.id = this.el.id;
	}

	// k is the key value in the interface object
	append(child, k) {
		if (k !== undefined) this.children[k] = child;
		this.childList.push(child);
		this.el.appendChild(child.el);
		return child;
	}

	insert(child, ref) {
		// html only has insert before
		this.el.insertBefore(child.el, ref.el);
		const index = this.childList.indexOf(ref);
		this.childList.splice(index, 0, child);
	}

	// most stuff uses add ...
	// *** get rid of addBreak
	add(child, k, addBreak) {
		if (addBreak) this.addBreak();
		return this.append(child, k);
	}

	addBreak() {
		this.add(new UIElement({ class: 'break' }));
	}

	addLabel(text) {
		this.add(new UILabel({ text }));
	}

	remove(child, k) {
		if (k) delete this.children[k];
		const removeIndex = this.childList.indexOf(child);
		this.childList.splice(removeIndex, 1);
		this.el.removeChild(child.el);
		return child;
	}

	removeK(k) {
		return this.remove(this.children[k], k);
	}

	clear() {
		// originally part of row, seems simpler safer
		while (this.el.firstChild) {
			this.el.firstChild.value = null; /* prevent blur event */
			this.el.removeChild(this.el.firstChild);
		}
		this.children = {};
		this.childList = [];
	}

	pop() {
		const child = this.childList.pop();
		if (!child) return;
		return this.remove(child);
	}	
}
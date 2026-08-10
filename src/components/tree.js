import { UICollection, UIElement, UIRow } from '@b/oi';

export class UITree extends UICollection {
	constructor(params={}) {
		super({ ...params, tag: 'details' });
		
		this.ui = params.ui; // *** 

		if (params.isOpen) this.el.open = true;
		this.addClass('tree');
		this.addClass('row');

		const summary = this.append(new UIElement({
			tag: 'summary',
			text: params.title ?? 'tree',
		}));

		this.row = this.append(new UIRow());
		this.treeList = [];
	}

	add(child, k, addBreak) {
		this.row.add(child); // goes in row, not el
		this.treeList.push(child);
		if (k !== undefined) this[k] = child;
		if (addBreak) this.addBreak();
		return child;
	}

	pop() {
		this.remove(this.treeList.pop());
	}

	removeK(k) {
		this.row.el.removeChild(this[k].el);
		delete this[k];
	}

	remove(child) {
		this.row.el.removeChild(child.el);
	}

	clear() {
		this.row.clear();
	}

	addBreak() {
		this.row.addBreak();
	}

	open() {
		this.el.open = true;
	}

	close() {
		this.el.open = false;
	}

	// maybe use this in collection or panel too 
	// non-ref value with label
	// but get component type thing is very helpful ... 
	addParam(label, params) {
		const component = this.ui.addRef(this, { label, ...params, noRef: true, noRow: true }); // this is insane ... ***
		this.addBreak();
		return component;
	}
}
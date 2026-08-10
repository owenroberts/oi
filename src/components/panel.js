import { UILabel, UICollection, UIToggle, UIRow, UINumberStep, UIButton, UITree } from '@b/oi';

/**
 * panel for buttons and refs
 */
export class UIPanel extends UICollection {

	/**
	 * creates a panel
	 * @param  {object} params    - ui params
	 * @param  {object} params.ui - ui obj
	 * @param  {string} params.id - html id
	 */
	constructor(params) {
		super({ ...params, id: `${params.id}-panel` });
		
		this.ui = params.ui;
		this.id = params.id;
		this.addClass("panel");
		this.rows = [];

		const header = this.append(new UIRow({
			// class: "header",
			tag: "header",
		}));

		header.add(new UILabel({ text: params.label ?? params.id }));

		this.order = header.add(new UINumberStep({
			value: 0,
			class: "order",
			callback: value => {
				this.setStyle("order", value);
			}
		}));

		header.add(new UIButton({
			text: 'X',
			class: 'undock',
			callback: () => {
				this.ui.sections[this.section].panels.removeK(this.id);
			},
		}));

		this.headlessToggle = header.add(new UIToggle({
			onText: "▿",
			offText: "◃",
			class: "headless",
			callback: value => {
				if (value) {
					this.addClass('headless');
				} else {
					this.removeClass('headless');
				}
			}
		}));
	}

	getSettings() {
		return {
			headless: this.hasClass('headless'),
			order: this.order.value,
		};
	}

	setup(settings) {
		this.headlessToggle.update(settings.headless ?? false);
		this.order.update(settings.order || 0);
	}

	addBreak() {
		this.addRow({ class: 'break' });
		// this.addRow();
	}

	addLabel(text) {
		this.add(new UILabel({ text }));
	}

	addRow(params={}) {
		const row = new UIRow(params);
		this.append(row, params.id);
		this.rows.push(row);
		return row;
	}

	removeRow(row) {
		const index = this.rows.indexOf(row);
		this.rows.splice(index, 1);
		this.remove(row);
		return row;
	}

	addRef(params) {
		// if (params.ref === "sequence") console.log(params);
		return this.ui.addRef(this, params);
	}

	addRefs(params, refs) {
		this.ui.addRefs(this, params, refs);
	}

	addButton(params) {
		return this.ui.addButton(this, params);
	}

	addButtons(params, buttons) {
		this.ui.addButtons(this, params, buttons);
	}

	add(child, k, row) {
		if (this.debug) console.log(child, k, row);
		if (!row) row = this.rows[this.rows.length - 1];
		if (!row) row = this.addRow();
		if (k) this.children[k] = child;
		row.append(child, k);
		return child;
	}

	addTree(title) {
		return this.add(new UITree({ title, ui: this.ui }));
	}

	clear() {
		console.log('clear', this)
		for (let i = this.childList.length - 1; i >= 0; i--) {
			if (this.childList[i].el.tagName === "HEADER") continue;
			this.remove(this.childList[i]);
		}
		// this.children = {};
		// this.childList = [];
	}
}
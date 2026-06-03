import { UIPanel, UIModal, UIButton, UILabel } from '@b/oi';

export class QuickPanel extends UIPanel {
	constructor(params) {
		super({ ...params, id: 'quick' });

		this.quick = this.ui.quick;
		this.fontSize = 11;

		this.addRef({
			obj: this,
			ref: 'fontSize',
			reset: true, // ??
			range: [10, 40],
			callback: value => {
				document.body.style.setProperty('--quick-ref-font-size', +value);
			}
		});

		this.addBreak();

		this.addButton({ 
			callback: () => {
				this.quick.open(false);
			}, 
			text: "menu", 
			key: "q",
		});

		this.addButton({ 
			callback: () => {
				this.quick.displayKeys();
			}, 
			text: "key commands",
			key: "alt-k", 
		});

		this.addButton({ 
			callback: () => {
				this.quick.open(true);
			}, 
			text: "+",
			key: "shift-q",
		});

	}

	addUI(item) {
		const row = this.addRow();
		row.add(new UILabel({ text: item.panelName }));

		if (item.params.callback) {
			this.addButton(item.params);
		} else {
			this.addRef(item.params);
		}

		row.append(new UIButton({
			text: 'x',
			callback: () => {
				this.removeRow(row);
			}
		}));
	}
}



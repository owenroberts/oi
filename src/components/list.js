import { assert } from '@b/cool';
import { UICollection, UIInput, UIInputStep, UINumberStep, UISelect, UIButton, UITree } from '@b/oi';

export class UIList extends UICollection {
	
	constructor(params) {
		super(params);

		this.obj = params.obj;
		this.ref = params.ref;		
		this.callback = params.callback;

		this.list = params.list ?? params.obj?.[params.ref] ?? [];
		this.options = params.options ?? []; // maybe better default
		this.itemClass = params.itemClass ?? UIInput;
		if (params.class) this.addClass(params.class);

		const listGroup = this.add(new UICollection({ class: 'list-group' }));

		if (!params.isFixed) {

			listGroup.add(new UIButton({
				text: 'x',
				class: 'left-end',
				callback: () => {
					this.set([]);
					this.update();
				}
			}));

			listGroup.add(new UIButton({
				text: '*',
				class: 'middle',
				callback: () => {
					if (this.list.length === 0) return;
					this.set([...this.list]);
					this.update();
				}
			}));

			listGroup.add(new UIButton({
				text: '-',
				class: 'middle',
				callback: () => {
					if (this.list.length > 0) {
						this.tree.pop();
						this.list.pop();
					}
					this.update();
				}
			}));

			listGroup.add(new UIButton({
				text: '+',
				class: 'right-end',
				callback: () => {
					this.addItem(this.list?.[0] ?? 0);
					this.update();
				}
			}));

			this.addBreak();
		}

		this.tree = this.add(new UITree({ 
			title: params.treeTitle ?? "items", 
			isOpen: params.isListItemsOpen ?? true,
		}));
		this.addItemUIs();
	}

	update() {
		if (this.obj && this.ref) this.obj[this.ref] = this.list;
		if (this.callback) this.callback(this.list);
	}

	set(list) {
		assert(Array.isArray(list), `set requires array, got ${list}, ${typeof list}`);

		this.tree.clear();
		this.list = list;

		for (let i = 0; i < this.list.length; i++) {
			this.addItemUI(i, this.list[i]);
		}
	}

	addItem(value) {
		this.list.push(value);
		this.addItemUI(this.list.length - 1, value);
		this.update();
	}

	addItemUI(index, value) {
		this.tree.add(new this.itemClass({
			value: value,
			options: this.options,
			callback: value => {
				this.list[index] = value;
				this.update();
			}
		}), 'n' + index );
	}

	addItemUIs() {
		for (let i = 0; i < this.list.length; i++) {
			this.addItemUI(i, this.list[i]);
		}
	}
}
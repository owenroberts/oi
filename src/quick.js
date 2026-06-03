import { UIModal, UIButton, UILabel, UIInputSearch, UITree, UIRow } from '@b/oi';

/**
 * get ui refs and buttons
 * display key commnds
 * add refs and buttons to panel for quick access
 */
export class QuickMenu {
	
	constructor(ui) {
		this.ui = ui;
		this.registry = []; // registered components for reference
		this.isModalOpen = false;
	}

	open(addToPanel) {
		if (this.isModalOpen) return;

		this.isModalOpen = true;

		const m = new UIModal({
			title: "quick menu",
			ui: this.ui,
			onClear: () => {
				this.isModalOpen = false;
			},
		});

		const input = m.add(new UIInputSearch({
			listName: "quick-menu-list",
			options: this.registry.map(e => e.label),
			callback: value => {
				const item = this.getUI(value);
				if (!item) {
					input.focus();
					return;
				}

				const { component, params, panelName } = item;

				if (addToPanel) {
					item.isInPanel = true;
					this.ui.panels.quick.addUI(item);
					return;
				} else {
					if (params.callback) {
						params.callback();
					} else if (component.update) {
						component.update(prompt('value:'));
					}
				}

				this.isModalOpen = false;
				m.clear();
			}
		}));

		input.focus();
	}

	getUI(label) {
		return this.registry.find(e => e.label === label);
	}

	register(component, panelName, params) {
		const label = params.face ?? params.id ?? params.ref ?? params.text;
		this.registry.push({
			label: `${ panelName } > ${ label }`,
			params,
			component,
			panelName,
			isInPanel: false,
		});
	}

	getList() {
		return this.registry.filter(c => c.isInPanel).map(c => c.label);
	}

	displayKeys() {
		console.log('display')
		const m = new UIModal({
			title: "Key Commands",
			ui: this.ui,
			class: 'key-command-list',
		});

		const keyRow = m.add(new UIRow());


		const alphas = {};
		const alphaTree = m.add(new UITree({ title: 'alpha' }));
		keyRow.add(alphaTree);
		const alphaLetters = [];

		const panels = {};
		const panelTree = m.add(new UITree({ title: 'panel' }));
		keyRow.add(panelTree);

		for (let i = 0; i < this.registry.length; i++) {
			if (!this.registry[i].params.hasOwnProperty("key")) continue;

			const { panelName, label } = this.registry[i];
			const key = this.registry[i].params.key;

			const letter = key.split('-').pop();

			if (!panels[panelName]) {
				panels[panelName] = new UITree({ title: panelName });
			}

			if (!alphas[letter]) {
				alphas[letter] = new UITree({ title: letter });
				alphaLetters.push(letter);
			}

			const text = `${ key } -- ${ label }`;

			panels[panelName].add(new UILabel({ text, class: 'key-command-label' }));
			panels[panelName].addBreak();

			alphas[letter].add(new UILabel({ text, class: 'key-command-label' }));
			alphas[letter].addBreak();
		}

		alphaLetters.sort();
		for (let i = 0; i < alphaLetters.length; i++) {
			const letter = alphaLetters[i];
			alphaTree.add(alphas[letter]);
		}

		// const panelAlphas = this.registry
		// 	.filter(c => c.params.hasOwnProperty("key"))
		// 	.map(c => c.params.key)
		// 	.sort();
		
		for (const k in panels) {
			panelTree.add(panels[k])
		}
	}
}
import { UICollection, UIElement, UISelectButton, UILabel, UINumber, UINumberStep, UIToggleCheck, UIToggle, UIButton } from '../oi.js'; 

export class UISection extends UICollection {
	constructor(params) {
		super({ ...params, tag: "section" });

		this.ui = params.ui;
		this.label = params.label;
		// this.addClass('section');

		const header = this.add(new UICollection({
			tag: "header",
			id: params.id + '-header',
			class: 'section-header',
		}));

		header.add(new UILabel({ text: params.label }));

		this.panels = this.add(new UICollection({ 
			id: params.id + '-panels', 
			class: 'panels'
		}));
		
		this.selector = header.add(new UISelectButton({ 
			class: 'selector',
			callback: value => { this.addPanel(value); }
		}));
		
		const width = header.add(new UICollection({ class: 'width-collection' }));
		width.add(new UILabel({ text: '⧦' }));
		this.widthInput = width.add(new UINumberStep({
			value: 100,
			min: 25,
			max: 100,
			callback: value => {
				// this.setStyle('--max-width', value);
				this.setStyle("--width", value);
			}
		}));

		const scale = header.add(new UICollection({ 'class': 'scale-collection' }));
		scale.add(new UILabel({ text: '◰' }));
		this.baseFontSize = scale.add(new UINumberStep({
			value: 11,
			min: 10,
			max: 40,
			callback: value => {
				this.panels.setStyle('--ui-scale', +value);
			}
		}));

		const section = header.add(new UICollection({ "class": "section-collection"}));

		this.order = section.add(new UINumberStep({
			value: 0,
			callback: value => {
				this.setStyle("order", value);
			}
		}));

		this.isVisibleToggle = section.add(new UIToggle({
			onText: "◉",
			offText: "◎",
			class: "left-end",
			callback: value => {
				if (value) {
					this.removeClass("hidden");
				} else {
					this.addClass("hidden");
				}
			}
		}));

		section.add(new UIButton({
			text: "X",
			class: "middle",
			callback: () => {
				this.ui.removeSection(params.label, this);
			},
		}));

		section.add(new UIButton({
			text: "+",
			class: "right-end",
			callback: () => {
				this.ui.addSection(prompt("Section name?"));
			},
		}));
	}

	addSelectorOptions(panelList) {
		panelList.forEach(p => {
			// const [option, label] = p;
			this.selector.select.addOption(p, p);
		});
	}

	addSelectorOption(key, label) {
		this.selector.select.addOption(key, label);
	}

	addPanel(panelName) {
		const panel = this.ui.panels[panelName];
		panel.section = this.label;
		this.panels.add(panel, panelName);
	}

	removePanel(panelName) {
		this.panels.removeK(panelName);
	}

	setup(settings) {
		this.widthInput.update(settings.width);
		this.baseFontSize.update(settings.baseFontSize);
		this.isVisibleToggle.update(settings.isVisible ?? true);
		this.order.update(settings.order ?? 0);

		for (let i = 0; i < settings.panelList.length; i++) {
			this.addPanel(settings.panelList[i]);
		}
	}

	getSettings() {
		return {
			width: this.widthInput.value,
			isVisible: !this.hasClass('hidden'),
			baseFontSize: this.baseFontSize.value,
			order: this.order.value,
			panelList: Object.keys(this.panels.children),
		}
	}
}
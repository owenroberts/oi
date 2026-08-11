import { mobilecheck, whichKeyMap } from '@b/cool';
import { Settings } from './settings.js';
import { QuickMenu } from './quick.js';
import { UILabel, UIPanel, UIButton, UICollection, UISection } from './components.js';
import * as Components from './components.js';

// panels for quick menu and settings are separated to avoid loading error
import { SettingsPanel } from './panels/settings-panel.js';
import { WorkspacesPanel } from './panels/workspaces-panel.js';
import { QuickPanel } from './panels/quick-panel.js';

export function labelFromKey(key) {
	let label = key[0].toUpperCase() + key.substring(1);
	label = label.replace(/(?<=[a-z])(?=[A-Z])/g, ' ');
	return label;
}

export function formatNumberInput(value) {
	if (typeof value === 'string') {
		if (value.match(/\D/)) {
			try {
				value = eval(value);
			} catch(e) {
				alert("Please enter a numerical value or mathematical expression.");
				return;
			}
		}
	}
	return value;
}

export class Interface {

	constructor(settings) {

		// turn off ipad request desktop
		document.body.classList.add(mobilecheck() ? 'mobile' : 'desktop');

		this.keys = {}; // all short cut keys
		this.faces = {}; // all interfaces that need to be saved/updated -- make this all interfaces?
		this.panels = {};
		this.sections = {}; 
		
		this.mousePosition = { x: 0, y: 0 };

		this.container = new UICollection({ id: 'container' });
		this.toolTip = new UILabel({ id: 'tool-tip' });
		this.container.append(this.toolTip);

		this.quick = new QuickMenu(this);
		this.settings = new Settings(this, settings);
		
		this.addPanel(new SettingsPanel({ ui: this }));
		this.addPanel(new WorkspacesPanel({ ui: this }));
		this.addPanel(new QuickPanel({ ui: this }));
		
		/* key commands */
		document.addEventListener("keydown", ev => {
			this.keyDown(ev);
		}, false);
		
		// track mouse for modal
		document.addEventListener("mousemove", ev => {
			this.mousePosition.x = ev.clientX;
			this.mousePosition.y = ev.clientY;
		}, false);

		this.activeModal = undefined; // track existing modal
	}

	keyDown(ev) {

		let k = whichKeyMap[ev.which];
		if (k === "space") ev.preventDefault();
		k = ev.shiftKey ? "shift-" + k : k;
		k = ev.ctrlKey ? "ctrl-" + k : k;
		k = ev.altKey ? "alt-" + k : k;

		if (!k || !this.keys[k]) return;

		if (k !== "escape") {
			if (document.activeElement.type === "text") return;
			if (document.activeElement.type === "number") return;
		}
		if (ev.metaKey) return;
		
		ev.preventDefault();
		this.keys[k].keyHandler(ev.target.value);
		this.onKeyPress(this.keys[k], true);
	}

	addKey(key, params, component) {
		this.keys[key] = component;
		component.setTitle(`${ params.text ?? params.ref ?? params.id } ~ ${ key }`);

		component.el.addEventListener('mouseenter', () => { 
			this.onKeyPress(component, false);
		});
		component.el.addEventListener('mouseleave', () => {
			this.onKeyRelease(component); 
		});
	}

	onKeyPress(component, triggerRelease) {
		component.addClass('triggered');
		this.toolTip.setText(`${ component.el.title }`);
		this.toolTip.addClass('visible');
		
		if (triggerRelease === true) {
			setTimeout(() => { 
				this.onKeyRelease(component);
			}, 1000);
		}
	}

	onKeyRelease(component) {
		component.removeClass('triggered');
		this.toolTip.removeClass('visible');
	}

	addSection(key, params={}) {
		if (!key) return;
		if (this.sections[key]) return;
		
		this.sections[key] = this.container.add(new UISection({
			label: key,
			id: key,
			ui: this,
		}));
		this.sections[key].addSelectorOptions(Object.keys(this.panels));
	}

	removeSection(key, section) {
		if (Object.keys(this.sections).length === 1) return;
		this.container.remove(section);
		delete this.sections[key];
	}

	addSectionPanelOption(key, label) {
		for (const k in this.sections) {
			// name this add panel option?
			this.sections[k].addSelectorOption(key, label);
		}
	}

	addPanel(panel) {
		const label = labelFromKey(panel.id);
		this.panels[panel.id] = panel;
		this.addSectionPanelOption(panel.id, label);
		return panel;
	}

	getComponentType(params) {
		const value = params.value ?? params.obj[params.ref];

		// options is either select or steppers
		if (params.options) {
			if (params.options?.[0] === "C_1") return "UIInputStep";
			// if (typeof params.options[0] === "string") return "UISelect";
			return "UISelect";
		} else {
			if (typeof value === 'string') return 'UIText';
			if (typeof value === 'number') {
				if (params.range) return "UIRange";
				return 'UINumberStep';
			}
			if (typeof value === 'boolean') return 'UIToggleCheck';
			if (Array.isArray(value)) return 'UIList';
		}
	}
	
	addRef(panel, params) {
		if (!params.noRow) panel.addRow();
		
		const type = params.type ?? this.getComponentType(params);
		const id = params.id ?? params.ref;
		const component = new Components[type](params);
		if (!params.noLabel) {
			panel.add(new UILabel({ text: params.label ?? params.face ?? id }));
		}
		panel.add(component, id);
		if (params.key) {
			this.addKey(params.key, params, component);
		}

		if (params.noRef) return; // insane ***

		// multiple faces? save by panel?
		if (this.faces[params.face ?? id]) {
			console.warn("existing face", params.face, id, panel)
		}

		this.faces[params.face ?? id] = component; // if params.face?
		if (params.ignoreSettings) component.ignoreSettings = true;
		this.quick.register(component, panel.id, params);
		// if (params.ref === "sequence") console.log(component)
		return component;
	}

	addRefs(panel, params, refs) {
		for (let i = 0; i < refs.length; i++) {
			this.addRef(panel, { ...params, ...refs[i] });
		}
	}

	addButton(panel, params) {
		if (params.addRow) panel.addRow();
		
		let type = params.type ?? "UIButton";
		if (params.isFile) type = "UIFile";
		if (params.hasOwnProperty("onText")) type = "UIToggle";

		if (params.hasOwnProperty("ref") && !params.hasOwnProperty("text")) {
			params.text = params.ref;
		}

		const component = panel.add(new Components[type](params));
		if (params.key) this.addKey(params.key, params, component);
		this.quick.register(component, panel.id, params);
		return component;
	}

	/**
	 * multiple buttons with shared params, mainly obj: this
	 * @param {UIPanel} panel  
	 * @param {object} 	params  	shared params
	 * @param {array{}} buttons 	list of button params
	 */	
	addButtons(panel, params, buttons) {
		for (let i = 0; i < buttons.length; i++) {
			this.addButton(panel, { ...params, ...buttons[i] });
		}
	}
}
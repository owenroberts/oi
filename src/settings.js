/**
 * save layout, interface values
 */
export class Settings {

	constructor(ui, params) {
		this.ui = ui;
		this.workspaces = params.workspaces ?? [];
		this.localStorageString = `settings-${ params.name }`;

		// deprecated ?
		this.appLoad = params.appLoad;
		this.appSave = params.appSave;
	}

	loadPanels(panels) {
		for (const p in panels) {
			if (p === 'el') continue;
			if (!this.ui.panels[p]) continue;
			this.ui.panels[p].setup(panels[p]);
		}
	}

	loadFaces(faces) {
		for (const f in faces) {
			if (!this.ui.faces[f]) continue;
			if (this.ui.faces[f].ignoreSettings) continue;
			this.ui.faces[f].update(faces[f]);
		}
	}

	loadSections(sections={}) {
		if (Object.keys(sections).length === 0) {
			// add default section
			this.ui.addSection('default');
		} else {
			for (const k in sections) {
				this.ui.addSection(k);
				this.ui.sections[k].setup(sections[k]);
			}
		}
	}

	save() {
		const settings = {
			faces: {},
			panels: {},
			sections: {},
			quick: this.ui.quick.getList(),
		};

		Object.keys(this.ui.faces)
			.filter(f => !this.ui.faces[f].ignoreSettings)
			.forEach(f => {
				settings.faces[f] = this.ui.faces[f].value;
			});

		if (this.appSave) {
			Object.assign(settings.faces, this.appSave());
		}
		
		for (const p in this.ui.panels) {
			settings.panels[p] = this.ui.panels[p].getSettings();
		}

		for (const k in this.ui.sections) {
			settings.sections[k] = this.ui.sections[k].getSettings();
		}

		localStorage[this.localStorageString] = JSON.stringify(settings);
		return JSON.stringify(settings);
	}

	load() {
		if (localStorage[this.localStorageString]) {
			const settings = JSON.parse(localStorage[this.localStorageString]);

			this.loadSections(settings.sections);
			this.loadPanels(settings.panels);
			this.loadFaces(settings.faces);
			
			settings.quick.forEach(label => {
				this.ui.panels.quick.addUI(this.ui.quick.getUI(label));
			});

			if (this.appLoad) this.appLoad(settings);
		} else {
			if (this.workspaces.length > 0) {
				this.loadWorkspace(this.workspaces[0].url)
			}
		}
	}

	clear() {
		localStorage.setItem(localStorageString, '');
	}

	saveWorkspace() {
		const fileName = prompt('Layout Name:', 'New Layout');
		if (!fileName) return;
		const settings = this.save();
		const blob = new Blob([settings], { type: "application/x-download;charset=utf-8" });
		saveAs(blob, `${fileName}.json`);
	}

	// prob need better name for this ... 
	loadSettings(settings) {
		// this.loadLayout(settings.layout);
		this.loadSections(settings.sections);
		this.loadFaces(settings.faces); 
		this.loadPanels(settings.panels);
	}

	loadWorkspace(url) {

		for (const k in this.ui.sections) {
			this.ui.sections[k].panels.clear();
		}

		// if url is json from vite load
		if (url?.hasOwnProperty('faces')) {
			this.loadSettings(url);
		} else if (url) {
			// load default file
			fetch(url)
				.then(response => { return response.json(); })
				.then(settings => { this.loadSettings(settings); })
				.catch(error => { console.error(error); });
		} else {
			// choose file to load
			const openFile = document.createElement('input');
			openFile.type = "file";
			openFile.click();
			openFile.onchange = () => {
				for (let i = 0, f; f = openFile.files[i]; i++) {
					if (!f.type.match('application/json')) continue;
					const reader = new FileReader();
					reader.onload = ((theFile) => {
						return (e) => {
							this.loadSettings(JSON.parse(e.target.result))
						}
					})(f);
					reader.readAsText(f);
				}
			};
		}
	}
}

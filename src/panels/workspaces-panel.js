import { UIPanel, UIButton, UILabel } from '@b/oi';

export class WorkspacesPanel extends UIPanel {
	constructor(params) {
		super({ ...params, id: 'workspaces' });

		const settings = this.ui.settings;
		
		this.addButton({ 
			callback: () => {
				settings.saveWorkspace();
			}, 
			key: 'alt-w', 
			text: 'save'
		});

		this.addButton({ 
			callback: () => {
				settings.loadWorkspace();
			},	 
			text: 'load'
		});

		this.addRow();
		this.add(new UILabel({ text: "defaults" }));
		this.addBreak();

		settings.workspaces.forEach(workspace => {
			const { text, url } = workspace;
			this.addButton({
				text,
				callback: () => {
					settings.loadWorkspace(url); 
				}
			});
		});
	}
}
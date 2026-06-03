import { UICollection, UIToggleCheck, UILabel, UIButton, } from '@b/oi';

export class UIToggleGrid extends UICollection {
	constructor(params) {
		super(params);

		this.obj = params.obj;
		this.ref = params.ref;
		this.callback = params.callback;
		this.value = params.value ?? this.obj?.[this.ref] ?? [[true]];

		const label = new UILabel({ text: params.text ?? 'grid' });

		const subCol = this.add(new UIButton({
			text: '-',
			class: 'left-end',
			callback: () => {
				for (let i = 0; i < this.value.length; i++) {
					this.value[i].pop();
				}
				this.update();
			}
		}));

		const addCol = this.add(new UIButton({
			text: '+',
			class: 'right-end',
			callback: () => {
				for (let i = 0; i < this.value.length; i++) {
					this.value[i].push(true);
				}
				this.update();
			}
		}));

		this.grid = this.add(new UICollection({
			id: 'sequence-grid'
		}));

		this.display();
	}

	display() {
		this.grid.clear();
		this.grid.setStyle('--rows', this.value.length);
		this.grid.setStyle('--cols', this.value[0].length);

		for (let i = 0; i < this.value.length; i++) {
			for (let j = 0; j < this.value[i].length; j++) {
				const toggle = new UIToggleCheck({
					value: this.value[i][j],
					css: {
						'grid-row': `${i + 1}/${i + 1}`,
						'grid-column': `${j + 1}/${j + 1}`,
					},
					callback: value => {
						this.value[i][j] = value;
						this.update(this.value);
					}
				});
				this.grid.add(toggle);
			}
		}
	}

	update(value) {
		if (value) this.value = value;
		if (this.obj && this.ref) this.obj[this.ref] = this.value;
		if (this.callback) this.callback(this.value);
		this.display();
	}
}
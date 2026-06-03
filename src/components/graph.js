import { map } from '@b/cool';
import { UICollection, UIButton, UINumberStep, UILabel, UIModal } from '@b/oi';

export class UIGraph extends UICollection {
	constructor(params) {
		super(params);

		const editBtn = new UIButton({
			text: 'edit graph',
			callback: openGraphEditor,
		});

		let list = params.list ?? [];

		const count = new UINumberStep({
			value: params.graph?.count ?? 1,
			callback: returnGraph,
		});

		const min = new UINumberStep({
			value: params.graph?.min ?? 0,
			callback: returnGraph,
		});

		const max = new UINumberStep({
			value: params.graph?.max ?? 1,
			callback: returnGraph,
		});

		const step = new UINumberStep({
			value: params.graph?.step ?? 0.1,
			callback: returnGraph,
		});

		this.add(new UILabel({ text: 'count' }));
		this.add(count);
		this.addBreak();
		this.add(new UILabel({ text: 'min' }));
		this.add(min);
		this.addBreak();
		this.add(new UILabel({ text: 'max' }));
		this.add(max);
		this.addBreak();
		this.add(new UILabel({ text: 'step' }));
		this.add(step);
		this.addBreak();
		this.add(editBtn);

		function returnGraph() {
			const graph = {
				count: count.value,
				min: min.value,
				max: max.value,
				step: step.value,
			};
			if (params.obj) {
				params.obj.list = list;
				params.obj.graph = graph;
			}
			if (params.callback) params.callback(list, graph);
		}

		function openGraphEditor() {
			const m = new UIModal({
				title: 'graph editor',
				ui: params.ui,
				callback: returnGraph,
			});

			if (list.length < 1) {
				list = new Array(count.value).fill(min.value);
			} else if (list < count.value) {
				list = list.concat(new Array(count.value - list.length).fill(min.value));
			}

			let w = 360, h = 180;
			let c = w / count.value;
			let r = h / (((max.value - min.value) / step.value) + 2);

			const canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;
			m.el.appendChild(canvas);
			const ctx = canvas.getContext('2d');

			let mouseIsDown = false;
			canvas.addEventListener('mousedown', startPosition);
			canvas.addEventListener('mousemove', draw);
			canvas.addEventListener('mouseup', endPosition);
			canvas.addEventListener('mouseout', endPosition);

			function startPosition(ev) {
				mouseIsDown = true;
				draw(ev);
			}

			function endPosition() {
				mouseIsDown = false;
			}

			function draw(ev) {

				if (mouseIsDown) {
					for (let i = 0; i < count.value; i++) {
						if (ev.offsetX > i * c && ev.offsetX < i * c + c) {
							let v = map(ev.offsetY, h - r, r, min.value, max.value, true);
							v = Math.round((v / step.value)) * step.value;
							list[i] = v;
						}
					}
				}

				ctx.fillStyle = 'lightgray';
				ctx.fillRect(0, 0, w, h);

				ctx.fillStyle = 'black';

				for (let i = 0; i < count.value; i++) {
					const v = list[i];
					const x = i * c;
					const y = map(v, min.value, max.value, h - r, r, true);
					if (i === 0 || v !== list[i-1]) {
						if (v) ctx.fillText(v.toFixed(1), x, y - 5); // idk why error
					}
					// line(x, y, x + col, y);
					ctx.fillRect(x, y, c, r);
				}
			}
			draw();
		}
	}
}
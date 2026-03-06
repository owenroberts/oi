export class UIElement {
	constructor(params={}) {

		this.el = document.getElementById(params.id) ?
				document.getElementById(params.id) :
				document.createElement(params.tag || "div");

		for (const prop in params.css) {
			if (prop === "marginLeft") console.log(params.css);
			this.el.style[prop] = params.css[prop];
		}

		if (params.id !== undefined) this.el.id = params.id;
		if (params.class) this.addClass(params.class); // list?
		if (params.hasOwnProperty("text")) this.setText(params.text);
		if (params.debug) this.debug = true;
	}

	setText(value) {
		this.el.textContent = value;
	}

	setTitle(value) {
		this.el.title = value;
	}

	setStyle(prop, value) {
		this.el.style.setProperty(prop, value);
	}

	getStyle(prop) {
		return this.el.style.getPropertyValue(prop); 
	}

	addClass(value) {
		this.el.classList.add(value);
	}

	removeClass(value) {
		this.el.classList.remove(value);
	}

	hasClass(value) {
		return this.el.classList.contains(value);
	}

	remove() {
		this.el.remove();
	}

	add(child) {
		this.el.appendChild(child.el);
		return child;
	}

	clear() {
		while (this.el.firstChild) {
			this.el.firstChild.value = null; /* prevent blur event */
			this.el.removeChild(this.el.firstChild);
		}
	}
}
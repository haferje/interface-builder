class PropTypeBase {
	constructor(initial) {
		this.$input = null;
		this.required = false;
		this.changeHandler = $.noop;

		this.$input = $(`<input type="text">`)
			.val(initial || '')
			.change(e => this.changeHandler());
	}
	get value() {
		return this.$input.val();
	}
	set value(value) {
		this.$input.val(value).change();
		return this;
	}
	render() {
		return this.$input;
	}
	required() {
		this.required = true;
		return this;
	}
	changed(callback) {
		this.changeHandler = callback;
		return this;
	}
}

var PropType = {
	String: class extends PropTypeBase {
		constructor(initial) {
			super(initial);
		}
	},
	Bool: class extends PropTypeBase {
		constructor(initial) {
			super(initial);

			this.$input = $(`<input type="checkbox">`)
				.val(initial)
				.change(e => this.changeHandler())
		}
	},
	Int: class extends PropTypeBase {
		constructor(initial) {
			super(initial);

			this.$input = $(`<input type="number">`)
				.val(initial)
				.change(e => this.changeHandler())
		}
		get value() {
			return ''+this.$input.val();
		}
	},
	Color: class extends PropTypeBase {
		constructor(initial) {
			super(initial);

			this.$input = $(`<input type="color">`)
				.val(initial)
				.change(e => this.changeHandler())
		}
	},
	Select: class extends PropTypeBase {
		constructor(initial, options) {
			//options = _.concat([""], options);

			super();

			this.$input = $("<select/>")
				.append(
					_.map(options, option => $("<option/>").text(option).val(option))
				)
				.val(initial || '')
				.change(e => this.changeHandler())
			;
		}
		get value() {
			return $("option:selected", this.$input).val();
		}
	},
};

var sorters = [];
class Dropzone {
	constructor(config) {
		this.max = 0; // unlimited
		this.accepts = ".sortable";
		this.items = [];
		this.uuid = (function uuidv4() {
			// return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
			return 'x'+([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
				(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
			);
		})();

		_.extend(this, config);

		sorters.push({
			class: this.uuid,
			options: {
				placeholderClass: '.sortable-placeholder',
				hoverClass: 'sortable-hover',
				items: ':not(.disabled)',
				acceptFrom: this.accepts,
				copy: true,
				maxItems: 0 || this.max,
			}
		});
	}

	render() {
		var $out = $(`
			<div class="sortable ${this.uuid}">
				<div class="sortable"></div>
			</div>
		`);
		// sortable('.sortable', {
		// 	placeholderClass: '.sortable-placeholder',
		// 	hoverClass: 'sortable-hover',
		// 	items: ':not(.disabled)',
		// 	acceptFrom: this.accepts,
		// 	copy: true,
		// 	maxItems: 0 || this.max,
		// 	//
		// 	// connectWith: '',
		// 	// handle: '',
		// 	// forcePlaceholderSize: true,
		// 	// placeholder: '',
		// 	// itemSerializer: $.noop,
		// 	// containerSerializer
		// 	// customDragImage

		// });
		// $out.on('sortupdate', e => {
		// 	console.log(e.detail.destination.items);
		// });
		// // sortstart
		// // sortstop
		// // sortupdate
		// // //
		// // destroy
		// // disable
		// // enable
		// // serialize
		// // reload
		return $out;
	}

	source() {
		//
	}
}

class ItemBase {
	constructor() {
		this.children = [];
		this.name = "Item";
	}

	render() {
		return $(`
			<div class="item">
				<div class="item-name">${this.name}</div>
			</div>
		`);
	}

	source() {
		return {};
	}
}

class JasonItem extends ItemBase {
	constructor() {
		super();

		this.name = "$jason";
		this.head = new HeadItem();
		this.body = new BodyItem();
	}

	render() {
		// return $(`
		// 	<div class="item">
		// 		<div class="item-name">${this.name}</div>
		// 		${this.head.render()}
		// 		${this.body.render()}
		// 	</div>
		// `);
		return (
			$("<div/>", { class: "item" })
				.append(
					$("<div/>", { class: "item-name" })
						.text(this.name)
				)
				.append(this.head.render())
				.append(this.body.render())
		);
	}

	source() {
		return {
			head: this.head.source(),
			body: this.body.source(),
		};
	}
}

class HeadItem extends ItemBase {
	constructor() {
		super();

		this.name = "head";
	}
}

class BodyItem extends ItemBase {
	constructor() {
		super();

		this.name = "body";
		this.header = new Dropzone({ accepts: ".sortable", max: 1 });
		this.sections = new Dropzone({ accepts: "" });
		this.layers = new Dropzone({ accepts: "" });
		this.footer = new Dropzone({ accepts: "", max: 1 });
	}

	render() {
		var $out = $(`
			<div class="item">
				<div class="item-name">${this.name}</div>
			</div>
		`);

		$out.append(this.header.render());
		$out.append(this.sections.render());
		$out.append(this.layers.render());
		$out.append(this.footer.render());

		return $out;
	}

	source() {
		// TODO
		return {};
	}
}

class BodyHeadItem extends ItemBase {
	constructor() {
		super();

		// this.name = "bodyhead";
	}
}

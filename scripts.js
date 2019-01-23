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
	// Node: class extends PropTypeBase {
	// 	constructor() {

	// 	}
	// },
	// Nodes: class extends PropTypeBase {
	// 	constructor() {

	// 	}
	// },
};


var Util = {
	uuid: function() {
		// return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		return 'x'+([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		);
	},
};




class Node {
	constructor(name, struct) {
		this.name = name;
		this.props = struct.props || [];
		this.nodes = struct.nodes || [];
	}
}

var NodeTypes = {

};

var $json = new Node('$json', {
	props: [],
	nodes: [
		{ head: null }, // max 1
		{ body: null }, // max 1
	],
});

var body = new Node('body', {
	props: [],
	nodes: [
		{ header: null }, // max 1
		{ sections: null },
		{ layers: null },
		{ footer: null }, // max 1
	],
});










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
	static name() { 'un-named'; }

	constructor(struct) {
		this.props = struct.props || [];
		this.nodes = struct.nodes || [];
	}

	render() {
		return `
			<div class="node-name">${this.constructor.name()}</div>
			<div>
				<ul class="list-group node">
					${_.map(this.nodes.map, (item, i) => `
						<li class="list-group-item">
							a
						</li>
	  				`).join('')}
				</ul>
			</div>
		`;
		// return `
		// 	<div class="node-name">${this.constructor.name()}</div>
		// 	<div class="node">
		// 		${_.map(this.nodes.map, (item, i) => `
		// 			<div class="child-name">${i}</div>
		// 			<ul class="list-group node">
		// 			</ul>
		//   		`).join('')}
		// 	</div>
		// `;
	}

	toJson() {
		//
	}
}

class NodeList {
	constructor(types, max) {
		this.types = _.concat(types); // takes single element or array
		this.max = max || 0; // unlimited
		this.list = [];
	}
}

class JsonNode extends Node {
	static name() { return '$json'; }
	constructor() {
		super({
			props: {},
			nodes: {
				head: new NodeList(HeadNode, 1),
				body: new NodeList(BodyNode, 1),
			},
		});
	}
}
// JsonNode.name = '$json';

class HeadNode extends Node {
	static name() { return 'head'; }
	constructor() {
		super({
			props: {},
			nodes: {
				//
			},
		});
	}
}
// HeadNode.name = 'head';

class BodyNode extends Node {
	static name() { return 'body'; }
	constructor() {
		super({
			props: {},
			nodes: {
				header: new NodeList(null, 1),
				sections: new NodeList(null),
				layers: new NodeList(null),
				footer: new NodeList(null, 1),
			},
		});
	}
}
// BodyNode.name = 'body';

var NodeTypes = {
	$json: JsonNode,
	head: HeadNode,
	body: BodyNode,
};


/*

// Element dragging ended
onEnd
// Element is dropped into the list from another list
onAdd
// Event when you move an item in the list or between lists
onMove

*/


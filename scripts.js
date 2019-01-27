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


var Jsonette = {
	$json: null,
	initialize: function() {
		Jsonette.$json = new JsonNode();
		Jsonette.$json.nodes.head = new ChildList(HeadNode, 1);
		Jsonette.$json.nodes.body = new ChildList(BodyNode, 1);
		Jsonette.$json.nodes.head.add(new HeadNode());
		Jsonette.$json.nodes.body.add(new BodyNode());
	},
	add: function(newNode, parentID, parentProp) {
		var parentNode = Jsonette.$json.find(parentID);

		if (!parentNode)
			throw "Couldn't find parent.";

		var childList = parentNode.nodes[parentProp];
		childList.add(newNode);
	},
}


class Node {
	static name() { 'un-named'; }

	constructor(struct) {
		this.props = struct.props || {};
		this.nodes = struct.nodes || {};
		this.id = Util.uuid();
		this.required = false;
	}

	find(nodeID) {
		return (
			_(this.nodes)
			.map(childList => childList.find(nodeID))
			.compact()
			.first()
		);
	}

	render() {
		return `
			<li class="list-group-item" data-id="${this.id}">

				<div class="node-label"><div>${this.constructor.name()}</div></div>
				<ul class="list-group">
				${_.map(this.nodes, (item, i) => `
					<li class="list-group-item">
						<div class="child-label"><div>${i}</div></div>
						<ul class="list-group ${item.required ? '' : 'sortable'}" data-id="${this.id}" data-property="${i}">
							${item.render()}
						</ul>
					</li>
				`).join('')}
				</ul>

			</li>
		`;
	}

	toJson() {
		//
	}
}

class ChildList {
	constructor(types, max) {
		this.types = _.concat(types || []); // takes single element or array
		this.max = max || 0; // unlimited
		this.list = [];
	}

	add(node) {
		if (this.max && this.max <= this.list.length)
			throw "Max items allowed.";
		// if (!_.contains(this.types, typeof node))
		if (!_.find(this.types, nodeType => node instanceof nodeType))
			throw "Item type not allowed.";

		this.list.push(node);
	}

	find(nodeID) {
		return _.find(this.list, node => node.id == nodeID);
		// return _.find(this.list, node => node.id == nodeID);
	}

	render() {
		return _.map(this.list, (item, i) => item.render()).join('');
	}
}

class JsonNode extends Node {
	static name() { return '$json'; }
	constructor() {
		super({
			props: {},
			nodes: {
				head: new ChildList(HeadNode, 1),
				body: new ChildList(BodyNode, 1),
			},
		});
		this.required = true;
	}
}
// JsonNode.name = '$json';

class HeadNode extends Node {
	static name() { return 'head'; }
	constructor() {
		super({
			props: {},
			nodes: {
				// TEST
				head: new ChildList(HeadNode, 1),
			},
		});
		this.required = true;
	}
}
// HeadNode.name = 'head';

class BodyNode extends Node {
	static name() { return 'body'; }
	constructor() {
		super({
			props: {},
			nodes: {
				header: new ChildList(null, 1),
				sections: new ChildList(null),
				layers: new ChildList(null),
				footer: new ChildList(null, 1),
			},
		});
		this.required = true;
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


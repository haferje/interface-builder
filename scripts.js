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
				.append(_.map(options, option => $("<option/>").text(option).val(option)))
				.val(initial || '')
				.change(e => this.changeHandler())
			;
		}

		get value() {
			return $("option:selected", this.$input).val();
		}
	},
};


var Jsonette = {
	root: null,
	initialize: function() {
		this.root = new JsonNode();
		this.root.nodes.head = new ChildList(HeadNode, 1);
		this.root.nodes.body = new ChildList(BodyNode, 1);
		this.root.nodes.head.add(new HeadNode());
		this.root.nodes.body.add(new BodyNode());
	},
	find: function(nodeID) {
		return this.root.find(nodeID);
	},
	render: function() {
		return this.root.render();
	},
	export: function() {
		return this.root.export();
	},
	add: function (nodeType, parentID, parentProp) {
		var standardMessage = "There was an error when adding the item.";

		var parentNode = this.find(parentID);
		if (!parentNode) {
			this.alert(standardMessage);
			return false;
		}

		var childList = parentNode.child(parentProp);
		if (!childList) {
			this.alert(standardMessage);
			return false;
		}

		if (!childList.accepts(nodeType)) {
			this.alert("Parent element does not accept the dropped element type.");
			return false;
		}

		if (!childList.vacancy()) {
			this.alert("Cannot add item. Max items reached.");
			return false;
		}

		var newNode = new nodeType();

		if (!childList.add(newNode)) {
			this.alert(standardMessage);
			return false;
		}

		var $cloneNode = $(newNode.render());

		return $cloneNode;
	},
	alert: function(message) {
		var $alert = $("#alert-template")
			.clone()
			.attr("id", "")
			.find("#alert-message")
			.html(message)
			.end()
			.appendTo("#alert")
		;
		setTimeout(() => $alert.remove(), 3000);
	},
	uuid: function() {
		return 'x'+([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		);
	},
};


class Node {
	static name() { 'un-named'; }

	constructor(struct) {
		this.props = struct.props || {};
		this.nodes = struct.nodes || {};
		this.id = Jsonette.uuid();
		this.required = false;
	}

	find(nodeID) {
		return (
			_(this.nodes)
			.map(childList => childList.find(nodeID))
			.flatten()
			.compact()
			.first()
		);
	}

	child(childName) {
		return _.find(this.nodes, (childList, key) => key == childName);
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

	export() {
		var self = {};
		_.each(this.props, (prop, key) => _.extend(self, { [key]: prop }));
		_.each(this.nodes, (childList, key) => _.extend(self, { [key]: childList.export() }));
		return self;
	}
}

class ChildList {
	constructor(types, max) {
		this.types = _.concat(types || []); // takes single element or array
		this.max = max || 0; // unlimited
		this.list = [];
	}

	add(node) {
		if (this.accepts(node.constructor) && this.vacancy()) {
			this.list.push(node);
			return true;
		}

		return false;
	}

	find(nodeID) {
		return _.find(this.list, node => node.id == nodeID) || _.map(this.list, node => node.find(nodeID));
	}

	render() {
		return _.map(this.list, (item, i) => item.render()).join('');
	}

	accepts(nodeType) {
		return _.find(this.types, type => type == nodeType) || false;
	}

	vacancy() {
		return (this.max && this.max > this.list.length);
	}

	export() {
		if (this.max == 1)
			return this.list.length ? this.list[0].export() : {};
		else
			return _.map(this.list, node => node.export());
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


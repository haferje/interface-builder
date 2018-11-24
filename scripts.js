class Prop {
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

class StringProp extends Prop {
	constructor(initial) {
		super(initial);
	}
}

class BoolProp extends Prop {
	constructor(initial) {
		super(initial);

		this.$input = $(`<input type="checkbox">`)
			.val(initial)
			.change(this.changeHandler);
	}
}

class IntProp extends Prop {
	constructor(initial) {
		super(initial);

		this.$input = $(`<input type="number">`)
			.val(initial)
			.change(this.changeHandler);
	}
}

class ColorProp extends Prop {
	constructor(initial) {
		super(initial);

		this.$input = $(`<input type="color">`)
			.val(initial)
			.change(this.changeHandler);
	}
}

class SelectProp extends Prop {
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
}

var PropType = {
	STRING: function(initial) {
		return new StringProp(initial);
	},
	BOOL: function(initial) {
		return new BoolProp(initial);
	},
	INT: function(initial) {
		return new IntProp(initial);
	},
	COLOR: function(initial) {
		return new ColorProp(initial);
	},
	SELECT: function(initial, options) {
		return new SelectProp(initial, options);
	},
};

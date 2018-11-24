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

var PropType = {
	String: class extends Prop {
		constructor(initial) {
			super(initial);
		}
	},
	Bool: class extends Prop {
		constructor(initial) {
			super(initial);

			this.$input = $(`<input type="checkbox">`)
				.val(initial)
				.change(this.changeHandler);
		}
	},
	Int: class extends Prop {
		constructor(initial) {
			super(initial);

			this.$input = $(`<input type="number">`)
				.val(initial)
				.change(this.changeHandler);
		}
	},
	Color: class extends Prop {
		constructor(initial) {
			super(initial);

			this.$input = $(`<input type="color">`)
				.val(initial)
				.change(this.changeHandler);
		}
	},
	Select: class extends Prop {
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

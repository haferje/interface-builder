var PropType = {
	STRING: function() {
		var changeHandler = $.noop;
		return {
			getValue: function() {
				//
			},
			setValue: function(value) {
				//
			},
			render: function() {
				return $(`<input type="text">`);
			},
			change: (callback) => changeHandler = callback,
		};
	},
	BOOL: function() {
		var changeHandler = $.noop;
		return {
			getValue: function() {
				//
			},
			setValue: function(value) {
				//
			},
			render: function() {
				return $(`<input type="checkbox">`);
			},
			change: (callback) => changeHandler = callback,
		};
	},
	INT: function() {
		var changeHandler = $.noop;
		return {
			getValue: function() {
				//
			},
			setValue: function(value) {
				//
			},
			render: function() {
				return $(`<input type="number">`);
			},
			change: (callback) => changeHandler = callback,
		};
	},
	COLOR: function() {
		var changeHandler = $.noop;
		return {
			getValue: function() {
				//
			},
			setValue: function(value) {
				//
			},
			render: function() {
				return $(`<input type="color">`);
			},
			change: (callback) => changeHandler = callback,
		};
	},
	SELECT: function(options) {
		options = _.concat([""], options);

		// var value = "";
		var changeHandler = $.noop;
		var $input = $("<select/>")
			.append(
				_.map(options, option => $("<option/>").text(option).val(option))
			)
			// .change(e => value = $("option:selected", this).val())	// FAIL: ES6 arrow function scopes 'this' with closure
			// .change(({currentTarget}) => value = $(currentTarget).find("option:selected").val())
			// .change(({currentTarget}) => value = $("option:selected", currentTarget).val())
			// .change(changeHandler) // FAIL
			.change(e => changeHandler())
		;

		return {
			// getValue: () => { return value },
			getValue: () => { return $("option:selected", $input).val() },
			setValue: (value) => { $input.val(value).change() },
			render: () => { return $input },
			change: (callback) => { changeHandler = callback },
		};
	},
};

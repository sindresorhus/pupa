const pupa = require(".");

const result = pupa("{foo}{deeply.nested.value-foo}", {
	foo: "!",
	deeply: {
		nested: {
			"value-foo": "#"
		}
	}
});

// console.log(result);

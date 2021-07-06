'use strict';
const {htmlEscape} = require('escape-goat');

class MissingValueError extends Error {
	constructor(key) {
		super(`Missing a value for ${key ? `the placeholder: ${key}` : 'a placeholder'}`, key);
		this.name = 'MissingValueError';
		this.key = key;
	}
}

const defaultOptions = {
	ignoreMissing: false,
	transform: ({value}) => value
};

module.exports = (template, data, options = {}) => {
	const ignoreMissing = options.ignoreMissing || defaultOptions.ignoreMissing;
	const transform = options.transform || defaultOptions.transform;

	if (typeof template !== 'string') {
		throw new TypeError(`Expected a \`string\` in the first argument, got \`${typeof template}\``);
	}

	if (typeof data !== 'object') {
		throw new TypeError(`Expected an \`object\` or \`Array\` in the second argument, got \`${typeof data}\``);
	}

	// The regex tries to match either a number inside `{{ }}` or a valid JS identifier or key path.
	const doubleBraceRegex = /{{(\d+|[a-z$_][a-z\d$_]*?(?:\.[a-z\d$_]*?)*?)}}/gi;

	if (doubleBraceRegex.test(template)) {
		template = template.replace(doubleBraceRegex, (placeholder, key) => {
			let value = data;
			for (const property of key.split('.')) {
				value = value ? value[property] : undefined;
			}

			const transformedValue = transform({value, key});
			if (transformedValue === undefined) {
				if (ignoreMissing) {
					return placeholder;
				}

				throw new MissingValueError(key);
			}

			return htmlEscape(String(transformedValue));
		});
	}

	const braceRegex = /{(\d+|[a-z$_][a-z\d$_]*?(?:\.[a-z\d$_]*?)*?)}/gi;

	return template.replace(braceRegex, (placeholder, key) => {
		let value = data;
		for (const property of key.split('.')) {
			value = value ? value[property] : undefined;
		}

		const transformedValue = transform({value, key});
		if (transformedValue === undefined) {
			if (ignoreMissing) {
				return placeholder;
			}

			throw new MissingValueError(key);
		}

		return String(transformedValue);
	});
};

module.exports.MissingValueError = MissingValueError;

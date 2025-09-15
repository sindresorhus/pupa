import {htmlEscape} from 'escape-goat';

export class MissingValueError extends Error {
	constructor(key) {
		super(`Missing a value for ${key ? `the placeholder: ${key}` : 'a placeholder'}`, key);
		this.name = 'MissingValueError';
		this.key = key;
	}
}

export default function pupa(template, data, {ignoreMissing = false, transform = ({value}) => value} = {}) {
	if (typeof template !== 'string') {
		throw new TypeError(`Expected a \`string\` in the first argument, got \`${typeof template}\``);
	}

	if (typeof data !== 'object') {
		throw new TypeError(`Expected an \`object\` or \`Array\` in the second argument, got \`${typeof data}\``);
	}

	const replace = (placeholder, key) => {
		// Parse key path, handling escaped dots
		const segments = [];
		let segment = '';

		for (let index = 0; index < key.length; index++) {
			if (key[index] === '\\' && key[index + 1] === '.') {
				segment += '.';
				index++; // Skip escaped dot
			} else if (key[index] === '.') {
				segments.push(segment);
				segment = '';
			} else {
				segment += key[index];
			}
		}

		segments.push(segment);

		// Navigate object path
		let value = data;
		for (const property of segments) {
			value = value?.[property];
		}

		const transformedValue = transform({value, key});
		if (transformedValue === undefined) {
			if (ignoreMissing) {
				return placeholder;
			}

			throw new MissingValueError(key);
		}

		return String(transformedValue);
	};

	// ReDoS-safe regexes - backslash at end of character class
	const keyPattern = '(\\d+|[a-z$_][\\w\\-.$\\\\]*)';
	const doubleBraceRegex = new RegExp(`{{${keyPattern}}}`, 'gi');
	const singleBraceRegex = new RegExp(`{${keyPattern}}`, 'gi');

	template = template.replace(doubleBraceRegex, (...arguments_) => htmlEscape(replace(...arguments_)));

	return template.replace(singleBraceRegex, replace);
}

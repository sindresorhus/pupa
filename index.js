import {htmlEscape} from 'escape-goat';

export class MissingValueError extends Error {
	constructor(key) {
		super(
			`Missing a value for ${
				key ? `the placeholder: ${key}` : 'a placeholder'
			}`,
			key,
		);
		this.name = 'MissingValueError';
		this.key = key;
	}
}

const getIn = (object, keyParts) => {
	let value = object;

	for (const keyPart of keyParts) {
		value = value ? value[keyPart] : undefined;
	}

	return value;
};

export const parse = template => {
	const string = template;
	const literals = [];
	const keys = [];
	let i = 0;
	let escaped = false;
	let doubleCurly = false;
	let keyStart = null;
	let partial = '';

	while (i < string.length) {
		if (escaped) {
			partial += string[i];
		} else if (string[i] === '\\') {
			if (escaped) {
				partial += '\\';
			}

			escaped = !escaped;
		} else if (string[i] === '{') {
			literals.push(partial);

			if (keyStart !== null) {
				throw new Error(
					`invalid character: ${string[i]} at position: ${i} in template: ${template}`,
				);
			}

			doubleCurly = false;
			if (string[i + 1] === '{') {
				doubleCurly = true;
				i++;
			}

			keyStart = i + 1;
			partial = '';

			keys.push({parts: [], doubleCurly});
		} else if (string[i] === '}') {
			if (keyStart === i) {
				throw new Error(
					`empty braces: \`${doubleCurly ? '{{}}' : '{}'}\` at position: ${
						i - (doubleCurly ? 2 : 1)
					} in template: ${template}`,
				);
			}

			if (
				(doubleCurly && string[i + 1] !== '}')
				|| (!doubleCurly && string[i + 1] === '}')
			) {
				throw new Error(
					`mismatched braces at start: ${keyStart} end: ${
						doubleCurly ? i : i + 1
					} in template: ${template}`,
				);
			}

			if (doubleCurly) {
				i++;
			}

			if (!partial) {
				throw new Error(`empty key segment at position: ${i} in template: ${template}`);
			}

			keys[keys.length - 1].parts.push(partial);

			doubleCurly = false;
			keyStart = null;
			partial = '';
		} else if (string[i] === '.') {
			if (keyStart !== null) {
				if (!partial) {
					throw new Error(`empty key segment at position: ${i} in template: ${template}`);
				}

				keys[keys.length - 1].parts.push(partial);
				partial = '';
			}
		} else {
			partial += string[i];
		}

		i++;
	}

	literals.push(partial);

	return {literals, keys};
};

const interpolate = (literals, ...values) => {
	let i = 0;
	let string = literals[i];
	for (const value of values) {
		i++;
		string += value;
		string += literals[i];
	}

	return string;
};

export default function pupa(
	template,
	data,
	{ignoreMissing = false, transform = ({value}) => value} = {},
) {
	if (typeof template !== 'string') {
		throw new TypeError(
			`Expected a \`string\` in the first argument, got \`${typeof template}\``,
		);
	}

	if (typeof data !== 'object') {
		throw new TypeError(
			`Expected an \`object\` or \`Array\` in the second argument, got \`${typeof data}\``,
		);
	}

	const {literals, keys} = parse(template);

	const values = keys.map(({parts, doubleCurly}) => {
		const value = getIn(data, parts);
		const key = parts.join('.');

		const transformedValue = transform({value, key});
		if (transformedValue === undefined) {
			if (ignoreMissing) {
				return doubleCurly ? `{{${key}}}` : `{${key}}`;
			}

			throw new MissingValueError(key);
		}

		const result = String(transformedValue);

		return doubleCurly ? htmlEscape(result) : result;
	});

	return interpolate(literals, ...values);
}

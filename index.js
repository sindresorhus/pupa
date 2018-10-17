'use strict';

module.exports = (template, data) => {
	if (typeof template !== 'string') {
		throw new TypeError(`Expected a string in the first argument, got ${typeof template}`);
	}

	if (typeof data !== 'object') {
		throw new TypeError(`Expected an Object/Array in the second argument, got ${typeof data}`);
	}

	const regex = /{(.*?)}/g;

	return template.replace(regex, (_, key) => {
		let ret = data;

		for (const prop of key.split('.')) {
			ret = ret ? ret[prop] : '';
		}

		return ret || '';
	});
};

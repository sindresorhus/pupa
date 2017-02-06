'use strict';
module.exports = (tpl, data) => {
	if (typeof tpl !== 'string') {
		throw new TypeError(`Expected a string in the first argument, got ${typeof tpl}`);
	}

	if (typeof data !== 'object') {
		throw new TypeError(`Expected an Object/Array in the second argument, got ${typeof data}`);
	}

	const re = /{(.*?)}/g;

	if (Array.isArray(data) && tpl.indexOf('{this}') > 0) {
		return data.reduce((acc, item) => {
			return acc + tpl.replace('{this}', item);
		}, '');
	}

	return tpl.replace(re, (_, key) => {
		let ret = data;

		for (const prop of key.split('.')) {
			ret = ret ? ret[prop] : '';
		}

		return ret || '';
	});
};

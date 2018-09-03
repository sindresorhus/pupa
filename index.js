'use strict';
module.exports = (tpl, data) => {
	if (typeof tpl !== 'string') {
		throw new TypeError(`Expected a string in the first argument, got ${typeof tpl}`);
	}

	if (typeof data !== 'object') {
		throw new TypeError(`Expected an Object/Array in the second argument, got ${typeof data}`);
	}

	const re = /{(.*?)}/g;
	const array_re = /^([a-zA-Z0-9]*)\[(.*)\]$/;

	return tpl.replace(re, (_, key) => {
		let ret = data;

		for (const prop of key.split('.')) {
			if(prop.match(array_re)) {
		                let matching = array_re.exec(prop);
                		ret = ret[ matching[1] ] [ matching[2] ];
            		} else {
                		ret = ret ? ret[prop] : '';
            		}
		}

		return ret || '';
	});
};

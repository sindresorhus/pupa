'use strict';

module.exports = (template, data) => {
	if (typeof template !== 'string') {
		throw new TypeError(`Expected a string in the first argument, got ${typeof template}`);
	}

	if (typeof data !== 'object') {
		throw new TypeError(`Expected an Object/Array in the second argument, got ${typeof data}`);
	}

	const HTMLregex = /{{(.*?)}}/g;

	if (HTMLregex.test(template)) {
		template = template.replace(HTMLregex, (_, key) => {
			let ret = data;
			for (const prop of key.split('.')) {
				ret = ret ? ret[prop] : '';
			}

			// Encoding HTML Entities to avoid code injection
			const HTMLentities = /[&"<>]/g;
			ret = ret.toString().replace(HTMLentities, c => {
				return {
					'&': '&amp;',
					'"': '&quot;',
					'<': '&lt;',
					'>': '&gt;'
				}[c];
			});

			return ret || '';
		});
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

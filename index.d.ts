/**
Simple micro templating.

@param template - Text with placeholders for `data` properties.
@param data - Data to interpolate into `template`.
@param [options] - Options to customize behavior.

@example
```
import pupa = require('pupa');

pupa('The mobile number of {name} is {phone.mobile}', {
	name: 'Sindre',
	phone: {
		mobile: '609 24 363'
	}
});
//=> 'The mobile number of Sindre is 609 24 363'

pupa('I like {0} and {1}', ['🦄', '🐮']);
//=> 'I like 🦄 and 🐮'

// Double braces encodes the HTML entities to avoid code injection
pupa('I like {{0}} and {{1}}', ['<br>🦄</br>', '<i>🐮</i>']);
//=> 'I like &lt;br&gt;🦄&lt;/br&gt; and &lt;i&gt;🐮&lt;/i&gt;'
```
*/
declare function pupa(
	template: string,
	data: unknown[] | {[key: string]: any},
	options?: {
		/** By default, Pupa throws a `MissingValueError` when a placeholder resolves to `undefined`. With this option being `true`, it simply ignores it and leaves the placeholder as is. */
		ignoreMissing?: boolean;
		/** Performs arbitrary operation for each interpolation. If the returned value was `undefined`, it behaves different depending on `ignoreMissing` option. Otherwise, the returned value will be passed to `String` constructor (and escaped when double-braced) and embedded into the template. */
		transform?: (data: {value: unknown; key: string}) => unknown;
	}
): string;

declare namespace pupa {
	export class MissingValueError extends Error {
		constructor(key: string);
		message: string;
		key: string;
		name: 'MissingValueError';
	}
}

export = pupa;

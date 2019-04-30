/**
Simple micro templating.

@param template - Text with placeholders for `data` properties.
@param data - Data to interpolate into `template`.

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
```
*/
declare function pupa(
	template: string,
	data: unknown[] | {[key: string]: unknown}
): string;

export = pupa;

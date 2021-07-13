import {expectType} from 'tsd';
import pupa from './index.js';

expectType<string>(
	pupa('The mobile number of {name} is {phone.mobile}', {
		name: 'Sindre',
		phone: {
			mobile: '609 24 363',
		},
	}),
);
expectType<string>(pupa('I like {0} and {1}', ['🦄', '🐮']));

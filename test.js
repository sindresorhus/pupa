import test from 'ava';
import m from './';

test(t => {
	t.is(m('{foo}', {foo: '!'}), '!');
	t.is(m('{foo}', {foo: 10}), '10');
	t.is(m('{foo}{foo}', {foo: '!'}), '!!');
	t.is(m('{foo}{bar}{foo}', {foo: '!', bar: '#'}), '!#!');
	t.is(m('yo {foo} lol {bar} sup', {foo: '🦄', bar: '🌈'}), 'yo 🦄 lol 🌈 sup');

	t.is(m('{foo}{deeply.nested.value}', {
		foo: '!',
		deeply: {
			nested: {
				value: '#'
			}
		}
	}), '!#');

	t.is(m('{0}{1}', ['!', '#']), '!#');
	t.is(m('{results[0].field1} and {results[0].field2}', {results:[{field1:'v',field2:'v2'}]}) , 'v and v2');
});


import test from 'ava';
import pupa from '.';

test('main', t => {
	t.is(pupa('{foo}', {foo: '!'}), '!');
	t.is(pupa('{foo}', {foo: 10}), '10');
	t.is(pupa('{foo}{foo}', {foo: '!'}), '!!');
	t.is(pupa('{foo}{bar}{foo}', {foo: '!', bar: '#'}), '!#!');
	t.is(pupa('yo {foo} lol {bar} sup', {foo: '🦄', bar: '🌈'}), 'yo 🦄 lol 🌈 sup');

	t.is(pupa('{foo}{deeply.nested.value}', {
		foo: '!',
		deeply: {
			nested: {
				value: '#'
			}
		}
	}), '!#');

	t.is(pupa('{0}{1}', ['!', '#']), '!#');
});


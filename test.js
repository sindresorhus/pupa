import test from 'ava';
import pupa from '.';

test('main', t => {
	// Normal placeholder
	t.is(pupa('{foo}', {foo: '!'}), '!');
	t.is(pupa('{foo}', {foo: 10}), '10');
	t.is(pupa('{foo}', {foo: 0}), '0');
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

	// Encoding HTML Entities to avoid code injection
	t.is(pupa('{{foo}}', {foo: '!'}), '!');
	t.is(pupa('{{foo}}', {foo: 10}), '10');
	t.is(pupa('{{foo}}', {foo: 0}), '0');
	t.is(pupa('{{foo}}{{foo}}', {foo: '!'}), '!!');
	t.is(pupa('{foo}{{bar}}{foo}', {foo: '!', bar: '#'}), '!#!');
	t.is(pupa('yo {{foo}} lol {{bar}} sup', {foo: '🦄', bar: '🌈'}), 'yo 🦄 lol 🌈 sup');

	t.is(pupa('{foo}{{deeply.nested.value}}', {
		foo: '!',
		deeply: {
			nested: {
				value: '<br>#</br>'
			}
		}
	}), '!&lt;br&gt;#&lt;/br&gt;');

	t.is(pupa('{{0}}{{1}}', ['!', '#']), '!#');

	t.is(pupa('{{0}}{{1}}', ['<br>yo</br>', '<i>lol</i>']), '&lt;br&gt;yo&lt;/br&gt;&lt;i&gt;lol&lt;/i&gt;');
});


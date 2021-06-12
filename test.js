import test from 'ava';
import pupa, {MissingValueError} from '.';

test('main', t => {
	// Normal placeholder
	t.is(pupa('{foo}', {foo: '!'}), '!');
	t.is(pupa('{foo}', {foo: 10}), '10');
	t.is(pupa('{foo}', {foo: 0}), '0');
	t.is(pupa('{foo}{foo}', {foo: '!'}), '!!');
	t.is(pupa('{foo}{bar}{foo}', {foo: '!', bar: '#'}), '!#!');
	t.is(pupa('yo {foo} lol {bar} sup', {foo: '🦄', bar: '🌈'}), 'yo 🦄 lol 🌈 sup');

	t.is(pupa('{foo}{deeply.nested.valueFoo}', {
		foo: '!',
		deeply: {
			nested: {
				valueFoo: '#'
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

	t.is(pupa('{foo}{{deeply.nested.valueFoo}}', {
		foo: '!',
		deeply: {
			nested: {
				valueFoo: '<br>#</br>'
			}
		}
	}), '!&lt;br&gt;#&lt;/br&gt;');

	t.is(pupa('{{0}}{{1}}', ['!', '#']), '!#');

	t.is(pupa('{{0}}{{1}}', ['<br>yo</br>', '<i>lol</i>']), '&lt;br&gt;yo&lt;/br&gt;&lt;i&gt;lol&lt;/i&gt;');
});

test('do not match non-identifiers', t => {
	const fixture = '"*.{json,md,css,graphql,html}"';
	t.is(pupa(fixture, []), fixture);
});

test('ignore missing', t => {
	const template = 'foo{{bar}}{undefined}';
	const options = {ignoreMissing: true};
	t.is(pupa(template, {}, options), template);
});

test('throw on undefined by default', t => {
	t.throws(() => {
		pupa('{foo}', {});
	}, MissingValueError);
});

test('transform and ignore missing', t => {
	const options = {
		ignoreMissing: true,
		transform: ({value}) => Number.isNaN(Number.parseInt(value, 10)) ? undefined : value
	};
	t.is(pupa('{0} {1} {2}', ['0', 42, 3.14], options), '0 42 3.14');
	t.is(pupa('{0} {1} {2}', ['0', null, 3.14], options), '0 {1} 3.14');
});

test('transform and throw on undefined', t => {
	const options = {
		transform: ({value}) => Number.isNaN(parseInt(value, 10)) ? undefined : value
	};
	t.notThrows(() => pupa('{0} {1} {2}', ['0', 42, 3.14], options), MissingValueError);
	t.throws(() => pupa('{0} {1} {2}', ['0', null, 3.14], options), MissingValueError);
});

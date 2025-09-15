import test from 'ava';
import pupa, {MissingValueError} from './index.js';

test('basic functionality', t => {
	// Various data types
	t.is(pupa('{foo}', {foo: '!'}), '!');
	t.is(pupa('{foo}', {foo: 0}), '0');
	t.is(pupa('{fo-o}', {'fo-o': 0}), '0');

	// Multiple placeholders
	t.is(pupa('{foo}{bar}', {foo: '!', bar: '#'}), '!#');
	t.is(pupa('yo {foo} lol {bar} sup', {foo: '🦄', bar: '🌈'}), 'yo 🦄 lol 🌈 sup');

	// Nested properties and arrays
	t.is(pupa('{deeply.nested.value}', {deeply: {nested: {value: '#'}}}), '#');
	t.is(pupa('{0}{1}', ['!', '#']), '!#');
});

test('html escaping', t => {
	t.is(pupa('{{foo}}', {foo: '<script>alert("xss")</script>'}), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
	t.is(pupa('{foo}{{bar}}', {foo: '!', bar: '<b>bold</b>'}), '!&lt;b&gt;bold&lt;/b&gt;');
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
	}, {instanceOf: MissingValueError});
});

test('transform function', t => {
	const options = {
		transform: ({value}) => Number.isNaN(Number.parseInt(value, 10)) ? undefined : value,
	};

	// Transform with ignore missing
	t.is(pupa('{0} {1}', ['0', null], {...options, ignoreMissing: true}), '0 {1}');

	// Transform without ignore missing throws
	t.throws(() => pupa('{0} {1}', ['0', null], options), {instanceOf: MissingValueError});
});

test('escaped dots in property names', t => {
	// Basic escaped dot
	t.is(pupa('{phone\\.mobile}', {'phone.mobile': '123'}), '123');

	// HTML escaping with escaped dots
	t.is(pupa('{{phone\\.mobile}}', {'phone.mobile': '<b>123</b>'}), '&lt;b&gt;123&lt;/b&gt;');

	// Multiple escaped dots
	t.is(pupa('{foo\\.bar\\.baz}', {'foo.bar.baz': 'value'}), 'value');

	// Mixed escaped and normal dots
	t.is(pupa('{user.name} {user\\.email}', {
		user: {name: 'John'},
		'user.email': 'john@example.com',
	}), 'John john@example.com');

	// Edge case: property ending with dot
	t.is(pupa('{empty\\.}', {'empty.': 'works'}), 'works');
});

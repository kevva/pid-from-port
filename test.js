import http from 'http';
import {serial as test} from 'ava';
import getPort from 'get-port';
import m from '.';

const srv = () => http.createServer((req, res) => {
	res.end();
});

test('success', async t => {
	const port = await getPort();
	const server = srv().listen(port);
	t.truthy(await m(port));
	server.close();
});

test('fail', async t => {
	await t.throws(m(0), 'Couldn\'t find a process with port `0`');
	await t.throws(m.all([0]), 'Couldn\'t find a process with port `0`');
});

test('accepts a number', async t => {
	await t.throws(m('foo'), 'Expected a number, got string');
});

test('all', async t => {
	const [p1, p2] = await Promise.all([getPort(), getPort()]);
	const [s1, s2] = [srv().listen(p1), srv().listen(p2)];
	const ports = await m.all([p1, p2]);

	t.true(ports instanceof Map);

	for (const x of ports.values()) {
		t.is(typeof x, 'number');
	}

	s1.close();
	s2.close();
});

test('list', async t => {
	const list = await m.list();
	t.true(list instanceof Map);
	await t.notThrows(m.all(Array.from(list.keys())));
});

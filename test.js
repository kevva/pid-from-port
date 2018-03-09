import http from 'http';
import test from 'ava';
import getPort from 'get-port';
import m from '.';

const srv = http.createServer((req, res) => {
	res.end();
});

test('success', async t => {
	const port = await getPort();
	const server = srv.listen(port);
	t.truthy(await m(port));
	server.close();
});

test('fail', async t => {
	await t.throws(m(0), 'Couldn\'t find a process with port `0`');
});

test('accepts a number', async t => {
	await t.throws(m('foo'), 'Expected a number, got string');
});

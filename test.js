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
	const err = await t.throws(m(0));
	t.is(err.message, 'Couldn\'t find a process with port `0`');
});

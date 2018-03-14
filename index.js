'use strict';
const execa = require('execa');

const macos = () => execa.stdout('netstat', ['-anv', '-p', 'tcp'])
	.then(data => Promise.all([data, execa.stdout('netstat', ['-anv', '-p', 'udp'])]))
	.then(data => data.join('\n'));

const linux = () => execa.stdout('netstat', ['-tunlp']);
const win32 = () => execa.stdout('netstat', ['-ano']);

const isProtocol = x => {
	x = x.toLowerCase();
	return x.startsWith('tcp') || x.startsWith('udp');
};

const getPort = (input, list) => {
	const cols = process.platform === 'darwin' ? [3, 8] : process.platform === 'linux' ? [3, 6] : [1, 4];
	const port = list.find(x => x[cols[0]].endsWith(`:${input}`) || x[cols[0]].endsWith(`.${input}`));

	if (!port) {
		throw new Error(`Couldn't find a process with port \`${input}\``);
	}

	return parseInt(port[cols[1]], 10);
};

const getList = () => {
	const fn = process.platform === 'darwin' ? macos : process.platform === 'linux' ? linux : win32;

	return fn()
		.then(list => list.split('\n'))
		.then(list => list.filter(x => isProtocol(x)))
		.then(list => list.map(x => x.match(/\S+/g) || []));
};

module.exports = input => {
	if (typeof input !== 'number') {
		return Promise.reject(new TypeError(`Expected a number, got ${typeof input}`));
	}

	return getList().then(list => getPort(input, list));
};

module.exports.all = input => {
	if (!Array.isArray(input)) {
		return Promise.reject(new TypeError(`Expected an array, got ${typeof input}`));
	}

	return getList()
		.then(list => Promise.all(input.map(x => [x, getPort(x, list)])))
		.then(list => new Map(list));
};

module.exports.list = () => getList().then(list => {
	const cols = process.platform === 'darwin' ? [3, 8] : process.platform === 'linux' ? [3, 6] : [1, 4];
	const ret = new Map();

	for (const x of list) {
		const match = x[cols[0]].match(/[^]*\.(\d+)$/);

		if (match) {
			ret.set(parseInt(match[1], 10), parseInt(x[cols[1]], 10));
		}
	}

	return ret;
});

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

module.exports = input => {
	if (typeof input !== 'number') {
		throw new TypeError(`Expected a number, got ${typeof input}`);
	}

	const fn = process.platform === 'darwin' ? macos : process.platform === 'linux' ? linux : win32;
	const cols = process.platform === 'darwin' ? [3, 8] : process.platform === 'linux' ? [3, 6] : [1, 4];

	return fn()
		.then(list => list.split('\n'))
		.then(list => list.filter(x => isProtocol(x)))
		.then(list => list.map(x => x.match(/\S+/g) || []))
		.then(list => {
			const port = list.find(x => x[cols[0]].endsWith(`:${input}`) || x[cols[0]].endsWith(`.${input}`));

			if (!port) {
				throw new Error(`Couldn't find a process with port \`${input}\``);
			}

			return parseInt(port[cols[1]], 10);
		});
};
